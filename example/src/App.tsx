import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  EmojiChatInput,
  EmojiTextView,
  EmojiUtils,
  defaultEmojiConfig,
  type EmojiChatInputRef,
  type EmojiConfig,
} from 'react-native-emoji-chat-input';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('Hello [smile] Welcome to emoji chat! [heart]');
  const [allEmojis, setAllEmojis] = useState<EmojiConfig[]>([]);
  const inputRef = useRef<EmojiChatInputRef>(null);

  React.useEffect(() => {
    // 获取所有emoji映射关系
    const emojis = EmojiUtils.getAllEmojis(defaultEmojiConfig);
    setAllEmojis(emojis);
  }, []);

  const handleTextChange = (event: { text: string }) => {
    setInputText(event.text);
  };

  const handleEmojiInsert = (event: { emojiName: string }) => {
    Alert.alert('Emoji Inserted', `Inserted: ${event.emojiName}`);
  };

  const handleSubmit = (event: { text: string }) => {
    setDisplayText(event.text);
    setInputText('');
    inputRef.current?.setText('');
  };

  const insertEmoji = (emojiName: string) => {
    inputRef.current?.insertEmoji(emojiName);
  };

  const clearInput = () => {
    setInputText('');
    inputRef.current?.setText('');
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const blurInput = () => {
    inputRef.current?.blur();
  };

  const renderEmojiPicker = () => {
    const categories = EmojiUtils.getCategories(defaultEmojiConfig);
    
    return (
      <View style={styles.emojiPicker}>
        <Text style={styles.sectionTitle}>Emoji Picker</Text>
        {Object.entries(categories).map(([categoryName, emojiNames]) => (
          <View key={categoryName} style={styles.emojiCategory}>
            <Text style={styles.categoryTitle}>{categoryName.toUpperCase()}</Text>
            <View style={styles.emojiRow}>
              {emojiNames.map((emojiName) => {
                const emoji = EmojiUtils.getEmojiByName(defaultEmojiConfig, emojiName);
                return emoji ? (
                  <TouchableOpacity
                    key={emojiName}
                    style={styles.emojiButton}
                    onPress={() => insertEmoji(emojiName)}
                  >
                    <Text style={styles.emojiButtonText}>[{emojiName}]</Text>
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>React Native Emoji Chat Input</Text>
          <Text style={styles.subtitle}>Demo Application</Text>
        </View>

        {/* Display Text Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Text (EmojiTextView)</Text>
          <View style={styles.displayContainer}>
            <EmojiTextView
              style={styles.displayText}
              text={displayText}
              emojiConfig={defaultEmojiConfig}
              fontSize={16}
              color="#333"
              numberOfLines={0}
            />
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Input (EmojiChatInput)</Text>
          <EmojiChatInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type your message with emojis..."
            placeholderColor="#999"
            emojiConfig={defaultEmojiConfig}
            cursorColor="#007AFF"
            multiline={true}
            maxLength={500}
            onTextChange={handleTextChange}
            onEmojiInsert={handleEmojiInsert}
            onSubmit={handleSubmit}
            onFocus={() => console.log('Input focused')}
            onBlur={() => console.log('Input blurred')}
          />
          <Text style={styles.inputInfo}>
            Current text: {inputText}
          </Text>
          <Text style={styles.inputInfo}>
            Plain text length: {EmojiUtils.getPlainTextLength(inputText)}
          </Text>
          <Text style={styles.inputInfo}>
            Emoji count: {EmojiUtils.countEmojis(inputText)}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={clearInput}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={focusInput}>
              <Text style={styles.buttonText}>Focus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blurInput}>
              <Text style={styles.buttonText}>Blur</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emoji Picker */}
        {renderEmojiPicker()}

        {/* Emoji List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Available Emojis ({allEmojis.length})</Text>
          <View style={styles.emojiList}>
            {allEmojis.map((emoji) => (
              <View key={emoji.name} style={styles.emojiItem}>
                <Text style={styles.emojiName}>{emoji.name}</Text>
                <Text style={styles.emojiDescription}>{emoji.description}</Text>
                <Text style={styles.emojiSize}>
                  {emoji.width}x{emoji.height}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features Demonstrated</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ Text and emoji mixed input</Text>
            <Text style={styles.featureItem}>✅ Custom cursor color</Text>
            <Text style={styles.featureItem}>✅ Emoji display consistency (iOS/Android)</Text>
            <Text style={styles.featureItem}>✅ Emoji mapping relationship access</Text>
            <Text style={styles.featureItem}>✅ Native text display component</Text>
            <Text style={styles.featureItem}>✅ Baseline alignment optimization</Text>
            <Text style={styles.featureItem}>✅ Animated emoji support</Text>
            <Text style={styles.featureItem}>✅ TypeScript support</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  displayContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  displayText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: '#fff',
  },
  inputInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emojiPicker: {
    marginBottom: 16,
  },
  emojiCategory: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emojiButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  emojiButtonText: {
    fontSize: 12,
    color: '#495057',
  },
  emojiList: {
    maxHeight: 200,
  },
  emojiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emojiName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  emojiDescription: {
    fontSize: 12,
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  emojiSize: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    textAlign: 'right',
  },
  featuresList: {
    paddingLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default App;

