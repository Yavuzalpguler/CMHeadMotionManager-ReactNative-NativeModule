//
//  Gyro.m
//  postureNativeModule
//
//  Created by Yavuzalp Güler on 10.08.2022.
//

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(Gyro, RCTEventEmitter)

RCT_EXTERN_METHOD(motion)
RCT_EXTERN_METHOD(isAvailable: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(isActive: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getData: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(startUpdates)
//RCT_EXPORT_METHOD(setUpdateInterval:(double) interval)
RCT_EXTERN_METHOD(stopUpdates)




@end


