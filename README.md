
## The What

Fork of https://github.com/baalexander/node-portscanner with actual port scan (like very(!) simple nmap) and event emitter.

The portscanner module is an asynchronous JavaScript port scanner for Node.js.

You may consume events as they are emitted or just use the callbacks.

## The How

### To Use

A brief example:

```javascript
// event emitting example
var Portscanner = require('./portscanner');
var ps = new Portscanner();

ps.on('scancomplete', function (ports) {
  console.log(ports);
});
ps.scan('192.168.2.35', 20, 100);

// callback example
var Portscanner = require('./portscanner');
var ps = new Portscanner();

ps.scan('192.168.2.35', 1, 1000, function (openPorts) {
  console.log(openPorts);
});
```
The example directory contains more detailed examples.

#### Events
method: checkPortStatus
events:
* error
* open
* closed
* portChecked

method: scan
events:
* All events from checkPortStatus
* scancomplete

method: findAPortWithStatus
events:
* All events from scan
* firstopen
* firstclosed

### To Test

Bleh. I am a fan of testing, but currently looking into an easier way to test
several HTTP connections. If any ideas, please message me.

## The Future

Please create issues, or better yet, pull requests, for port scanning related
features you'd like to see included.

## The License (MIT)

Released under the MIT license. See the LICENSE file for the complete wording.

