import {NativeModules, NativeEventEmitter} from 'react-native';

// OPTION 1
class Motion extends NativeEventEmitter {
  constructor(nativeModule) {
    super(nativeModule);

    // explicitly set our custom methods and properties

    this.isAvailable = nativeModule.isAvailable;
    this.isActive = nativeModule.isActive;
    this.stopUpdates = nativeModule.stopUpdates;
    this.startUpdates = nativeModule.startUpdates;

    this.getData = nativeModule.getData;
    this.motion = nativeModule.motion;
  }
}

export default new Motion(NativeModules.Gyro);
