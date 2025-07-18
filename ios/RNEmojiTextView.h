#import <React/RCTView.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNEmojiTextView : UIView

@property (nonatomic, copy) NSString *text;
@property (nonatomic, strong) NSDictionary *emojiConfig;
@property (nonatomic, strong) UIFont *font;
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, assign) NSTextAlignment textAlignment;
@property (nonatomic, assign) NSInteger numberOfLines;
@property (nonatomic, assign) NSLineBreakMode lineBreakMode;

- (void)setText:(NSString *)text;
- (void)setEmojiConfig:(NSDictionary *)emojiConfig;

@end

NS_ASSUME_NONNULL_END

