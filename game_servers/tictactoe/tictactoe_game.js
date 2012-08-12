function TicTacToeGame(playerOneId, playerTwoId) {
  var self = this;

  self.board = [];
  self.players = [];

  self.addPlayer = function(playerId) {
    if (self.players.length == 2) {
      throw("Cannot add more than two players");
    }
    self.players.push(playerId);
  };

  self.move = function(location) {
    if (self.board[location] != null) {
      throw("Location is already set");
    }
    self.board[location] = "X";
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