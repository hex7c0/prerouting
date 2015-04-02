'use strict';
/**
 * @file routing through chaining servers with compression to http server
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..'); // use require ('prerouting') instead
var http = require('http');
var snappy = require('snappy');

var compress = function(input, next) {

  snappy.compress(input, function(err, compressed) {

    if (err) throw err;
    return next(compressed);
  });
};
var uncompress = function(input, next) {

  snappy.uncompress(input, {
    asBuffer: true
  }, function(err, uncompress) {

    if (err) throw err;
    return next(uncompress);
  });
};

var web = http.createServer(function(req, res) {

  res.end('Hello World');
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web server running at ' + addr.address + ':' + addr.port);
});

var pre1 = prerouting.createServer({
  toPort: 3000,
  listenPort: 5000,
  dataToNext: uncompress,
  dataFromNext: compress
}).on(
  'listening',
  function() {

    var addr = pre1.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port + '. Don\'t connect directly!!');

  });

var pre2 = prerouting.createServer({
  toPort: 5000,
  listenPort: 5001,
  dataToNext: compress,
  dataFromNext: uncompress
}).on(
  'listening',
  function() {

    var addr = pre2.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port + '.');
  });
