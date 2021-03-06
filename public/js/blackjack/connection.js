function Connection() {
  var self = this;

  var sockjs_url = "/games/blackjack";
  var sockjs;
  var game;

  self.connect = function(theGame) {
    game = theGame;

    sockjs = new SockJS(sockjs_url);

    sockjs.onopen = function() {
      sockjs.send(JSON.stringify({ message: "list" }));
    };

    sockjs.onmessage = function(e) {
      console.log(e);
      var data = JSON.parse(e.data);

      switch(data.message) {
        case "list":
          game.setTableList(data.tables);
          break;
      };
    };

    sockjs.onclose = function() {
      console.log("Closing connection...");
      game.quit();
    }
  };
  
  self.createTable = function(data) {
    sockjs.send(JSON.stringify({ message: "new", 
                                     maxPlayers: data.maxPlayers,
                                     name: data.name,
                                     playerName: data.playerName,
                                     decks: data.decks}));
  };

  // self.move = function(location) {
    // sockjs.send(JSON.stringify({ message: "move", location: location }));
  // };

  self.quit = function() {
    sockjs.close();
  };
}