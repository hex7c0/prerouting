'use strict';
/**
 * @file routing through https to http server
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..'); // use require ('prerouting') instead
var http = require('http');
var fs = require('fs');

var web = http.createServer(function(req, res) {

  res.end('Hello World');
}).listen(3000, '127.0.0.1', function() {

  var addr = web.address();
  console.log('Web HTTP server running at ' + addr.address + ':' + addr.port);
});

var pre = prerouting.createServer({
  tls: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
}).on(
  'listening',
  function() {

    var addr = pre.address();
    console.log('Prerouting HTTPS server running at ' + addr.address + ':'
      + addr.port);
  });
