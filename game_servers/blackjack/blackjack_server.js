var sockjs  = require('sockjs');

exports.blackjackServer = function(sockjs_opts, server, prefix) {
  var blackjack = sockjs.createServer(sockjs_opts);
  var self = this;

  self.games = {};
  self.gamesByPlayer = {};
  self.nextGameId = 1;

  blackjack.on('connection', function(conn) {
    conn.on('close', function() {

    });

    conn.on('data', function(message) {
      var data = JSON.parse(message);

      switch(data.message) {
        case 'new':
          var newGame = new BlackjackGame({ id: nextGameId,
                                            maxPlayers: data.maxPlayers,
                                            decks: data.decks,
                                            name: data.name });
          games[newGame.id] = newGame;
          games[conn] = newGame;
          newGame.addPlayer(conn, data.playerName);
          sendBasicGameData(conn, newGame);
          newGameId++;
          break;
        case 'join':
          var game = games[data.id];
          if (game.addPlayer(conn, data.playerName)) {
            games[conn] = game;
            sendBasicGameData(conn, game);

            // Notify all the other players of the new player
            for (var i = 0; i < game.players.length; i++) {
              game.players[i].connection.write(JSON.stringify({
                message: "new player",
                newPlayer: data.playerName
              }));
            }
          }
          else {
            conn.write(JSON.stringify({ error: "Too many players" }));
          }
          break;
        case 'quit':
          break;
        case 'list':
          var gameList = [];
          for (var i = 0; i < games.length; i++) {
            gameList.push({ message: "list",
                            id: games[i].id,
                            name: games[i].name,
                            players: games[i].players.length});
          }
          conn.write(JSON.stringify(gameList));
          break;
      }
    });

    function sendBasicGameData(connection, game) {
      var players = [];
      for (var i = 0; i < game.players.length; i++) {
        players.push(game.players[i].name);
      }

      connection.write(JSON.stringify({
        message: "state", 
        id: game.id,
        maxPlayers: game.maxPlayers,
        decks: game.decks,
        name: game.name,
        players: players }));
      };
  });

  blackjack.installHandlers(server, 
    {prefix: prefix + '/blackjack'});
};