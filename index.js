var app = require('express')();
var httplib = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var io = {on: function() {}};
var fs = require("fs");
var servers = ["serv1"];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/list.html');
});
app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/web/favicon.ico');
});
app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/web/style.css');
});

http.listen(80, function(){
  console.log('listening on *:80');
});

io.on('connection', function (socket) {
  socket.on('getlist', function () {
    var ids = {};
    var done = 0;
    for(i=0; i<servers.length; i++) {
      ids[servers[i]] = {identifier: "", server: "", gamemode: "", map: "", maxplayers: 0, players: 0, name: "", port: 0};
      getID(servers[i], function (serv, id) {
        ids[serv].identifier = id;
        ids[serv].server = serv;
        getConfig(serv, function (serv, conf) {
          ids[serv].gamemode = conf.game_mode;
          ids[serv].maxplayers = conf.max_players;
          ids[serv].name = conf.name;
          ids[serv].port = conf.port;
          getStatus(serv, conf.status_server.port, function(serv, map, players) {
            ids[serv].map = map;
            ids[serv].players = players;
            done++;
            if(done == servers.length) {
              socket.emit('list', ids);
            }
          });
        });
      });
    }
  });
});

function getID(serv, callback) {
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
}

function getConfig(serv, callback) {
  fs.readFile("./servers/"+serv+"/feature_server/config.txt", "utf8", function(err, config) {
    config = JSON.parse(config);
    callback(serv, config);
  });
}

function getStatus(serv, port, callback) {
  httplib.get({host:'localhost',port:port,path:'/'}, function (res) {
    var body = '';
    res.on('data', function(d) {body += d;});
    res.on('end', function() {
      var map = body.split("The server is currently running ")[body.split("The server is currently running ").length-1].split(".</p>")[0].split(" by ");
      var players = body.split("Current players: ")[body.split("Current players: ").length-1].split("/")[0];
      callback(serv, map, players);
    });
  });
}