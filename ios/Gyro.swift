//
//  Gyro.swift
//  postureNativeModule
//
//  Created by Yavuzalp Güler on 10.08.2022.
//

import Foundation
import CoreMotion

@available(iOS 14.0, *)
@objc(Gyro)

class Gyro: RCTEventEmitter,CMHeadphoneMotionManagerDelegate {
  @objc
  let APP = CMHeadphoneMotionManager()
  
  
  private var isActive = false
  private var isAvailable = false
  private var quaX:Double = 0
  private var quaY :Double = 0
  private var quaZ :Double = 0
  private var quaW:Double = 0
  private var attPitch :Double = 0
  private var attRoll:Double = 0
  private var attYaw:Double = 0
  private var gravAccX:Double = 0
  private var gravAccY:Double = 0
  private var gravAccZ:Double = 0
  private var rotRateX:Double = 0
  private var rotRateY :Double = 0
  private var rotRateZ:Double = 0
  private var accX:Double = 0
  private var accY:Double = 0
  private var accZ :Double = 0
  private var heading:Double = 0
  
  
  
  //  @objc func setUpdateInterval(_ interval: Double){
  //
  //
  //    let intervalInSeconds: Double = interval / 1000
  //
  //    APP.updateInterval = TimeInterval(intervalInSeconds)
  //  }
  //
  
  @objc func getData(_ callback: RCTResponseSenderBlock){
    APP.delegate = self
//
//    let quaX = self.attitude.quaternion.x
//    let quaY = data.attitude.quaternion.y
//    let quaZ = data.attitude.quaternion.z
//    let quaW = data.attitude.quaternion.w
//    let attPitch = data.attitude.pitch
//    let attRoll = data.attitude.roll
//    let attYaw = data.attitude.yaw
//    let gravAccX = data.gravity.x
//    let gravAccY = data.gravity.y
//    let gravAccZ = data.gravity.z
//    let rotRateX = data.rotationRate.x
//    let rotRateY = data.rotationRate.y
//    let rotRateZ = data.rotationRate.z
//    let accX = data.userAcceleration.x
//    let accY = data.userAcceleration.y
//    let accZ = data.userAcceleration.z
//
//    let heading = data.heading
//
    
    
    //    let jsonObj:[Any] = ["""
    //      "x": \(),
    //      "y": \(y),
    //      "z": \(z),
    //      "w": \(w)
    //"""
    //    ]
    callback([["quaternion": ["x": self.quaX, "y": self.quaY, "z": self.quaZ, "w": self.quaW],"attitude":["pitch": self.attPitch, "roll": self.attRoll, "yaw": self.attYaw],"gravitationalAcc":["x": self.gravAccX, "y": self.gravAccY ,"z": self.gravAccZ ],"rotationRate":["x": self.rotRateX, "y": self.rotRateY, "z": self.rotRateZ],"acceleration":["x":self.accX, "y":self.accY, "z": self.accZ],"heading": self.heading]])
  }
  
  
  @objc func startUpdates(){
    APP.delegate = self
    APP.startDeviceMotionUpdates(to: OperationQueue.main, withHandler: {[weak self] motion, error  in
      guard let motion = motion, error == nil else { return }
      
      self?.quaX = motion.attitude.quaternion.x
      self?.quaY = motion.attitude.quaternion.y
      self?.quaZ = motion.attitude.quaternion.z
      self?.quaW = motion.attitude.quaternion.w
      self?.attPitch = motion.attitude.pitch
      self?.attRoll = motion.attitude.roll
      self?.attYaw = motion.attitude.yaw
      self?.gravAccX = motion.gravity.x
      self?.gravAccY = motion.gravity.y
      self?.gravAccZ = motion.gravity.z
      self?.rotRateX = motion.rotationRate.x
      self?.rotRateY = motion.rotationRate.y
      self?.rotRateZ = motion.rotationRate.z
      self?.accX = motion.userAcceleration.x
      self?.accY = motion.userAcceleration.y
      self?.accZ = motion.userAcceleration.z

      self?.heading = motion.heading

//
//      self?.sendEvent(withName: "onMotion", body: ["quaternion": ["x": quaX, "y": quaY, "z": quaZ, "w": quaW],"attitude":["pitch": attPitch, "roll": attRoll, "yaw": attYaw],"gravitationalAcc":["x": gravAccX, "y": gravAccY ,"z": gravAccZ ],"rotationRate":["x": rotRateX, "y": rotRateY, "z": rotRateZ],"acceleration":["x":accX, "y":accY, "z": accZ],"heading": heading])
    })
  }
  
  
  @objc func stopUpdates(){
    APP.delegate = self
    APP.stopDeviceMotionUpdates()
  }
  
  @objc func isAvailable(_ callback: RCTResponseSenderBlock) {
    APP.delegate = self
    if( APP.isDeviceMotionAvailable ){
      isAvailable = true
    }
    else {
      isAvailable = false
    }
    callback([isAvailable])
  }
  
  
  @objc func isActive(_ callback: RCTResponseSenderBlock) {
    APP.delegate = self
    if( APP.isDeviceMotionActive ){
      isActive = true
    }
    else {
      isActive = false
    }
    callback([isAvailable])
  }
  
  
  @objc func motion() {
    APP.startDeviceMotionUpdates(to: OperationQueue.current!, withHandler: {[weak self] motion, error  in
      guard let motion = motion, error == nil else { return }
      self?.sendEvent(withName: "onMotion", body: ["motion": motion])
      
    })
  }
  
  override func supportedEvents() -> [String]! {
    return ["onMotion"]
  }
  
  
  
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
