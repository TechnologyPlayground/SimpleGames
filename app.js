var tictactoe = require('./game_servers/tictactoe/tictactoe_server.js')
var express = require('express');
var sockjs  = require('sockjs');
var app = express();

var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var server = require('http').createServer(app); /*create a nodejs http server */

tictactoe.tictactoeServer(sockjs_opts, server, "/games");

app.use(express.static('public'));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/tictactoe', function(req, res) {
  res.render("tictactoe");
});

app.get('/blackjack', function(req, res) {
  res.render("blackjack");
});

server.listen(3000);
console.log('Listening on port 3000');