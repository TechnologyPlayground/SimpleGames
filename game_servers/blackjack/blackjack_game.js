function BlackjackGame(config) {
  var self = this;
  self.id = config.id;
  self.maxPlayers = config.maxPlayers;
  self.decks = config.decks;
  self.name = config.name;
  self.players = [];

  self.addPlayer = function(player) {
    self.players.push(player);
  }
}