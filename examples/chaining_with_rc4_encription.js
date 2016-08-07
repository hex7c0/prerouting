'use strict';
/**
 * @file routing through chaining servers with rc4 encription to http server
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 * 
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
//       encode
//         |
//         +
// +----------------+
// |  5000 -> 3000  |
// +----------------+
//         +
//         |
//      decode
//         |
//         +
// +----------------+
// |      3000      |
// +----------------+
//

var prerouting = require('..'); // use require ('prerouting') instead
var http = require('http');
var rc4 = require('arc4');
var cipher = rc4('arc4', 'secret_key');
var fs = require('fs');
var loremIpsum = fs.readFileSync('keys/key.pem') + fs.readFileSync('keys/cert.pem');
loremIpsum += loremIpsum + loremIpsum + loremIpsum;

var encode = function(input, next) {

  return next(cipher.encodeBuffer(input));
};

var decode = function(input, next) {

  return next(cipher.decodeBuffer(input));
};

var pre2 = prerouting.createServer({
  toPort: 5000,
  listenPort: 5001,
  dataToNext: encode,
  dataFromNext: decode
}).on('listening', function() {

  var addr = pre2.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port + '.');
});

var pre1 = prerouting.createServer({
  toPort: 3000,
  listenPort: 5000,
  dataToNext: decode,
  dataFromNext: encode
}).on('listening', function() {

  var addr = pre1.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port + '. Don\'t connect directly!!');
});

var web = http.createServer(function(req, res) {

  res.end(loremIpsum);
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web server running at ' + addr.address + ':' + addr.port);
});
