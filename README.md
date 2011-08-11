
## The What

The portscanner module is a pure JavaScript port scanner for node.js.

Portscanner can check a port, or range of ports, for 'open' or 'closed'
statuses.

## The How

### To Install

NPM package coming soon. Needs more testing and features first. For now, require
the lib/portscanner.js file.

### To Use

A brief example:

```javascript
var portscanner = require('portscanner')

// Checks the status of a single port
portscanner.checkPortStatus(3000, 'localhost', function(error, status) {
  // Status is 'open' if currently in use or 'closed' if available
  console.log(status)
})

// Find the first port in use or blocked. Asynchronously checks, so first port
// to respond is returned.
portscanner.findAnOpenPort(3000, 3010, 'localhost', function(error, port) {
  console.log('OPEN PORT AT ' + port)
})

// Find the first available port. Asynchronously checks, so first port
// determined as available is returned.
portscanner.findAClosedPort(3000, 3010, 'localhost', function(error, port) {
  console.log('CLOSED PORT AT ' + port)
})
```

Also check the example directory for more examples.

### To Test

Bleh. I am a fan of testing, but currently looking into an easier way to test
HTTP connections. If any ideas, please message me.

## The License (MIT)

Released under the MIT license. See the LICENSE file for the complete wording.

