$(function() {
  
  var newTableDialog;
  var connection = new Connection();
  var game = new Game(connection, function(callback) {
    if(!newTableDialog) {
      newTableDialog = $("#newTablePopup").dialog({
        modal: true,
        buttons: {
          "Ok": function() {
            var datums = {
              name: $("#tableName").val(),
              maxPlayers: $("#maxPlayers").val(),
              decks: $("#decks").val(),
              playerName: $("#playerName").val()
            };
            
            callback(datums);
            $(this).dialog("close");
          }
        }
      });
    }
    newTableDialog.dialog("open");
  });
  ko.applyBindings(game);
  game.connect();
});