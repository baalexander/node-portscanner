var net    = require('net')
  , Socket = net.Socket
  , events = require('events');

var portscanner = function() {};

portscanner.prototype = new events.EventEmitter();

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * there is likely a service listening on it.
 *
 * @param {Number} startPort  - Port to begin status check on (inclusive).
 * @param {Number} endPort    - Last port to check status on (inclusive).
 *                              Defaults to 65535.
 * @param {String} host       - Where to scan. Defaults to 'localhost'.
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first open port found. Note, this is the
 *                              first port that returns status as 'open', not
 *                              necessarily the first open port checked. If no
 *                              open port is found, the value is false.
 */
portscanner.prototype.findAPortInUse = function(startPort, endPort, host, callback) {
  portscanner.prototype.findAPortWithStatus('open', startPort, endPort, host, callback)
}

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use.
 *
 * @param {Number} startPort  - Port to begin status check on (inclusive).
 * @param {Number} endPort    - Last port to check status on (inclusive).
 *                              Defaults to 65535.
 * @param {String} host       - Where to scan. Defaults to 'localhost'.
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first closed port found. Note, this is the
 *                              first port that returns status as 'closed', not
 *                              necessarily the first closed port checked. If no
 *                              closed port is found, the value is false.
 */
portscanner.prototype.findAPortNotInUse = function(startPort, endPort, host, callback) {
 portscanner.prototype. findAPortWithStatus('closed', startPort, endPort, host, callback)
}

/**
 * Checks the status of an individual port.
 *
 * @param {Number} port           - Port to check status on.
 * @param {String|Object} options - host or options
 *   - {String} host              - Host of where to scan. Defaults to 'localhost'.
 *   - {Object} options
 *     - {String} host            - Host of where to scan. Defaults to 'localhost'.
 *     - {Number} timeout         - Connection timeout. Defaults to 400ms.
 * @param {Function} callback     - function (error, port) { ... }
 *   - {Object|null} error        - Any errors that occurred while port scanning.
 *   - {String} status            - 'open' if the port is in use.
 *                                  'closed' if the port is available.
 */
portscanner.prototype.checkPortStatus = function(port, options, callback) {
  if (typeof options === 'string') {
    // Assume this param is the host option
    options = {host: options}
  }

  var host = options.host || 'localhost'
  var timeout = options.timeout || 400
  var self = this;
  var socket = new Socket()
    , status = null
    , error = null

  // Socket connection established, port is open
  socket.on('connect', function() {
    status = 'open'
    socket.end()
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
    error = exception
    status = 'closed'
    self.emit('error', error);
  })

  // Return after the socket has closed
  socket.on('close', function(exception) {
    if (exception) error = exception
    callback(error, status, port)
    if (status === 'open') {
      self.emit('open', port);
    } else {
      self.emit('closed', port);
    }
  })

  socket.connect(port, host)
}

portscanner.prototype.scan = function(host, startPort, endPort) {
  var numberOfPortsChecked = 0
  var port = startPort;
  var self = this;
  for (port; port <= endPort; port++) {
    portscanner.prototype.checkPortStatus(port, host, function(error, statusOfPort, port) {
      numberOfPortsChecked++
      if (numberOfPortsChecked === (endPort - startPort + 1)) {
        self.emit('done','done');
      }
    });
  }
}

portscanner.prototype.findAPortWithStatus = function(status, startPort, endPort, host, callback) {
  var hasEmitted = false;
  var self = this;
  this.on(status, function(data) {
    if (!hasEmitted) {
      hasEmitted = true;
      this.emit('first'+status, data);
      callback(null, data);
    }
  });
  portscanner.prototype.scan(host, startPort, endPort);
}

module.exports = portscanner;
