describe("TicTacToe Game", function() {
  var game;

  beforeEach(function() {
    game = new TicTacToeGame();
  });

  describe("on a new game", function() {
    it("should start with an empty board", function() {
      for (var i = 0; i < 9; i++) {
        expect(game.board[i]).toBeNull();
      }
    });

    it("should have no players", function() {
      expect(game.players.length).toEqual(0);
    });

    it("should have players if specified", function() {
      game = new TicTacToeGame("Foo", "Bar");
      expect(game.players.length).toEqual(2);
      expect(game.players[0]).toEqual("Foo");
      expect(game.players[1]).toEqual("Bar");
    });
  });

  describe("when adding players", function() {
    beforeEach(function() {
      game.addPlayer("Foo");
    });

    it("should add player to the first spot", function() {
      expect(game.players[0]).toEqual("Foo");
    });

    it("should add second player to second spot", function() {
      game.addPlayer("Bar");
      expect(game.players[1]).toEqual("Bar");
    });

    it("should throw if a third player is added", function() {
      game.addPlayer("Bar");
      expect(function() { game.addPlayer("Baz"); }).toThrow();
    });
  });

  describe("during a game", function() {
    for (var i = 0; i < 9; i++) {
      (function(spot) {
        it("should set an X at spot " + spot, function() {
          game.move(spot);
          expect(game.board[spot]).toEqual("X");
        });
      })(i);
    }

    it("should throw if the spot is already set", function() {
      game.move(0);
      expect(function() { game.move(0) }).toThrow();
    });

    it("should throw if the spot is invalid", function() {
      expect(function() { game.move(-1) }).toThrow();
      expect(function() { game.move(9) }).toThrow();
    });

    it("should alternate Xs and Os", function() {
      for (var i = 0; i < 9; i++) {
        game.move(i);
        expect(game.board[i]).toEqual((i % 2) ? "O" : "X");
      }
    });

    it("should return a null result if more moves are possible", function() {
      expect(game.move(0)).toBeNull();
    });

    it("should return a tie if there was no winner", function() {
      game.board = ["X", "X", "O", 
                    "O", "O", "X", 
                    "X", "O", null];
      var result = game.move(8);
      expect(result).toEqual({winner: null});
    });
  });

  describe("winning scenarios", function() {
    for (var i = 0; i < 2; i++) {
      (function(pos) {
        var letter = (pos == 0) ? "X" : "O";
        var other = (pos == 1) ? "X" : "O";

        it("should return winner " + letter + " for first row", function() {
          var result = game.getWinner([letter, letter, letter, 
                                       other, other, null, 
                                       null, null, null]);
          expect(result).toEqual(letter);
        });

        it("should return winner " + letter + " for second row", function() {
          var result = game.getWinner([other, other, null, 
                                       letter, letter, letter, 
                                       null, null, null]);
          expect(result).toEqual(letter);
        });

        it("should return winner " + letter + " for third row", function() {
          var result = game.getWinner([other, other, null, 
                                       null, null, null, 
                                       letter, letter, letter]);
          expect(result).toEqual(letter);
        });
      })(i);
    }
  });
});