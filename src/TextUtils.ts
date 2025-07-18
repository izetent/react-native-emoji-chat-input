import type { EmojiConfig } from './types';

export interface TextSegment {
  type: 'text' | 'emoji';
  content: string;
  emoji?: EmojiConfig;
}

export class TextUtils {
  /**
   * 解析包含emoji的文本，返回文本段落数组
   * @param text 包含emoji标记的文本，如 "Hello [smile] world [heart]"
   * @param emojiMap emoji配置映射
   * @returns 解析后的文本段落数组
   */
  static parseText(text: string, emojiMap: { [key: string]: EmojiConfig }): TextSegment[] {
    const segments: TextSegment[] = [];
    const emojiRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = emojiRegex.exec(text)) !== null) {
      // 添加emoji前的文本
      if (match.index > lastIndex) {
        const textContent = text.substring(lastIndex, match.index);
        if (textContent) {
          segments.push({
            type: 'text',
            content: textContent,
          });
        }
      }

      // 添加emoji
      const emojiName = match[1];
      const emojiConfig = emojiMap[emojiName];
      
      if (emojiConfig) {
        segments.push({
          type: 'emoji',
          content: match[0], // 保留原始标记
          emoji: emojiConfig,
        });
      } else {
        // 如果找不到emoji配置，当作普通文本处理
        segments.push({
          type: 'text',
          content: match[0],
        });
      }

      lastIndex = emojiRegex.lastIndex;
    }

    // 添加剩余的文本
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        segments.push({
          type: 'text',
          content: remainingText,
        });
      }
    }

    return segments;
  }

  /**
   * 将文本段落数组转换回文本字符串
   * @param segments 文本段落数组
   * @returns 文本字符串
   */
  static segmentsToText(segments: TextSegment[]): string {
    return segments.map(segment => segment.content).join('');
  }

  /**
   * 从文本中提取所有emoji名称
   * @param text 包含emoji标记的文本
   * @returns emoji名称数组
   */
  static extractEmojiNames(text: string): string[] {
    const emojiRegex = /\[([^\]]+)\]/g;
    const emojiNames: string[] = [];
    let match;

    while ((match = emojiRegex.exec(text)) !== null) {
      emojiNames.push(match[1]);
    }

    return emojiNames;
  }

  /**
   * 替换文本中的emoji标记
   * @param text 原始文本
   * @param replacements emoji替换映射
   * @returns 替换后的文本
   */
  static replaceEmojis(text: string, replacements: { [emojiName: string]: string }): string {
    const emojiRegex = /\[([^\]]+)\]/g;
    
    return text.replace(emojiRegex, (match, emojiName) => {
      return replacements[emojiName] || match;
    });
  }

  /**
   * 计算文本的显示长度（emoji按1个字符计算）
   * @param text 包含emoji标记的文本
   * @returns 显示长度
   */
  static getDisplayLength(text: string): number {
    const segments = this.parseText(text, {});
    return segments.reduce((length, segment) => {
      if (segment.type === 'emoji') {
        return length + 1; // emoji按1个字符计算
      } else {
        return length + segment.content.length;
      }
    }, 0);
  }

  /**
   * 截取指定长度的文本（考虑emoji）
   * @param text 原始文本
   * @param maxLength 最大长度
   * @param emojiMap emoji配置映射
   * @returns 截取后的文本
   */
  static truncateText(text: string, maxLength: number, emojiMap: { [key: string]: EmojiConfig }): string {
    const segments = this.parseText(text, emojiMap);
    let currentLength = 0;
    const resultSegments: TextSegment[] = [];

    for (const segment of segments) {
      if (segment.type === 'emoji') {
        if (currentLength + 1 <= maxLength) {
          resultSegments.push(segment);
          currentLength += 1;
        } else {
          break;
        }
      } else {
        const remainingLength = maxLength - currentLength;
        if (remainingLength <= 0) {
          break;
        }

        if (segment.content.length <= remainingLength) {
          resultSegments.push(segment);
          currentLength += segment.content.length;
        } else {
          resultSegments.push({
            type: 'text',
            content: segment.content.substring(0, remainingLength),
          });
          break;
        }
      }
    }

    return this.segmentsToText(resultSegments);
  }

  /**
   * 验证文本格式是否正确
   * @param text 文本内容
   * @returns 是否有效
   */
  static validateTextFormat(text: string): boolean {
    // 检查emoji标记是否正确配对
    const openBrackets = (text.match(/\[/g) || []).length;
    const closeBrackets = (text.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      return false;
    }

    // 检查是否有嵌套的emoji标记
    const emojiRegex = /\[([^\]]+)\]/g;
    let match;
    
    while ((match = emojiRegex.exec(text)) !== null) {
      const emojiContent = match[1];
      if (emojiContent.includes('[') || emojiContent.includes(']')) {
        return false;
      }
    }

    return true;
  }

  /**
   * 清理文本中的无效emoji标记
   * @param text 原始文本
   * @param validEmojiNames 有效的emoji名称集合
   * @returns 清理后的文本
   */
  static cleanInvalidEmojis(text: string, validEmojiNames: Set<string>): string {
    const emojiRegex = /\[([^\]]+)\]/g;
    
    return text.replace(emojiRegex, (match, emojiName) => {
      if (validEmojiNames.has(emojiName)) {
        return match; // 保留有效的emoji
      } else {
        return emojiName; // 移除标记，保留名称
      }
    });
  }
}

