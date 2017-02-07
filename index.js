'use strict';
/**
 * @file prerouting main
 * @module prerouting
 * @version 0.4.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var net = require('net');
var tls = require('tls');

/*
 * functions
 */
/**
 * prerouting createServer (net or tls)
 * 
 * @function createServer
 * @param {Object} [options] - various options. Check README.md
 * @return {Object}
 */
function createServer(options) {

  var my = options || Object.create(null);
  my.toPort = Number(my.toPort) || 3000;
  my.toHost = String(my.toHost || '127.0.0.1');
  my.listenPort = Number(my.listenPort) || 5000;
  my.listenHost = my.listenHost;
  my.dataToNext = typeof my.dataToNext === 'function' ? my.dataToNext : false;
  my.dataFromNext = typeof my.dataFromNext === 'function' ? my.dataFromNext
    : false;
  my.tls = Boolean(my.tls);
  my.clientUseTls = Boolean(my.clientUseTls);

  var server, connect;

  if (!my.tls) {
    server = net.createServer;
  } else {
    server = tls.createServer;
  }
  if (!my.clientUseTls) {
    connect = net.connect;
  } else {
    connect = tls.connect;
  }

  return server(my, function(clientToServer) {

    var serverToClient = connect(my.toPort, my.toHost); // connect prerouting to server
    var dataToNext, dataFromNext;
    var dataDispatcherServer = function(buffer) {

      if (serverToClient.writable === true) { // open connection
        if (serverToClient.write(buffer) === false) { // was queued in user memory
          serverToClient.pause();
        }
      }
    };
    var dataDispatcherClient = function(buffer) {

      if (clientToServer.writable === true) { // open connection
        if (clientToServer.write(buffer) === false) { // was queued in user memory
          clientToServer.pause();
        }
      }
    };

    /*
     * sent data To
     */
    if (!my.dataToNext) {
      dataToNext = dataDispatcherServer;
    } else {
      dataToNext = function(toServer) {

        my.dataToNext(toServer, dataDispatcherServer);
      };
    }

    /*
     * receive data From
     */
    if (!my.dataFromNext) {
      dataFromNext = dataDispatcherClient;
    } else {
      dataFromNext = function(toBack) {

        my.dataFromNext(toBack, dataDispatcherClient);
      };
    }

    /*
     * get data from server and send to client
     */
    // events
    serverToClient.on('data', dataFromNext).on('end', function() {

      if (clientToServer.destroyed === false) {
        clientToServer.end();
      }
    }).on('timeout', function() {

      serverToClient.emit('end');
    }).on('drain', function() {

      serverToClient.resume();
    });
    // options
    serverToClient.setTimeout(120000);
    serverToClient.setNoDelay(true);
    serverToClient.setKeepAlive(true);

    /*
     * get data from client and send to server
     */
    // events
    clientToServer.on('data', dataToNext).on('end', function() {

      if (serverToClient.destroyed === false) {
        serverToClient.end();
      }
    }).on('timeout', function() {

      clientToServer.emit('end');
    }).on('drain', function() {

      clientToServer.resume();
    });
    // options
    clientToServer.setTimeout(120000);
    clientToServer.setNoDelay(true);

  }).listen(my.listenPort, my.listenHost);
}
module.exports.createServer = createServer;
