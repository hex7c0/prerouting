'use strict';
/**
 * @file chaining http test
 * @module prerouting
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var prerouting = require('..');
var assert = require('assert');
var http = require('http');
var request = require('superagent');
var snappy = require('snappy');

/*
 * test module
 */
describe('normal chaining http request', function() {

  var ports = [ 3001, 5001, 5002, 5003, 5004 ];

  describe('create', function() {

    it('should create Web server', function(done) {

      http.createServer(function(req, res) {

        res.setHeader('X-Field', 'ciao');
        if (req.url == '/') {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });
        } else {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
        }
        res.end('Hello World\n');
      }).listen(ports[0], done);
    });
    it('should create 1° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[0],
        listenPort: ports[1]
      }).on('listening', done);
    });
    it('should create 2° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[1],
        listenPort: ports[2]
      }).on('listening', done);
    });
    it('should create 3° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[2],
        listenPort: ports[3]
      }).on('listening', done);
    });
    it('should create 4° Prerouting server', function(done) {

      prerouting.createServer({
        toPort: ports[3],
        listenPort: ports[4]
      }).on('listening', done);
    });
  });

  describe('routing', function() {

    var uri = 'http://127.0.0.1:';

    it('should return web request to 1° Prerouting server', function(done) {

      request.get(uri + ports[1] + '/').end(function(err, res) {

        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.text, 'Hello World\n');
        assert.equal(res.header['x-field'], 'ciao');
        done();
      });
    });
    it('should return web request to 2° Prerouting server', function(done) {

      request.get(uri + ports[2] + '/').end(function(err, res) {

        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.text, 'Hello World\n');
        assert.equal(res.header['x-field'], 'ciao');
        done();
      });
    });
    it('should return web request to 3° Prerouting server', function(done) {

      request.get(uri + ports[3] + '/').end(function(err, res) {

        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.text, 'Hello World\n');
        assert.equal(res.header['x-field'], 'ciao');
        done();
      });
    });
    it('should return web request to 4° Prerouting server', function(done) {

      request.get(uri + ports[4] + '/').end(function(err, res) {

        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.text, 'Hello World\n');
        assert.equal(res.header['x-field'], 'ciao');
        done();
      });
    });
  });
});

describe('compressed chaining http request', function() {

  var ports = [ 3011, 5011, 5012 ];
  var compress = function(input, next) {

    snappy.compress(input, function(err, compressed) {

      assert.ifError(err);
      return next(compressed);
    });
  };
  var uncompress = function(input, next) {

    snappy.uncompress(input, {
      asBuffer: true
    }, function(err, uncompress) {

      assert.ifError(err);
      return next(uncompress);
    });
  };

  describe('create', function() {

    it('should create Web server', function(done) {

      http.createServer(function(req, res) {

        res.setHeader('X-Field', 'ciao');
        if (req.url == '/') {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });
        } else {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
        }
        res.end('Hello World\n');
      }).listen(ports[0], done);
    });
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

    var uri = 'http://127.0.0.1:';

    it('should return web request to 2° Prerouting server', function(done) {

      request.get(uri + ports[2] + '/').end(function(err, res) {

        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.text, 'Hello World\n');
        assert.equal(res.header['x-field'], 'ciao');
        done();
      });
    });
  });
});
