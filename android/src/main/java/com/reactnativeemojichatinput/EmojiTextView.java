package com.reactnativeemojichatinput;

import android.content.Context;
import android.graphics.Color;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.util.AttributeSet;
import android.util.TypedValue;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatTextView;
import org.json.JSONObject;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmojiTextView extends AppCompatTextView {
    private JSONObject emojiConfig;
    private String textContent;
    private Pattern emojiPattern = Pattern.compile("\\[([a-zA-Z0-9_]+)\\]");

    public EmojiTextView(Context context) {
        super(context);
        init();
    }

    public EmojiTextView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public EmojiTextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        // 设置默认属性
        setTextColor(Color.BLACK);
        setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
    }

    public void setTextContent(String text) {
        this.textContent = text;
        updateText();
    }

    public void setEmojiConfig(String configJson) {
        try {
            this.emojiConfig = new JSONObject(configJson);
            updateText();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void updateText() {
        if (textContent == null || emojiConfig == null) {
            setText(textContent);
            return;
        }

        try {
            SpannableStringBuilder builder = new SpannableStringBuilder();
            Matcher matcher = emojiPattern.matcher(textContent);
            
            int lastEnd = 0;
            JSONObject emojis = emojiConfig.getJSONObject("emojis");
            
            while (matcher.find()) {
                // 添加emoji前的文本
                if (matcher.start() > lastEnd) {
                    String beforeText = textContent.substring(lastEnd, matcher.start());
                    builder.append(beforeText);
                }
                
                String emojiName = matcher.group(1);
                if (emojis.has(emojiName)) {
                    JSONObject emoji = emojis.getJSONObject(emojiName);
                    String imagePath = emoji.getString("image");
                    int width = emoji.optInt("width", 24);
                    int height = emoji.optInt("height", 24);
                    
                    // 创建emoji span
                    AnimatedEmojiSpan span = new AnimatedEmojiSpan(getContext(), emojiName, imagePath, width, height);
                    
                    // 添加emoji占位符文本
                    int spanStart = builder.length();
                    builder.append("[" + emojiName + "]");
                    int spanEnd = builder.length();
                    
                    // 设置span
                    builder.setSpan(span, spanStart, spanEnd, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                } else {
                    // 如果找不到emoji，保留原始文本
                    builder.append(matcher.group(0));
                }
                
                lastEnd = matcher.end();
            }
            
            // 添加剩余文本
            if (lastEnd < textContent.length()) {
                builder.append(textContent.substring(lastEnd));
            }
            
            setText(builder);
        } catch (Exception e) {
            e.printStackTrace();
            setText(textContent);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        startAllEmojiAnimations();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        stopAllEmojiAnimations();
    }

    @Override
    protected void onWindowVisibilityChanged(int visibility) {
        super.onWindowVisibilityChanged(visibility);
        if (visibility == VISIBLE) {
            resumeAllEmojiAnimations();
        } else {
            pauseAllEmojiAnimations();
        }
    }

    private void startAllEmojiAnimations() {
        if (getText() instanceof SpannableStringBuilder) {
            SpannableStringBuilder builder = (SpannableStringBuilder) getText();
            AnimatedEmojiSpan[] spans = builder.getSpans(0, builder.length(), AnimatedEmojiSpan.class);
            for (AnimatedEmojiSpan span : spans) {
                span.startAnimation();
            }
        }
    }

    private void stopAllEmojiAnimations() {
        if (getText() instanceof SpannableStringBuilder) {
            SpannableStringBuilder builder = (SpannableStringBuilder) getText();
            AnimatedEmojiSpan[] spans = builder.getSpans(0, builder.length(), AnimatedEmojiSpan.class);
            for (AnimatedEmojiSpan span : spans) {
                span.stopAnimation();
            }
        }
    }
    
    private void pauseAllEmojiAnimations() {
        if (getText() instanceof SpannableStringBuilder) {
            SpannableStringBuilder builder = (SpannableStringBuilder) getText();
            AnimatedEmojiSpan[] spans = builder.getSpans(0, builder.length(), AnimatedEmojiSpan.class);
            for (AnimatedEmojiSpan span : spans) {
                span.pauseAnimation();
            }
        }
    }
    
    private void resumeAllEmojiAnimations() {
        if (getText() instanceof SpannableStringBuilder) {
            SpannableStringBuilder builder = (SpannableStringBuilder) getText();
            AnimatedEmojiSpan[] spans = builder.getSpans(0, builder.length(), AnimatedEmojiSpan.class);
            for (AnimatedEmojiSpan span : spans) {
                span.resumeAnimation();
            }
        }
    }

    public String getPlainText() {
        if (textContent == null) {
            return "";
        }
        return emojiPattern.matcher(textContent).replaceAll("");
    }
}

