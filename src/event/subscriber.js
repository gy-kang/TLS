import { insert_active_data } from "../db/insert_active_data";
import { insert_water_data } from "../db/insert_water_data";

var MQTT = require("mqtt");
var {insert_active_data} = require('../db/insert_active_data');
var winston = require('../config/winston');
var subscriber = {};

subscriber = async function()
{

  const BROKER_URL = "mqtt://square.abrain.co.kr:21883";
  const TOPIC_NAME = "event/#";
  const CLIENT_ID = "adapter_sub_01";

  var client  = MQTT.connect(BROKER_URL, {clientId: CLIENT_ID});

  client.on("connect", onConnected);
  client.on("message", onMessageReceived)

  function onConnected()
  {
    client.subscribe(TOPIC_NAME);
  }

  function onMessageReceived(topic, message)
  {
    var topic_array = topic.toString().split('/');
    if(topic_array[1] == 'minael')
    {
      var string_replace = message.toString().replace(/'/gi, '\"');
      var sensor_body = JSON.parse(string_replace);
      winston.info('minael : ' + string_replace);
      var sensor_type = sensor_body.type;
      var sensor_device_id = sensor_body.device;
      var timestamp = sensor_body.datatime;
  
      var sensor_data = 0;
      if (sensor_body.value == true){
        sensor_data = 1;
      }
      insert_active_data(sensor_type, sensor_device_id, timestamp);
    }
    else if(topic_array[1] == 'hej')
    {
      var sensor_body = message;
      winston.info(`hej : ${sensor_body}`);
      var sensor_type = sensor_body.sensor_type;
      var sensor_device_id = sensor_body.device;
      var timestamp = sensor_body.sensor_time;
      insert_water_data(sensor_type, sensor_device_id, timestamp);      
    }

  }
}

export {
  subscriber
}