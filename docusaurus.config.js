// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;
const { default: math } = require("remark-math");
const { default: katex } = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Docs-n-Notes",
  tagline:
    "Knowledge is power. Sharing knowledge is the key to unlocking that power.",
  favicon: "img/favicon.ico",
  markdown: {
    mermaid: true,
    // Docusaurus 3.9: control emoji transformation in markdown
    emoji: true,
    // Docusaurus 3.9: new hooks for handling broken markdown links/images
    // (replaces deprecated siteConfig.onBrokenMarkdownLinks)
    hooks: {
      onBrokenMarkdownLinks({sourceFilePath, url}) {
        console.warn(`[WARNING] Broken markdown link in ${sourceFilePath}: ${url}`);
        return undefined; // return a fallback URL string, or undefined to keep default behavior
      },
    },
  },
  themes: ["@docusaurus/theme-live-codeblock", "@docusaurus/theme-mermaid"],
  // Set the production url of your site here
  url: "https://docs.tanthanh.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ngtanthanh-qc", // Usually your GitHub org/user name.
  projectName: "sharing docs and tips", // Usually your repo name.

  onBrokenLinks: "throw",
  // Docusaurus 3.9: onBrokenMarkdownLinks moved to markdown.hooks (see below)
  // onBrokenMarkdownLinks is deprecated in v3.9, will be removed in v4

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    localeConfigs: {
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en-US",
        calendar: "gregory",
        // Docusaurus 3.9: skip translation file lookups for default locale (faster builds)
        translate: false,
      },
      vi: {
        label: "Tiếng Việt",
        direction: "ltr",
        htmlLang: "vi-VN",
        calendar: "gregory",
        translate: true,
      },
    },
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [[math, {strict: false}]],
          rehypePlugins: [[katex, {strict: false, throwOnError: false}]],
        },
        blog: {
          showReadingTime: true,
          remarkPlugins: [[math, {strict: false}]],
          rehypePlugins: [[katex, {strict: false, throwOnError: false}]],
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      type: "text/css",
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/social-card.jpg",
      navbar: {
        title: "Docs-n-Notes",
        logo: {
          alt: 'Docs-n-Notes Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          { to: "/blog", label: "Blog", position: "left" },
          { to: "/about-me", label: "About", position: "left" },
          {
            type: "search",
            position: "right",
          },
          {
            href: 'https://tanthanh.dev',
            label: 'Resume',
            position: 'right',
            target: '_blank',
          },
          {
            href: 'https://github.com/ngtanthanh-qc',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                type: 'html',
                value: '<hr style="margin: 0.3rem 0;">',
              },
              {
                href: 'https://github.com/ngtanthanh-qc/docusaurus-site/issues',
                label: 'Help us translate',
              },
            ],
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: 'Resources',
            items: [
              { label: 'Documentation', to: '/docs/intro' },
              { label: 'Blog', to: '/blog' },
              { label: 'About Me', to: '/about-me' },
            ],
          },
          {
            title: 'Topics',
            items: [
              { label: 'Test Automation', to: '/docs/test-automation/intro' },
              { label: 'AI/ML & Agents', to: '/docs/ai-ml-agents/intro' },
              { label: 'Networking', to: '/docs/networking/intro' },
            ],
          },
          {
            title: 'Connect',
            items: [
              { label: 'GitHub', href: 'https://github.com/ngtanthanh-qc' },
              { label: 'Resume', href: 'https://tanthanh.dev' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Thanh Nguyen. Built with <a href="https://docusaurus.io" target="_blank">Docusaurus</a>`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['bash', 'diff', 'json'],
        magicComments: [
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-error-line",
            line: "This will error",
          },
        ],
      },
      algolia: {
        appId: "ISLH6D7EJC",
        apiKey: "1699acc7aa3b0e45d2ff0b8a715157cb",
        indexName: "tanthanh",
        contextualSearch: true,
        searchParameters: {},
        // DocSearch v4 - Ask AI feature (Docusaurus 3.9+)
        // To enable: create an AskAI assistant at https://docsearch.algolia.com/docs/v4/askai/
        // then uncomment and fill in your assistantId below
        // askAi: {
        //   assistantId: 'YOUR_ASSISTANT_ID',
        // },
      },
      mermaid: {
        theme: {
          light: 'default',
          dark: 'dark',
        },
        options: {
          maxTextSize: 90000,
          wrap: true,
          fontSize: 16,
          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
          securityLevel: 'loose',
          startOnLoad: true,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
            nodeSpacing: 50,
            rankSpacing: 50,
            diagramMarginX: 10,
            diagramMarginY: 10,
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
          },
          er: {
            useMaxWidth: true,
            diagramMarginX: 15,
            diagramMarginY: 15,
            entityPadding: 15,
            fontSize: 14,
          },
          gitGraph: {
            showBranches: true,
            showCommitLabel: true,
          },
        },
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      zoom: {
        selector: '.markdown img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {}
      },
    }),
  plugins: [
    path.resolve(__dirname, 'plugins/recent-blog-posts.js'),
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-0RYVLZ03TQ',
        anonymizeIP: true,
      },
    ],
    [
      '@docusaurus/plugin-google-tag-manager',
      {
        containerId: 'GTM-W4JDZ33',
      },
    ],
    [
      'docusaurus-plugin-image-zoom',
      {
        selector: '.markdown img:not(.no-zoom)',
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
  ],
};
module.exports = config;
