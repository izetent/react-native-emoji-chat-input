import type { EmojiChatInputConfig, EmojiConfig, EmojiConfigMap } from './types';

export class EmojiConfigManager {
  private config: EmojiChatInputConfig | null = null;

  constructor(config?: EmojiChatInputConfig) {
    if (config) {
      this.setConfig(config);
    }
  }

  setConfig(config: EmojiChatInputConfig): void {
    this.config = config;
  }

  getConfig(): EmojiChatInputConfig | null {
    return this.config;
  }

  getEmoji(name: string): EmojiConfig | null {
    if (!this.config) {
      return null;
    }
    return this.config.emojis[name] || null;
  }

  getAllEmojis(): EmojiConfigMap {
    if (!this.config) {
      return {};
    }
    return this.config.emojis;
  }

  getEmojisByCategory(category: string): EmojiConfig[] {
    if (!this.config || !this.config.categories[category]) {
      return [];
    }
    
    const emojiNames = this.config.categories[category];
    return emojiNames
      .map(name => this.config!.emojis[name])
      .filter(emoji => emoji !== undefined);
  }

  getAllCategories(): string[] {
    if (!this.config) {
      return [];
    }
    return Object.keys(this.config.categories);
  }

  validateEmojiName(name: string): boolean {
    if (!this.config) {
      return false;
    }
    return name in this.config.emojis;
  }

  getDefaultSize(): { width: number; height: number } {
    if (!this.config) {
      return { width: 24, height: 24 };
    }
    return this.config.settings.defaultSize;
  }

  getMaxSize(): { width: number; height: number } {
    if (!this.config) {
      return { width: 48, height: 48 };
    }
    return this.config.settings.maxSize;
  }

  getSupportedFormats(): string[] {
    if (!this.config) {
      return ['gif', 'png', 'jpg', 'webp'];
    }
    return this.config.settings.supportedFormats;
  }

  searchEmojis(query: string): EmojiConfig[] {
    if (!this.config || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: EmojiConfig[] = [];

    Object.values(this.config.emojis).forEach(emoji => {
      if (
        emoji.name.toLowerCase().includes(searchTerm) ||
        emoji.description.toLowerCase().includes(searchTerm)
      ) {
        results.push(emoji);
      }
    });

    return results;
  }

  static createDefaultConfig(): EmojiChatInputConfig {
    return {
      version: '1.0.0',
      emojis: {
        smile: {
          name: 'smile',
          image: 'smile.gif',
          width: 24,
          height: 24,
          description: 'Smiling face',
        },
        laugh: {
          name: 'laugh',
          image: 'laugh.gif',
          width: 24,
          height: 24,
          description: 'Laughing face',
        },
        heart: {
          name: 'heart',
          image: 'heart.gif',
          width: 24,
          height: 24,
          description: 'Red heart',
        },
        thumbs_up: {
          name: 'thumbs_up',
          image: 'thumbs_up.gif',
          width: 24,
          height: 24,
          description: 'Thumbs up',
        },
      },
      categories: {
        faces: ['smile', 'laugh'],
        gestures: ['thumbs_up'],
        objects: ['heart'],
      },
      settings: {
        defaultSize: {
          width: 24,
          height: 24,
        },
        maxSize: {
          width: 48,
          height: 48,
        },
        supportedFormats: ['gif', 'png', 'jpg', 'webp'],
      },
    };
  }

  static async loadConfigFromFile(filePath: string): Promise<EmojiChatInputConfig> {
    try {
      // 在实际应用中，这里应该从文件系统或网络加载配置
      // 这里提供一个示例实现
      const response = await fetch(filePath);
      const config = await response.json();
      return config as EmojiChatInputConfig;
    } catch (error) {
      console.warn('Failed to load emoji config from file:', error);
      return EmojiConfigManager.createDefaultConfig();
    }
  }

  static validateConfig(config: any): config is EmojiChatInputConfig {
    if (!config || typeof config !== 'object') {
      return false;
    }

    if (!config.version || typeof config.version !== 'string') {
      return false;
    }

    if (!config.emojis || typeof config.emojis !== 'object') {
      return false;
    }

    if (!config.categories || typeof config.categories !== 'object') {
      return false;
    }

    if (!config.settings || typeof config.settings !== 'object') {
      return false;
    }

    // 验证emojis结构
    for (const [key, emoji] of Object.entries(config.emojis)) {
      if (typeof emoji !== 'object' || !emoji) {
        return false;
      }
      
      const emojiObj = emoji as any;
      if (
        typeof emojiObj.name !== 'string' ||
        typeof emojiObj.image !== 'string' ||
        typeof emojiObj.width !== 'number' ||
        typeof emojiObj.height !== 'number' ||
        typeof emojiObj.description !== 'string'
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * 从默认配置获取所有emoji的映射关系数组
   * @returns 包含所有emoji信息的数组
   */
  static getAllEmojisFromDefault(): EmojiConfig[] {
    const defaultConfig = EmojiConfigManager.createDefaultConfig();
    return Object.values(defaultConfig.emojis);
  }

  /**
   * 从指定配置获取所有emoji的映射关系数组
   * @param config emoji配置对象
   * @returns 包含所有emoji信息的数组
   */
  static getAllEmojisFromConfig(config: EmojiChatInputConfig): EmojiConfig[] {
    return Object.values(config.emojis);
  }

  /**
   * 从指定配置根据分类获取emoji列表
   * @param config emoji配置对象
   * @param categoryName 分类名称
   * @returns 该分类下的emoji数组
   */
  static getEmojisByCategoryFromConfig(config: EmojiChatInputConfig, categoryName: string): EmojiConfig[] {
    const emojis: EmojiConfig[] = [];
    if (config.categories && config.categories[categoryName]) {
      const emojiNames = config.categories[categoryName];
      emojiNames.forEach(name => {
        if (config.emojis[name]) {
          emojis.push(config.emojis[name]);
        }
      });
    }
    return emojis;
  }

  /**
   * 从指定配置获取所有分类信息
   * @param config emoji配置对象
   * @returns 分类信息对象
   */
  static getCategoriesFromConfig(config: EmojiChatInputConfig): { [categoryName: string]: string[] } {
    return config.categories || {};
  }
}

