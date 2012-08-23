function Connection() {
  var self = this;

  var sockjs_url = "/games/tictactoe";
  var sockjs;
  var game;

  self.connect = function(theGame) {
    game = theGame;

    sockjs = new SockJS(sockjs_url);

    sockjs.onopen = function() {
      //game = new Game(self);
      //game.waitForOpponent();
    }

    sockjs.onmessage = function(e) {
      console.log(e);
      var data = JSON.parse(e.data);

      if (data.message == "startGame") {
        game.start(data.player);
      }
      else if (data.message == "takeTurn") {
        game.moveMade({ 
          whoseTurn: data.whoseTurn,
          board: data.board,
          winner: data.winner 
        });
      }
    }

    sockjs.onclose = function() {
      console.log("Closing connection...");
      game.quit();
    }
  };

  self.move = function(location) {
    sockjs.send(JSON.stringify({ message: "move", location: location }));
  };

  self.quit = function() {
    sockjs.close();
  }
}