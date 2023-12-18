// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'uno.css'
import './style.css'

import Posts from './components/Posts.vue';
import HeroBefore from './components/HeroBefore.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'aside-outline-before': () => h(HeroBefore)
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Posts', Posts);
  }
} satisfies Theme
