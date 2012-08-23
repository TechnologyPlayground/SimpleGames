var sockjs  = require('sockjs');

exports.blackjackServer = function(sockjs_opts, server, prefix) {
  var blackjack = sockjs.createServer(sockjs_opts);

  blackjack.on('connection', function(conn) {
    conn.on('close', function() {
    });

    conn.on('data', function(message) {

    });
  });

  blackjack.installHandlers(server, 
    {prefix: prefix + '/blackjack'});
};