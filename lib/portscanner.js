var net    = require('net')
  , Socket = net.Socket

var portscanner = exports

portscanner.findAnAvailablePort = function(startPort, endPort, host, callback) {
  var that = this
  var foundAvailablePort = false
  var numberOfPortsChecked = 0

  var check = function(port) {
    that.checkPortStatus(port, host, function(error, status) {
      numberOfPortsChecked++
      // Only callback once
      if (foundAvailablePort === false) {
        if (error) {
          foundAvailablePort = true
          callback(error)
        }
        else {
          if (status === 'open') {
            foundAvailablePort = true
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

