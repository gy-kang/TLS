var db_sql = require('./db_sql.js');

async function insert_env_data(sensor_node_id, sensor_Obj){
  var dt = new Date();

  dt.add({hours: 9});
  
  var time = dt.toFormat('YYYYMMDDHH24MISS');
  var temp_data = sensor_Obj.deviceState.temperature;
  var humi_data = sensor_Obj.deviceState.humidity;

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
    var node_id = sensor_node_id;

    var query_check_sensor = 'select count(*) AS count, system_type, alert_min_data, alert_max_data from square_sensor_setting_tb where sensor_type ="' + sensor_type + '" and system_type = (select system_type from square_system_serial_tb where system_id = (select system_id from square_node_serial_tb where node_id = "' + node_id + '"))';
    
    const rows = await db_sql.square_query(query_check_sensor);
    
    if(rows[0].count == 1)
    {
      var query_replace_previous = 'replace into square_'+rows[0].system_type+'_sensor_previous_data_tb (node_id, time, data, sensor_type, alert) select * from square_'+rows[0].system_type+'_sensor_current_data_tb where node_id="'+node_id+'" and sensor_type="'+sensor_type+'";';
      
      const query_previous_rows = await db_sql.square_query(query_replace_previous);
      
      var query_replace_current = 'replace into square_' + rows[0].system_type + '_sensor_current_data_tb (node_id, time, data, sensor_type, alert) select "' + node_id + '","' + sensor_time + '","' + sensor_data + '","' + sensor_type + '", (select if(' + rows[0].alert_max_data + '>' + sensor_data + ' and ' + sensor_data + '>' + rows[0].alert_min_data +',0,1));';
      
      const query_current_rows = await db_sql.square_query(query_replace_current);
      
      var query_insert_stat = 'insert into square_'+rows[0].system_type+'_sensor_stat_data_tb (node_id, time, data, sensor_type) values ("'+node_id+'","'+sensor_time+'","'+sensor_data+'","'+sensor_type+'");';
      
      const query_stat_rows = await db_sql.square_query(query_insert_stat);
    }
  }
}

export {
  insert_env_data
}
