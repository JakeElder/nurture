/**
 * getServer
 * ========
 * Returns a server instance running on the lowest available port above 3000.
 *
 * Useful for test purposes, where one server may not be fully disconnected
 * when another instance is needed.
 */

//==============================================================================
// Dependencies
//==============================================================================

var app = require('../../app');
var Q   = require('q');


//==============================================================================
// Export
//==============================================================================

module.exports = function getServer(port, deferred) {
  'use strict';
  if (!port) { port = 3000; }
  if (!deferred) { deferred = Q.defer(); }
  var server = app.listen(port);
  server.on('listening', function() {
    deferred.resolve({
      instance: server,
      url: 'http://localhost:' + port
    });
  });
  server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      getServer(++port, deferred);
      return;
    }
    deferred.reject(err);
  });
  return deferred.promise;
};

