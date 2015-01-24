'use strict';
/**
 * @file mongo test
 * @module prerouting
 * @package prerouting
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var prerouting = require('..');
var assert = require('assert');
var client = require('mongodb').MongoClient;

/*
 * test module
 */
describe('mongo', function() {

  var listenPort = 5000;

  describe('create', function() {

    it('should create Prerouting server', function(done) {

      prerouting.createServer({
        toPort: 27017,
        listenPort: listenPort
      }).on('listening', done);
    });
  });

  describe('routing', function() {

    it('should return mongo request to Prerouting server', function(done) {

      client.connect('mongodb://127.0.0.1:5000', function(err, db) {

        assert.equal(err, null);
        assert.notEqual(db.databaseName, null);
        assert.notEqual(db.databaseName, undefined);
        done();
      });
    });
  });
});

client.connect
