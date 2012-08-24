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
          var newTable = new BlackjackTable.BlackjackTable({ 
            id: nextTableId,
            maxPlayers: data.maxPlayers,
            decks: data.decks,
            name: data.name 
          });
          tables[newTable.id] = newTable;
          tables[conn] = newTable;
          newTable.addPlayer(conn, data.playerName);
          sendBasicTableData(conn, newTable);
          newGameId++;
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
        case 'quit':
          break;
        case 'list':
          var tableList = [];
          for (var i = 0; i < tables.length; i++) {
            tableList.push({
              id: tables[i].id,
              name: tables[i].name,
              players: tables[i].players.length
            });
          }
          conn.write(JSON.stringify({ 
            message: "list",
            tables: tableList
          }));
          break;
      }
    });

    function sendBasicTableData(connection, table) {
      var players = [];
      for (var i = 0; i < table.players.length; i++) {
        players.push(table.players[i].name);
      }

      connection.write(JSON.stringify({
        message: "state", 
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