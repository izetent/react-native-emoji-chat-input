#import <UIKit/UIKit.h>
#import <SDWebImage/SDAnimatedImage.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNEmojiTextAttachment : NSTextAttachment

@property (nonatomic, strong) NSString *emojiName;
@property (nonatomic, strong) NSString *imageName;
@property (nonatomic, strong, nullable) SDAnimatedImage *animatedImage;

@end

NS_ASSUME_NONNULL_END

