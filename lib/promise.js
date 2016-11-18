var portscanner = require('./portscanner')

var promisified = exports

promisified.findAPortInUse = function() {
  return promiseConstructor(portscanner.findAPortInUse, arguments)
}

promisified.findAPortNotInUse = function() {
  return promiseConstructor(portscanner.findAPortNotInUse, arguments)
}

promisified.checkPortStatus = function() {
  return promiseConstructor(portscanner.checkPortStatus, arguments)
}

promisified.findAPortWithStatus = function() {
  return promiseConstructor(portscanner.findAPortWithStatus, arguments)
}

function promiseConstructor(method, args) {
  return new Promise(function(resolve, reject) {
    args = [].slice.call(args).concat([callback])
    method.apply(null, args)

    function callback(error, port) {
      if (error || port === false) {
        reject(error || new Error('No open port found'))
      } else {
        resolve(port)
      }
    }
  })
}
