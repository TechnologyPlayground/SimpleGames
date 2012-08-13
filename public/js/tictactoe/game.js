function Game(conn) {
  var connection = conn;
  var self = this;
  var state = ko.observable("not connected");
  var whoseTurn = ko.observable();
  var winner = ko.observable();
  self.board = ko.observableArray();
  self.player = ko.observable(null);

  self.needsConnection = ko.computed(function() {
    return (state() == "not connected");
  });

  self.isCompleted = ko.computed(function() {
    return (state() == "completed");
  });

  self.waitingForOpponent = ko.computed(function() {
    return (state() == "waiting for opponent");
  });

  self.inProgress = ko.computed(function() {
    return (state() == "playing");
  });

  self.canMove = ko.computed(function() {
    return (whoseTurn() != null && self.player() == whoseTurn());
  });

  self.results = ko.computed(function() {
    return winner();
  });

  self.connect = function() {
    connection.connect(self);
    self.waitForOpponent();
  };

  self.waitForOpponent = function() {
    state("waiting for opponent"); 
  };

  self.start = function(playerLetter) {
    state("playing"); 
    self.player(playerLetter);
    self.board([null, null, null, 
                null, null, null, 
                null, null, null]);
    whoseTurn("X");
  };

  self.move = function(location) {
    if (!self.canMove()) throw("It is not your turn");
    if (self.board()[location] == null) {
      conn.move(location);
    }
  };

  self.moveMade = function(results) {
    self.board(results.board);
    whoseTurn(results.whoseTurn);
    if (results.winner != null) {
      state("completed");
      winner(results.winner);
    }
  };

  self.quit = function() {
    state("not connected");
    self.board([]);
    self.player(null);
    conn.quit();
  };
};