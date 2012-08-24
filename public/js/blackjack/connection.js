function Connection() {
  var self = this;

  var sockjs_url = "/games/tictactoe";
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

  // self.move = function(location) {
    // sockjs.send(JSON.stringify({ message: "move", location: location }));
  // };

  self.quit = function() {
    sockjs.close();
  };
}