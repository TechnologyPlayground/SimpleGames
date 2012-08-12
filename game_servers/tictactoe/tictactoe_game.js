function TicTacToeGame(playerOneId, playerTwoId) {
  var self = this;

  self.board = [];
  self.players = [];
  var lastMove = "O";

  self.addPlayer = function(playerId) {
    if (self.players.length == 2) {
      throw("Cannot add more than two players");
    }
    self.players.push(playerId);
  };

  self.move = function(location) {
    console.log(location);
    if (location < 0 || location > 8) {
      throw("Location is invalid");
    }
    if (self.board[location] != null) {
      throw("Location is already set");
    }
    lastMove = (lastMove == "X") ? "O" : "X";
    self.board[location] = lastMove;
  };

  if (playerOneId) {
    self.addPlayer(playerOneId);
    if (playerTwoId) {
      self.addPlayer(playerTwoId);
    }
  }

  for (var i = 0; i < 9; i++) {
    self.board[i] = null;
  }
}