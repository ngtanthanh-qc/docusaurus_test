"""
Auto-translate Docusaurus documentation using Google Translate
Requirements: pip install googletrans==4.0.0-rc1 pyyaml
"""

import os
import json
import shutil
from pathlib import Path
from googletrans import Translator
import time
import yaml

# Initialize translator
translator = Translator()

# Configuration
SUPPORTED_LOCALES = ['vi', 'zh-CN', 'ja', 'ko', 'es', 'fr']
SOURCE_LOCALE = 'en'
PROJECT_ROOT = Path(__file__).parent.parent
DOCS_PATH = PROJECT_ROOT / 'docs'
I18N_PATH = PROJECT_ROOT / 'i18n'

# Language mapping for Google Translate
LANG_MAP = {
    'vi': 'vi',
    'zh-CN': 'zh-cn',
    'ja': 'ja',
    'ko': 'ko',
    'es': 'es',
    'fr': 'fr'
}

def translate_text(text, target_lang, max_retries=3):
    """Translate text with retry logic"""
    if not text or text.strip() == '':
        return text
    
    # Don't translate code blocks
    if text.strip().startswith('```') or text.strip().startswith('`'):
        return text
    
    for attempt in range(max_retries):
        try:
            result = translator.translate(text, dest=LANG_MAP[target_lang])
            time.sleep(0.5)  # Rate limiting
            return result.text
        except Exception as e:
            print(f"Translation error (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                return text  # Return original if translation fails
    
    return text

def translate_json_file(source_file, target_file, target_lang):
    """Translate JSON translation files"""
    print(f"Translating JSON: {source_file} -> {target_file}")
    
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    translated_data = {}
    for key, value in data.items():
        if isinstance(value, dict) and 'message' in value:
            translated_message = translate_text(value['message'], target_lang)
            translated_data[key] = {
                'message': translated_message,
                'description': value.get('description', '')
            }
        else:
            translated_data[key] = value
    
    # Create directory if not exists
    target_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Saved: {target_file}")

def translate_markdown_file(source_file, target_file, target_lang):
    """Translate Markdown files preserving structure"""
    print(f"Translating Markdown: {source_file} -> {target_file}")
    
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content into lines for better preservation
    lines = content.split('\n')
    translated_lines = []
    
    in_code_block = False
    
    for line in lines:
        # Skip code blocks
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            translated_lines.append(line)
            continue
        
        if in_code_block:
            translated_lines.append(line)
            continue
        
        # Skip empty lines
        if not line.strip():
            translated_lines.append(line)
            continue
        
        # Skip front matter
        if line.strip().startswith('---'):
            translated_lines.append(line)
            continue
        
        # Translate the line
        translated_line = translate_text(line, target_lang)
        translated_lines.append(translated_line)
    
    # Create directory if not exists
    target_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(translated_lines))
    
    print(f"✓ Saved: {target_file}")

def copy_and_translate_docs(target_lang):
    """Copy and translate all documentation files"""
    print(f"\n🌍 Translating documentation to {target_lang}...")
    
    target_docs_path = I18N_PATH / target_lang / 'docusaurus-plugin-content-docs' / 'current'
    
    # Walk through all docs
    for root, dirs, files in os.walk(DOCS_PATH):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                source_file = Path(root) / file
                relative_path = source_file.relative_to(DOCS_PATH)
                target_file = target_docs_path / relative_path
                
                # Skip if already translated
                if target_file.exists():
                    print(f"⚠ Skipping (already exists): {target_file}")
                    continue
                
                translate_markdown_file(source_file, target_file, target_lang)

def translate_theme_files(target_lang):
    """Translate theme JSON files"""
    print(f"\n🎨 Translating theme files to {target_lang}...")
    
    # Common theme files to translate
    theme_files = [
        'docusaurus-theme-classic/navbar.json',
        'docusaurus-theme-classic/footer.json',
        'docusaurus-plugin-content-blog/options.json',
    ]
    
    for theme_file in theme_files:
        source_file = I18N_PATH / SOURCE_LOCALE / theme_file
        target_file = I18N_PATH / target_lang / theme_file
        
        if not source_file.exists():
            # Try to find in target language folder (auto-generated)
            if target_file.exists():
                print(f"⚠ Using existing file for translation: {target_file}")
                # Translate in-place
                translate_json_file(target_file, target_file, target_lang)
            continue
        
        if target_file.exists():
            print(f"⚠ Skipping (already exists): {target_file}")
            continue
        
        translate_json_file(source_file, target_file, target_lang)

def main():
    """Main translation process"""
    import sys
    import os
    
    # Fix encoding for Windows
    if sys.platform == 'win32':
        os.system('chcp 65001 > nul')
    
    print("🚀 Docusaurus Auto-Translation Script")
    print("=" * 50)
    
    # Let user choose languages
    print("\nAvailable languages:")
    for i, lang in enumerate(SUPPORTED_LOCALES, 1):
        print(f"{i}. {lang}")
    
    print("\nEnter language codes to translate (comma-separated, or 'all'):")
    choice = input("> ").strip()
    
    if choice.lower() == 'all':
        languages = SUPPORTED_LOCALES
    else:
        languages = [lang.strip() for lang in choice.split(',')]
        languages = [lang for lang in languages if lang in SUPPORTED_LOCALES]
    
    if not languages:
        print("❌ No valid languages selected!")
        return
    
    print(f"\n✓ Will translate to: {', '.join(languages)}")
    
    for lang in languages:
        print(f"\n{'='*50}")
        print(f"Processing: {lang}")
        print('='*50)
        
        # Translate documentation
        copy_and_translate_docs(lang)
        
        # Translate theme files
        translate_theme_files(lang)
    
    print("\n✅ Translation complete!")
    print("\n📝 Next steps:")
    print("1. Review translations for quality")
    print("2. Fix any formatting issues")
    print("3. Run: npm start -- --locale [lang] to test")
    print("4. Consider using Crowdin for professional translations")

if __name__ == "__main__":
    main()