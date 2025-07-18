package com.reactnativeemojichatinput;

import android.graphics.Color;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class EmojiTextViewManager extends SimpleViewManager<EmojiTextView> {
    public static final String REACT_CLASS = "RNEmojiTextView";

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public EmojiTextView createViewInstance(@NonNull ThemedReactContext context) {
        return new EmojiTextView(context);
    }

    @ReactProp(name = "text")
    public void setText(EmojiTextView view, @Nullable String text) {
        view.setTextContent(text);
    }

    @ReactProp(name = "emojiConfig")
    public void setEmojiConfig(EmojiTextView view, @Nullable ReadableMap config) {
        if (config != null) {
            try {
                String configJson = config.toString();
                view.setEmojiConfig(configJson);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(EmojiTextView view, float fontSize) {
        view.setTextSize(TypedValue.COMPLEX_UNIT_SP, fontSize);
    }

    @ReactProp(name = "color", customType = "Color")
    public void setColor(EmojiTextView view, @Nullable Integer color) {
        if (color != null) {
            view.setTextColor(color);
        }
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(EmojiTextView view, @Nullable String fontWeight) {
        int typefaceStyle = Typeface.NORMAL;
        if ("bold".equals(fontWeight)) {
            typefaceStyle = Typeface.BOLD;
        } else if ("italic".equals(fontWeight)) {
            typefaceStyle = Typeface.ITALIC;
        }
        view.setTypeface(view.getTypeface(), typefaceStyle);
    }

    @ReactProp(name = "textAlign")
    public void setTextAlign(EmojiTextView view, @Nullable String textAlign) {
        int gravity = Gravity.START;
        if ("center".equals(textAlign)) {
            gravity = Gravity.CENTER_HORIZONTAL;
        } else if ("right".equals(textAlign)) {
            gravity = Gravity.END;
        } else if ("left".equals(textAlign)) {
            gravity = Gravity.START;
        }
        view.setGravity(gravity);
    }

    @ReactProp(name = "numberOfLines")
    public void setNumberOfLines(EmojiTextView view, int numberOfLines) {
        if (numberOfLines == 1) {
            view.setSingleLine(true);
            view.setEllipsize(TextUtils.TruncateAt.END);
        } else {
            view.setSingleLine(false);
            view.setMaxLines(numberOfLines > 0 ? numberOfLines : Integer.MAX_VALUE);
        }
    }

    @ReactProp(name = "ellipsizeMode")
    public void setEllipsizeMode(EmojiTextView view, @Nullable String ellipsizeMode) {
        if ("head".equals(ellipsizeMode)) {
            view.setEllipsize(TextUtils.TruncateAt.START);
        } else if ("middle".equals(ellipsizeMode)) {
            view.setEllipsize(TextUtils.TruncateAt.MIDDLE);
        } else if ("tail".equals(ellipsizeMode)) {
            view.setEllipsize(TextUtils.TruncateAt.END);
        } else if ("clip".equals(ellipsizeMode)) {
            view.setEllipsize(null);
        }
    }
}

