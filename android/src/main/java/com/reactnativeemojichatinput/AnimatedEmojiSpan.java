package com.reactnativeemojichatinput;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.text.style.ReplacementSpan;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import pl.droidsonroids.gif.GifDrawable;
import java.io.IOException;

public class AnimatedEmojiSpan extends ReplacementSpan {
    private Context context;
    private String emojiName;
    private String imagePath;
    private int width;
    private int height;
    private Drawable drawable;
    private boolean isLoaded = false;
    private boolean isAnimated = false;

    public AnimatedEmojiSpan(Context context, String emojiName, String imagePath, int width, int height) {
        this.context = context;
        this.emojiName = emojiName;
        this.imagePath = imagePath;
        this.width = width;
        this.height = height;
        loadImage();
    }

    private void loadImage() {
        try {
            // 检查文件扩展名以确定是否为动画格式
            String extension = getFileExtension(imagePath).toLowerCase();
            
            if (extension.equals("gif") || extension.equals("webp")) {
                // 尝试加载动画图片
                loadAnimatedImage();
            } else {
                // 加载静态图片
                loadStaticImage();
            }
        } catch (Exception e) {
            e.printStackTrace();
            loadDefaultImage();
        }
    }
    
    private void loadAnimatedImage() {
        try {
            String assetPath = "emoji/" + imagePath;
            GifDrawable gifDrawable = new GifDrawable(context.getAssets(), assetPath);
            gifDrawable.setBounds(0, 0, width, height);
            this.drawable = gifDrawable;
            this.isLoaded = true;
            this.isAnimated = true;
        } catch (IOException e) {
            // 如果GIF加载失败，尝试用Glide加载
            loadStaticImage();
        }
    }
    
    private void loadStaticImage() {
        Glide.with(context)
            .asDrawable()
            .load("file:///android_asset/emoji/" + imagePath)
            .into(new CustomTarget<Drawable>() {
                @Override
                public void onResourceReady(@NonNull Drawable resource, @Nullable Transition<? super Drawable> transition) {
                    resource.setBounds(0, 0, width, height);
                    drawable = resource;
                    isLoaded = true;
                    isAnimated = false;
                }

                @Override
                public void onLoadCleared(@Nullable Drawable placeholder) {
                    // 清理资源
                }
            });
    }
    
    private void loadDefaultImage() {
        // 创建默认的emoji图片
        // 这里可以创建一个简单的占位符
        isLoaded = true;
        isAnimated = false;
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }

    @Override
    public int getSize(@NonNull Paint paint, CharSequence text, int start, int end, @Nullable Paint.FontMetricsInt fm) {
        if (fm != null) {
            // 获取字体度量信息
            Paint.FontMetricsInt paintFm = paint.getFontMetricsInt();
            
            // 计算字体的基线信息
            int fontHeight = paintFm.descent - paintFm.ascent;
            int baseline = -paintFm.ascent;
            
            // 确保emoji尺寸与字体高度成比例
            int adjustedHeight = (int) (fontHeight * 0.9f);
            int adjustedWidth = (int) (width * ((float) adjustedHeight / height));
            
            // 更新drawable的bounds
            if (drawable != null) {
                drawable.setBounds(0, 0, adjustedWidth, adjustedHeight);
            }
            
            // 计算垂直居中对齐
            int emojiTop = baseline - adjustedHeight / 2 - (paintFm.descent - paintFm.ascent) / 4;
            int emojiBottom = emojiTop + adjustedHeight;
            
            // 设置字体度量以确保行高正确
            fm.ascent = Math.min(paintFm.ascent, emojiTop);
            fm.descent = Math.max(paintFm.descent, emojiBottom);
            fm.top = fm.ascent;
            fm.bottom = fm.descent;
            
            return adjustedWidth;
        }
        return width;
    }

    @Override
    public void draw(@NonNull Canvas canvas, CharSequence text, int start, int end, float x, int top, int y, int bottom, @NonNull Paint paint) {
        if (drawable != null && isLoaded) {
            canvas.save();
            
            // 获取字体度量信息
            Paint.FontMetricsInt fm = paint.getFontMetricsInt();
            int fontHeight = fm.descent - fm.ascent;
            int baseline = y;
            
            // 计算emoji的实际尺寸
            int adjustedHeight = (int) (fontHeight * 0.9f);
            int adjustedWidth = (int) (width * ((float) adjustedHeight / height));
            
            // 计算垂直居中位置，确保与文字基线对齐
            int drawY = baseline - adjustedHeight / 2 - (fm.descent - fm.ascent) / 4;
            
            // 更新drawable bounds并绘制
            drawable.setBounds(0, 0, adjustedWidth, adjustedHeight);
            canvas.translate(x, drawY);
            drawable.draw(canvas);
            canvas.restore();
        }
    }

    public String getEmojiName() {
        return emojiName;
    }
    
    public boolean isAnimated() {
        return isAnimated;
    }

    public void startAnimation() {
        if (drawable instanceof GifDrawable) {
            ((GifDrawable) drawable).start();
        }
    }

    public void stopAnimation() {
        if (drawable instanceof GifDrawable) {
            ((GifDrawable) drawable).stop();
        }
    }
    
    public void pauseAnimation() {
        if (drawable instanceof GifDrawable) {
            ((GifDrawable) drawable).pause();
        }
    }
    
    public void resumeAnimation() {
        if (drawable instanceof GifDrawable) {
            ((GifDrawable) drawable).start();
        }
    }
}

