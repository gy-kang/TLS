var MQTT = require("mqtt");
var {insert_active_data} = require('../db/insert_active_data');
var winston = require('../config/winston');
var subscriber = {};

subscriber = async function()
{

  const BROKER_URL = "mqtt://square.abrain.co.kr:1883";
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
    
    var strArray = topic.toString().split('/');
    var string_replace = message.toString().replace(/'/gi, '\"');
    var sensor_body = JSON.parse(string_replace);
    winston.info('mqtt : ' + sensor_body);
    var sensor_type = sensor_body.type;
    var sensor_device_id = sensor_body.device;
    var timestamp = sensor_body.datatime;

    var sensor_data = 0;
    if (sensor_body.value == true){
      sensor_data = 1;
    }
    insert_active_data(sensor_type, sensor_device_id, timestamp);
  }
}

export {
  subscriber
}