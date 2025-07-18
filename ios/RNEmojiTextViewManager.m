#import "RNEmojiTextViewManager.h"
#import "RNEmojiTextView.h"
#import <React/RCTUIManager.h>

@implementation RNEmojiTextViewManager

RCT_EXPORT_MODULE(RNEmojiTextView)

- (UIView *)view {
    return [[RNEmojiTextView alloc] init];
}

// 导出属性
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(emojiConfig, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(font, UIFont)
RCT_EXPORT_VIEW_PROPERTY(textColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(textAlignment, NSTextAlignment)
RCT_EXPORT_VIEW_PROPERTY(numberOfLines, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(lineBreakMode, NSLineBreakMode)

@end

