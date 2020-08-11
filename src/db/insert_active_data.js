var db_sql = require('./db_sql.js');

async function insert_active_data(sensor_type, device_Id, sensor_time)
{
  var query_search_nodeid = 'select node_id from square_sensor_list_tb where device_id = "' + device_Id + '"';
  const query_nodeid_rows = await db_sql.square_query(query_search_nodeid);
  var node_id = query_nodeid_rows[0].node_id;

  console.log(node_id);

  var query_check_sensor = 'select count(*) AS count, system_type, alert_min_data, alert_max_data from square_sensor_setting_tb where sensor_type ="' + sensor_type + '" and system_type = (select system_type from square_system_serial_tb where system_id = (select system_id from square_node_serial_tb where node_id = "' + node_id + '"))';
  const rows = await db_sql.square_query(query_check_sensor);

  if(rows[0].count == 1 && sensor_type == "active")
  {
    var query_check_active = 'select emergency_flag, check_flag from square_lite_sensor_active_current_data_tb where node_id = "' + node_id + '"';
    const query_active_rows = await db_sql.square_query(query_check_active);
    if(query_active_rows[0].check_flag == 1)
    {
      return "not_required_active";
    }
    else if(query_active_rows[0].check_flag == 0)
    {
      if(query_active_rows[0].emergency_flag ==1)
      {
        var query_E_current_update = 'update square_lite_sensor_active_current_data_tb set check_flag = true, response_time = "' + sensor_time + '" where node_id = "' + node_id + '";';
        const query_E_current_rows = await db_sql.square_query(query_E_current_update);
        var query_E_stat_update = 'update square_lite_sensor_active_stat_data_tb set check_flag = true, response_time = "' + sensor_time + '" where id = (select id from square_lite_sensor_active_stat_data_tb where node_id = "' + node_id + '" order by id desc limit 1);';
        const query_E_stat_rows = await db_sql.square_query(query_E_stat_update);
        return "update_emergency_active";
      }
      else if(query_active_rows[0].emergency_flag == 0)
      {
        var query_interval_check = 'select count(request_time) AS count from square_lite_sensor_active_current_data_tb where node_id = "' + node_id + '" and "' + sensor_time + '" between date_sub(request_time, INTERVAL (select response_period from square_lite_sensor_active_setting_tb where node_id = "' + node_id + '") MINUTE) and date_add(request_time, INTERVAL (select response_period from square_lite_sensor_active_setting_tb where node_id = "' + node_id + '") MINUTE);';
        const query_interval_rows = await db_sql.square_query(query_interval_check);

        if(query_interval_rows[0].count == 0)
        {
          return "not_requeired_interval_active";
        }
        else if(query_interval_rows[0].count == 1)
        {
          var query_I_current_update = 'update square_lite_sensor_active_current_data_tb set check_flag = true, response_time = "' + sensor_time + '" where node_id = "' + node_id + '";';
          const query_I_current_rows = await db_sql.square_query(query_I_current_update);
          var query_I_stat_update = 'update square_lite_sensor_active_stat_data_tb set check_flag = true, response_time = "' + sensor_time + '" where id = (select id from square_lite_sensor_active_stat_data_tb where node_id = "' + node_id + '" order by id desc limit 1);';
          const query_I_stat_rows = await db_sql.square_query(query_I_stat_update);
          return "update_Interval_active";
        }
      }
    }
  }
}

export {
  insert_active_data
}
