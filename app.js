var express = require('express');
var favicon = require('serve-favicon');

var app = express(); // Main stub
var list = express(); // Server list stub
var manager = express(); // Manager stub

app.use(favicon(__dirname + '/web/main/favicon.ico'));

list.get('/', function(req, res) {
  res.sendFile(__dirname + '/web/list/list.html');
});
list.use('/', function(req, res, next) {
  res.sendFile(__dirname + '/web/list' + req.url);
});

app.use('/list', list);
app.use('/manager', manager);
app.get('/', function(req, res) {
  res.redirect('/list');
});
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);
});

module.exports = app;
