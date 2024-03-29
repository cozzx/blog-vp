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
      { text: 'Posts', link: '/posts/index' },
      { text: 'Interview', link: '/interview/read' },
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
          { text: 'Java', link: '/code/java/basic/01_var' },
          { text: 'Python', link: '/code/py/1_basic' },
          { text: 'Golang', link: '/code/go/basic/01_var' },
          {
            items: [
              { text: 'MySQL', link: '/code/mysql/basic' },
              { text: 'MongoDB', link: '/code/mongo/mongodb' },
              { text: 'Redis', link: '/code/redis/01_datatype' },
              { text: 'Nginx', link: '/code/nginx/1_var' },
            ]
          },
          {
            items: [
              { text: 'other', link: '/code/other/os' }
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
          text: '🏭 模型',
          items: set_sidebar('/posts/mode', false)
        },
        {
          text: '📕 开发笔记',
          items: set_sidebar('/posts/code', false)
        },
        {
          text: '🖥 macos笔记',
          items: set_sidebar('/posts/mac', false)
        }
      ],
      '/interview': set_sidebar('/interview', false),
      '/command/linux': set_sidebar('/command/linux'),
      '/command/mac': set_sidebar('/command/mac'),
      '/command/win': set_sidebar('/command/win'),
      '/code/java': [
        { text: '✨ 索引', link: '/code/java/read' },
        {
          text: '🍎 Java 基础',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/basic', false)
        },
        {
          text: '🧀 Java Web',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/web', false)
        },
        {
          text: '🍔 JVM',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/jvm', false)
        },
        {
          text: '🍟 JUC',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/juc', false)
        }
      ],
      '/code/py': set_sidebar('/code/py', false),
      '/code/go': [
        {
          text: '🪤 Golang 基础', 
          items: set_sidebar('/code/go/basic', false)
        },
        {
          text: '🕹 Golang 模块', 
          items: set_sidebar('/code/go/mod', false)
        },
      ],
      '/code/mysql': set_sidebar('/code/mysql', false),
      '/code/nginx': set_sidebar('/code/nginx', false),
      '/code/other': set_sidebar('/code/other', false),
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
