#import "RNEmojiTextView.h"
#import "RNEmojiTextAttachment.h"
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImage/SDAnimatedImageView.h>

@interface RNEmojiTextView ()

@property (nonatomic, strong) UILabel *textLabel;
@property (nonatomic, strong) NSMutableDictionary *emojiCache;

@end

@implementation RNEmojiTextView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self setupView];
    }
    return self;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setupView];
    }
    return self;
}

- (void)setupView {
    self.emojiCache = [[NSMutableDictionary alloc] init];
    
    // 创建文本标签
    self.textLabel = [[UILabel alloc] init];
    self.textLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.textLabel.numberOfLines = 0; // 默认多行
    self.textLabel.lineBreakMode = NSLineBreakByWordWrapping;
    self.textLabel.textAlignment = NSTextAlignmentLeft;
    self.textLabel.textColor = [UIColor blackColor];
    self.textLabel.font = [UIFont systemFontOfSize:16];
    
    [self addSubview:self.textLabel];
    
    // 设置约束
    [NSLayoutConstraint activateConstraints:@[
        [self.textLabel.topAnchor constraintEqualToAnchor:self.topAnchor],
        [self.textLabel.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
        [self.textLabel.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
        [self.textLabel.bottomAnchor constraintEqualToAnchor:self.bottomAnchor]
    ]];
}

- (void)setText:(NSString *)text {
    _text = text;
    [self updateAttributedText];
}

- (void)setEmojiConfig:(NSDictionary *)emojiConfig {
    _emojiConfig = emojiConfig;
    [self updateAttributedText];
}

- (void)setFont:(UIFont *)font {
    _font = font;
    self.textLabel.font = font;
    [self updateAttributedText];
}

- (void)setTextColor:(UIColor *)textColor {
    _textColor = textColor;
    self.textLabel.textColor = textColor;
    [self updateAttributedText];
}

- (void)setTextAlignment:(NSTextAlignment)textAlignment {
    _textAlignment = textAlignment;
    self.textLabel.textAlignment = textAlignment;
}

- (void)setNumberOfLines:(NSInteger)numberOfLines {
    _numberOfLines = numberOfLines;
    self.textLabel.numberOfLines = numberOfLines;
}

- (void)setLineBreakMode:(NSLineBreakMode)lineBreakMode {
    _lineBreakMode = lineBreakMode;
    self.textLabel.lineBreakMode = lineBreakMode;
}

- (void)updateAttributedText {
    if (!self.text || !self.emojiConfig) {
        self.textLabel.text = self.text;
        return;
    }
    
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] init];
    NSString *text = self.text;
    
    // 使用正则表达式查找emoji标记
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"\\[([a-zA-Z0-9_]+)\\]"
                                                                           options:0
                                                                             error:nil];
    
    NSArray<NSTextCheckingResult *> *matches = [regex matchesInString:text
                                                              options:0
                                                                range:NSMakeRange(0, text.length)];
    
    NSInteger lastLocation = 0;
    
    for (NSTextCheckingResult *match in matches) {
        // 添加emoji前的文本
        if (match.range.location > lastLocation) {
            NSString *beforeText = [text substringWithRange:NSMakeRange(lastLocation, match.range.location - lastLocation)];
            NSAttributedString *beforeAttr = [self createTextAttributedString:beforeText];
            [attributedString appendAttributedString:beforeAttr];
        }
        
        // 获取emoji名称
        NSString *emojiName = [text substringWithRange:[match rangeAtIndex:1]];
        
        // 创建emoji附件
        RNEmojiTextAttachment *attachment = [self createEmojiAttachment:emojiName];
        if (attachment) {
            NSAttributedString *emojiAttr = [NSAttributedString attributedStringWithAttachment:attachment];
            [attributedString appendAttributedString:emojiAttr];
        } else {
            // 如果找不到emoji，保留原始文本
            NSString *originalText = [text substringWithRange:match.range];
            NSAttributedString *originalAttr = [self createTextAttributedString:originalText];
            [attributedString appendAttributedString:originalAttr];
        }
        
        lastLocation = NSMaxRange(match.range);
    }
    
    // 添加剩余的文本
    if (lastLocation < text.length) {
        NSString *remainingText = [text substringFromIndex:lastLocation];
        NSAttributedString *remainingAttr = [self createTextAttributedString:remainingText];
        [attributedString appendAttributedString:remainingAttr];
    }
    
    self.textLabel.attributedText = attributedString;
}

- (NSAttributedString *)createTextAttributedString:(NSString *)text {
    UIFont *font = self.font ?: [UIFont systemFontOfSize:16];
    UIColor *textColor = self.textColor ?: [UIColor blackColor];
    
    NSDictionary *attributes = @{
        NSFontAttributeName: font,
        NSForegroundColorAttributeName: textColor
    };
    
    return [[NSAttributedString alloc] initWithString:text attributes:attributes];
}

- (RNEmojiTextAttachment *)createEmojiAttachment:(NSString *)emojiName {
    if (!self.emojiConfig || !self.emojiConfig[@"emojis"]) {
        return nil;
    }
    
    NSDictionary *emojis = self.emojiConfig[@"emojis"];
    NSDictionary *emojiInfo = emojis[emojiName];
    
    if (!emojiInfo) {
        return nil;
    }
    
    NSString *imageName = emojiInfo[@"image"];
    NSNumber *width = emojiInfo[@"width"];
    NSNumber *height = emojiInfo[@"height"];
    
    if (!imageName) {
        return nil;
    }
    
    RNEmojiTextAttachment *attachment = [[RNEmojiTextAttachment alloc] init];
    attachment.emojiName = emojiName;
    attachment.imageName = imageName;
    
    // 设置emoji尺寸，确保与字体大小成比例
    UIFont *font = self.font ?: [UIFont systemFontOfSize:16];
    CGFloat fontHeight = font.lineHeight;
    CGFloat emojiSize = fontHeight * 0.9; // 稍小于字体高度
    
    if (width && height) {
        CGFloat aspectRatio = width.floatValue / height.floatValue;
        attachment.bounds = CGRectMake(0, 0, emojiSize * aspectRatio, emojiSize);
    } else {
        attachment.bounds = CGRectMake(0, 0, emojiSize, emojiSize);
    }
    
    // 加载emoji图片
    [self loadEmojiImage:imageName forAttachment:attachment];
    
    return attachment;
}

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

- (UIImage *)defaultEmojiImage {
    // 创建一个简单的默认emoji图片
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(24, 24), NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    // 绘制圆形背景
    CGContextSetFillColorWithColor(context, [UIColor lightGrayColor].CGColor);
    CGContextFillEllipseInRect(context, CGRectMake(2, 2, 20, 20));
    
    // 绘制问号
    CGContextSetFillColorWithColor(context, [UIColor whiteColor].CGColor);
    UIFont *font = [UIFont boldSystemFontOfSize:14];
    NSString *text = @"?";
    NSDictionary *attributes = @{NSFontAttributeName: font, NSForegroundColorAttributeName: [UIColor whiteColor]};
    CGSize textSize = [text sizeWithAttributes:attributes];
    CGPoint textPoint = CGPointMake((24 - textSize.width) / 2, (24 - textSize.height) / 2);
    [text drawAtPoint:textPoint withAttributes:attributes];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}

@end

