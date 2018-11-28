import net from 'net'
import test from 'ava'
import portScanner from '.'

initialize()
checkPortStatus()
findPortInUse()
findPortNotInUse()
promise()
reverseOrder()
portsAsStrings()

function initialize () {
  test.before.cb('Set #1 test server', t => {
    const server = net.createServer()
    server.listen(3000, '127.0.0.1', t.end)
  })
  test.before.cb('Set #2 test server', t => {
    const server2 = net.createServer()
    server2.listen(2999, '127.0.0.1', t.end)
  })
}

function checkPortStatus () {
  test.cb('checkPortStatus - taken', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - taken (with host in options)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - taken (with host as string and options)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, '127.0.0.1', { timeout: 400 }, (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - taken (without host)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - free', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - free (with host in options argument)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - free (with host as string and options)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, '127.0.0.1', { timeout: 400 }, (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - free (without host)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - timeout', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, { host: '127.0.0.1', timeout: 1 }, (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - error', t => {
    t.plan(1)

    portScanner.checkPortStatus(3001, '127.0.0.0', (error, port) => {
      t.is(error.code, 'ENETUNREACH')
      t.end()
    })
  })
}

function findPortInUse () {
  test.cb('findAPortInUse - taken port in range', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, 3010, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range (with host in options)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, 3010, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range (without endPort)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range (without endPort and host) ', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range (without endPort and host in options)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range - ports as array', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range - ports as array', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range - ports as array (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findAPortInUse - taken port in range - ports as array (with host on options)', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findAPortInUse - all ports in range free', t => {
    t.plan(2)

    portScanner.findAPortInUse(3001, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test.cb('findAPortInUse - all ports in range free - ports as array', t => {
    t.plan(2)

    portScanner.findAPortInUse([3001, 3005, 3008], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test.cb('findAPortInUse - all ports in range free - ports as array (with host in options)', t => {
    t.plan(2)

    portScanner.findAPortInUse([3001, 3005, 3008], { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test.cb('findAPortInUse - all ports in range free - ports as array (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse([3001, 3005, 3008], (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test('findAPortInUse - no promise in env', t => {
    t.plan(1)

    var oldPromise = Promise

    // eslint-disable-next-line
    Promise = undefined

    t.throws(() => portScanner.findAPortInUse(3001, 3010, { host: '127.0.0.1' }))

    // eslint-disable-next-line
    Promise = oldPromise
  })
}

function findPortNotInUse () {
  test.cb('findAPortNotInUse - start from free port', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3001, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - start from taken port', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3000, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - start from taken port (with host in options)', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3000, 3010, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - all ports in range taken', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(2999, 3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - all ports in range taken (with host in options)', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(2999, 3000, { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.false(port)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - with array as parameter', t => {
    t.plan(2)

    portScanner.findAPortNotInUse([3000, 3002, 2999], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3002)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - with array as parameter (with host in options)', t => {
    t.plan(2)

    portScanner.findAPortNotInUse([3000, 3002, 2999], { host: '127.0.0.1' }, (error, port) => {
      t.is(error, null)
      t.is(port, 3002)
      t.end()
    })
  })
  test('findAPortNotInUse - promise (error) (no promise in env)', t => {
    t.plan(1)

    var oldPromise = Promise

    // eslint-disable-next-line
    Promise = undefined

    t.throws(() => portScanner.findAPortNotInUse(3001, 3010, { host: '127.0.0.1' }))

    // eslint-disable-next-line
    Promise = oldPromise
  })
}

function promise () {
  test.cb('findAPortNotInUse - promise', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000, 3010, '127.0.0.1').then(port => {
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - promise (without host)', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000, 3010).then(port => {
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - promise (with host in options)', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000, 3010, { host: '127.0.0.1' }).then(port => {
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - promise (without host and endPort)', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000).then(port => {
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortInUse - promise', t => {
    t.plan(1)

    portScanner.findAPortInUse(3000, 3010, '127.0.0.1').then(port => {
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - promise (with host in options)', t => {
    t.plan(1)

    portScanner.findAPortInUse(3000, 3010, { host: '127.0.0.1' }).then(port => {
      t.is(port, 3000)
      t.end()
    })
  })
  test.cb('findAPortInUse - promise (error)', t => {
    t.plan(1)

    portScanner.findAPortInUse(3001, 3010, '127.0.0.1').catch(err => {
      t.not(err, null)
      t.end()
    })
  })
  test.cb('findAPortInUse - promise (error) (with host in options)', t => {
    t.plan(1)

    portScanner.findAPortInUse(3001, 3010, { host: '127.0.0.1' }).catch(err => {
      t.not(err, null)
      t.end()
    })
  })
}

function reverseOrder () {
  test.cb('findAPortNotInUse - ports in reverse order, lowest one being in use', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3005, 3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
      t.end()
    })
  })
  test.cb('findAPortNotInUse - ports in reverse order, highest one being in use', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3000, 2995, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2995)
      t.end()
    })
  })
}

function portsAsStrings () {
  test.cb('checkPortStatus - taken (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3000', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - taken (without host) (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3000', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
      t.end()
    })
  })
  test.cb('checkPortStatus - free (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3001', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('checkPortStatus - free (without host) (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3001', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
      t.end()
    })
  })
  test.cb('findPortInUse - taken port in range (startPort as a string)', t => {
    t.plan(2)

    portScanner.findAPortInUse('2990', 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findPortInUse - taken port in range (endPort as a string)', t => {
    t.plan(2)

    portScanner.findAPortInUse(2990, '3010', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
      t.end()
    })
  })
  test.cb('findPortInUse - taken port in range (startPort and endPort as strings)', t => {
    t.plan(2)

    portScanner.findAPortInUse('3000', '3010', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
      t.end()
    })
  })
}
