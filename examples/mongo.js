'use strict';
/**
 * @file routing to mongo example
 * @module prerouting
 * @package prerouting
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var prerouting = require('..');

var server = prerouting.createServer({
  toPort: 27017
}).on(
  'listening',
  function() {

    var addr = server.address();
    console.log('Prerouting server running at ' + addr.address + ':'
      + addr.port);
  });
