#import <React/RCTView.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNEmojiChatInputView : UITextView

@property (nonatomic, copy) RCTBubblingEventBlock onTextChange;
@property (nonatomic, copy) RCTBubblingEventBlock onEmojiInsert;
@property (nonatomic, copy) RCTBubblingEventBlock onSubmit;
@property (nonatomic, copy) RCTBubblingEventBlock onFocus;
@property (nonatomic, copy) RCTBubblingEventBlock onBlur;

@property (nonatomic, strong) NSDictionary *emojiConfig;
@property (nonatomic, assign) NSInteger maxLength;
@property (nonatomic, assign) BOOL multiline;
@property (nonatomic, strong) UIColor *cursorColor;

- (void)insertEmoji:(NSString *)emojiName;
- (NSString *)getPlainText;
- (void)setText:(NSString *)text;
- (NSString *)getText;
- (void)focus;
- (void)blur;

@end

NS_ASSUME_NONNULL_END

