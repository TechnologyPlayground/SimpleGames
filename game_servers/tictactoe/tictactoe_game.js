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

  self.nextPlayer = function() {
    return (lastMove == "X") ? "O" : "X";
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

    var winningLetter = self.getWinner(self.board);
    if (winningLetter) {
      return {winner: winningLetter};
    }

    return null;
  };

  self.getWinner = function(testBoard) {
    var winner;
    
    for (var i = 1; i < 4; i++) {
      if (winner = checkRow(testBoard, i)) return winner;
      if (winner = checkColumn(testBoard, i)) return winner;      
    }

    if (winner = checkForWin(testBoard, 0, 4, 8)) return winner;
    if (winner = checkForWin(testBoard, 2, 4, 6)) return winner;

    if (testBoard.indexOf(null) == -1) {
      return "TIE";
    }
    return null;
  };

  function checkRow(testBoard, row) {
    var index = (row - 1) * 3;
    return checkForWin(testBoard, index, index + 1, index + 2);
  }

  function checkColumn(testBoard, column) {
    var index = (column - 1);
    return checkForWin(testBoard, index, index + 3, index + 6);
  }

  function checkForWin(testBoard, index1, index2, index3) {
    if (testBoard[index1] != null
        && testBoard[index1] == testBoard[index2]
        && testBoard[index2] == testBoard[index3]) {
      return testBoard[index1];
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

if (exports) {
  exports.createGame = function(playerOneId, playerTwoId) {
    return new TicTacToeGame(playerOneId, playerTwoId);
  }
}