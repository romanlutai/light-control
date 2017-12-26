function ListHTML (id) {
  this.element = document.getElementById(id);
  this.list = {"50:65:83:9D:05:B3":"MyLamp"};

  this.addBT = (devices) => {
    var self = this;
    if (devices instanceof Array) {
      devices.forEach(function(device){
        console.log(device.id);
        self.list[String(device.id)] = device.name;
      });
    } else {
      self.list[String(device.id)] = devices.name;
    }
  };

  this.update = () => {
    var self = this;
    this.element.innerHTML = "";
    for (id in this.list){
      console.log(id);
      var name = this.list[id];
      self.element.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${name}','${id}')">${name}</li>`);
    };
  };

  this.hide = () => {
    if (!this.element.classList.contains('hide')) {
      this.element.classList.add('hide');
    }
  };

  this.show = () => {
    if (this.element.classList.contains('hide')) {
      this.element.classList.remove('hide');
    }
  };
}

var btListHTML = new ListHTML('bt_list');

var greenStatus = document.getElementById('green');

var bt = {
  check: function() {
    btListHTML.show();
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
    bluetoothSerial.list(function(devices) {
        btListHTML.addBT(devices);
        btListHTML.update();
        if(device.platform == 'Android') self.scan();
      }, function(failure){console.log(failure);}
    );
  },
  scan: function() { // For Android Only
    semiLog.log('Android scanning for unpaired devices');
    bluetoothSerial.setDeviceDiscoveredListener(function (device) {
      console.log(device.id);
      btListHTML.addBT();
      btListHTML.update();
    }, function(failure){semiLog.log(failure);} );
    bluetoothSerial.discoverUnpaired( function(devices){
      bluetoothSerial.clearDeviceDiscoveredListener();
    }, function(failure){semiLog.log(failure);} );
  },
  pair: function(deviceName,deviceId) {
    if(device.platform == 'Android') bluetoothSerial.clearDeviceDiscoveredListener();
    semiLog.log("Connecting to device ${deviceName}");
    bluetoothSerial.connect(deviceId, function(success){
      btListHTML.hide();
      semiLog.clc();
      semiLog.log(`Successfully connected to the device ${deviceName} Id ${deviceId}`);
      greenStatus.innerHTML = deviceName;
    }, function (failure) {
      semiLog.log("Connection failed: ${failure}");
    });
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

