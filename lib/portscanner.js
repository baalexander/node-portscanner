var net    = require('net')
  , Socket = net.Socket

var portscanner = exports


portscanner.findAnOpenPort = function(startPort, endPort, host, callback) {
  findAPortWithStatus('open', startPort, endPort, host, callback)
}

portscanner.findAClosedPort = function(startPort, endPort, host, callback) {
  findAPortWithStatus('closed', startPort, endPort, host, callback)

}

portscanner.checkPortStatus = function(port, host, callback) {
  var socket = new Socket()

  // Socket connection established, port is open
  socket.on('connect', function() {
    console.log('ON CONNECT')
    socket.end()
    callback(null, 'open')
  })

  // If no response, assume port is not listening
  socket.setTimeout(400)
  socket.on('timeout', function() {
    console.log('ON TIMEOUT')
    socket.end()
    callback(null, 'closed')
  })

  // Assuming the port is not open if an error. May need to refine based on
  // exception
  socket.on('error', function(exception) {
    console.log('ON ERROR')
    //console.log(exception)
    socket.end()
    callback(null, 'closed')
  })

  host = host || 'localhost'
  socket.connect(port, host)
}

function findAPortWithStatus(status, startPort, endPort, host, callback) {
  endPort = endPort || 65535
  var foundPort = false
  var numberOfPortsChecked = 0

  var check = function(port) {
    portscanner.checkPortStatus(port, host, function(error, statusOfPort) {
      numberOfPortsChecked++
      // Only callback once
      if (foundPort === false) {
        if (error) {
          foundPort = true
          callback(error)
        }
        else {
          if (statusOfPort === status) {
            foundPort = true
            callback(null, port)
          }
          // All port checks have returned unavailable
          else if (numberOfPortsChecked === (endPort - startPort + 1)) {
            callback(null, false)
          }
        }
      }
    })
  }

  for (var port = startPort; port <= endPort; port++) {
    check(port)
  }
}

