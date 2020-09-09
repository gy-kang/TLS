var request = require('request');
var {insert_env_data} = require('../../db/insert_env_data');

var app_api = {};

app_api.post_Things = function(sensor_node_id, sensor_device_id)
{
     var options = 
    {
      'method': 'GET',
      'url': 'https://goqual.io/openapi/device/' + sensor_device_id,
      'headers': {
        'Authorization': 'Bearer 67cc73b9-a59e-490b-8b10-f09158f8c8ca',
        'Cookie': 'JSESSIONID=7EEFDFB12BBE72CF18CDAE33D7AE3A80'
      }
    };
    request(options, function (error, response) 
    {
      if (error) throw new Error(error);
      if (error) winston.error('goqual api error : ' + error);
      const sensor_Obj = JSON.parse(response.body);
      const result = insert_env_data(sensor_node_id, sensor_Obj);
    });
}

module.exports = app_api;

