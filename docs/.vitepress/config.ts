import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'bugfreedback',
  description: 'Nuxt feedback widget with pluggable storage and export adapters',
  base: '/bugfreedback/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Demo', link: '/guide/demo' },
      { text: 'Adapters', link: '/guide/adapters' },
      { text: 'GitHub', link: 'https://github.com/bugfreedback/bugfreedback' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Demo site', link: '/guide/demo' },
        ],
      },
      {
        text: 'Adapters',
        items: [
          { text: 'Overview', link: '/guide/adapters' },
          { text: 'Storage (GCS / S3)', link: '/guide/storage' },
        ],
      },
      {
        text: 'Export providers',
        collapsed: false,
        items: [
          { text: 'GitHub Issues', link: '/guide/export/github' },
          { text: 'Linear', link: '/guide/export/linear' },
          { text: 'Jira', link: '/guide/export/jira' },
          { text: 'Notion', link: '/guide/export/notion' },
          { text: 'Slack', link: '/guide/export/slack' },
          { text: 'Asana', link: '/guide/export/asana' },
          { text: 'Trello', link: '/guide/export/trello' },
          { text: 'Webhook', link: '/guide/export/webhook' },
          { text: 'IFTTT', link: '/guide/export/ifttt' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bugfreedback/bugfreedback' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 bugfreedback',
    },
  },
})
