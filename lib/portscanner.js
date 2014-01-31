var net = require('net'),
  Socket = net.Socket,
  events = require('events');

var Portscanner = function () {};

Portscanner.prototype = new events.EventEmitter();

Portscanner.prototype.checkPortStatus = function (port, options, callback) {
  if (typeof options === 'string') {
    // Assume this param is the host option
    options = {
      host: options
    };
  }

  var host = options.host || 'localhost';
  var timeout = 1000;
  var self = this;
  var socket = new Socket(),
    status = null,
    error = null;

  // Socket connection established, port is open
  socket.on('connect', function () {
    status = 'open';
    socket.end();
  });

  // If no response, assume port is not listening
  socket.setTimeout(timeout);
  socket.on('timeout', function () {
    status = 'closed';
    error = new Error('Timeout (' + timeout + 'ms) occurred waiting for ' + host + ':' + port + ' to be available');
    socket.destroy();
  });

  // Assuming the port is not open if an error. May need to refine based on
  // exception
  socket.on('error', function (exception) {
    error = exception;
    status = 'closed';
    self.emit('error', error);
  });

  // Return after the socket has closed
  socket.on('close', function (exception) {
    if (exception) {
      error = exception;
    }
    self.emit(status, port);
    self.emit('portChecked', port);
    if (callback) {
      callback(error, status, port);
    }
  });
  socket.connect(port, host);
};

Portscanner.prototype.scan = function (host, startPort, endPort, callback) {
  var numberOfPortsChecked = 0;
  var port = startPort;
  var ports = [];
  this.on('open', function (openPort) {
    ports.push(openPort);
  });
  this.on('portChecked', function (port) {
    numberOfPortsChecked++;
    if (numberOfPortsChecked === (endPort - startPort + 1)) {
      this.emit('scancomplete', ports);
      if (callback) {
        callback(ports);
      }
    }
  });
  for (port; port <= endPort; port++) {
    Portscanner.prototype.checkPortStatus(port, host);
  }
};

Portscanner.prototype.findAPortWithStatus = function (status, startPort, endPort, host, callback) {
  var hasEmitted = false;
  this.on(status, function (data) {
    if (!hasEmitted) {
      hasEmitted = true;
      this.emit('first' + status, data);
      if (callback) {
        callback(data);
      }
    }
  });
  Portscanner.prototype.scan(host, startPort, endPort);
};

Portscanner.prototype.findAPortInUse = function (startPort, endPort, host, callback) {
  Portscanner.prototype.findAPortWithStatus('open', startPort, endPort, host, callback);
};

Portscanner.prototype.findAPortNotInUse = function (startPort, endPort, host, callback) {
  Portscanner.prototype.findAPortWithStatus('closed', startPort, endPort, host, callback);
};

module.exports = Portscanner;
