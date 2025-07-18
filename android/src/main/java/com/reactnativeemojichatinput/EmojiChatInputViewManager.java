package com.reactnativeemojichatinput;

import android.graphics.Color;
import android.graphics.Typeface;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.util.Map;

public class EmojiChatInputViewManager extends SimpleViewManager<EmojiChatInputView> {
    public static final String REACT_CLASS = "RNEmojiChatInput";
    private ReactApplicationContext reactContext;

    public EmojiChatInputViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public EmojiChatInputView createViewInstance(@NonNull ThemedReactContext context) {
        return new EmojiChatInputView(context);
    }

    @Override
    @Nullable
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onTextChange", MapBuilder.of("phasedRegistrationNames", 
                MapBuilder.of("bubbled", "onTextChange")))
            .put("onEmojiInsert", MapBuilder.of("phasedRegistrationNames", 
                MapBuilder.of("bubbled", "onEmojiInsert")))
            .put("onSubmit", MapBuilder.of("phasedRegistrationNames", 
                MapBuilder.of("bubbled", "onSubmit")))
            .build();
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(EmojiChatInputView view, @Nullable String placeholder) {
        view.setHint(placeholder);
    }

    @ReactProp(name = "placeholderColor", customType = "Color")
    public void setPlaceholderColor(EmojiChatInputView view, @Nullable Integer color) {
        if (color != null) {
            view.setHintTextColor(color);
        }
    }

    @ReactProp(name = "textColor", customType = "Color")
    public void setTextColor(EmojiChatInputView view, @Nullable Integer color) {
        if (color != null) {
            view.setTextColor(color);
        }
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(EmojiChatInputView view, float fontSize) {
        view.setTextSize(fontSize);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(EmojiChatInputView view, @Nullable String fontWeight) {
        int typefaceStyle = Typeface.NORMAL;
        if ("bold".equals(fontWeight)) {
            typefaceStyle = Typeface.BOLD;
        } else if ("italic".equals(fontWeight)) {
            typefaceStyle = Typeface.ITALIC;
        }
        view.setTypeface(view.getTypeface(), typefaceStyle);
    }

    @ReactProp(name = "maxLength")
    public void setMaxLength(EmojiChatInputView view, int maxLength) {
        view.setMaxLength(maxLength);
    }

    @ReactProp(name = "cursorColor", customType = "Color")
    public void setCursorColor(EmojiChatInputView view, @Nullable Integer color) {
        if (color != null) {
            view.setCursorColor(color);
        }
    }

    @ReactProp(name = "emojiConfig")
    public void setEmojiConfig(EmojiChatInputView view, @Nullable ReadableMap config) {
        if (config != null) {
            view.setEmojiConfig(config.toString());
        }
    }

    @ReactMethod
    public void insertEmoji(int reactTag, String emojiName) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            EmojiChatInputView view = (EmojiChatInputView) nativeViewHierarchyManager.resolveView(reactTag);
            if (view != null) {
                view.insertEmoji(emojiName);
            }
        });
    }

    @ReactMethod
    public void setText(int reactTag, String text) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            EmojiChatInputView view = (EmojiChatInputView) nativeViewHierarchyManager.resolveView(reactTag);
            if (view != null) {
                view.setText(text);
            }
        });
    }

    @ReactMethod
    public void getText(int reactTag, Promise promise) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            EmojiChatInputView view = (EmojiChatInputView) nativeViewHierarchyManager.resolveView(reactTag);
            if (view != null) {
                promise.resolve(view.getText().toString());
            } else {
                promise.reject("VIEW_NOT_FOUND", "View not found");
            }
        });
    }

    @ReactMethod
    public void focus(int reactTag) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            EmojiChatInputView view = (EmojiChatInputView) nativeViewHierarchyManager.resolveView(reactTag);
            if (view != null) {
                view.requestFocus();
            }
        });
    }

    @ReactMethod
    public void blur(int reactTag) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            EmojiChatInputView view = (EmojiChatInputView) nativeViewHierarchyManager.resolveView(reactTag);
            if (view != null) {
                view.clearFocus();
            }
        });
    }
}

