import { defineConfig } from 'vitepress'
import {set_sidebar} from './sidebar.ts'

const mode = process.argv[process.argv.length - 1]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AR Doc",
  base: "/",
  description: "A Technology Sharing Site",
    locales: {
      root: {
          label: 'Change language',
          lang: 'zh-CN',
      },
  },
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详情"
    }
  },
  themeConfig: {
    siteTitle: "AR",
    logo: "img/ar.logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/posts/index' },
      { text: 'Examples', link: '/ex/markdown-examples' },
      { 
        text: 'Command',
        items: [
          { text: 'linux', link: '/command/linux/' },
          { text: 'mac', link: '/command/mac/' },
          { text: 'win', link: '/command/win/' },
        ]
      },
      { 
        text: 'Code',
        items: [
          { text: 'java', link: '/code/java/' },
          { text: 'python', link: '/code/py/' },
          { text: 'golang', link: '/code/go/' },
          {
            items: [
              { text: 'mysql', link: '/code/mysql/' },
              { text: 'mongodb', link: '/code/mongodb/' },
            ]
          },
          {
            items: [
              { text: 'nginx', link: '/code/mysql/' }
            ]
          }
        ]
      },
      { text: 'Toolbox', link: '/toolbox' },
    ],

    sidebar: {
      '/ex': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/ex/markdown-examples' },
            { text: 'Runtime API Examples', link: '/ex/api-examples' }
          ]
        }
      ],
      '/command/linux': set_sidebar('/command/linux'),
      '/command/mac': set_sidebar('/command/mac'),
      '/command/win': set_sidebar('/command/win'),
      '/code/java': set_sidebar('/code/java'),
      '/code/py': set_sidebar('/code/py'),
      '/code/go': set_sidebar('/code/go'),
    },

     //上下篇文本
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
  },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cozzx' },
      // { icon: 'twitter', link: 'https://github.com/cozzx' },
      // { icon: 'discord', link: 'https://github.com/cozzx' },
      // { icon: 'facebook', link: 'https://github.com/cozzx' },
      // { icon: 'instagram', link: 'https://github.com/cozzx' },
      // { icon: 'linkedin', link: 'https://github.com/cozzx' },
      // { icon: 'slack', link: 'https://github.com/cozzx' },
      // { icon: {svg: ''}, link: 'https://github.com/cozzx' },
    ],
    footer: {
      message: '',
      copyright: 'Copyright © 2024 CodePlay. All rights reserved'
    }
  },

  // mpa: true,
  head: mode === 'dev' ? [] : [
    [
      'script',
      {id: 'baidu'},
      `var _hmt = _hmt || [];
      (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?42d7e0f183103b4578ac0684f1342bde";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      })();`,
    ],
  ],
})
