import { defineConfig } from 'vitepress'
import {set_sidebar} from './sidebar.ts'

const mode = process.argv[process.argv.length - 1]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AR Doc",
  base: '/blog-vp/',
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
    logo: "/img/ar.logo.svg",
    search: {
      provider: 'local'
    },
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Mode', link: '/posts/index' },
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
          { text: 'java', link: '/code/java/basic/01_var.md' },
          { text: 'python', link: '/code/py/1_basic' },
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
      { text: 'Toolbox', link: '/toolbox/read' },
    ],

    sidebar: {
      '/posts': [
        { text: '✨ 阅读须知', link: '/posts/read' },
        {
          text: '📕 开发笔记',
          items: set_sidebar('/posts/code', false)
        },
        {
          text: '🖥 macos笔记',
          items: set_sidebar('/posts/mac', false)
        }
      ],
      '/ex': set_sidebar('/ex'),
      '/command/linux': set_sidebar('/command/linux'),
      '/command/mac': set_sidebar('/command/mac'),
      '/command/win': set_sidebar('/command/win'),
      '/code/java': [
        {
          text: '🍎 java 基础', 
          items: set_sidebar('/code/java/basic', false)
        },
        {
          text: '🍟 java web',
          items: set_sidebar('/code/java/web', false)
        },
        {
          text: '🍔 JVM',
          items: set_sidebar('/code/java/jvm', false)
        }
      ],
      '/code/py': set_sidebar('/code/py', false),
      '/code/go': set_sidebar('/code/go'),
      '/toolbox': [
        { text: '✨ 阅读须知', link: '/toolbox/read' },
        {
          text: '⏱ 时间工具',
          items: set_sidebar('/toolbox/time')
        },
        {
          text: '🕹 网络工具',
          items: set_sidebar('/toolbox/net')
        }
      ],
    },

     //上下篇文本
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cozzx/blog-vp' },
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
