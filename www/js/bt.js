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
    ble.isEnabled(
      function() {
        console.log("Bluetooth already ON");
        semiLog.log("Bluetooth is enabled");
        self.scan();
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
    ble.enable(
      function() {
        console.log("You have enabled Bluetooth");
        semiLog.log("You have enabled Bluetooth");
        self.scan();
      },
      function() {
        console.log("The user did *not* enable Bluetooth");
        semiLog.log("You have not enabled Bluetooth. App cannot continue without it.");
      }
    );
  },
  scan: function() { // For Android Only
    semiLog.log('Scanning for BLE devices');
    btListHTML.update();
    ble.startScanWithOptions([],{}, function (device) {
      console.log(device.id);
      btListHTML.addBT();
      btListHTML.update();
    }, function(failure){semiLog.log(failure);} );
  },
  pair: function(deviceName,deviceId) {
    ble.stopScan(
      function(success){semiLog.log("Scan complete")},
      function(failure){semiLog.log("stopScan failed: "+failure)}
    );
    semiLog.log(`Connecting to device ${deviceName}`);
    activeBLE.connected(deviceName,deviceId);
    ble.connect(deviceId, function(success){
      btListHTML.hide();
      semiLog.clc();
      semiLog.log(`Successfully connected to the device ${deviceName} Id ${deviceId}`);
      greenStatus.innerHTML = deviceName;
      activeBLE.connected(deviceName,deviceId);
    }, function (failure) {
      semiLog.log(`Connection failed: ${failure}`);
    });
  }
}


var activeBLE = {
  connected: function(name, id){
    this.name = name;
    this.id = id;
  },

  write_service_UUID: "0000ffe5-0000-1000-8000-00805f9b34fb",
  write_charachteristic_UUID: "0000FFE9-0000-1000-8000-00805F9B34FB",
  readUUID : "0000FFE4-0000-1000-8000-00805F9B34FB",
  infoUUID : "2A00",

  interval: 32,
  getTime: function(){
    var clock = new Date();
    return clock.getTime();
  },
  watchInterval: function(){
    if ( typeof this.lastCall === 'undefined') this.lastCall = this.getTime();
    if ( (this.getTime()-this.lastCall) > this.interval ){
      this.lastCall = this.getTime();
      return true;
    } else {
      return false;
    }
  },

  sendRGB: function(r,g,b){
    if ( this.watchInterval() ){
      ble.write(
        this.id,
        this.write_service_UUID,
        this.write_charachteristic_UUID,
        this.messageRGB(r,g,b),
        function(success){},
        function(failure){
          semiLog.log("Sending data failed: "+failure);
        }
      );
    }
  },
  messageRGB:function(r,g,b){
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return this.encodeBytes([0x56,r,g,b,0x00,0xF0,0xAA]);
  },

  sendSwitch: function(isOff){
    ble.write(
      this.id,
      this.write_service_UUID,
      this.write_charachteristic_UUID,
      this.messageSwitch(isOff),
      function(success){},
      function(failure){
        alert("Sending data failed: "+failure);
      }
    );
  },
  messageSwitch: function(isOff){
    return this.encodeBytes([0xCC,0x23+off,0x33]);
  },

  encodeBytes:function(arr){
    var message = new Uint8Array(arr.length);
    for (var i=0 ; i<arr.length ; i++){
      message[i] = arr[i];
    }
    return message.buffer;
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
  semiLog.log( "Time in ms: "+t.getTime() );
  ble.disconnect(activeBLE.id,function(success){semiLog.log('Successfully disconnect')},function(failure){semiLog.log(failure)});
}

