$(function() {
  var connection = new Connection();
  var game = new Game(connection);
  ko.applyBindings(game);
  game.connect();
});