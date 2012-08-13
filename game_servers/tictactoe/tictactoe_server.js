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
      console.log("Closing connection " + conn.id + "...");
      var game = gameLookup[conn];
      if (game == null) {
        console.log("WARN: Could not find game...");
        return;
      }

      console.log("Deleting connection...");
      delete gameLookup[conn];
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i] != conn) {
          game.players[i].close();
        }
      };
    });

    conn.on('data', function(message) {
      console.log(message);

      var game = gameLookup[conn];

      if (game == null) {
        console.log("Could not find requested game...");
        return;
      }

      var data = JSON.parse(message);

      if (data.message == "move") {
        console.log("Process move...");
        if (game.players[(game.nextPlayer() == "X") ? 0 : 1] == conn) {
          console.log("Moving...");
          var result = game.move(data.location);
          sendTurnMessage(game);

          if (result != null) {
            console.log("Game over, deleting game...");
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
      whoseTurn: game.nextPlayer(), 
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
};