#import "RNEmojiTextAttachment.h"
#import <SDWebImage/SDAnimatedImageView.h>

@implementation RNEmojiTextAttachment

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化默认属性
    }
    return self;
}

- (CGRect)attachmentBoundsForTextContainer:(NSTextContainer *)textContainer
                      proposedLineFragment:(CGRect)lineFrag
                             glyphPosition:(CGPoint)position
                            characterIndex:(NSUInteger)charIndex {
    // 获取字体信息以确保emoji与文字基线对齐
    UIFont *font = textContainer.layoutManager.textStorage.font;
    if (!font) {
        font = [UIFont systemFontOfSize:16]; // 默认字体
    }
    
    CGFloat fontHeight = font.lineHeight;
    CGFloat fontAscender = font.ascender;
    CGFloat fontDescender = font.descender;
    
    // 计算emoji的尺寸
    CGSize emojiSize = self.bounds.size;
    if (CGSizeEqualToSize(emojiSize, CGSizeZero)) {
        emojiSize = CGSizeMake(fontHeight * 0.9, fontHeight * 0.9); // 稍小于字体高度
    }
    
    // 计算垂直偏移以确保基线对齐
    CGFloat yOffset = fontDescender + (fontHeight - emojiSize.height) / 2;
    
    return CGRectMake(0, yOffset, emojiSize.width, emojiSize.height);
}

- (UIImage *)imageForBounds:(CGRect)imageBounds
             textContainer:(NSTextContainer *)textContainer
            characterIndex:(NSUInteger)charIndex {
    // 如果有动画图片，返回当前帧
    if (self.animatedImage) {
        return self.animatedImage.posterImage ?: [self.animatedImage animatedImageFrameAtIndex:0];
    }
    
    // 否则返回静态图片
    return self.image;
}

@end

