
var app_api = require('./app_api.js');
var {insert_data} = require('../../db/insert_data');

require('date-utils');

const post = async (req, res, next) => 
{
  try 
  {
    const node_id = req.params.id;

    if (!node_id) 
    {
      return res.status(400).json({error: 'empty id'});
    }
    else if(node_id == "req")
    {
      var req_node_id = req.body.node_id.split(',');

      for(var i = 0; i < req_node_id.length; i++)
      {
        var req_data = "";
        if(req.body.data == "common")
        {
          req_data = "d";
        }
        else if(req.body.data == "active")
        {
          req_data = "w";
        }

        var sensor_nodeId = "";
        if(req_node_id[i] == "SS004")
        {
          sensor_nodeId = "SS004";
        }
        else if(req_node_id[i] == "SS001")
        {
          sensor_nodeId = "SS001"
        }
        else{
          continue;
        }
        console.log(sensor_nodeId);
        const env_sensor = await app_api.post_Things(sensor_nodeId, req_data);

        var dt = new Date();
        dt.add({hours: 9});
        var time = dt.toFormat('YYYYMMDDHH24MISS');
        var temp_data = env_sensor.deviceState.temperature;
        var humi_data = env_sensor.deviceState.humidity;
        console.log("here");
        var temp_Json = {"data":temp_data, "sensor_type":"temperature"};
        var humi_Json = {"data":humi_data, "sensor_type":"humidity"};

        var jsonArray = new Array();

        jsonArray.push(temp_Json);
        jsonArray.push(humi_Json);

        var sensor_Json = new Object();
        sensor_Json = {"time":time, "list":jsonArray};

        for(var i = 0; i < sensor_Json.list.length; i++)
        {
          var sensor_type = sensor_Json.list[i].sensor_type;
          var sensor_data = sensor_Json.list[i].data;
          var sensor_time = sensor_Json.time;
          console.log(sensor_time);
        const result = insert_data(sensor_type, sensor_nodeId, sensor_data, sensor_time);
        }
      }
      return res.status(200).json({result: 'test good'});
    }
  } catch (e) 
  {
    next(e)
  }
}

export {
  post
}


