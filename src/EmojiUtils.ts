import type { EmojiConfig, EmojiChatInputConfig } from './types';
import { EmojiConfigManager } from './EmojiConfigManager';

/**
 * Emoji工具类，提供便捷的emoji操作方法
 */
export class EmojiUtils {
  /**
   * 从配置中获取所有emoji的映射关系数组
   * @param config emoji配置对象
   * @returns 包含所有emoji信息的数组
   */
  static getAllEmojis(config: EmojiChatInputConfig): EmojiConfig[] {
    return EmojiConfigManager.getAllEmojisFromConfig(config);
  }

  /**
   * 根据分类获取emoji列表
   * @param config emoji配置对象
   * @param categoryName 分类名称
   * @returns 该分类下的emoji数组
   */
  static getEmojisByCategory(config: EmojiChatInputConfig, categoryName: string): EmojiConfig[] {
    return EmojiConfigManager.getEmojisByCategoryFromConfig(config, categoryName);
  }

  /**
   * 获取所有分类信息
   * @param config emoji配置对象
   * @returns 分类信息对象
   */
  static getCategories(config: EmojiChatInputConfig): { [categoryName: string]: string[] } {
    return EmojiConfigManager.getCategoriesFromConfig(config);
  }

  /**
   * 搜索emoji
   * @param config emoji配置对象
   * @param query 搜索关键词
   * @returns 匹配的emoji数组
   */
  static searchEmojis(config: EmojiChatInputConfig, query: string): EmojiConfig[] {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: EmojiConfig[] = [];

    Object.values(config.emojis).forEach(emoji => {
      if (
        emoji.name.toLowerCase().includes(searchTerm) ||
        emoji.description.toLowerCase().includes(searchTerm)
      ) {
        results.push(emoji);
      }
    });

    return results;
  }

  /**
   * 根据名称获取emoji
   * @param config emoji配置对象
   * @param name emoji名称
   * @returns emoji配置对象或null
   */
  static getEmojiByName(config: EmojiChatInputConfig, name: string): EmojiConfig | null {
    return config.emojis[name] || null;
  }

  /**
   * 验证emoji名称是否存在
   * @param config emoji配置对象
   * @param name emoji名称
   * @returns 是否存在
   */
  static validateEmojiName(config: EmojiChatInputConfig, name: string): boolean {
    return name in config.emojis;
  }

  /**
   * 将文本中的emoji标记转换为emoji名称数组
   * @param text 包含emoji标记的文本
   * @returns emoji名称数组
   */
  static extractEmojiNames(text: string): string[] {
    const emojiPattern = /\[([a-zA-Z0-9_]+)\]/g;
    const matches = text.match(emojiPattern);
    if (!matches) {
      return [];
    }
    
    return matches.map(match => match.slice(1, -1)); // 移除方括号
  }

  /**
   * 将文本中的emoji标记替换为纯文本
   * @param text 包含emoji标记的文本
   * @param replacement 替换文本，默认为空字符串
   * @returns 处理后的文本
   */
  static removeEmojiMarkers(text: string, replacement: string = ''): string {
    const emojiPattern = /\[([a-zA-Z0-9_]+)\]/g;
    return text.replace(emojiPattern, replacement);
  }

  /**
   * 统计文本中emoji的数量
   * @param text 包含emoji标记的文本
   * @returns emoji数量
   */
  static countEmojis(text: string): number {
    const emojiNames = this.extractEmojiNames(text);
    return emojiNames.length;
  }

  /**
   * 获取文本的纯文本长度（不包括emoji标记）
   * @param text 包含emoji标记的文本
   * @returns 纯文本长度
   */
  static getPlainTextLength(text: string): number {
    const plainText = this.removeEmojiMarkers(text);
    return plainText.length;
  }

  /**
   * 格式化emoji配置为显示用的数据结构
   * @param config emoji配置对象
   * @returns 格式化后的数据结构
   */
  static formatEmojiConfigForDisplay(config: EmojiChatInputConfig): {
    categories: Array<{
      name: string;
      emojis: EmojiConfig[];
    }>;
    allEmojis: EmojiConfig[];
  } {
    const categories = Object.entries(config.categories).map(([name, emojiNames]) => ({
      name,
      emojis: emojiNames
        .map(emojiName => config.emojis[emojiName])
        .filter(emoji => emoji !== undefined),
    }));

    const allEmojis = Object.values(config.emojis);

    return {
      categories,
      allEmojis,
    };
  }

  /**
   * 创建emoji选择器数据
   * @param config emoji配置对象
   * @returns emoji选择器数据
   */
  static createEmojiPickerData(config: EmojiChatInputConfig): Array<{
    title: string;
    data: EmojiConfig[];
  }> {
    const pickerData: Array<{ title: string; data: EmojiConfig[] }> = [];

    // 添加分类数据
    Object.entries(config.categories).forEach(([categoryName, emojiNames]) => {
      const categoryEmojis = emojiNames
        .map(name => config.emojis[name])
        .filter(emoji => emoji !== undefined);
      
      if (categoryEmojis.length > 0) {
        pickerData.push({
          title: categoryName,
          data: categoryEmojis,
        });
      }
    });

    // 如果没有分类，添加所有emoji
    if (pickerData.length === 0) {
      pickerData.push({
        title: 'All',
        data: Object.values(config.emojis),
      });
    }

    return pickerData;
  }
}

