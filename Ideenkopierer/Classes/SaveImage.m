//
//  SaveImage.h
//
//  Created by MyFreeWeb on 29/04/2010.
//  Copyright 2010 MyFreeWeb.
//  MIT licensed
//

#import <UIKit/UIKit.h>
    #import <Cordova/NSData+Base64.h>


#import "SaveImage.h"
@implementation SaveImage

- (void)saveImage:(NSMutableArray*)sdata withDict:(NSMutableDictionary*)options
{
  NSData *result = [NSData dataFromBase64String:[sdata objectAtIndex:0]];
    UIImage *image = [UIImage imageWithData:result];
    UIImageWriteToSavedPhotosAlbum(image, self, @selector(imageSaver:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:), nil);
}

- (void)imageSaver:(UIImage *)image hasBeenSavedInPhotoAlbumWithError:(NSError *)error usingContextInfo:(void*)ctxInfo {
    int ImageResult;
    if (error) {
        ImageResult=0;
    } else {
        ImageResult=1;
    }
	NSString* jsString = [[NSString alloc] initWithFormat:@"window.plugins.SaveImage._didFinishWithResult(%d);",ImageResult];
	[self writeJavascript:jsString];
	[jsString release];
}

@end
