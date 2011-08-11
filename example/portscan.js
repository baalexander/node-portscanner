var portscanner = require('../lib/portscanner.js')

portscanner.checkPortStatus('3000', 'localhost', function(error, status) {
  console.log(status)
})

portscanner.findAnOpenPort(3000, 3010, 'localhost', function(error, port) {
  console.log('OPEN PORT AT ' + port)
})

portscanner.findAClosedPort(3000, 3010, 'localhost', function(error, port) {
  console.log('CLOSED PORT AT ' + port)
})

setTimeout(function() { }, 10000)

