var Service, Characteristic;
var rpio = require('rpio');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-relays-delay", "RelayDelay", RelayAccessory2);
}

function RelayAccessory2(log, config) {
  this.log = log;
  this.name = config["name"];
  this.binaryState = 0;
  this.pin = config["pin"];

  this.log("Creating a relay with name '" + this.name + "'");
  rpio.open(this.pin, rpio.OUTPUT, rpio.HIGH);
}

RelayAccessory2.prototype.getRelayStatus = function(callback) {
  this.binaryState = rpio.read(this.pin);
  var relayOn = this.binaryState > 0;
  callback(null, relayOn);
}

RelayAccessory2.prototype.setRelayOn = function(on, callback) {
  this.binaryState = on ? 1 : 0;
  if (this.binaryState) {
    rpio.write(this.pin, rpio.LOW);
    setTimeout(() => rpio.write(this.pin, rpio.HIGH), 700);
  } else {
    rpio.write(this.pin, rpio.LOW);
    setTimeout(() => rpio.write(this.pin, rpio.HIGH), 700);
  }

  this.log("Relay status for PIN:'%d' is %s", this.name, this.binaryState);
  callback(null);
}

RelayAccessory2.prototype.getServices = function() {
  var relayService = new Service.Switch(this.name);
  relayService.getCharacteristic(Characteristic.On)
    .on('get', this.getRelayStatus.bind(this))
    .on('set', this.setRelayOn.bind(this));
  return [relayService];
}
