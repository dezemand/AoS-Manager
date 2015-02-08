var fs = require("fs");
var httplib = require("http");

var obj = {
  getServerIdentifier: function(serv, callback) {
    httplib.get("http://services.buildandshoot.com/getip", function (res) {
      var body = '';
      res.on('data', function(d) {body += d;});
      res.on('end', function() {
        var a = parseInt(body.split(".")[0]);
        var b = parseInt(body.split(".")[1]) * Math.pow(2, 8);
        var c = parseInt(body.split(".")[2]) * Math.pow(2, 16);
        var d = parseInt(body.split(".")[3]) * Math.pow(2, 24);
        var identifier = a + b + c + d;
        callback(serv, identifier);
      });
    });
  },

  getServerConfig: function(serv, callback) {
    fs.readFile("./servers/"+serv+"/feature_server/config.txt", "utf8", function(err, config) {
      config = JSON.parse(config);
      callback(serv, config);
    });
  },

  getAdvancedServerStatus: function(serv, port, callback) {
    httplib.get({host:'localhost',port:port,path:'/'}, function (res) {
      var body = '';
      res.on('data', function(d) {body += d;});
      res.on('end', function() {
        var map = body.split("The server is currently running ")[body.split("The server is currently running ").length-1].split(".</p>")[0].split(" by ");
        var players = body.split("Current players: ")[body.split("Current players: ").length-1].split("/")[0];
        callback(serv, map, players);
      });
    });
  },

  getServerIDs: function(callback) {
    var servers = [];
    fs.readdir("./servers/", function(err, files) {
      for(i=0; i<files.length;i++) {
        if(fs.statSync("./servers/"+files[i]).isDirectory())
          servers.push(files[i]);
      }
      callback(servers);
    });
  }
};

module.exports = obj;