import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'bugfreedback',
  description: 'Nuxt feedback widget with pluggable storage and export adapters',
  base: '/bugfreedback/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Adapters', link: '/guide/adapters' },
      { text: 'GitHub', link: 'https://github.com/bugfreedback/bugfreedback' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Adapters', link: '/guide/adapters' },
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
