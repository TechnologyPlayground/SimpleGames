var express = require('express');
var app = express();
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/tictactoe', function(req, res) {
  res.render("tictactoe");
});

app.listen(3000);
console.log('Listening on port 3000');