'use strict';
/**
 * @file routing through chaining servers to N http server
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

//
//      request
//         |
//         +
// +----------------+
// |  5001 -> 5000  |
// +----------------+
//         +
//         |
//      request
//         |
//         +
// +----------------+
// |  5000 -> 3000  |
// +----------------+
//         +
//         |
//      request
//         |
//         +
// +----------------+
// |      3000      |
// +----------------+
//

var prerouting = require('..'); // use require ('prerouting') instead
var http = require('http');
var fs = require('fs');
var loremIpsum = fs.readFileSync('keys/key.pem') + fs.readFileSync('keys/cert.pem');
loremIpsum += loremIpsum + loremIpsum + loremIpsum;

var pre2 = prerouting.createServer({
  toPort: 5000,
  listenPort: 5001
}).on('listening', function() {

  var addr = pre2.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port);
});

var pre1 = prerouting.createServer({
  toPort: 3000,
  listenPort: 5000
}).on('listening', function() {

  var addr = pre1.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port);
});

var web = http.createServer(function(req, res) {

  res.end(loremIpsum);
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web server running at ' + addr.address + ':' + addr.port);
});
