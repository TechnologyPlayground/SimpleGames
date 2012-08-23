var sockjs  = require('sockjs');

exports.blackjackServer = function(sockjs_opts, server, prefix) {
  var blackjack = sockjs.createServer(sockjs_opts);
  var self = this;

  self.games = {};
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
                                            name: data.name});
          games[newGame.id] = newGame;
          newGame.addPlayer(conn);
          sendBasicGameData(conn, newGame);
          newGameId++;
          break;
        case 'join':
          var game = games[data.id];
          game.addPlayer(conn);
          sendBasicGameData(conn, game);
          break;
        case 'quit':
          break;
        case 'list':
          var gameList = [];
          for (var i = 0; i < games.length; i++) {
            gameList.push({ id: games[i].id,
                            name: games[i].name,
                            players: games[i].players.length});
          }
          conn.write(JSON.stringify(gameList));
          break;
      }
    });

    function sendBasicGameData(connection, game) {
      connection.write(JSON.stringify({ id: game.id,
                                    maxPlayers: game.maxPlayers,
                                    decks: game.decks,
                                    name: game.name}))
      };
  });

  blackjack.installHandlers(server, 
    {prefix: prefix + '/blackjack'});
};