# Translation Scripts & Tools

This directory contains scripts and documentation for translating the Docusaurus site.

## 🛠️ Available Tools

### 1. `auto-translate.py` - Automatic Translation Script
Automatically translates your documentation using Google Translate API.

**Setup:**
```bash
# Install dependencies
pip install googletrans==4.0.0-rc1 pyyaml

# Run the script
python scripts/auto-translate.py
```

**Features:**
- Translates to multiple languages: Vietnamese, Chinese, Japanese, Korean, Spanish, French
- Preserves Markdown formatting
- Skips code blocks
- Rate limiting to avoid API limits
- Batch processing support

**Usage:**
1. Run the script
2. Choose languages to translate (or 'all')
3. Review and fix translations
4. Test with: `npm start -- --locale [lang]`

### 2. `setup-crowdin.md` - Crowdin Integration Guide
Complete guide for setting up professional translations with Crowdin.

**Benefits:**
- Free for open source projects
- Community-powered translations
- GitHub integration
- Professional translation UI
- Quality assurance workflow

## 🌍 Translation Options Comparison

| Method | Quality | Speed | Cost | Best For |
|--------|---------|-------|------|----------|
| Manual | ⭐⭐⭐⭐⭐ | 🐢 Slow | 💰 Expensive | Critical content |
| Auto-translate | ⭐⭐⭐ | 🚀 Fast | Free | Quick prototypes |
| Crowdin | ⭐⭐⭐⭐ | ⚡ Medium | Free (OSS) | Community projects |

## 📝 Quick Commands

### Generate translation files
```bash
# For a specific locale
npm run write-translations -- --locale vi

# For all configured locales
npm run write-translations
```

### Test translations
```bash
# Start dev server with specific locale
npm start -- --locale vi

# Build for production with all locales
npm run build
```

### Serve translated site
```bash
# Serve specific locale
npm run serve -- --locale vi
```

## 🎯 Workflow Recommendations

### For Personal Projects:
1. Use `auto-translate.py` for initial translation
2. Manually review and fix important pages
3. Leave less critical content auto-translated

### For Open Source Projects:
1. Set up Crowdin (free)
2. Auto-translate as initial draft
3. Let community improve translations
4. Review and approve changes

### For Commercial Projects:
1. Use professional translation services
2. Set up Crowdin Pro for management
3. Implement review workflow
4. Use translation memory for consistency

## 🔧 Troubleshooting

### Common Issues:

**1. Google Translate API Limits**
- Solution: Add delays in script
- Alternative: Use DeepL API (better quality)

**2. Broken Markdown formatting**
- Solution: Review translated files
- Use markdown linter to check

**3. Missing translations**
- Run: `npm run write-translations`
- Check file paths in `i18n/` folder

**4. Language not showing**
- Clear cache: `npm run clear`
- Check `docusaurus.config.js` i18n config

## 📚 Additional Resources

- [Docusaurus i18n Docs](https://docusaurus.io/docs/i18n/introduction)
- [Crowdin for Docusaurus](https://docusaurus.io/docs/i18n/crowdin)
- [Google Translate API](https://cloud.google.com/translate)
- [DeepL API](https://www.deepl.com/pro-api)

## 💡 Tips

1. **Start with UI strings** - Translate navigation, buttons first
2. **Use glossary** - Maintain consistent terminology
3. **Keep code unchanged** - Don't translate code examples
4. **Test thoroughly** - Check all pages in translated versions
5. **SEO consideration** - Translate meta descriptions and titles

---

*Making documentation accessible worldwide! 🌐*