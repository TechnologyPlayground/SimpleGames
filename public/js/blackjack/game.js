function Game(conn) {
  var self = this;
  var connection = conn;
  var state = ko.observable("needs connection");
  
  self.needsConnection = ko.computed(function() {
    return state() == "needs connection";
  });
  
  self.selectingTable = ko.computed(function() {
    return state() == "selecting table";
  });
  
  self.waitingFofGame = ko.computed(function() {
    return state() == "waiting for table";
  });
  
  self.inProgress = ko.computed(function() {
    return state() == "in progress";
  });
  
  self.completed = ko.computed(function() {
    return state() == "completed";
  });
  
  self.connect = function() {
    connection.connect(self);
  };
}