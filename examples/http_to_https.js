'use strict';
/**
 * @file routing through http to https server
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..'); // use require ('prerouting') instead
var https = require('https');
var fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // self-signed cert

var web = https.createServer({
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem')
}, function(req, res) {

  res.end('Hello World');
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web HTTPS server running at ' + addr.address + ':' + addr.port);
});

var pre = prerouting.createServer({
  clientUseTls: true,
}).on(
  'listening',
  function() {

    var addr = pre.address();
    console.log('Prerouting HTTP server running at ' + addr.address + ':'
      + addr.port);
  });
