'use strict';
/**
 * @file routing to mongo example
 * @module prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..'); // use require ('prerouting') instead

var server = prerouting.createServer({
  toPort: 27017, // mongo port
}).on(
  'listening',
  function() {

    var addr = server.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port);
  });
