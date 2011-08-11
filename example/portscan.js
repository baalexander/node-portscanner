var portscanner = require('../lib/portscanner.js')

portscanner.checkPortStatus('3000', 'localhost', function(error, status) {
  console.log(status)
})

portscanner.findAnAvailablePort(3000, 3010, 'localhost', function(error, port) {
  console.log('AVAILABLE PORT AT ' + port)
})

setTimeout(function() { }, 10000)

