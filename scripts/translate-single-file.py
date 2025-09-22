"""
Auto-translate single Docusaurus file using Google Translate
Requirements: pip install googletrans==4.0.0-rc1
Usage: python translate-single-file.py <file_path> <target_language>
Example: python translate-single-file.py src/pages/about-me.mdx vi
"""

import os
import sys
import shutil
from pathlib import Path
from googletrans import Translator
import time

# Initialize translator
translator = Translator()

# Language mapping for Google Translate
LANG_MAP = {
    'vi': 'vi',
    'zh-CN': 'zh-cn', 
    'ja': 'ja',
    'ko': 'ko',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'pt': 'pt',
    'it': 'it',
    'ru': 'ru',
    'ar': 'ar',
    'th': 'th'
}

def translate_text(text, target_lang, max_retries=3):
    """Translate text with retry logic"""
    if not text or text.strip() == '':
        return text
    
    # Don't translate certain patterns
    skip_patterns = [
        '```',  # Code blocks
        '`',    # Inline code
        'https://',  # URLs
        'http://',   # URLs
        '![',   # Image markdown
        '[![', # Badge markdown
        '---',  # Front matter
        'style={{',  # JSX styles
        'import ',   # Imports
        'export '    # Exports
    ]
    
    for pattern in skip_patterns:
        if pattern in text:
            return text
    
    # Skip if mostly symbols/numbers
    if len([c for c in text if c.isalpha()]) < len(text) * 0.3:
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

def translate_mdx_file(source_file, target_lang, output_file=None, auto_i18n=True):
    """Translate MDX file preserving structure and React components"""
    print(f"Translating: {source_file} -> {target_lang}")
    
    if not os.path.exists(source_file):
        print(f"❌ File not found: {source_file}")
        return False
    
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content into lines for better preservation
    lines = content.split('\n')
    translated_lines = []
    
    in_code_block = False
    in_front_matter = False
    front_matter_count = 0
    in_jsx_block = False
    jsx_bracket_count = 0
    
    for i, line in enumerate(lines):
        original_line = line
        
        # Handle front matter (--- blocks)
        if line.strip() == '---':
            front_matter_count += 1
            if front_matter_count <= 2:
                in_front_matter = not in_front_matter
            translated_lines.append(line)
            continue
        
        if in_front_matter:
            # Only translate specific front matter fields
            if line.strip().startswith(('title:', 'description:')):
                key, value = line.split(':', 1)
                translated_value = translate_text(value.strip(), target_lang)
                translated_lines.append(f"{key}: {translated_value}")
            else:
                translated_lines.append(line)
            continue
        
        # Handle code blocks
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            translated_lines.append(line)
            continue
        
        if in_code_block:
            translated_lines.append(line)
            continue
        
        # Handle JSX blocks (basic detection)
        if '<div' in line or '</div>' in line or 'style={{' in line:
            in_jsx_block = True
        
        if in_jsx_block:
            # Count brackets to know when JSX block ends
            jsx_bracket_count += line.count('{') - line.count('}')
            
            # Don't translate JSX attributes, but translate content between tags
            if '>' in line and '</' in line and not 'style=' in line and not 'href=' in line:
                # This might be translatable content within JSX
                import re
                # Extract text between > and < 
                matches = re.findall(r'>([^<]+)<', line)
                translated_line = line
                for match in matches:
                    if match.strip() and not match.strip().startswith(('**', '*')):
                        translated_match = translate_text(match, target_lang)
                        translated_line = translated_line.replace(f'>{match}<', f'>{translated_match}<')
                translated_lines.append(translated_line)
            else:
                translated_lines.append(line)
            
            if jsx_bracket_count <= 0:
                in_jsx_block = False
                jsx_bracket_count = 0
            continue
        
        # Skip empty lines
        if not line.strip():
            translated_lines.append(line)
            continue
        
        # Skip lines with only markdown syntax
        if line.strip() in ['---', ':::info', ':::tip', ':::', ':::caution', ':::warning']:
            translated_lines.append(line)
            continue
        
        # Skip import/export statements
        if line.strip().startswith(('import ', 'export ')):
            translated_lines.append(line)
            continue
        
        # Skip comments
        if line.strip().startswith('<!--') or line.strip().startswith('//'):
            translated_lines.append(line)
            continue
        
        # Handle special markdown elements
        if line.strip().startswith(('[![', '![', '[', '#')):
            # These might contain translatable text
            # Handle headers
            if line.strip().startswith('#'):
                header_level = len(line) - len(line.lstrip('#'))
                header_text = line.lstrip('#').strip()
                if header_text:
                    translated_header = translate_text(header_text, target_lang)
                    translated_lines.append('#' * header_level + ' ' + translated_header)
                else:
                    translated_lines.append(line)
            else:
                # For other markdown, be more careful
                translated_lines.append(line)
            continue
        
        # Handle list items
        if line.strip().startswith(('- ', '* ', '1. ', '2. ', '3. ', '4. ', '5. ')):
            # Extract the prefix and translate the content
            stripped = line.lstrip()
            prefix = line[:len(line) - len(stripped)]
            
            if stripped.startswith('- **') or stripped.startswith('* **'):
                # Bold list item, be careful with markdown
                translated_lines.append(line)  # Skip for now
            else:
                # Regular list item
                marker_end = stripped.find(' ') + 1
                marker = stripped[:marker_end]
                content = stripped[marker_end:]
                if content and not content.startswith('**'):
                    translated_content = translate_text(content, target_lang)
                    translated_lines.append(prefix + marker + translated_content)
                else:
                    translated_lines.append(line)
            continue
        
        # Handle regular paragraphs
        if line.strip() and not any(char in line for char in ['`', '{', '}', '<', '>', '[', ']']):
            # This looks like regular text that can be translated
            leading_spaces = len(line) - len(line.lstrip())
            translated_text = translate_text(line.strip(), target_lang)
            translated_lines.append(' ' * leading_spaces + translated_text)
        else:
            # Keep original line if it contains special characters
            translated_lines.append(line)
    
    # Determine output file
    source_path = Path(source_file)
    project_root = source_path.parent.parent  # Assuming scripts is one level down
    
    # Check if source file is in src/pages (standalone page)
    is_page = 'src/pages' in str(source_path) or 'src\\pages' in str(source_path)
    
    if auto_i18n and target_lang:
        # Auto-map to i18n folder structure
        if is_page:
            # For pages, put in i18n/<lang>/docusaurus-plugin-content-pages
            i18n_dir = project_root / 'i18n' / target_lang / 'docusaurus-plugin-content-pages'
            # Get relative path from src/pages
            relative_path = source_path.relative_to(project_root / 'src' / 'pages')
            output_file = i18n_dir / relative_path
        else:
            # For docs, put in i18n/<lang>/docusaurus-plugin-content-docs/current
            i18n_dir = project_root / 'i18n' / target_lang / 'docusaurus-plugin-content-docs' / 'current'
            # Get relative path from docs folder
            if 'docs' in str(source_path):
                docs_folder = project_root / 'docs'
                relative_path = source_path.relative_to(docs_folder)
                output_file = i18n_dir / relative_path
            else:
                # Fallback: create in same directory with language suffix
                output_file = source_path.parent / f"{source_path.stem}-{target_lang}{source_path.suffix}"
    elif output_file is None:
        # No auto_i18n, use simple naming
        output_file = source_path.parent / f"{source_path.stem}-{target_lang}{source_path.suffix}"
    
    # Create directory if not exists
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    # Write translated content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(translated_lines))
    
    print(f"✓ Saved: {output_file}")
    
    # Print i18n instructions if auto-mapped
    if auto_i18n and target_lang:
        print(f"\n📁 File auto-mapped to i18n structure!")
        print(f"   Location: {output_file}")
        print(f"\n🌐 To test the translation:")
        print(f"   npm start -- --locale {target_lang}")
        print(f"   or visit: http://localhost:3000/{target_lang}/")
    
    return True

def main():
    """Main function"""
    if len(sys.argv) < 3:
        print("Usage: python translate-single-file.py <file_path> <target_language> [--no-i18n]")
        print("\nSupported languages:")
        for lang in LANG_MAP.keys():
            print(f"  - {lang}")
        print("\nExamples:")
        print("  python translate-single-file.py src/pages/about-me.mdx vi")
        print("  python translate-single-file.py docs/intro.md vi")
        print("  python translate-single-file.py src/pages/about-me.mdx vi --no-i18n")
        print("\nOptions:")
        print("  --no-i18n : Don't auto-map to i18n folder, save in same directory")
        return
    
    source_file = sys.argv[1]
    target_lang = sys.argv[2]
    auto_i18n = '--no-i18n' not in sys.argv
    
    if target_lang not in LANG_MAP:
        print(f"❌ Unsupported language: {target_lang}")
        print(f"Supported languages: {', '.join(LANG_MAP.keys())}")
        return
    
    # Fix encoding for Windows
    if sys.platform == 'win32':
        os.system('chcp 65001 > nul')
    
    print(f"🌍 Translating {source_file} to {target_lang}")
    if auto_i18n:
        print("📁 Auto-mapping to i18n folder structure")
    else:
        print("📄 Saving in same directory (no i18n mapping)")
    print("=" * 50)
    
    success = translate_mdx_file(source_file, target_lang, auto_i18n=auto_i18n)
    
    if success:
        print("\n✅ Translation complete!")
        if not auto_i18n:
            print("\n📝 Next steps:")
            print("1. Review the translation for quality")
            print("2. Manually move file to i18n folder if needed")
            print("3. Fix any formatting issues")
            print("4. Test the translated file")
    else:
        print("\n❌ Translation failed!")

if __name__ == "__main__":
    main()