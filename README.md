# node-portscanner

The portscanner module is
an asynchronous JavaScript port scanner for Node.js.

Portscanner can check a port, range of ports, or array of ports for 'open' or 'closed' statuses.

[Looking for maintainer](https://github.com/baalexander/node-portscanner/issues/25)!

## Install

```bash
npm install portscanner
```

## Usage

A brief example:

```javascript
var portscanner = require('portscanner')

// Checks the status of a single port
portscanner.checkPortStatus(3000, '127.0.0.1', function(error, status) {
  // Status is 'open' if currently in use or 'closed' if available
  console.log(status)
})

// Find the first available port. Asynchronously checks, so first port
// determined as available is returned.
portscanner.findAPortNotInUse(3000, 3010, '127.0.0.1', function(error, port) {
  console.log('AVAILABLE PORT AT: ' + port)
})

// Find the first port in use or blocked. Asynchronously checks, so first port
// to respond is returned.
portscanner.findAPortInUse(3000, 3010, '127.0.0.1', function(error, port) {
  console.log('PORT IN USE AT: ' + port)
})

// You can also pass array of ports to check
portscanner.findAPortInUse([3000, 3005, 3006], '127.0.0.1', function(error, port) {
  console.log('PORT IN USE AT: ' + port)
})
```

The example directory contains a more detailed example.

## Test

```$ npm test```

## Future

Please create issues or pull requests
for port scanning related features
you'd like to see included.

## License (MIT)

[MIT](LICENSE)

