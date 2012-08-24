var sockjs  = require('sockjs');
var BlackjackTable  = require('./table');

exports.blackjackServer = function(sockjs_opts, server, prefix) {
  var blackjack = sockjs.createServer(sockjs_opts);
  var self = this;

  self.tables = {};
  self.tablesByPlayer = {};
  self.nextTableId = 1;

  blackjack.on('connection', function(conn) {
    conn.on('close', function() {

    });

    conn.on('data', function(message) {
      var data = JSON.parse(message);

      switch(data.message) {
        case 'new':
          var newTable = new BlackjackTable.create({ 
            id: self.nextTableId,
            maxPlayers: data.maxPlayers,
            decks: data.decks,
            name: data.name 
          });
          console.log(newTable);
          self.tables[newTable.id] = newTable;
          self.tablesByPlayer[conn] = newTable;
          newTable.addPlayer(conn, data.playerName);
          sendBasicTableData(conn, newTable);
          self.nextTableId++;
          break;
        case 'join':
          var table = tables[data.id];
          if (table.addPlayer(conn, data.playerName)) {
            tables[conn] = table;
            sendBasictableData(conn, table);

            // Notify all the other players of the new player
            for (var i = 0; i < table.players.length; i++) {
              table.players[i].connection.write(JSON.stringify({
                message: "new player",
                newPlayer: data.playerName
              }));
            }
          }
          else {
            conn.write(JSON.stringify({ error: "Too many players" }));
          }
          break;
        case 'start game':
          var table = tablesByPlayer[conn];
          table.startGame();
          break;
        case 'quit':
          break;
        case 'list':
          console.log(self.tables);
          var tableList = [];
          for (table in self.tables) {
            tableList.push({
              id: self.tables[table].id,
              name: self.tables[table].name,
              players: self.tables[table].players.length
            });
          }
          conn.write(JSON.stringify({ 
            message: "list",
            tables: tableList
          }));
          console.log(tableList);
          break;
      }
    });

    function sendBasicTableData(connection, table) {
      var players = [];
      for (var i = 0; i < table.players.length; i++) {
        players.push(table.players[i].name);
      }

      connection.write(JSON.stringify({
        message: "table created",
        id: table.id,
        maxPlayers: table.maxPlayers,
        decks: table.decks,
        name: table.name,
        players: players }));
      };
  });

  blackjack.installHandlers(server, 
    {prefix: prefix + '/blackjack'});
};