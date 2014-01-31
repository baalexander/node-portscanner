var http        = require('http')
  , Portscanner = require('../lib/portscanner');

// Sets up an HTTP server listening on port 3005
var server = http.createServer(function (request, response) {

});

server.listen(3005, 'localhost', function() {
  var ps = new Portscanner();

  // will trigger on every open, i.e. also for scan and findAPortInUse
  ps.on('open', function(s) {
    console.log('event open ' + s);
  });

  ps.on('scancomplete', function(ports) {
    console.log('event done', ports);
  });

  ps.on('error', function(data) {
    console.log('error ' + data);
  });

  ps.scan('192.168.2.35', 1, 1000, function(error, port) {
    if (!error) {
      console.log('open ' + port);
    }
  });
});

