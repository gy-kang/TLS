
var MQTT = require("mqtt");
var {insert_data} = require('../db/insert_data')
var subscriber = {};

subscriber = async function()
{

  const BROKER_URL = "mqtt://34.85.110.82:1883:1883";
  const TOPIC_NAME = "abrain/#";
  const CLIENT_ID = "subscribe";

  var client  = MQTT.connect(BROKER_URL, {clientId: CLIENT_ID});

  client.on("connect", onConnected);
  client.on("message", onMessageReceived)

  function onConnected()
  {
    client.subscribe(TOPIC_NAME);
  }

  function onMessageReceived(topic, message)
  {
    
    var strArray=topic.toString().split('/');
    var sensor_uniqueid = strArray[1];
    var sensor_body = message.toString();
    var timestamp = sensor_body.datatime;
    var sensor_data = 0;
    var unixtime = moment(timestamp, 'YYYYMMDDhhmmss').unix();
    if (sensor_body.value == true){
      sensor_data = 1;
    }
    convert(sensor_uniqueid, unixtime, sensor_data);
  }

}

var convert = async function(device_Id, time, data)
{
  try
  {

    console.log(device_Id);
    console.log(time);
    console.log(data);

    var sensor_nodeId = "";

    if(device_Id == "ebfd4edf393ffcbe4exqgd" || device_Id == "eb0bba1ea1ffef5a68y2ou")
    {
      sensor_nodeId = "SS001";
    }
    else if(device_Id == "ebfd79723dd5afc79dyado" || device_Id == "ebb0a967620b192ea7vu6g")
    {
      sensor_nodeId = "SS004";
    }

    var unix_to_time = new Date((time/1000) * 1000);
    var year = unix_to_time.getFullYear();
    var month = "0" + (unix_to_time.getMonth()+1);
    if((unix_to_time.getHours() + 9) > 23 )
    {
      var day = "0" + (unix_to_time.getDate() + 1);
      var hours = "0" + (unix_to_time.getHours() + 9 - 24);
    }
    else
    {
      var day = "0" + unix_to_time.getDate();
      var hours = "0" + (unix_to_time.getHours()+9);
    }
    
    var minutes = "0" + unix_to_time.getMinutes();
    var seconds = "0" + unix_to_time.getSeconds();

    console.log(day.substr(-2));
    console.log(hours.substr(-2));
    
    var formattedTime = year + "" + month.substr(-2) + "" + day.substr(-2) + "" + hours.substr(-2) + "" + minutes.substr(-2) + "" + seconds.substr(-2);

    console.log(sensor_nodeId + ":" + formattedTime);

    if(data == true)
    {
      var sensor_data = 1;
      var sensor_type = "water";
      var sensor_time = formattedTime;
      insert_data(sensor_type, sensor_nodeId, sensor_data, sensor_time);
    }
    else if(data == "pir")
    {
      var sensor_data = 1;
      var sensor_type = "active";
      var sensor_time = formattedTime;
      insert_data(sensor_type, sensor_nodeId, sensor_data, sensor_time);
    }
    return "result";
  }
  catch(e)
  {
    console.log(e);
  }
}


export {
  subscriber
}