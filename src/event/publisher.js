var MQTT = require("mqtt");
//var randomstring = require("randomstring");
//if client id error, use randomstring id
var publisher = {};

publisher.publish_event = function(req_node_id, req_device_id, req_emergency_flag)
{
  const BROKER_URL = "mqtt://square.abrain.co.kr:21883";
  const TOPIC_NAME = "minael";
  const CLIENT_ID = req_device_id;

  var client  = MQTT.connect(BROKER_URL, {clientId: CLIENT_ID});

  client.on("connect", onConnected);

  function onConnected()
  {
    var active_Json = "";
    if(req_emergency_flag == true)
    {
        active_Json = JSON.stringify({"device":req_device_id, "color":"red"});
    }
    else if(req_emergency_flag == false)
    {
        active_Json = JSON.stringify({"device":req_device_id, "color":"blue"});
    }
    client.publish(TOPIC_NAME, active_Json);
    client.end();
  }
}

module.exports = publisher;