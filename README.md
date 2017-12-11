# light-control
Simple app to control Bluetooth lamp from a smartfone. Powered by PhoneGap
### Examining performance of the BluetoothSetial module
So long, total impression from the module is as follows: it does not work with Android OS. 

For the app testing issue were used **Chrome 62.0.3202.94** browser on **Windows 8.1** *(further reffered as **PC**)* and the **PhoneGap app** on **Android 6.0.1**, Samsung Galaxy S5 *(further reffered as **the phone**)*.

To proof the issue was written a simple script to check if Bluetooth is enabled on the device and write the result to the main page. 
As a result, the script works on PC, but freezes on the phone at the function `BluetoothSerial.isEnabled()`.

Also, the performance of the function `BluetoothSerial.list()` looks suspicious even on PC: it returns **identical** list as in the Readme for the module. On the phone it also freezes.
### Solution
The script works perfectly after building the app even though it wasn't connesting in test mode.


