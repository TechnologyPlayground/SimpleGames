describe("TicTacToe Client", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  describe("when not connected", function() {
    it("should need a connection", function() {
      expect(game.needsConnection()).toEqual(true);
    });

    it("should not have a player letter", function() {
      expect(game.player()).toBeNull();
    });

    it("should have an empty board", function() {
      expect(game.board().length).toEqual(0);
    });

    it("should not allow either player to move", function() {
      expect(game.canMove()).toBeFalsy();
    });
  });

  describe("when waiting for a game", function() {
    beforeEach(function() {
      game.waitForOpponent();
    });

    it("should not need a connection", function() {
      expect(game.needsConnection()).toEqual(false);
    });

    it("should not have a player letter", function() {
      expect(game.player()).toBeNull();
    });

    it("should have an empty board", function() {
      expect(game.board().length).toEqual(0);
    });

    it("should be waiting for an opponent", function() {
      expect(game.waitingForOpponent()).toBeTruthy();
    });
  });

  describe("when starting a game", function() {
    beforeEach(function() {
      game.start("X");
    });

    it("should not need a connection", function() {
      expect(game.needsConnection()).toEqual(false);
    });

    it("should have a player letter", function() {
      expect(game.player()).toEqual("X");
    });

    it("should have a valid board", function() {
      expect(game.board().length).toEqual(9);
      for (var i = 0; i < 9; i++) {
        expect(game.board()[i]).toEqual(null);
      }
    });

    it("should allow player X to make a move", function() {
      expect(game.canMove()).toBeTruthy();
    });

    it("should not allow player O to make a move", function() {
      game.start("O");
      expect(game.canMove()).toBeFalsy();
    });
  });

  describe("while in a game", function() {
    beforeEach(function() {
      conn = {
        move: function(location) {}
      };

      spyOn(conn, "move");

      game = new Game(conn);
      game.start("X");
    })

    it("should not allow the player to move if it is not their turn", function() {
      game.start("O");
      expect(function() { game.move(location); }).toThrow();
    })

    it("should allow the player to move if it is their turn", function() {
      expect(function() { game.move(location); }).not.toThrow();
    });

    it("should not allow the player to move into an occupied spot", function() {
      game.board(["X", null, null, 
                  null, null, null, 
                  null, null, null]);
      game.move(0);
      expect(conn.move).not.toHaveBeenCalled();
    });

    it("should call the move method of the connection", function() {
      game.move(1);
      expect(conn.move).toHaveBeenCalled();
      expect(conn.move.mostRecentCall.args[0]).toEqual(1);
    });
  });

  describe("after a successful move has been made", function() {
    var data = { 
      whoseTurn: "O",
      board: ["X", null, "O",
              "O", "X", null,
              "X", null, null],
      winner: null
    };

    beforeEach(function() {
      game.start("X");
    });

    it("should update the board", function() {
      game.moveMade(data);
      expect(game.board()).toEqual(["X", null, "O",
              "O", "X", null,
              "X", null, null]);
    });

    it("should update who has the next turn", function() {
      game.moveMade(data);
      expect(game.canMove()).toBeFalsy();
    });

    it("should not mark the game as completed", function() {
      game.moveMade(data);
      expect(game.isCompleted()).toBeFalsy();
    });
  });

  describe("when the game has completed", function() {
    var data = { 
      whoseTurn: "O",
      board: ["X", null, "O",
              "O", "X", null,
              "X", null, null],
      winner: "X"
    };

    beforeEach(function() {
      game.start("X");
    });

    it("should mark the game as finished", function() {
      game.moveMade(data);
      expect(game.isCompleted()).toBeTruthy();
    });

    it("should mark X as the winner", function() {
      game.moveMade(data);
      expect(game.results()).toEqual("X");
    });

    it("should mark O as the winner", function() {
      data.winner = "O";
      game.moveMade(data);
      expect(game.results()).toEqual("O");
    });

    it("should mark the winner as a tie", function() {
      data.winner = "TIE";
      game.moveMade(data);
      expect(game.results()).toEqual("TIE");
    });
  });

  describe("when quitting a game", function() {
    beforeEach(function() {
      conn = {
        quit: function(location) {}
      };

      spyOn(conn, "quit");

      game = new Game(conn);
      game.start("X");
      game.quit();
    })

    it("should need a connection", function() {
      expect(game.needsConnection()).toBeTruthy();
    });

    it("should have an empty game board", function() {
      expect(game.board().length).toEqual(0);
    });

    it("should have no player set", function() {
      expect(game.player()).toBeNull();
    });

    it("should call quit on the connection", function() {
      expect(conn.quit).toHaveBeenCalled();
    });
  });
});