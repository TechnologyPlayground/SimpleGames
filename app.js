var express = require('express');
var sockjs  = require('sockjs');
var app = express();

var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
 
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
});

var server = require('http').createServer(app); /*create a nodejs http server */
sockjs_echo.installHandlers(server, {prefix:'/games'});

app.use(express.static('public'));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/tictactoe', function(req, res) {
  res.render("tictactoe");
});

server.listen(3000);
console.log('Listening on port 3000');