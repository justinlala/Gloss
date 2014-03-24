'use strict';

/**
 * First we set the node enviornment variable if not set before
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
// app.listen(config.port);
var io = require('socket.io').listen(app.listen(config.port));

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Express app started on port ' + config.port);

// Socket.io
var http = require('http');
var server = http.createServer(app);
var routes = require('./app/controllers/votes');

io.sockets.on('connection', routes.create, function (socket) {
  var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
  console.log('Client connected from: ' + ip);
}); 