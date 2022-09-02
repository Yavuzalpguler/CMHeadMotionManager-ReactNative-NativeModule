import Foundation
import UIKit
import AVFoundation
@objc(HelloWorldModule) class HelloWorldModule: RCTEventEmitter {
@objc()
func scanBLEDevices() -> Void {
  // Way to scan BLE devices
  bleHelper.startScanPeripheral()
}

  override func supportedEvents() -> [String]! {
  return [EVENTS.SCAN, EVENTS.ERROR, EVENTS.CONNECT, “read”, “write”, “notification”, “change”, EVENTS.VALUE_UPDATE, EVENTS.APPSTATECHANGE]
  }
  
  
  // This method will return all the nearest devices
  func didDiscoverPeripheral(_ peripheral: CBPeripheral, advertisementData: [String : Any], RSSI: NSNumber)
  {
  // Use send Events with name of event and body of event
  sendEvent(withName: "SCAN" , body: ["name": peripheral.name, ""rssi"": RSSI, "state":peripheral.state, "address" :peripheral.identifier.uuidString])
  }
  
}
