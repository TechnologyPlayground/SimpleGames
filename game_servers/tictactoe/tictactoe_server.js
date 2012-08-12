function tictactoeServer(sockjs_opts, server, prefix) {
  var tictactoe = sockjs.createServer(sockjs_opts);

  var games = [];


  tictactoe.on('connection', function(conn) {
      conn.on('data', function(message) {
          conn.write(message);
      });
  });

  tictactoe.installHandlers(server, 
    {prefix:prefix + '/tictactoe'});

  this.getAvailableGame = function() {
    for (var i = 0; i < games.length; i++) {
      if (games[i].player1 == null || games[i].player2 == null) {
        return games[i];
      }

      games.push(new TicTacToeGame());
    }
  };
};