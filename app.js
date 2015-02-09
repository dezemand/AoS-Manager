var express = require('express');

var app = express(); // Main stub
var list = express(); // Server list stub
var manager = express(); // Manager stub

list.use('/', function(req, res, next) {
  res.sendFile(__dirname + '/web/list.html');
});
list.use(['/favicon.ico', '/style.css', '/list.js'], function(req, res, next) {
  res.sendFile(__dirname + '/web' + req.url);
});

app.use('/list', list);
app.use('/manager', manager);
app.get('/', function(req, res) {
  res.redirect('/list');
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
