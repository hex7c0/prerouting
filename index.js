'use strict';
/**
 * @file prerouting main
 * @module prerouting
 * @package prerouting
 * @subpackage main
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var net = require('net');

/*
 * functions
 */
/**
 * prerouting createServer
 * 
 * @function createServer
 * @param {Object} [options] - various options. Check README.md
 * @return {Object}
 */
function createServer(options) {

  var opt = options || Object.create(null);
  var my = {
    toPort: Number(opt.toPort) || 3000,
    toHost: String(opt.toHost || '127.0.0.1'),
    listenPort: Number(opt.listenPort) || 5000,
    listenHost: opt.listenHost
  };

  var server = net.createServer(function(clientToServer) {

    // connect prerouting to server
    var serverToClient = net.connect(my.toPort, my.toHost, function() {

      /**
       * get data from server and send to client
       */
      serverToClient.on('data', function(toBack) {

        return clientToServer.write(toBack);
      });
    });

    /**
     * get data from client and send to server
     */
    clientToServer.on('data', function(toServer) {

      return serverToClient.write(toServer);
    });

  }).listen(my.listenPort, my.listenHost);

  return server;
}
module.exports.createServer = createServer;
