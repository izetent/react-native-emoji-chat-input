import os
import json
import shutil

# 项目根目录
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..')

# Emoji图片源目录
EMOJI_SOURCE_DIR = os.path.join(PROJECT_ROOT, 'assets', 'emojis', 'emoji')

# Emoji配置文件路径
EMOJI_CONFIG_PATH = os.path.join(PROJECT_ROOT, 'assets', 'emojis', 'emoji-config.json')

# iOS资源目录
IOS_ASSETS_DIR = os.path.join(PROJECT_ROOT, 'ios', 'RNEmojiChatInput', 'Assets', 'emoji.bundle')

# Android资源目录
ANDROID_ASSETS_DIR = os.path.join(PROJECT_ROOT, 'android', 'src', 'main', 'assets', 'emoji')

def update_emojis():
    print("开始更新emoji资源...")

    # 确保目标目录存在
    os.makedirs(IOS_ASSETS_DIR, exist_ok=True)
    os.makedirs(ANDROID_ASSETS_DIR, exist_ok=True)

    # 读取emoji配置文件
    with open(EMOJI_CONFIG_PATH, 'r', encoding='utf-8') as f:
        emoji_config = json.load(f)

    # 清空旧的emoji图片
    for folder in [IOS_ASSETS_DIR, ANDROID_ASSETS_DIR]:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'无法删除 {file_path}. 原因: {e}')

    # 复制新的emoji图片并更新配置
    new_emojis = {}
    for filename in os.listdir(EMOJI_SOURCE_DIR):
        if filename.startswith('.'): # 忽略macOS的隐藏文件
            continue
        
        source_path = os.path.join(EMOJI_SOURCE_DIR, filename)
        
        # 复制到iOS和Android目录
        shutil.copy(source_path, IOS_ASSETS_DIR)
        shutil.copy(source_path, ANDROID_ASSETS_DIR)

        # 假设emoji名称是文件名（不含扩展名）
        emoji_name = os.path.splitext(filename)[0]
        new_emojis[emoji_name] = {
            "name": emoji_name,
            "image": filename,
            "width": 24, # 默认宽度
            "height": 24 # 默认高度
        }
    
    # 更新emoji配置文件的emojis部分
    emoji_config['emojis'] = new_emojis

    # 重新生成categories (可选，如果需要根据新的emojis自动分类)
    # 这里简单地将所有新emoji放入一个'all'类别
    emoji_config['categories'] = {"all": list(new_emojis.keys())}

    # 写回配置文件
    with open(EMOJI_CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(emoji_config, f, indent=2, ensure_ascii=False)

    print("Emoji资源更新完成！")

if __name__ == "__main__":
    update_emojis()


