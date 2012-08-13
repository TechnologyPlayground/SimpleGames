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

/*
var sockjs_url = "/games";
var sockjs = new SockJS(sockjs_url);
$("#first input").focus();
var div = $("#first div");
var inp = $("#first input");
var form = $("#first form");
print = function(m, p) {
  if (p == 'undefined') {
    p = ""
  }
  else {
    p = JSON.stringify(p);
  }

  div.append($("<code>").text(m + " " + p));
  div.append($("<br>"));
  div.scrollTop(div.scrollTop() + 10000);
}

sockjs.onopen = function() {
  print("[*] open", sockjs.protocol);
}

sockjs.onmessage = function(e) {
  print("[.] message", e.data);
}

sockjs.onclose = function() {
  print("[*] close");
}

form.submit(function(e) {
  e.preventDefault();
  print("[ ] sending", inp.val());
  sockjs.send(inp.val());
  inp.val("");
  return false;
});
*/