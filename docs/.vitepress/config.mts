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
      { text: 'Model', link: '/model/read' },
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
          { text: 'Java', link: '/code/java/read.md' },
          { text: 'Python', link: '/code/python/01_basic' },
          { text: 'Golang', link: '/code/go/basic/01_var' },
          {
            items: [
              { text: 'MySQL', link: '/code/mysql/00_command' },
              { text: 'MongoDB', link: '/code/mongo/00_command' },
              { text: 'Redis', link: '/code/redis/01_datatype' },
              { text: 'Nginx', link: '/code/nginx/01_var' },
              { text: 'Docker', link: '/code/docker/01_basic' },
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
        {
          text: '📕 开发笔记',
          items: set_sidebar('/posts/code')
        },
        {
          text: '🖥 macos笔记',
          items: set_sidebar('/posts/mac')
        }
      ],
      '/model': [
        { text: '✨ 阅读须知', link: '/model/read' },
        {
          text: '🏭 认知模型',
          items: set_sidebar('/model/cognitive'),
        },
        {
          text: '🏭 学习模型',
          items: set_sidebar('/model/learning'),
        }
      ],
      '/command/linux': set_sidebar('/command/linux', true),
      '/command/mac': set_sidebar('/command/mac', true),
      '/command/win': set_sidebar('/command/win', true),
      '/code/java': [
        { text: '✨ 索引', link: '/code/java/read' },
        {
          text: '🍎 Java 基础',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/basic')
        },
        {
          text: '🧀 Java Web',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/web')
        },
        {
          text: '🍔 JVM',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/jvm')
        },
        {
          text: '🍟 JUC',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/juc')
        },
        {
          text: '🥔 Spring',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/spring')
        },
        {
          text: '🍲 SpringBoot',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/springboot')
        },
        {
          text: '🍱 SpringCloud',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'springcloud01', link: '/code/java/springcloud/sc01/SpringCloud01.md' },
            { text: 'springcloud02', link: '/code/java/springcloud/sc02/SpringCloud02.md' },
            { text: '异步通信', link: '/code/java/springcloud/sc03/RabbitMQ.md' },
            { text: '分布式搜索01', link: '/code/java/springcloud/sc04/es01/elasticsearch01.md' },
            { text: '分布式搜索02', link: '/code/java/springcloud/sc04/es02/elasticsearch02.md' },
            { text: '分布式搜索03', link: '/code/java/springcloud/sc04/es03/elasticsearch03.md' },
            { text: '微服务保护', link: '/code/java/springcloud/sc05/sentinel.md' },
            { text: '分布式事务', link: '/code/java/springcloud/sc06/seata.md' },
            { text: '多级缓存', link: '/code/java/springcloud/sc07/multi_level_cache.md' },
            { text: 'RabbitMQ高级', link: '/code/java/springcloud/sc08/RabbitMQ-adv.md' },
            { text: '微服务面试题', link: '/code/java/springcloud/sc09/interview.md' },
          ]
        },
        {
          text: '🍩 SpringSecurity',
          collapsible: true,
          collapsed: true,
          items: set_sidebar('/code/java/springsecurity')
        }
      ],
      '/code/python': set_sidebar('/code/python'),
      '/code/go': [
        {
          text: '🪤 Golang 基础', 
          items: set_sidebar('/code/go/basic')
        },
        {
          text: '🕹 Golang 模块', 
          items: set_sidebar('/code/go/mod')
        },
      ],
      '/code/mysql': set_sidebar('/code/mysql'),
      '/code/nginx': set_sidebar('/code/nginx'),
      '/code/other': set_sidebar('/code/other'),
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
