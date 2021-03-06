var btListHTML = document.getElementById('bt_list');
var greenStatus = document.getElementById('green');
var bt = {
  check: function() {
    if (btListHTML.classList.contains('hide')) {
      btListHTML.classList.remove('hide');
    }
    semiLog.log('start');
    var self = this;
    bluetoothSerial.isEnabled(
      function() {
        console.log("Bluetooth already ON");
        semiLog.log("Bluetooth is enabled");
        self.list();
      },
      function() {
        console.log("Bluetooth is OFF");
        semiLog.log("Please, enable Bluetooth.");
        if(device.platform == 'Android') self.activate();
      }
    );
  },
  activate: function() {  // For Android Only
    var self = this;
    semiLog.log("Android OS");
    bluetoothSerial.enable(
      function() {
        console.log("You have enabled Bluetooth");
        semiLog.log("You have enabled Bluetooth");
        self.list();
      },
      function() {
        console.log("The user did *not* enable Bluetooth");
        semiLog.log("You have not enabled Bluetooth. App cannot continue without it.");
      }
    );
  },
  list: function() {
    var self = this;
    btListHTML.innerHTML = "";
    bluetoothSerial.list(function(devices) {
        devices.forEach(function(device) {
          console.log(device.id);
          btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.name}','${device.id}')">${device.name}</li>`);
        });
        if(device.platform == 'Android') self.scan();
      }, function(failure){console.log(failure);}
    );
  },
  scan: function() { // For Android Only
    semiLog.log('Android scanning for unpaired devices');
    bluetoothSerial.discoverUnpaired(function(devices) {
      btListHTML.insertAdjacentHTML('afterend',`<div class="comments bright">scanning...</div>`);
      devices.forEach(function(device) {
          console.log(device.id);
          btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.name}','${device.id}')">${device.name}</li>`);
      })
    }, function(failure){console.log(failure);} );
  },
  pair: function(deviceName,deviceId) {
    semiLog.clc();
    semiLog.log(`You chose device ${deviceName} Id ${deviceId}`);
    greenStatus.innerHTML = deviceName;
    btListHTML.classList.toggle("hide");
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

