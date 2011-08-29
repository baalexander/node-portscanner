var net    = require('net')
  , Socket = net.Socket

var portscanner = exports

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * a service listening on it.
 *
 * @param {Number} startPort - port to begin status check
 * @param {Number} endPort - last port to check status on (defaults to 65535)
 * @param {String} host - where to scan
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error - any errors that occurred while port scanning
 *   - {Number|Boolean} port - The first open port found. Note, this is the
 *     first port that returns status as 'open', not necessarily the first open
 *     port checked. If no open port is found, value is false.
 */
portscanner.findAnOpenPort = function(startPort, endPort, host, callback) {
  findAPortWithStatus('open', startPort, endPort, host, callback)
}

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use.
 *
 * @param {Number} startPort - port to begin status check
 * @param {Number} endPort - last port to check status on (defaults to 65535)
 * @param {String} host - where to scan
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error - any errors that occurred while port scanning
 *   - {Number|Boolean} port - The first closed port found. Note, this is the
 *     first port that returns status as 'closed', not necessarily the first
 *     closed port checked. If no closed port is found, value is false.
 */
portscanner.findAClosedPort = function(startPort, endPort, host, callback) {
  findAPortWithStatus('closed', startPort, endPort, host, callback)

}

/**
 * Checks the status of an individual port.
 *
 * @param {Number} port - port to check status on
 * @param {String} host - where to scan
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error - any errors that occurred while port scanning
 *   - {String} status - 'open' if the port is in use
 *       'closed' if the port is available
 */
portscanner.checkPortStatus = function(port, host, callback) {
  host = host || 'localhost'
  var socket = new Socket()

  // Socket connection established, port is open
  socket.on('connect', function() {
    socket.end()
    callback(null, 'open')
  })

  // If no response, assume port is not listening
  socket.setTimeout(400)
  socket.on('timeout', function() {
    socket.end()
    callback(null, 'closed')
  })

  // Assuming the port is not open if an error. May need to refine based on
  // exception
  socket.on('error', function(exception) {
    socket.destroy()
    callback(null, 'closed')
  })

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

