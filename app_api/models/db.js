var mongoose = require( 'mongoose' );
var gracefulShutdown;
//var dbURI = 'mongodb://localhost/blogs';
//var dbURI = 'DB_URL=mongodb://blogs:blogs@localhost/blogs'
var dbURI = 'mongodb://blogs:blogs@localhost/blogs'
//var dbURI = `mongodb://blogs:blogs@0.0.0.0:27017/blogs`
//var dbURI = `mongodb://blogs:blogs@127.0.0.1:27017/blogs`
//var dbURI = 'mongodb://blogs:blogs@127.0.0.1/blogs'
mongoose.connect(dbURI);


// Monitor and report when database is connected                      
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting to database
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
}); 
// Closes (disconnects) from Mongoose DB upon shutdown    
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
}); });

// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
}); });

// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
}); });

// BRING IN YOUR SCHEMAS & MODELS
require('./blogs');
require('./users'); // Lab6
require('./comments'); //Lab8