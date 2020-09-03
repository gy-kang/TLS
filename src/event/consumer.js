var amqp = require('amqp');
var {insert_active_data} = require('../db/insert_active_data');
var {insert_water_data} = require('../db/insert_water_data');
var winston = require('../config/winston');
var consumer = {};

consumer = async function()
{

  var implOpts = 
  {
        reconnect: true,
        reconnectBackoffStrategy: 'exponential',
        reconnectBackoffTime: 500
  };

  var connection  = amqp.createConnection(
    { 
        host: 'goqual.io'
      , port: 55001
      , login: '0483f779468c4f89ab1c90d09e676548'
      , password: '4711cbb476544b47bab40ed9e5f36b94'
      , connectionTimeout: 10000
      , authMechanism: 'AMQPLAIN'
      , heartbeat: 30
      , autoAck: true 
      , vhost: '/'
      , noDelay: true
      , ssl: {enabled : true}
    }, implOpts);


  connection.on('ready', function (error) 
  {
    var q = connection.queue('0483f779468c4f89ab1c90d09e676548', {autoDelete:false, noDeclare:true}, function (queue) {
      winston.info('Queue ' + queue.name + ' is open');
      
      q.subscribe(function(msg){

        console.log(msg.deviceDataReport);
        if(msg.deviceDataReport != null)
        {
          winston.info(msg.deviceStatusReport);
          var device_Id = msg.deviceDataReport.devId;
          var time = msg.deviceDataReport.status[0].t;
          var data = msg.deviceDataReport.status[0].value;
          var code = msg.deviceDataReport.status[0].code;
        }

        convert(device_Id, time, data, code);
      })
    });
  });

  connection.on('error', function (error) 
  {
    winston.debug('Amqp error : ' + error);
  });

  connection.on('close', function () 
  {
    winston.debug('Amqp Connection close');
  });
}

var convert = async function(device_Id, time, data, code)
{
  try
  {
    console.log(device_Id);
    console.log(time);
    console.log(data);

    var unix_to_time = new Date((time/1000) * 1000);
    var year = unix_to_time.getFullYear();
    var month = "0" + (unix_to_time.getMonth()+1);
    var korea_time = (unix_to_time.getHours());

    console.log(unix_to_time.getDate());

    console.log(korea_time > 23);
    if(korea_time > 23)
    {
      var day = "0" + (unix_to_time.getDate()+1);
      var hours = "0" + (korea_time-24);
    }
    else
    {
      var day = "0" + unix_to_time.getDate();
      var hours = "0" + (korea_time);
    }
    
    var minutes = "0" + unix_to_time.getMinutes();
    var seconds = "0" + unix_to_time.getSeconds();

    console.log(day.substr(-2));
    console.log(hours.substr(-2));
    
    var formattedTime = year +""+ month.substr(-2) +""+ day.substr(-2) +""+ hours.substr(-2) +""+ minutes.substr(-2) +""+ seconds.substr(-2);

    console.log(device_Id + " : " + formattedTime);

    if(data == true)
    {
      var sensor_data = 1;
      var sensor_type = "water";
      var sensor_time = formattedTime;
      insert_water_data(sensor_type, device_Id, sensor_time);
    }
    else if(code == "pir")
    {
      var sensor_data = 1;
      var sensor_type = "active";
      var sensor_time = formattedTime;
      //insert_active_data(sensor_type, device_Id, sensor_time);
      if (data == "none") active_still_check = false;
      else active_still_check = true;
    }
    return "result";
  }
  catch(e)
  {
    winston.debug('consumer/convert error : ' + error);
  }
}


export {
  consumer
}