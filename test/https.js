'use strict';
/**
 * @file https test
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
var https = require('https');
var request = require('superagent');
var fs = require('fs');
var path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // self-signed cert

/*
 * test module
 */
describe('https', function() {

  var listenPort = 4000;

  describe('toPort', function() {

    var listenPort = 40000;
    var toPort = 40001;

    describe('create', function() {

      it('should create Web server', function(done) {

        https.createServer({
          key: fs.readFileSync(__dirname + '/../examples/keys/key.pem'),
          cert: fs.readFileSync(__dirname + '/../examples/keys/cert.pem')
        }, function(req, res) {

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
          listenPort: listenPort,
          toPort: toPort,
          sessionTimeout: 120, // tls specs
        }).on('listening', done);
      });
    });

    describe('routing', function() {

      var uri = 'https://127.0.0.1:';

      // it('should return web request to Prerouting server', function(done) {
      //
      // request.get(uri + listenPort + '/').end(function(err, res) {
      //
      // assert.equals(err,null);
      // assert.equal(res.statusCode, 200);
      // assert.equal(res.text, 'Hello World\n');
      // assert.equal(res.header['x-field'], 'ciao');
      // done();
      // });
      // });
      it('should return web request to Web server', function(done) {

        request.get(uri + toPort + '/').end(function(err, res) {

          assert.equal(err, null);
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
      // it('should return 404 web request to Prerouting server', function(done) {
      //
      // request.get(uri + listenPort + '/err').end(function(err, res) {
      //
      // assert.equals(err,null);
      // assert.equal(res.statusCode, 404);
      // assert.equal(res.text, 'Hello World\n');
      // assert.equal(res.header['x-field'], 'ciao');
      // done();
      // });
      // });
      it('should return 404 web request to Web server', function(done) {

        request.get(uri + toPort + '/err').end(function(err, res) {

          assert.notEqual(err, null);
          assert.equal(err.response.statusCode, 404);
          assert.equal(err.response.text, 'Hello World\n');
          assert.equal(err.response.header['x-field'], 'ciao');
          assert.equal(res.statusCode, 404);
          assert.equal(res.text, 'Hello World\n');
          assert.equal(res.header['x-field'], 'ciao');
          done();
        });
      });
    });
  });
});
