var http        = require('http')
  , ps = require('../lib/portscanner.js')

// Sets up an HTTP server listening on port 3005
var server = http.createServer(function (request, response) {

})
server.listen(3005, 'localhost', function() {
  var portscanner = new ps();
  
  // will trigger on every open, i.e. also for scan and findAPortInUse
  portscanner.on('open', function(s) {
    console.log('event open ' + s);
  });
  
  portscanner.on('done', function() {
    console.log('event done');
  });
  
  portscanner.scan('localhost', 3000, 3010, function(error, port) {
    if (!error) {      
      console.log('open ' + port);
    }
  });
  
  portscanner.on('firstopen', function(port) {
    console.log('event firstopen '+ port);
  });
  
  portscanner.on('firstclosed', function(port) {
    console.log('event firstclosed ' + port);
  });
  
    // Finds a port that a service is listening on
  portscanner.findAPortInUse(3000, 3010, 'localhost', function(error, port) {
    // Port should be 3005 as the HTTP server is listening on that port
    console.log('Found an open port at ' + port)
  })

  // Finds a port no service is listening on
  portscanner.findAPortNotInUse(3000, 3010, 'localhost', function(error, port) {
    // Will return any number between 3000 and 3010 (inclusive), that's not 3005.
    // The order is unknown as the port status checks are asynchronous.
    console.log('Found a closed port at ' + port)
  })

})

