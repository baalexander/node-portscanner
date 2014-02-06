var http        = require('http')
  , portscanner = require('../lib/portscanner.js')

// Sets up an HTTP server listening on port 3005
var server = http.createServer(function (request, response) {
})

server.listen(3005, '127.0.0.1', function() {
  // Checks the status of an individual port.
  portscanner.checkPortStatus(3005, '127.0.0.1', function(error, status) {
    // Status should be 'open' since the HTTP server is listening on that port
    console.log('Status at port 3005 is ' + status)
    if (error) console.error(error);
  })
  portscanner.checkPortStatus(3000, '127.0.0.1', function(error, status) {
    // Status should be 'closed' since no service is listening on that port.
    console.log('Status at port 3000 is ' + status)
    if (error) console.error(error);
  })

  // Finds a port that a service is listening on
  portscanner.findAPortInUse(3000, 3010, '127.0.0.1', function(error, port) {
    // Port should be 3005 as the HTTP server is listening on that port
    console.log('Found an open port at ' + port)
    if (error) console.error(error);
  })
  // Finds a port no service is listening on
  portscanner.findAPortNotInUse(3000, 3010, '127.0.0.1', function(error, port) {
    // Will return any number between 3000 and 3010 (inclusive), that's not 3005.
    // The order is unknown as the port status checks are asynchronous.
    console.log('Found a closed port at ' + port)
    if (error) console.error(error);
  })
})

