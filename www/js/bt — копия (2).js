var bt = {
  scan: function() {
    var btListHTML = document.getElementById('bt_list');
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
                btListHTML.insertAdjacentHTML('beforeend',`<li onclick="bt.pair('${device.id}')">${device.name}</li>`);
            })
        }, function(failure){console.log(failure);} );
      }
      devices.forEach(function(device) {
        console.log(device.id);
        btListHTML.insertAdjacentHTML('afterbegin',`<li onclick="bt.pair('${device.id}')">${device.name}</li>`);
      })
    }, function(failure){console.log(failure);} );
  },
  pair: function(deviceId) {
    console.log(`User chose device Id ${deviceId}`);
  }
}

function test() {
  var t = new Date();
  document.getElementById('bt_list').innerHTML = t.getTime();
}
