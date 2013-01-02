//
//  SaveImage.h
//
//  Created by MyFreeWeb on 29/04/2010.
//  Copyright 2010 MyFreeWeb.
//  MIT licensed
//

#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>
    #import <Cordova/CDVPlugin.h>
    #import <Cordova/NSData+Base64.h>


@interface SaveImage : CDVPlugin {
}

- (void)saveImage:(NSMutableArray*)sdata withDict:(NSMutableDictionary*)options;
@end
