'use strict';
/**
 * @file routing through chaining servers to http server
 * @module prerouting
 * @package prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..');
var http = require('http');

var web = http.createServer(function(req, res) {

  res.end('Hello World');
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web server running at ' + addr.address + ':' + addr.port);
});

var pre1 = prerouting.createServer({
  toPort: 3000,
  listenPort: 5000
}).on(
  'listening',
  function() {

    var addr = pre1.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port);
  });

var pre2 = prerouting.createServer({
  toPort: 5000,
  listenPort: 5001
}).on(
  'listening',
  function() {

    var addr = pre2.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port);
  });
