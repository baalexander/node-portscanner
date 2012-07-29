
## The What

The portscanner module is an asynchronous JavaScript port scanner for Node.js.

Portscanner can check a port, or range of ports, for 'open' or 'closed'
statuses.

## The How

### To Install

```bash
npm install portscanner
```

### To Use

A brief example:

```javascript
var portscanner = require('portscanner')

// Checks the status of a single port
portscanner.checkPortStatus(3000, 'localhost', function(error, status) {
  // Status is 'open' if currently in use or 'closed' if available
  console.log(status)
})

// Checks the status of a all ports in a range
portscanner.checkPortStatuses(3000, 4000, 'localhost', function(error, statuses) {
  // Statuses is an array of status objects, 
  // in the format of {port: port, status: status}
  console.log(statuses)
})

// Find the first available port. Asynchronously checks, so first port
// determined as available is returned.
portscanner.findAPortNotInUse(3000, 3010, 'localhost', function(error, port) {
  console.log('AVAILABLE PORT AT: ' + port)
})

// Find the first port in use or blocked. Asynchronously checks, so first port
// to respond is returned.
portscanner.findAPortInUse(3000, 3010, 'localhost', function(error, port) {
  console.log('PORT IN USE AT: ' + port)
})
```

The example directory contains a more detailed example.

### To Test

Bleh. I am a fan of testing, but currently looking into an easier way to test
several HTTP connections. If any ideas, please message me.

## The Future

Please create issues, or better yet, pull requests, for port scanning related
features you'd like to see included.

## The License (MIT)

Released under the MIT license. See the LICENSE file for the complete wording.

