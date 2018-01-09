var btListHTML = document.getElementById('bt_list');

var bt = {
  scan: function() {
    this.btEnable();
  },
  btEnable: function(){
    bluetoothSerial.isEnabled(
      function() {
          this.addLine("<li>Bluetooth is enabled</li>");
      },
      function() {
          this.addLine("<li>Bluetooth is *not* enabled</li>");
      }
    );
  },
  btList: function() {
    btListHTML.innerHTML = "";
    bluetoothSerial.list(function(devices) {
      devices.forEach(function(device) {
        console.log(device.id);
        btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.id}')">${device.name}</li>`);
      })
      if ( device.platform == 'Android' ) { this.androidScan(); }
    }, function(failure){console.log(failure);} );
  },
  androidScan: function() {
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
            btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.id}')">${device.name}</li>`);
        })
    }, function(failure){console.log(failure);} );
  },
  pair: function(deviceId) {
    console.log(`User chose device Id ${deviceId}`);
  }
  addLine: function(message) {
    btListHTML.insertAdjacentHTML('beforeend',message);
  }
}

function test() {
  var t = new Date();
  document.getElementById('bt_list').innerHTML = t.getTime();
}
