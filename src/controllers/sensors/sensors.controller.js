
var app_api = require('./app_api.js');

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
        var req_device_id = "";
        if(req.body.data == "common")
        {
          req_device_id = req.body.device_id;
                  
          console.log(sensor_nodeId);

          const env_sensor = app_api.post_Things(sensor_nodeId, req_device_id);
        }
        else if(req.body.data == "active")
        {
          req_device_id = req.body.device_id;
          req_emergency_flag = req.body.emergency_flag;
          console.log(sensor_nodeId);
          
          const active_sensor = publisher.publish_event(sensor_nodeId, req_device_id, req_emergency_flag);
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


