# light-control
Simple app to control Bluetooth lamp from a smartfone. Powered by PhoneGap
## Last  update
Now app finally connects and sends RGB values to the lamp from the color-space on the screen of a smartphone.
### Observed bugs
- `ble.scan()` function still does not work. To connect to the lamp you have to know its MAC-adress and manually write it to the code;
### Solved
- Continuos changing color on the color-space in the app leads to the temporal delay in the changing color of the lamp.
### Other updates
- Application does not switch to landscape anymore