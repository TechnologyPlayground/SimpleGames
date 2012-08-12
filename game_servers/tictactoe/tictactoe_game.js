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
    if (location < 0 || location > 8) {
      throw("Location is invalid");
    }
    if (self.board[location] != null) {
      throw("Location is already set");
    }
    lastMove = (lastMove == "X") ? "O" : "X";
    self.board[location] = lastMove;

    if (self.board.indexOf(null) == -1) {
      return {winner: null};
    }

    return null;
  };

  self.getWinner = function(testBoard) {
    var winner;
    
    for (var i = 1; i < 4; i++) {
      if (winner = checkRow(testBoard, i)) return winner;
      if (winner = checkColumn(testBoard, i)) return winner;      
    }

    if (testBoard[0] != null
        && testBoard[0] == testBoard[4]
        && testBoard[4] == testBoard[8]) {
      return testBoard[0];
    }

    if (testBoard[2] != null
        && testBoard[2] == testBoard[4]
        && testBoard[4] == testBoard[6]) {
      return testBoard[2];
    }

    return null;
  };

  function checkRow(testBoard, row) {
    var index = (row - 1) * 3;

    if (testBoard[index] != null 
        && testBoard[index] == testBoard[index + 1] 
        && testBoard[index + 1] == testBoard[index + 2]) {
      return testBoard[index];
    }

    return null;
  }

  function checkColumn(testBoard, column) {
    var index = (column - 1);

    if (testBoard[index] != null
        && testBoard[index] == testBoard[index + 3]
        && testBoard[index + 3] == testBoard[index + 6]) {
      return testBoard[index];
    }

    return null;
  }

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