var http        = require('http')
  , portscanner = require('../lib/portscanner.js')

// Check if one of the ports in the list is available
portscanner.findAPortNotInUseInList([4443, 4444, 4447], '127.0.0.1', function(error, port) {
	if (!error) {
		console.log('Available port: ' + port);
	} else {
		console.log('There was an error');
	}
});