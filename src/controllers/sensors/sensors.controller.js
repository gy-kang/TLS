var app_api = require('./app_api.js');
var {insert_active_data} = require('../../db/insert_active_data');
var publisher = require('../../event/publisher');
require('date-utils');

const post = async (req, res, next) => 
{
  try 
  {
    const node_id = req.params.id;
    var date = new Date();
    var active_time = date.toFormat('YYYYMMDDHH24MISS');
    var timestamp = date.toFormat('YYYY-MM-DD HH24:MI:SS');
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
        var req_emergency_flag = "";
        if(req.body.data == "common")
        {
 
          req_device_id = req.body.device_id;

          const env_sensor = app_api.post_Things(req_node_id, req_device_id);
        }
        else if(req.body.data == "active")
        {
          req_device_id = req.body.device_id;
          req_emergency_flag = req.body.emergency_flag;

          /*
          //pir active
          if(active_still_check == true)
          {
            insert_active_data(req.body.data, req.body.device_id, active_time);
          }
          */
          const active_sensor = publisher.publish_event(req_node_id, req_device_id, req_emergency_flag);
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
    winston.error('api error : '+ e);
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


