var fullApp = require("./app");
var http = require("http");
var appServer = http.Server(fullApp);
var io = require("./io")(appServer);

appServer.listen(80).on("error", function(err) {
  throw err; // What do?!
}).on("listening", function() {
  console.log("Listening on " + appServer.address().port);
});