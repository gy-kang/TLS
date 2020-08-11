var app_api = require('./app_api.js');
require('date-utils');

const post = async (req, res, next) => 
{
  try 
  {
    const node_id = req.params.id;
    var date = new Date();
    var timestamp = date.toFormat('YYYY-MM-DD HH24:MI:SS');

    if (!node_id) 
    {
      return res.status(400).json({error: 'empty id'});
    }
    else if(node_id == "req")
    {
      console.log(req.body);
      var req_node_id = req.body.node_id.split(',');

      for(var i = 0; i < req_node_id.length; i++)
      {
        var req_device_id = "";
        if(req.body.data == "common")
        {
 
          req_device_id = req.body.device_id;
           
          console.log(req_device_id);

          const env_sensor = app_api.post_Things(req_node_id, req_device_id);
        }
        else if(req.body.data == "active")
        {
          req_device_id = req.body.device_id;
          req_emergency_flag = req.body.emergency_flag;
          console.log(sensor_nodeId);
          
          const active_sensor = publisher.publish_event(sensor_nodeId, req_device_id, req_emergency_flag);
        }
      }
      return res.status(200).json(
        {
          "timestamp": timestamp,
          "success": true,
          "code": 1000,
          "msg": "성공하였습니다."
        });
    }
  } catch (e) 
  {
    return res.status(500).json(
      {
        "timestamp": timestamp,
        "success": false,
        "code": 2000,
        "msg": "실패하였습니다."
      });
    next(e)
  }
}

export {
  post
}


