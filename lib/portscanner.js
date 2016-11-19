var net    = require('net')
  , Socket = net.Socket
  , async  = require('async')

var portscanner = exports

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * there is likely a service listening on it.
 *
 * portsArray - Array of ports to check
 * startPort  - Port to begin status check on (inclusive).
 * endPort    - Last port to check status on (inclusive).
 * host       - Where to scan. Defaults to '127.0.0.1'.
 * callback   - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first open port found. Note, this is the
 *     first port that returns status as 'open', not
 *     necessarily the first open port checked. If no
 *     open port is found, the value is false.
 *
 *
 * @param {Array   |Number}   params portsArray or startPort
 * @param {String  |Number}   params host or endPort
 * @param {Function|String}   params callback or host
 * @param {*       |Function} params empty or callback
 *
 * @examples
 * portscanner.findAPortInUse([3000, 3001, 3002], '127.0.0.1', callback)
 * portscanner.findAPortInUse(3000, 3002, '127.0.0.1', callback)
 */
portscanner.findAPortInUse = function(params) {
  findAPortWithStatus('open', arguments)
};

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use.
 *
 * portsArray - Array of ports to check
 * startPort  - Port to begin status check on (inclusive).
 * endPort    - Last port to check status on (inclusive).
 * host       - Where to scan. Defaults to '127.0.0.1'.
 * callback   - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first closed port found. Note, this is the
 *     first port that returns status as 'closed', not
 *     necessarily the first closed port checked. If no
 *     closed port is found, the value is false.
 *
 * @param {Array   |Number}   params portsArray or startPort
 * @param {String  |Number}   params host or endPort
 * @param {Function|String}   params callback or host
 * @param {*       |Function} params empty or callback
 *
 * @examples
 * portscanner.findAPortNotInUse([3000, 3001, 3002], '127.0.0.1', callback)
 * portscanner.findAPortNotInUse(3000, 3002, '127.0.0.1', callback)
 */
portscanner.findAPortNotInUse = function(params) {
  findAPortWithStatus('closed', arguments)
}

/**
 * Checks the status of an individual port.
 *
 * @param {Number} port                 - Port to check status on.
 * @param {String|Object|Function} arg2 - host or options or function
 *   - {String} host                    - Host of where to scan. Defaults to '127.0.0.1'.
 *   - {Object} options
 *     - {String} host                  - Host of where to scan. Defaults to '127.0.0.1'.
 *     - {Number} timeout               - Connection timeout. Defaults to 400ms.
 * @param {Function} arg3               - function (error, port) { ... }
 *   - {Object|null} error              - Any errors that occurred while port scanning.
 *   - {String} status                  - 'open' if the port is in use. 'closed' if the port is available.
 */
portscanner.checkPortStatus = function(port, arg2, arg3) {
  var options = {}
    , callback

  if (typeof arg2 === 'string') {
    // Assume this param is the host option
    options = {host: arg2}
  }

  callback =  Array.prototype.slice.call(arguments).slice(-1)[0];

  var host = options.host || '127.0.0.1'
  var timeout = options.timeout || 400
  var connectionRefused = false;

  var socket = new Socket()
    , status = null
    , error = null

  // Socket connection established, port is open
  socket.on('connect', function() {
    status = 'open'
    socket.destroy()
  })

  // If no response, assume port is not listening
  socket.setTimeout(timeout)
  socket.on('timeout', function() {
    status = 'closed'
    error = new Error('Timeout (' + timeout + 'ms) occurred waiting for ' + host + ':' + port + ' to be available')
    socket.destroy()
  })

  // Assuming the port is not open if an error. May need to refine based on
  // exception
  socket.on('error', function(exception) {
    if(exception.code !== "ECONNREFUSED") {
      error = exception
    }
    else
      connectionRefused = true;
    status = 'closed'
  })

  // Return after the socket has closed
  socket.on('close', function(exception) {
    if(exception && !connectionRefused)
      error = error || exception;
    else
      error = null;
    callback(error, status)
  })

  socket.connect(port, host)
}

/**
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Array} Array of integers from @from to @to inclusive
 */
function range(from, to) {
  const arr = [];

  while(from <= to) {
    arr.push(~~from);
    from += 1;
  }

  return arr;
}

function findAPortWithStatus(status, params) {
  var host;
  var callback;

  //use array of ports
  if (typeof params[0] === 'object') {
    var ports = params[0];
    host = typeof params[1] === 'string' ? params[1] : null;

  //use startPort and endPort
  } else if (typeof params[0] === 'number') {
    var startPort = params[0];
    var endPort = params[1];
    host = typeof params[2] === 'string' ? params[2] : null;
  }

  //callback always at the end
  callback = Array.prototype.slice.call(params).slice(-1)[0];

  endPort = endPort || 65535

  var foundPort = false
  var numberOfPortsChecked = 0
  var port = ports ? ports[0] : startPort

  // Returns true if a port with matching status has been found or if checked
  // the entire range of ports
  var hasFoundPort = function() {
    return foundPort || numberOfPortsChecked === (ports ? ports.length : endPort - startPort + 1)
  }

  // Checks the status of the port
  var checkNextPort = function(callback) {

    portscanner.checkPortStatus(port, host, function(error, statusOfPort) {
      numberOfPortsChecked++
      if (statusOfPort === status) {
        foundPort = true
        callback(error)
      }
      else {
        port = ports ? ports[numberOfPortsChecked] : port + 1;
        callback(null)
      }
    })
  }

  // Check the status of each port until one with a matching status has been
  // found or the range of ports has been exhausted
  async.until(hasFoundPort, checkNextPort, function(error) {
    if (error) {
      callback(error, port)
    }
    else if (foundPort) {
      callback(null, port)
    }
    else {
      callback(null, false)
    }
  })
}

