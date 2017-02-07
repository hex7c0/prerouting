# [prerouting](https://github.com/hex7c0/prerouting)

[![NPM version](https://img.shields.io/npm/v/prerouting.svg)](https://www.npmjs.com/package/prerouting)
[![Linux Status](https://img.shields.io/travis/hex7c0/prerouting.svg?label=linux)](https://travis-ci.org/hex7c0/prerouting)
[![Dependency Status](https://img.shields.io/david/hex7c0/prerouting.svg)](https://david-dm.org/hex7c0/prerouting)
[![Coveralls](https://img.shields.io/coveralls/hex7c0/prerouting.svg)](https://coveralls.io/r/hex7c0/prerouting)

Preroute incoming traffic to N TCP servers; for compress data, encrypt message, etc (or just a loop :D)

```
      request
         |
         +
 +----------------+
 |  5001 -> 5000  |
 +----------------+
         +
         |
     compression
         |
         +
 +----------------+
 |  5000 -> 3000  |
 +----------------+
         +
         |
    decompression
         |
         +
 +----------------+
 |      3000      |
 +----------------+
```

## Installation

Install through NPM

```bash
npm install prerouting
```
or
```bash
git clone git://github.com/hex7c0/prerouting.git
```

## API

inside nodejs project
```js
var prerouting = require('prerouting');

var server = prerouting.createServer();
```

### createServer(options)

#### options

 - `toPort` - **Number** connect to this port *(default "3000")*
 - `toHost`- **String** connect to this host *(default "127.0.0.1")*
 - `listenPort` - **Number** open a TCP server on this port *(default "5000")*
 - `listenHost` - **String** open a TCP server on this host *(default "127.0.0.1")*
 - `dataToNext` - **Function** function to next route *(default "false")*
 - `dataFromNext` - **Function** function from next route *(default "false")*
 - `tls` - **Object** Enable TLS server *(default "false")*
 - `clientUseTls` - **Boolean** connect to TLS client *(default "false")*

NET [options](https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener)

TLS [options](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)

## Examples

Take a look at my [examples](examples)

### [License GPLv3](LICENSE)
