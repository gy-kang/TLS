const app = require('./app.js');
const port = 23000;

app.listen( port, function(){
    console.log('Express listening on port', port);
});