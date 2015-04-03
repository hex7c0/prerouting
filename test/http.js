'use strict';
/**
 * @file http test
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

/*
 * test module
 */
describe('http', function() {

  var listenPort = 5000;

  describe('default', function() {

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
        }).listen(3000, '127.0.0.1', done);
      });
      it('should create Prerouting server', function(done) {

        prerouting.createServer({
          listenPort: listenPort
        }).on('listening', done);
      });
    });

    describe('routing', function() {

      var uri = 'http://127.0.0.1:';

      it('should return web request to Prerouting server', function(done) {

        request.get(uri + listenPort + '/').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return web request to Web server', function(done) {

        request.get(uri + 3000 + '/').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return 404 web request to Prerouting server', function(done) {

        request.get(uri + listenPort + '/err').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 404);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return 404 web request to Web server', function(done) {

        request.get(uri + 3000 + '/err').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 404);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
    });
  });

  describe('toPort', function() {

    var listenPort2 = 50000;
    var toPort = 50001;

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
        }).listen(toPort, '127.0.0.1', done);
      });
      it('should create Prerouting server', function(done) {

        prerouting.createServer({
          listenPort: listenPort2,
          toPort: toPort
        }).on('listening', done);
      });
    });

    describe('routing', function() {

      var uri = 'http://127.0.0.1:';

      it('should return web request to Prerouting server', function(done) {

        request.get(uri + listenPort2 + '/').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return web request to Web server', function(done) {

        request.get(uri + toPort + '/').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return 404 web request to Prerouting server', function(done) {

        request.get(uri + listenPort2 + '/err').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 404);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      it('should return 404 web request to Web server', function(done) {

        request.get(uri + toPort + '/err').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 404);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
    });
  });
});
