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
  test.before('Set #1 test server', t => {
    const server = net.createServer()
    server.listen(3000, '127.0.0.1', () => t.end())
  })
  test.before('Set #2 test server', t => {
    const server2 = net.createServer()
    server2.listen(2999, '127.0.0.1', () => t.end())
  })
}

function checkPortStatus () {
  test('checkPortStatus - taken', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
    })
  })
  test('checkPortStatus - taken (without host)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3000, (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
    })
  })
  test('checkPortStatus - free', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
    })
  })
  test('checkPortStatus - free (without host)', t => {
    t.plan(2)

    portScanner.checkPortStatus(3001, (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
    })
  })
}

function findPortInUse () {
  test('findPortInUse - taken port in range', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
    })
  })
  test('findPortInUse - taken port in range (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, 3010, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
    })
  })
  test('findPortInUse - taken port in range (without endPort)', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
    })
  })
  test('findPortInUse - taken port in range (without endPort and host) ', t => {
    t.plan(2)

    portScanner.findAPortInUse(3000, (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
    })
  })
  test('findPortInUse - taken port in range - ports as array', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
    })
  })
  test('findPortInUse - taken port in range - ports as array (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse([2999, 3000, 3001], (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
    })
  })
  test('findPortInUse - all ports in range free', t => {
    t.plan(2)

    portScanner.findAPortInUse(3001, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
    })
  })
  test('findPortInUse - all ports in range free - ports as array', t => {
    t.plan(2)

    portScanner.findAPortInUse([3001, 3005, 3008], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
    })
  })
  test('findPortInUse - all ports in range free - ports as array (without host)', t => {
    t.plan(2)

    portScanner.findAPortInUse([3001, 3005, 3008], (error, port) => {
      t.is(error, null)
      t.false(port)
    })
  })
}

function findPortNotInUse () {
  test('findAPortNotInUse - start from free port', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3001, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
    })
  })
  test('findAPortNotInUse - start from taken port', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3000, 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
    })
  })
  test('findAPortNotInUse - all ports in range taken', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(2999, 3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.false(port)
    })
  })
  test('findAPortNotInUse - with array as parameter', t => {
    t.plan(2)

    portScanner.findAPortNotInUse([3000, 3002, 2999], '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3002)
    })
  })
}

function promise () {
  test('findAPortNotInUse - promise', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000, 3010, '127.0.0.1').then(port => {
      t.is(port, 3001)
    })
  })
  test('findAPortNotInUse - promise (without host)', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000, 3010).then(port => {
      t.is(port, 3001)
    })
  })
  test('findAPortNotInUse - promise (without host and endPort)', t => {
    t.plan(1)

    portScanner.findAPortNotInUse(3000).then(port => {
      t.is(port, 3001)
    })
  })
  test('findAPortInUse - promise', t => {
    t.plan(1)

    portScanner.findAPortInUse(3000, 3010, '127.0.0.1').then(port => {
      t.is(port, 3000)
    })
  })
  test('findAPortInUse - promise (error)', t => {
    t.plan(1)

    portScanner.findAPortInUse(3001, 3010, '127.0.0.1').catch(err => {
      t.not(err, null)
    })
  })
}

function reverseOrder () {
  test('findAPortNotInUse - ports in reverse order, lowest one being in use', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3005, 3000, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3001)
    })
  })
  test('findAPortNotInUse - ports in reverse order, highest one being in use', t => {
    t.plan(2)

    portScanner.findAPortNotInUse(3000, 2995, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2995)
    })
  })
}

function portsAsStrings () {
  test('checkPortStatus - taken (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3000', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
    })
  })
  test('checkPortStatus - taken (without host) (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3000', (error, port) => {
      t.is(error, null)
      t.is(port, 'open')
    })
  })
  test('checkPortStatus - free (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3001', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
    })
  })
  test('checkPortStatus - free (without host) (port as a string)', t => {
    t.plan(2)

    portScanner.checkPortStatus('3001', (error, port) => {
      t.is(error, null)
      t.is(port, 'closed')
    })
  })
  test('findPortInUse - taken port in range (startPort as a string)', t => {
    t.plan(2)

    portScanner.findAPortInUse('2990', 3010, '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
    })
  })
  test('findPortInUse - taken port in range (endPort as a string)', t => {
    t.plan(2)

    portScanner.findAPortInUse(2990, '3010', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 2999)
    })
  })
  test('findPortInUse - taken port in range (startPort and endPort as strings)', t => {
    t.plan(2)

    portScanner.findAPortInUse('3000', '3010', '127.0.0.1', (error, port) => {
      t.is(error, null)
      t.is(port, 3000)
    })
  })
}
