function Deck() {
  var self = this;
  var deckOfCards = [];

  self.suits = ["D", "C", "H", "S"];
  self.numbers = ["J", "Q", "K", "A"];
  self.cards = [];

  self.isValidCard = function(card) {
    return (deckOfCards.indexOf(card) != -1);
  };

  self.getShuffledCards = function(numberOfDecks) {
    numberOfDecks = (!isNaN(parseInt(numberOfDecks * 1))) ? numberOfDecks : 1;
    var cards = [];

    for (var cardIndex = 0; cardIndex < 52; cardIndex++) {
      for (var deckIndex = 0; deckIndex < numberOfDecks; deckIndex++) {
        cards.push(deckOfCards[cardIndex]);
      }
    }
    
    var i = cards.length, j, temp;
    if ( i == 0 ) return;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }

    return cards;
  }

  for (var i = 2; i < 11; i++) {
    self.numbers.push(i);
  }

  for (var suitIndex = 0; suitIndex < 4; suitIndex++) {
    for (var numberIndex = 0; numberIndex < 13; numberIndex++) {
      deckOfCards.push(self.suits[suitIndex] + self.numbers[numberIndex]);
    }
  }
}

if (exports) {
  exports.create = Deck;
}