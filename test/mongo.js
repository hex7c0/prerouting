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
var snappy = require('snappy');
var collectionName = 'prerouting_tests';

/*
 * test module
 */
describe('mongo', function() {

  var listenPort = 6000;

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

      client.connect('mongodb://127.0.0.1:' + listenPort, function(err, db) {

        assert.equal(err, null);
        assert.notEqual(db.databaseName, null);
        assert.notEqual(db.databaseName, undefined);

        db.createCollection(collectionName, {
          capped: true,
          size: 10000,
          max: 1000,
          w: 1
        }, function(err, collection) {

          assert.equal(null, err);
          assert.equal(collectionName, collection.collectionName);
          done();
        });
      });
    });
  });
});

describe('mongo with compress chain', function() {

  var listenPort = 6011;
  var ports = [ 27017, 6010, listenPort ];
  var compress = function(input, next) {

    snappy.compress(input, function(err, compressed) {

      if (err) throw err;
      return next(compressed);
    })
  }
  var uncompress = function(input, next) {

    snappy.uncompress(input, {
      asBuffer: true
    }, function(err, uncompress) {

      if (err) throw err;
      return next(uncompress);
    })
  }

  describe('create', function() {

    it('should create 1° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[0],
        listenPort: ports[1],
        dataToNext: uncompress,
        dataFromNext: compress
      }).on('listening', done);
    });
    it('should create 2° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[1],
        listenPort: ports[2],
        dataToNext: compress,
        dataFromNext: uncompress
      }).on('listening', done);
    });
  });

  describe('routing', function() {

    it('should return mongo request to Prerouting server', function(done) {

      client.connect('mongodb://127.0.0.1:' + listenPort, function(err, db) {

        assert.equal(err, null);
        assert.notEqual(db.databaseName, null);
        assert.notEqual(db.databaseName, undefined);

        db.listCollections({
          name: collectionName
        }).toArray(function(err, collections) {

          assert.equal(err, null);
          assert.equal(collections.length, 1);
          assert.equal(collections[0].options.capped, true);
          assert.equal(collections[0].options.max, 1000);
          assert.ok(new RegExp(collectionName).test(collections[0].name));
          done();
        });
      });
    });
  });
});
