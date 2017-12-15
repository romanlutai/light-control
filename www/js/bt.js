var btListHTML = document.getElementById('bt_list');
var greenStatus = document.getElementById('green');
var bt = {
  check: function() {
    semiLog.log('start');
    bluetoothSerial.isEnabled(
//      var btListHTML = document.getElementById('bt_list');
      function() {
          console.log("Bluetooth is enabled");
          semiLog.log("enabled");
      },
      function() {
          console.log("Bluetooth is *not* enabled");
          semiLog.log("NOT enabled");
      }
    );
    this.list();
  },
  list: function() {
    btListHTML.classList.toggle("show");
    btListHTML.innerHTML = "";
    bluetoothSerial.list(function(devices) {
        devices.forEach(function(device) {
          console.log(device.id);
          btListHTML.insertAdjacentHTML('afterbegin',`<li onclick="bt.pair('${device.name}','${device.id}')">${device.name}</li>`);
        });
      }, function(failure){console.log(failure);}
    );
  },
  scan: function() {
  btListHTML.innerHTML = "";
    bluetoothSerial.list(function(devices) {
      if ( device.platform == 'Android' ) {
        bluetoothSerial.enable(
          function() {
            console.log("Bluetooth is enabled");
          },
          function() {
            console.log("The user did *not* enable Bluetooth");
          }
        );
        bluetoothSerial.discoverUnpaired(function(devices) {
            devices.forEach(function(device) {
                console.log(device.id);
                btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.name}','${device.id}')">${device.name}</li>`);
            })
        }, function(failure){console.log(failure);} );
      }
      devices.forEach(function(device) {
        console.log(device.id);
        btListHTML.insertAdjacentHTML('afterbegin',`<li onclick="bt.pair('${device.name}','${device.id}')">${device.name}</li>`);
      })
    }, function(failure){console.log(failure);} );
  },
  pair: function(deviceName,deviceId) {
    semiLog.clc();
    semiLog.log(`You chose device ${deviceName} Id ${deviceId}`);
    greenStatus.innerHTML = deviceName;
  }
}

var semiLog = {
  log: function(message) {
    logWindow = document.getElementById('semiLog');
    console.log(message);
    logWindow.insertAdjacentHTML('beforeend','<div class="logline">'+message+'</div>');
  },
  clc: function() {
    logWindow = document.getElementById('semiLog');
    logWindow.innerHTML = '';
  }
}

function test() {
  var t = new Date();
  semiLog.log( t.getTime() );
}

