#import "RNEmojiChatInputView.h"
#import "RNEmojiTextAttachment.h"
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImage/SDAnimatedImageView.h>

@interface RNEmojiChatInputView () <UITextViewDelegate>

@property (nonatomic, strong) UITextView *textView;
@property (nonatomic, strong) UILabel *placeholderLabel;
@property (nonatomic, strong) NSMutableDictionary *emojiCache;

@end

@implementation RNEmojiChatInputView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self setupView];
    }
    return self;
}

- (void)setupView {
    self.emojiCache = [[NSMutableDictionary alloc] init];
    
    // 创建UITextView
    self.textView = [[UITextView alloc] init];
    self.textView.delegate = self;
    self.textView.backgroundColor = [UIColor clearColor];
    self.textView.font = [UIFont systemFontOfSize:16];
    self.textView.textColor = [UIColor blackColor];
    self.textView.scrollEnabled = YES;
    self.textView.showsVerticalScrollIndicator = NO;
    self.textView.showsHorizontalScrollIndicator = NO;
    self.textView.textContainer.lineFragmentPadding = 0;
    self.textView.textContainerInset = UIEdgeInsetsMake(8, 8, 8, 8);
    
    // 创建占位符标签
    self.placeholderLabel = [[UILabel alloc] init];
    self.placeholderLabel.text = @"输入消息...";
    self.placeholderLabel.font = [UIFont systemFontOfSize:16];
    self.placeholderLabel.textColor = [UIColor lightGrayColor];
    self.placeholderLabel.numberOfLines = 0;
    
    [self addSubview:self.textView];
    [self addSubview:self.placeholderLabel];
    
    // 设置约束
    self.textView.translatesAutoresizingMaskIntoConstraints = NO;
    self.placeholderLabel.translatesAutoresizingMaskIntoConstraints = NO;
    
    [NSLayoutConstraint activateConstraints:@[
        [self.textView.topAnchor constraintEqualToAnchor:self.topAnchor],
        [self.textView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
        [self.textView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
        [self.textView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
        
        [self.placeholderLabel.topAnchor constraintEqualToAnchor:self.textView.topAnchor constant:8],
        [self.placeholderLabel.leadingAnchor constraintEqualToAnchor:self.textView.leadingAnchor constant:8],
        [self.placeholderLabel.trailingAnchor constraintEqualToAnchor:self.textView.trailingAnchor constant:-8]
    ]];
    
    [self updatePlaceholderVisibility];
}

- (void)updatePlaceholderVisibility {
    self.placeholderLabel.hidden = self.textView.text.length > 0;
}

#pragma mark - Public Methods

- (void)insertEmoji:(NSString *)emojiName {
    if (!emojiName || !self.emojiConfig) {
        return;
    }
    
    NSDictionary *emojiInfo = self.emojiConfig[emojiName];
    if (!emojiInfo) {
        return;
    }
    
    NSString *imageName = emojiInfo[@"image"];
    NSNumber *width = emojiInfo[@"width"] ?: @24;
    NSNumber *height = emojiInfo[@"height"] ?: @24;
    
    // 创建emoji文本附件
    RNEmojiTextAttachment *attachment = [[RNEmojiTextAttachment alloc] init];
    attachment.emojiName = emojiName;
    attachment.imageName = imageName;
    attachment.bounds = CGRectMake(0, -4, width.floatValue, height.floatValue);
    
    // 异步加载图片
    [self loadEmojiImage:imageName forAttachment:attachment];
    
    // 创建属性字符串
    NSAttributedString *emojiString = [NSAttributedString attributedStringWithAttachment:attachment];
    NSMutableAttributedString *mutableEmojiString = [[NSMutableAttributedString alloc] initWithAttributedString:emojiString];
    
    // 设置字体属性
    [mutableEmojiString addAttribute:NSFontAttributeName value:self.textView.font range:NSMakeRange(0, mutableEmojiString.length)];
    
    // 插入到当前光标位置
    NSRange selectedRange = self.textView.selectedRange;
    NSMutableAttributedString *mutableText = [[NSMutableAttributedString alloc] initWithAttributedString:self.textView.attributedText];
    [mutableText insertAttributedString:mutableEmojiString atIndex:selectedRange.location];
    
    self.textView.attributedText = mutableText;
    
    // 更新光标位置
    NSRange newRange = NSMakeRange(selectedRange.location + 1, 0);
    self.textView.selectedRange = newRange;
    
    [self updatePlaceholderVisibility];
    [self notifyTextChange];
    
    if (self.onEmojiInsert) {
        self.onEmojiInsert(@{
            @"emojiName": emojiName,
            @"text": [self getText]
        });
    }
}

- (void)setText:(NSString *)text {
    self.textView.text = text;
    [self updatePlaceholderVisibility];
}

- (NSString *)getText {
    return self.textView.text ?: @"";
}

- (void)focus {
    [self.textView becomeFirstResponder];
}

- (void)blur {
    [self.textView resignFirstResponder];
}

#pragma mark - Private Methods

- (void)loadEmojiImage:(NSString *)imageName forAttachment:(RNEmojiTextAttachment *)attachment {
    // 检查缓存
    UIImage *cachedImage = self.emojiCache[imageName];
    if (cachedImage) {
        attachment.image = cachedImage;
        return;
    }
    
    // 从bundle加载图片
    NSBundle *bundle = [NSBundle bundleForClass:[self class]];
    NSString *bundlePath = [bundle pathForResource:@"emoji" ofType:@"bundle"];
    NSBundle *emojiBundle = [NSBundle bundleWithPath:bundlePath];
    
    // 尝试加载动画图片
    NSString *imagePath = [emojiBundle pathForResource:[imageName stringByDeletingPathExtension] 
                                                ofType:[imageName pathExtension]];
    
    if (imagePath) {
        NSData *imageData = [NSData dataWithContentsOfFile:imagePath];
        if (imageData) {
            // 检查是否为GIF或WebP动画
            SDImageFormat format = [NSData sd_imageFormatForImageData:imageData];
            if (format == SDImageFormatGIF || format == SDImageFormatWebP) {
                // 创建动画图片
                SDAnimatedImage *animatedImage = [SDAnimatedImage imageWithData:imageData];
                if (animatedImage) {
                    // 将动画图片转换为UIImage用于文本附件
                    UIImage *staticImage = animatedImage.posterImage ?: [animatedImage animatedImageFrameAtIndex:0];
                    self.emojiCache[imageName] = staticImage;
                    attachment.image = staticImage;
                    attachment.animatedImage = animatedImage;
                    return;
                }
            }
            
            // 加载静态图片
            UIImage *image = [UIImage imageWithData:imageData];
            if (image) {
                self.emojiCache[imageName] = image;
                attachment.image = image;
                return;
            }
        }
    }
    
    // 如果找不到图片，使用默认emoji
    attachment.image = [self defaultEmojiImage];
}

- (void)setCursorColor:(UIColor *)cursorColor {
    _cursorColor = cursorColor;
    if (cursorColor) {
        self.tintColor = cursorColor;
    }
}

- (UIImage *)defaultEmojiImage {
    // 创建一个简单的默认emoji图片
    
    // 绘制圆形背景
    CGContextSetFillColorWithColor(context, [UIColor lightGrayColor].CGColor);
    CGContextFillEllipseInRect(context, CGRectMake(0, 0, 24, 24));
    
    // 绘制问号
    NSString *text = @"?";
    NSDictionary *attributes = @{
        NSFontAttributeName: [UIFont systemFontOfSize:16],
        NSForegroundColorAttributeName: [UIColor whiteColor]
    };
    CGSize textSize = [text sizeWithAttributes:attributes];
    CGPoint textPoint = CGPointMake((24 - textSize.width) / 2, (24 - textSize.height) / 2);
    [text drawAtPoint:textPoint withAttributes:attributes];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}

- (void)notifyTextChange {
    if (self.onTextChange) {
        self.onTextChange(@{
            @"text": [self getText]
        });
    }
}

#pragma mark - UITextViewDelegate

- (void)textViewDidChange:(UITextView *)textView {
    [self updatePlaceholderVisibility];
    [self notifyTextChange];
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
    // 检查最大长度限制
    if (self.maxLength > 0) {
        NSInteger newLength = textView.text.length - range.length + text.length;
        if (newLength > self.maxLength) {
            return NO;
        }
    }
    
    // 检查是否按下回车键
    if ([text isEqualToString:@"\n"]) {
        if (!self.multiline) {
            // 单行模式下，回车键触发提交
            if (self.onSubmit) {
                self.onSubmit(@{
                    @"text": [self getText]
                });
            }
            return NO;
        }
    }
    
    return YES;
}

#pragma mark - Property Setters

- (void)setPlaceholder:(NSString *)placeholder {
    _placeholder = placeholder;
    self.placeholderLabel.text = placeholder;
}

- (void)setPlaceholderColor:(UIColor *)placeholderColor {
    _placeholderColor = placeholderColor;
    self.placeholderLabel.textColor = placeholderColor;
}

- (void)setFont:(UIFont *)font {
    _font = font;
    self.textView.font = font;
    self.placeholderLabel.font = font;
}

- (void)setTextColor:(UIColor *)textColor {
    _textColor = textColor;
    self.textView.textColor = textColor;
}

- (void)setMultiline:(BOOL)multiline {
    _multiline = multiline;
    self.textView.scrollEnabled = multiline;
}

@end

