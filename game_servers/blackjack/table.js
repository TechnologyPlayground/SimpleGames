function Table(config) {
  var self = this;
  self.id = config.id;
  self.maxPlayers = config.maxPlayers;
  self.decks = config.decks;
  self.name = config.name;
  self.players = [];

  self.addPlayer = function(player, name) {
    if (self.players.length == self.maxPlayers) {
      return false;
    }

    self.players.push({connection: player,
                       name: name});
    return true;
  }
}