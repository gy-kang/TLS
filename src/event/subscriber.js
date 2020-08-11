
var MQTT = require("mqtt");
var {insert_active_data} = require('../db/insert_active_data')
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
    var sensor_device_id = strArray[1];
    var sensor_body = message.toString();
    var timestamp = sensor_body.datatime;
    var sensor_data = 0;
    if (sensor_body.value == true){
      sensor_data = 1;
    }
 //   insert_active_data(sensor_type, sensor_device_id, sensor_data, timestamp);
  }
}

export {
  subscriber
}