var db_sql = require('./db_sql.js');

async function insert_water_data(sensor_type, device_Id, sensor_time)
{
  var query_search_nodeid = 'select node_id from square_sensor_list_tb where device_id = "' + device_Id + '"';
  const query_nodeid_rows = await db_sql.square_query(query_search_nodeid);
  var node_id = query_nodeid_rows[0].node_id;

  console.log(node_id);

  var query_check_sensor = 'select count(*) AS count, system_type, alert_min_data, alert_max_data from square_sensor_setting_tb where sensor_type ="' + sensor_type + '" and system_type = (select system_type from square_system_serial_tb where system_id = (select system_id from square_node_serial_tb where node_id = "'+ node_id + '"))';
  const rows = await db_sql.square_query(query_check_sensor);
  if(rows[0].count == 1 && sensor_type == "water")
  {
    var query_replace_current = 'replace into square_' + rows[0].system_type + '_sensor_water_current_data_tb (node_id, time) select "' + node_id + '","' + sensor_time + '";';
    const query_current_rows = await db_sql.square_query(query_replace_current);
    var query_insert_stat = 'insert into square_'+rows[0].system_type + '_sensor_water_stat_data_tb (node_id, time) values ("' + node_id + '","' + sensor_time + '");';
    const query_stat_rows = await db_sql.square_query(query_insert_stat);

    return "insert water data";
  }
}

export {
  insert_water_data
}
  