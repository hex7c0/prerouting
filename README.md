# [prerouting](http://supergiovane.tk/#/prerouting)

[![NPM version](https://badge.fury.io/js/prerouting.svg)](http://badge.fury.io/js/prerouting)
[![Build Status](https://travis-ci.org/hex7c0/prerouting.svg)](https://travis-ci.org/hex7c0/prerouting)
[![Dependency Status](https://david-dm.org/hex7c0/prerouting/status.svg)](https://david-dm.org/hex7c0/prerouting)

Preroute incoming traffic to N TCP servers; for compress data, encrypt message, etc (or just a loop :D)

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
 - `dataToNext` - **Function** function to next route (for chaining) *(default "disabled")*
 - `dataFromNext` - **Function** function from next route (for chaining) *(default "false")*
 - `tls` - **Object** TLS [options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) *(default "false")*
 - `clientUseTls` - **Boolean** connect to TLS client (true) *(default "false")*

## Examples

Take a look at my [examples](https://github.com/hex7c0/prerouting/tree/master/examples)

### [License GPLv3](http://opensource.org/licenses/GPL-3.0)
