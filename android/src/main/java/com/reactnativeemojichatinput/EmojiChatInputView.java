package com.reactnativeemojichatinput;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.content.res.Resources;
import android.os.Build;
import android.text.Editable;
import android.text.SpannableStringBuilder;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.widget.EditText;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import java.lang.reflect.Field;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class EmojiChatInputView extends EditText {
    private JSONObject emojiConfig;
    private int maxLength = -1;
    private boolean multiline = true;
    private Pattern emojiPattern = Pattern.compile("\\[([a-zA-Z0-9_]+)\\]");
    private Map<String, AnimatedEmojiSpan> emojiSpanCache = new HashMap<>();

    public EmojiChatInputView(Context context) {
        super(context);
        init();
    }

    public EmojiChatInputView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public EmojiChatInputView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                processEmojiText();
                sendTextChangeEvent();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        setOnKeyListener((v, keyCode, event) -> {
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN) {
                if (!multiline) {
                    sendSubmitEvent();
                    return true;
                }
            }
            return false;
        });

        setOnFocusChangeListener((v, hasFocus) -> {
            if (hasFocus) {
                sendFocusEvent();
            } else {
                sendBlurEvent();
            }
        });
    }

    public void setEmojiConfig(String configJson) {
        try {
            this.emojiConfig = new JSONObject(configJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }

    public void setMultiline(boolean multiline) {
        this.multiline = multiline;
        if (!multiline) {
            setSingleLine(true);
        }
    }

    public void insertEmoji(String emojiName) {
        if (emojiConfig == null) return;

        try {
            JSONObject emojis = emojiConfig.getJSONObject("emojis");
            if (emojis.has(emojiName)) {
                JSONObject emoji = emojis.getJSONObject(emojiName);
                String emojiText = "[" + emojiName + "]";
                
                int start = getSelectionStart();
                int end = getSelectionEnd();
                
                Editable editable = getText();
                editable.replace(Math.min(start, end), Math.max(start, end), emojiText);
                
                sendEmojiInsertEvent(emojiName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void processEmojiText() {
        if (emojiConfig == null) return;

        try {
            SpannableStringBuilder builder = new SpannableStringBuilder(getText());
            Matcher matcher = emojiPattern.matcher(builder.toString());
            
            // 清除旧的emoji spans
            AnimatedEmojiSpan[] oldSpans = builder.getSpans(0, builder.length(), AnimatedEmojiSpan.class);
            for (AnimatedEmojiSpan span : oldSpans) {
                builder.removeSpan(span);
            }

            JSONObject emojis = emojiConfig.getJSONObject("emojis");
            
            while (matcher.find()) {
                String emojiName = matcher.group(1);
                if (emojis.has(emojiName)) {
                    JSONObject emoji = emojis.getJSONObject(emojiName);
                    String imagePath = emoji.getString("image");
                    int width = emoji.optInt("width", 24);
                    int height = emoji.optInt("height", 24);
                    
                    AnimatedEmojiSpan span = new AnimatedEmojiSpan(getContext(), emojiName, imagePath, width, height);
                    builder.setSpan(span, matcher.start(), matcher.end(), SpannableStringBuilder.SPAN_EXCLUSIVE_EXCLUSIVE);
                }
            }
            
            setText(builder);
            setSelection(builder.length());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getPlainText() {
        String text = getText().toString();
        return emojiPattern.matcher(text).replaceAll("");
    }

    private void sendTextChangeEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("text", getText().toString());
        event.putString("plainText", getPlainText());
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onTextChange", event);
    }

    private void sendEmojiInsertEvent(String emojiName) {
        WritableMap event = Arguments.createMap();
        event.putString("emojiName", emojiName);
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onEmojiInsert", event);
    }

    private void sendFocusEvent() {
        WritableMap event = Arguments.createMap();
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onFocus", event);
    }

    private void sendBlurEvent() {
        WritableMap event = Arguments.createMap();
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onBlur", event);
    }

    private void sendSubmitEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("text", getText().toString());
        event.putString("plainText", getPlainText());
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onSubmit", event);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        // 启动所有emoji动画
        startAllEmojiAnimations();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        // 停止所有emoji动画
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
    
    public void setCursorColor(int color) {
        try {
            // 设置光标颜色
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10及以上版本
                Drawable cursorDrawable = getTextCursorDrawable();
                if (cursorDrawable != null) {
                    cursorDrawable.setColorFilter(color, PorterDuff.Mode.SRC_IN);
                    setTextCursorDrawable(cursorDrawable);
                }
            } else {
                // 使用反射设置光标颜色（适用于较低版本）
                Field field = TextView.class.getDeclaredField("mCursorDrawableRes");
                field.setAccessible(true);
                int drawableResId = field.getInt(this);
                
                field = TextView.class.getDeclaredField("mEditor");
                field.setAccessible(true);
                Object editor = field.get(this);
                
                Class<?> clazz = editor.getClass();
                field = clazz.getDeclaredField("mCursorDrawable");
                field.setAccessible(true);
                
                Drawable[] drawables = new Drawable[2];
                Resources res = getContext().getResources();
                drawables[0] = res.getDrawable(drawableResId);
                drawables[1] = res.getDrawable(drawableResId);
                drawables[0].setColorFilter(color, PorterDuff.Mode.SRC_IN);
                drawables[1].setColorFilter(color, PorterDuff.Mode.SRC_IN);
                field.set(editor, drawables);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

