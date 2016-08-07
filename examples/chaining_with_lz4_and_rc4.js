'use strict';
/**
 * @file routing through chaining servers with lz4 compression and rc4 encryption to http server
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
// |  5001 -> 5002  |
// +----------------+
//         +
//         |
//     compression
//         |
//         +
// +----------------+
// |  5002 -> 5003  |
// +----------------+
//         +
//         |
//       encode
//         |
//         +
// +----------------+
// |  5003 -> 5000  |
// +----------------+
//         +
//         |
//       decode
//         |
//         +
// +----------------+
// |  5000 -> 3000  |
// +----------------+
//         +
//         |
//    decompression
//         |
//         +
// +----------------+
// |      3000      |
// +----------------+
//

var prerouting = require('..'); // use require ('prerouting') instead
var http = require('http');
var lz4 = require('lz4');
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

var compress = function(input, next) {

  return next(lz4.encode(input));
};

var uncompress = function(input, next) {

  return next(lz4.decode(input));
};

var pre2 = prerouting.createServer({
  toPort: 5002,
  listenPort: 5001,
  dataToNext: compress,
  dataFromNext: uncompress
}).on('listening', function() {

  var addr = pre2.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port + '.');
});

var pre3 = prerouting.createServer({
  toPort: 5003,
  listenPort: 5002,
  dataToNext: encode,
  dataFromNext: decode
}).on('listening', function() {

  var addr = pre3.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port + '. Don\'t connect directly!!');
});

var pre4 = prerouting.createServer({
  toPort: 5000,
  listenPort: 5003,
  dataToNext: decode,
  dataFromNext: encode
}).on('listening', function() {

  var addr = pre4.address();
  console.log('Prerouting server running at ' + addr.address + ':' + addr.port + '. Don\'t connect directly!!');
});

var pre1 = prerouting.createServer({
  toPort: 3000,
  listenPort: 5000,
  dataToNext: uncompress,
  dataFromNext: compress
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
