var sockjs  = require('sockjs');
var TicTacToeGame = require('./tictactoe_game.js');

exports.tictactoeServer = function(sockjs_opts, server, prefix) {
  var tictactoe = sockjs.createServer(sockjs_opts);

  var unmatchedPlayers = [];
  var gameLookup = {};

  tictactoe.on('connection', function(conn) {
    console.log("New connection...");
    unmatchedPlayers.push(conn);
    console.log(unmatchedPlayers.length.toString() + " players waiting...");
    if (unmatchedPlayers.length == 2) {
      console.log("Starting game...");
      var player2 = unmatchedPlayers.pop();
      var player1 = unmatchedPlayers.pop();
      var game = TicTacToeGame.createGame(player1, player2);
      gameLookup[player1] = game;
      gameLookup[player2] = game;

      player1.write(JSON.stringify({ message: "startGame", 
                      player: "X" }));
      player2.write(JSON.stringify({ message: "startGame", 
                      player: "O" }));
      console.log("Game started...");
    }

    conn.on('close', function() {
      var game = gameLookup[conn];
      if (game == null) return;

      delete gameLookup[conn];
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i] != conn) {
          game.players[i].close();
        }
      };
    });

    conn.on('data', function(message) {
      console.log(conn);
      console.log(message);

      var game = gameLookup[conn];

      if (game == null) {
        console.log("Could not find requested game...");
        return;
      }

      var data = JSON.parse(message);

      if (data.message == "move") {
        console.log("Process move...");
        if (game.nextPlayer() == conn) {
          console.log("Moving...");
          var result = game.move(data.location);
          sendTurnMessage(game);

          if (result != null) {
            delete gameLookup[game.players[0]];
            delete gameLookup[game.players[1]];
          }
        }
      }

      if (data.message == "quit") {
        delete gameLookup[game.players[0]];
        delete gameLookup[game.players[1]];
      }
    });
  });

  function sendTurnMessage(game) {
    var data = JSON.stringify({  
      message: "takeTurn", 
      whoseTurn: (game.nextPlayer() == game.players[0]) ? "X" : "O", 
      board: game.board,
      winner: game.getWinner(game.board) 
    });

    console.log("Sending data to players: " + data);
    for (var i = 0; i < game.players.length; i++) {
      game.players[i].write(data);
    }
  }

  tictactoe.installHandlers(server, 
    {prefix: prefix + '/tictactoe'});

  this.getAvailableGame = function() {
    for (var i = 0; i < games.length; i++) {
      if (games[i].player1 == null || games[i].player2 == null) {
        return games[i];
      }

      games.push(new TicTacToeGame());
    }
  };
};