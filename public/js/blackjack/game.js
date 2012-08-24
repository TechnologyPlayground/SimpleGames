function Game(conn, getNewTableData) {
  var self = this;
  var connection = conn;
  var state = ko.observable("selecting table");
  self.tableList = ko.observableArray();
  
  self.selectingTable = ko.computed(function() {
    return state() == "selecting table";
  });
  
  self.waitingForTable = ko.computed(function() {
    return state() == "waiting for table";
  });
  
  self.inProgress = ko.computed(function() {
    return state() == "in progress";
  });
  
  self.completed = ko.computed(function() {
    return state() == "completed";
  });
  
  self.setTableList = function(tables) {
    self.tableList(tables);
  };
  
  self.connect = function() {
    connection.connect(self);
  };
  
  self.joinTable = function(game) {
    alert(game.id);
  };
  
  self.createTable = function() {
    getNewTableData(function(data) {
      connection.createTable(data);
    });
  };
}