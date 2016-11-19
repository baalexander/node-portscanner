var net = require('net')
var Socket = net.Socket
var async = require('async')

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * there is likely a service listening on it.
 */
/**
 * @param {Number} startPort - Port to begin status check on (inclusive).
 * @param {Number} [endPort=65535] - Last port to check status on (inclusive).
 * @param {String} [host='127.0.0.1'] - Host of where to scan.
 * @param {findPortCallback} callback - Function to call back with error or results.
 * @example
 * // scans through 3000 to 3002 (inclusive)
 * portscanner.findAPortInUse(3000, 3002, '127.0.0.1', console.log)
 * @example
 * // scans through 3000 to 65535 on '127.0.0.1'
 * portscanner.findAPortInUse(3000, console.log)
 */
/**
 * @param {Array} postList - Array of ports to check status on.
 * @param {String} [host='127.0.0.1'] - Host of where to scan.
 * @param {findPortCallback} callback - Function to call back with error or results.
 * @example
 * // scans 3000 and 3002 only, not 3001.
 * portscanner.findAPortInUse([3000, 3002], console.log)
 */
function findAPortInUse (params) {
  findAPortWithStatus('open', arguments)
}

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use. Accepts identical parameters as {@link findAPortInUse}
 */
function findAPortNotInUse (params) {
  findAPortWithStatus('closed', arguments)
}

/**
 * Checks the status of an individual port.
 */
/**
 * @param {Number} port - Port to check status on.
 * @param {String} [host='127.0.0.1'] - Host of where to scan.
 * @param {checkPortCallback} callback - Function to call back with error or results.
 */
/**
 * @param {Number} port - Port to check status on.
 * @param {Object} [opts={}] - Options object.
 * @param {String} [opts.host='127.0.0.1'] - Host of where to scan.
 * @param {Number} [opts.timeout=400] - Connection timeout in ms.
 * @param {checkPortCallback} callback - Function to call back with error or results.
 */
function checkPortStatus (port, arg2, arg3) {
  var options = {}
  var callback

  if (typeof arg2 === 'string') {
    // Assume this param is the host option
    options = { host: arg2 }
  }

  /**
   * Callback for {@link checkPortStatus}
   * @callback checkPortCallback
   * @param {Error|null} error - Any error that occurred while port scanning, or null.
   * @param {String} status - Status: 'open' if the port is in use, 'closed' if the port is available.
   */
  callback = Array.prototype.slice.call(arguments).slice(-1)[0]

  var host = options.host || '127.0.0.1'
  var timeout = options.timeout || 400
  var connectionRefused = false

  var socket = new Socket()
  var status = null
  var error = null

  // Socket connection established, port is open
  socket.on('connect', function () {
    status = 'open'
    socket.destroy()
  })

  // If no response, assume port is not listening
  socket.setTimeout(timeout)
  socket.on('timeout', function () {
    status = 'closed'
    error = new Error('Timeout (' + timeout + 'ms) occurred waiting for ' + host + ':' + port + ' to be available')
    socket.destroy()
  })

  // Assuming the port is not open if an error. May need to refine based on
  // exception
  socket.on('error', function (exception) {
    if (exception.code !== 'ECONNREFUSED') {
      error = exception
    } else {
      connectionRefused = true
    }
    status = 'closed'
  })

  // Return after the socket has closed
  socket.on('close', function (exception) {
    if (exception && !connectionRefused) { error = error || exception } else { error = null }
    callback(error, status)
  })

  socket.connect(port, host)
}

/**
 * Internal helper function used by {@link findAPortInUse} and {@link findAPortNotInUse}
 * to find a port from a range or a list with a specific status.
 */
/**
 * @param {String} status - Status to check.
 * @param {...params} params - Params as passed exactly to {@link findAPortInUse} and {@link findAPortNotInUse}.
 */
function findAPortWithStatus (status, params) {
  var host, callback

  if (typeof params[0] === 'object') {
    var ports = params[0]
    host = typeof params[1] === 'string' ? params[1] : null
  } else if (typeof params[0] === 'number') {
    var startPort = params[0]
    var endPort = params[1]
    host = typeof params[2] === 'string' ? params[2] : null
  }

  /**
   * Callback for {@link findAPortWithStatus}, and by that extension, for {@link findAPortInUse} and {@link findAPortNotInUse}.
   * @callback findPortCallback
   * @param {Error|null} error - Any error that occurred while port scanning, or null.
   * @param {Number|Boolean} port - The first open port found. Note, this is the first port that returns status as 'open', not necessarily the first open port checked. If no open port is found, the value is false.
   */
  callback = Array.prototype.slice.call(params).slice(-1)[0]

  endPort = endPort || 65535

  var foundPort = false
  var numberOfPortsChecked = 0
  var port = ports ? ports[0] : startPort

  // Returns true if a port with matching status has been found or if checked
  // the entire range of ports
  var hasFoundPort = function () {
    return foundPort || numberOfPortsChecked === (ports ? ports.length : endPort - startPort + 1)
  }

  // Checks the status of the port
  var checkNextPort = function (callback) {
    checkPortStatus(port, host, function (error, statusOfPort) {
      numberOfPortsChecked++
      if (statusOfPort === status) {
        foundPort = true
        callback(error)
      } else {
        port = ports ? ports[numberOfPortsChecked] : port + 1
        callback(null)
      }
    })
  }

  // Check the status of each port until one with a matching status has been
  // found or the range of ports has been exhausted
  async.until(hasFoundPort, checkNextPort, function (error) {
    if (error) {
      callback(error, port)
    } else if (foundPort) {
      callback(null, port)
    } else {
      callback(null, false)
    }
  })
}

/**
 * @exports portscanner
 */

module.exports = {
  findAPortInUse: findAPortInUse,
  findAPortNotInUse: findAPortNotInUse,
  checkPortStatus: checkPortStatus
}
