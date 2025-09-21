# Setting up Crowdin for Docusaurus Translation

[Crowdin](https://crowdin.com/) is a localization management platform that makes it easy to translate your Docusaurus site with community help.

## 🎯 Why Crowdin?

- **Free for Open Source** - If your project is open source
- **GitHub Integration** - Auto-sync with your repository
- **Community Translations** - Let volunteers help translate
- **Professional UI** - Easy for non-technical translators
- **Machine Translation** - Built-in MT suggestions
- **Quality Assurance** - Review and approval workflow

## 🚀 Quick Setup

### 1. Create Crowdin Account
1. Go to [crowdin.com](https://crowdin.com/)
2. Sign up (free for open source)
3. Create a new project

### 2. Install Crowdin CLI
```bash
npm install -g @crowdin/cli
# or
yarn global add @crowdin/cli
```

### 3. Create `crowdin.yml` Configuration

Create `crowdin.yml` in your project root:

```yaml
project_id: "YOUR_PROJECT_ID"
api_token: "YOUR_API_TOKEN"
base_path: "."
base_url: "https://api.crowdin.com"

preserve_hierarchy: true

files:
  # Translate Markdown docs
  - source: "/docs/**/*.md"
    translation: "/i18n/%locale%/docusaurus-plugin-content-docs/current/**/%original_file_name%"
    
  - source: "/docs/**/*.mdx"
    translation: "/i18n/%locale%/docusaurus-plugin-content-docs/current/**/%original_file_name%"
  
  # Translate blog posts
  - source: "/blog/**/*.md"
    translation: "/i18n/%locale%/docusaurus-plugin-content-blog/**/%original_file_name%"
    
  - source: "/blog/**/*.mdx"
    translation: "/i18n/%locale%/docusaurus-plugin-content-blog/**/%original_file_name%"
  
  # Translate JSON files
  - source: "/i18n/en/**/*.json"
    translation: "/i18n/%locale%/**/%original_file_name%"
  
  # Translate custom pages
  - source: "/src/pages/*.md"
    translation: "/i18n/%locale%/docusaurus-plugin-content-pages/%original_file_name%"
```

### 4. Upload Source Files
```bash
crowdin upload sources
```

### 5. Download Translations
```bash
crowdin download
```

## 🔄 GitHub Integration

### Automatic Workflow

Create `.github/workflows/crowdin.yml`:

```yaml
name: Crowdin Action

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'
      - 'blog/**'
      - 'i18n/en/**'
  
  schedule:
    - cron: '0 0 * * *'  # Daily sync

jobs:
  synchronize-with-crowdin:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Crowdin Action
        uses: crowdin/github-action@v1
        with:
          upload_sources: true
          upload_translations: true
          download_translations: true
          localization_branch_name: l10n_crowdin_translations
          create_pull_request: true
          pull_request_title: 'New Crowdin translations'
          pull_request_body: |
            New translations from Crowdin
            
            Please review and merge if everything looks good!
          pull_request_labels: |
            translations
            crowdin
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CROWDIN_PROJECT_ID: ${{ secrets.CROWDIN_PROJECT_ID }}
          CROWDIN_PERSONAL_TOKEN: ${{ secrets.CROWDIN_PERSONAL_TOKEN }}
```

### Add Secrets to GitHub
1. Go to Settings → Secrets → Actions
2. Add:
   - `CROWDIN_PROJECT_ID`
   - `CROWDIN_PERSONAL_TOKEN`

## 📝 Best Practices

### 1. Translation Keys
Use translation keys for UI strings:

```javascript
// docusaurus.config.js
{
  navbar: {
    items: [
      {
        label: translate({
          id: 'navbar.docs',
          message: 'Documentation',
          description: 'Navbar docs link'
        })
      }
    ]
  }
}
```

### 2. Exclude from Translation
Mark content that shouldn't be translated:

```markdown
<!-- crowdin:ignore-start -->
This content won't be translated
<!-- crowdin:ignore-end -->
```

### 3. Context for Translators
Add screenshots and context:

```yaml
# In crowdin.yml
files:
  - source: "/docs/**/*.md"
    translation: "/i18n/%locale%/**/%original_file_name%"
    update_option: "update_as_unapproved"
    labels:
      - "documentation"
    excluded_target_languages:
      - "es-MX"  # Exclude specific variants
```

## 🎯 Alternative: Crowdin + Docusaurus Plugin

Install the official plugin:

```bash
npm install @crowdin/docusaurus-plugin @crowdin/crowdin-api-client
```

Configure in `docusaurus.config.js`:

```javascript
module.exports = {
  plugins: [
    [
      '@crowdin/docusaurus-plugin',
      {
        projectId: YOUR_PROJECT_ID,
        token: YOUR_PERSONAL_TOKEN,
        // Optional config
        autoSync: true,
        syncInterval: 60, // minutes
      },
    ],
  ],
};
```

## 🌍 Community Guidelines

Create `TRANSLATING.md`:

```markdown
# Translation Guidelines

Thank you for helping translate our documentation!

## Getting Started
1. Join our [Crowdin project](https://crowdin.com/project/YOUR_PROJECT)
2. Choose your language
3. Start translating!

## Style Guide
- Keep technical terms in English when appropriate
- Use formal tone for documentation
- Keep URLs and code snippets unchanged
- Maintain Markdown formatting

## Priority
Please translate in this order:
1. Navigation and UI elements
2. Getting Started guides
3. Core documentation
4. Blog posts

## Questions?
Join our Discord: [link]
Or open an issue: [GitHub Issues]
```

## 🚀 Commands Cheat Sheet

```bash
# Upload new source files
crowdin upload sources

# Download all translations
crowdin download

# Download specific language
crowdin download -l vi

# Check configuration
crowdin config lint

# List projects
crowdin project list

# Check translation progress
crowdin status
```

## 💡 Pro Tips

1. **Machine Translation**: Enable MT suggestions in Crowdin settings
2. **Translation Memory**: Build TM from existing translations
3. **Glossary**: Create terminology glossary for consistency
4. **Webhooks**: Set up webhooks for Slack/Discord notifications
5. **In-Context**: Use Crowdin's in-context localization tool

## 📚 Resources

- [Crowdin Documentation](https://support.crowdin.com/)
- [Docusaurus i18n Guide](https://docusaurus.io/docs/i18n/crowdin)
- [Crowdin CLI](https://developer.crowdin.com/cli-tool/)
- [GitHub Integration](https://support.crowdin.com/github-integration/)

---

*Make your documentation accessible to everyone! 🌍*