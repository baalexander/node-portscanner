var Portscanner = require('../lib/portscanner');
var ps = new Portscanner();
var ports = [];

/*
ps.on('open', function (port) {
  ports.push(port);
});*/

ps.on('error', function(err) {
    console.log('fail ' + err);
})

ps.on('scancomplete', function (ports) {
  console.log(ports);
});
ps.scan('192.168.2.35', 20, 100);

/*
ps.scan('192.168.2.35', 1, 1000, function (pl) {
  console.log(pl);
});*/
 /*
ps.on('firstopen', function (data) {
  console.log('firstopen ' + data);
});

ps.on('firstclosed', function (data) {
  console.log('firstclosed ' + data);
});

ps.findAPortInUse(1, 1000, '192.168.2.35', function (port) {
  console.log('in use ' + port);
});

ps.findAPortNotInUse(1, 1000, '192.168.2.35', function (port) {
  console.log('not in use ' + port);
});*/
