var net    = require('net')
  , Socket = net.Socket
  , async  = require('async')

var portscanner = exports

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * there is likely a service listening on it.
 *
 * @param {Number} startPort  - Port to begin status check on (inclusive).
 * @param {Number} endPort    - Last port to check status on (inclusive).
 *                              Defaults to 65535.
 * @param {String} host       - Where to scan. Defaults to '127.0.0.1'.
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first open port found. Note, this is the
 *                              first port that returns status as 'open', not
 *                              necessarily the first open port checked. If no
 *                              open port is found, the value is false.
 */
portscanner.findAPortInUse = function(startPort, endPort, host, callback) {
  findAPortWithStatus('open', makePortRangeIter(startPort, endPort), host, callback)
}

/**
 * Finds the first port with a status of 'open', implying the port is in use and
 * there is likely a service listening on it, taking possible ports from the list.
 *
 * @param {Array<Number>} list - List of ports to check.
 * @param {String} host        - Where to scan. Defaults to '127.0.0.1'.
 * @param {Function} callback  - function (error, port) { ... }
 *   - {Object|null} error     - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port   - The first open port found. Note, this is the
 *                               first port that returns status as 'open', not
 *                               necessarily the first open port checked. If no
 *                               open port is found, the value is false.
 */
portscanner.findAPortInUseFromList = function(list, host, callback) {
  findAPortWithStatus('open', new ArrayIter(list), host, callback)
}

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use.
 *
 * @param {Number} startPort  - Port to begin status check on (inclusive).
 * @param {Number} endPort    - Last port to check status on (inclusive).
 *                              Defaults to 65535.
 * @param {String} host       - Where to scan. Defaults to '127.0.0.1'.
 * @param {Function} callback - function (error, port) { ... }
 *   - {Object|null} error    - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port  - The first closed port found. Note, this is the
 *                              first port that returns status as 'closed', not
 *                              necessarily the first closed port checked. If no
 *                              closed port is found, the value is false.
 */
portscanner.findAPortNotInUse = function(startPort, endPort, host, callback) {
  findAPortWithStatus('closed', makePortRangeIter(startPort, endPort), host, callback)
}

/**
 * Finds the first port with a status of 'closed', implying the port is not in
 * use, taking possible ports from the list.
 *
 * @param {Array<Number>} list - List of ports to check.
 * @param {String} host        - Where to scan. Defaults to '127.0.0.1'.
 * @param {Function} callback  - function (error, port) { ... }
 *   - {Object|null} error     - Any errors that occurred while port scanning.
 *   - {Number|Boolean} port   - The first closed port found. Note, this is the
 *                               first port that returns status as 'closed', not
 *                               necessarily the first closed port checked. If no
 *                               closed port is found, the value is false.
 */
portscanner.findAPortNotInUseFromList = function(list, host, callback) {
  findAPortWithStatus('closed', new ArrayIter(list), host, callback)
}

/**
 * Checks the status of an individual port.
 *
 * @param {Number} port           - Port to check status on.
 * @param {String|Object} options - host or options
 *   - {String} host              - Host of where to scan. Defaults to '127.0.0.1'.
 *   - {Object} options
 *     - {String} host            - Host of where to scan. Defaults to '127.0.0.1'.
 *     - {Number} timeout         - Connection timeout. Defaults to 400ms.
 * @param {Function} callback     - function (error, port) { ... }
 *   - {Object|null} error        - Any errors that occurred while port scanning.
 *   - {String} status            - 'open' if the port is in use.
 *                                  'closed' if the port is available.
 */
portscanner.checkPortStatus = function(port, options, callback) {
  if (typeof options === 'string') {
    // Assume this param is the host option
    options = {host: options}
  }

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
      error = exception;
    else
      error = null;
    callback(error, status)
  })

  socket.connect(port, host)
}



function findAPortWithStatus(status, ports, host, callback) {
  var foundPort = false

  // Returns true if a port with matching status has been found or if checked
  // the entire range of ports
  var hasFoundPortOrCheckedAll = function() {
    return foundPort !== false || !ports.hasNext()
  }

  // Checks the status of the port
  var checkNextPort = function(callback) {
    var port = ports.next();
    // console.log('checking port', port);
    portscanner.checkPortStatus(port, host, function(error, statusOfPort) {
      if(error != null) return callback(error);

      if (statusOfPort === status) {
        foundPort = port
      }

      callback(null)
    })
  }

  // Check the status of each port until one with a matching status has been
  // found or the range of ports has been exhausted
  async.until(hasFoundPortOrCheckedAll, checkNextPort, function(error) {
    if (error) {
      callback(error, null)
    }
    else {
      callback(null, foundPort)
    }
  })
}


function RangeIterIncl(from, to){
  this.cur = from;
  this.end = to+1;
}

RangeIterIncl.prototype.hasNext = function(){
  return this.cur < this.end
}

RangeIterIncl.prototype.next = function(){
  return this.cur++
}

function ArrayIter(array){
  this.array = array
  this.len = array.length
  this.idx = 0
}

ArrayIter.prototype.hasNext = function(){
  return this.idx < this.len
}

ArrayIter.prototype.next = function(){
  return this.array[this.idx++]
}

function makePortRangeIter(from, to){
  from = from || 0
  to = to || 65535
  if(from < to){
    return new RangeIterIncl(from, to)
  }
  else{
    return new RangeIterIncl(to, from)
  }
}