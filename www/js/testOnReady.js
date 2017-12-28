function testOnReady()
{
    console.log('Enabling bluetooth');

    ble.enable(function () {
        console.log('BLE enabled');

        console.log('Scanning...');
        ble.scan([], 10, function (device) {
            console.log(JSON.stringify(device));
        }, function () {
            console.log('Failed to scan');
        });
    }, function () {
        console.log('Could not enable BLE');
    });
}
