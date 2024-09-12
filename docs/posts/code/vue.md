---
title: vue3 项目初始化步骤
description: vue3 项目初始化步骤
date: 2023-07-29
tags:
  - vue
---

## vite 项目初始化

按照 [🍃Vite 官方文档 - 搭建第一个 Vite 项目](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2F%23scaffolding-your-first-vite-project) 说明，执行以下命令完成 `vue` 、`typescirpt` 模板项目的初始化

```bash
bash

复制代码 npm init vite@latest vue3-element-admin --template vue-ts
```

- **`vue3-element-admin`**: 自定义的项目名称
- **`vue-ts`** ： `vue` + `typescript` 模板的标识，查看 [create-vite](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Ftree%2Fmain%2Fpackages%2Fcreate-vite) 以获取每个模板的更多细节：vue，vue-ts，react，react-ts

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3585d2544c4851a37ecd83dcafb23e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1278&h=530&s=30304&e=png&b=0b0b0b)

初始化完成项目位于 `D:\project\demo\vue3-element-admin` , 使用 VSCode 导入，执行以下命令启动：

```bash
bash

复制代码npm install
npm run dev
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31482ceed1804d1bba4de36244798cdd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1739&h=1201&s=147160&e=png&b=f6f8fa)

浏览器访问 [localhost:5173](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A5173)  预览

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/386234b0f7194eddb4639edb554ae5e3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2558&h=1126&s=71983&e=png&b=242424)

## src 路径别名配置

> 相对路径别名配置，使用 @ 代替 src

**Vite 配置**

配置 vite.config.ts ，截图展示关键代码，完整代码移步：[vite.config.ts](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyoulaiorg%2Fvue3-element-admin%2Fblob%2Fmaster%2Fvite.config.ts)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55bb825cb90e42188eea282201fc3627~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1253&h=618&s=32713&e=png&b=2b2b2b) **安装@types/node**

`import path from 'path'`编译器报错：TS2307: Cannot find module 'path' or its corresponding type declarations.

本地安装 Node 的 TypeScript 类型描述文件即可解决编译器报错

```bash
bash

复制代码npm install @types/node --save-dev
```

**TypeScript 编译配置**

同样还是`import path from 'path'` 编译报错: TS1259: Module '"path"' can only be default-imported using the 'allowSyntheticDefaultImports' flag

因为 typescript 特殊的 import 方式 , 需要配置允许默认导入的方式，还有路径别名的配置

```json
json

复制代码// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //路径映射，相对于baseUrl
      "@/*": ["src/*"] 
    },
    "allowSyntheticDefaultImports": true // 允许默认导入
  }
}
```

**路径别名使用**

```typescript
typescript

复制代码// src/App.vue
import HelloWorld from '/src/components/HelloWorld.vue'
						↓
import HelloWorld from '@/components/HelloWorld.vue'
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88e87bcf29a4426bad9ca667033f0002~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1316&h=125&s=14891&e=png&b=2e2e2e)

## unplugin 自动导入

> Element Plus 官方文档中推荐 `按需自动导入` 的方式，而此需要使用额外的插件 `unplugin-auto-import`  和 `unplugin-vue-components`  来导入要使用的组件。所以在整合 `Element Plus` 之前先了解下`自动导入`的概念和作用

**概念**

为了避免在多个页面重复引入 `API` 或 `组件`，由此而产生的自动导入插件来节省重复代码和提高开发效率。

| 插件                    | 概念             | 自动导入对象                                  |
| ----------------------- | ---------------- | --------------------------------------------- |
| unplugin-auto-import    | 按需自动导入API  | ref，reactive,watch,computed 等API            |
| unplugin-vue-components | 按需自动导入组件 | Element Plus 等三方库和指定目录下的自定义组件 |

看下自动导入插件未使用和使用的区别：

| 插件名                  | 未使用自动导入                                               | 使用自动导入                                                 |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| unplugin-auto-import    | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff113799c83343acab22cbf0e810446a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=477&h=160&s=9536&e=png&b=2b2b2b) | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a78ddb9ff09e44afb96b45527ad719da~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=351&h=160&s=7309&e=png&b=2b2b2b) |
| unplugin-vue-components | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1aeff2ce05346faa343eb9f1a796ebe~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=630&h=212&s=14217&e=png&b=2b2b2b) | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8b9af5a27684af59d32338992a200cb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=402&h=215&s=8846&e=png&b=2b2b2b) |

**安装插件依赖**

```bash
bash

复制代码npm install -D unplugin-auto-import unplugin-vue-components 
```

**vite.config.ts - 自动导入配置**

先创建好 `/src/types` 目录用于存放自动导入函数和组件的TS类型声明文件，再进行自动导入配置

下面只贴关键配置代码，完整代码移步：[vite.config.ts](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyoulaiorg%2Fvue3-element-admin%2Fblob%2Fmaster%2Fvite.config.ts)

```typescript
typescript

复制代码// vite.config.ts
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

import path from "path";

const pathSrc = path.resolve(__dirname, "src");

plugins: [
  AutoImport({
    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    imports: ["vue"],
    eslintrc: {
      enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false 
      filepath: "./.eslintrc-auto-import.json", // 指定自动导入函数 eslint 规则的文件
    },
    dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // 指定自动导入函数TS类型声明文件路径
  }),
  Components({
    dts: path.resolve(pathSrc, "types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
  }),
]
```

**.eslintrc.cjs - 自动导入函数 eslint 规则引入**

```javascript
javascript

复制代码"extends": [
    "./.eslintrc-auto-import.json"
],
```

**tsconfig.json - 自动导入TS类型声明文件引入**

```json
json

复制代码{
  "include": ["src/**/*.d.ts"]
}
```

**自动导入效果**

运行项目 `npm run dev`  自动

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68d3b52636764ab9ba36bc11912aa410~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1727&h=835&s=213173&e=png&b=2b2b2b)

## 整合 Element Plus

参考： [element plus 按需自动导入](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.gitee.io%2Fzh-CN%2Fguide%2Fquickstart.html%23%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5)

需要完成上面一节的 **自动导入** 的安装和配置

**安装 Element Plus**

```bash
bash

复制代码npm install element-plus
```

**安装自动导入 Icon 依赖**

```bash
bash

复制代码npm i -D unplugin-icons
```

**vite.config.ts 配置**

参考： [element-plus-best-practices - vite.config.ts ](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsxzz%2Felement-plus-best-practices%2Fblob%2Fmain%2Fvite.config.ts)

```typescript
typescript

复制代码// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite";

import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default ({ mode }: ConfigEnv): UserConfig => {

  return {
    plugins: [
      // ...
      AutoImport({
        // ...  
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({}),
        ]
        vueTemplate: true, // 是否在 vue 模板中自动导入
        dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts') // 自动导入组件类型声明文件位置，默认根目录
          
      }),
      Components({ 
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"] // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
          }),
        ],
        dts: path.resolve(pathSrc, "types", "components.d.ts"), //  自动导入组件类型声明文件位置，默认根目录
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
    ],
  };
};
```

**示例代码**

```html
html

复制代码<!-- src/components/HelloWorld.vue -->
<div>
  <el-button type="success"><i-ep-SuccessFilled />Success</el-button>
  <el-button type="info"><i-ep-InfoFilled />Info</el-button>
  <el-button type="warning"><i-ep-WarningFilled />Warning</el-button>
  <el-button type="danger"><i-ep-WarnTriangleFilled />Danger</el-button>
</div>
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d58ca380242a4a9981815fe75dcc3c99~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1351&h=850&s=30465&e=png&b=242424)

## 整合 SVG 图标

> 通过 [vite-plugin-svg-icons](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvbenjs%2Fvite-plugin-svg-icons) 插件整合 `Iconfont` 第三方图标库实现本地图标

参考： [ vite-plugin-svg-icons 安装文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvbenjs%2Fvite-plugin-svg-icons%2Fblob%2Fmain%2FREADME.zh_CN.md)

安装依赖

```bash
bash

复制代码npm install -D fast-glob@3.2.11 
npm install -D vite-plugin-svg-icons@2.0.1 
```

创建 `src/assets/icons` 目录 , 放入从 Iconfont 复制的 `svg` 图标

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c09eaf137fa4863aa4dc0978fb2b3bc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1058&h=327&s=18220&e=png&b=3b3e40)

main.ts 引入注册脚本

```typescript
typescript

复制代码// src/main.ts
import 'virtual:svg-icons-register';
```

vite.config.ts 配置插件

```typescript
typescript

复制代码// vite.config.ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default ({command, mode}: ConfigEnv): UserConfig => {
 return (
     {
         plugins: [
             createSvgIconsPlugin({
                 // 指定需要缓存的图标文件夹
                 iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                 // 指定symbolId格式
                 symbolId: 'icon-[dir]-[name]',
             })
         ]
     }
 )
}
```

SVG 组件封装

```html
html

复制代码<!-- src/components/SvgIcon/index.vue -->
<script setup lang="ts">
const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  iconClass: {
    type: String,
    required: false,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "1em",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`);
</script>

<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="'width:' + size + ';height:' + size"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  outline: none;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  fill: currentColor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
  overflow: hidden;
}
</style>
```

组件使用

```html
html

复制代码<!-- src/components/HelloWorld.vue -->
<template>
 <el-button type="info"><svg-icon icon-class="block"/>SVG 本地图标</el-button>
</template>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc24ccc4a9e745548aa499e40ab82dd4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1116&h=107&s=11895&e=png&b=242424)

## 整合 SCSS

> 一款CSS预处理语言，SCSS 是 Sass 3 引入新的语法，其语法完全兼容 CSS3，并且继承了 Sass 的强大功能。

安装依赖

```bash
bash

复制代码npm i -D sass 
```

创建 `variables.scss` 变量文件，添加变量  `$bg-color` 定义，注意规范变量以 `$` 开头

```scss
scss

复制代码// src/styles/variables.scss
$bg-color:#242424;
```

`Vite` 配置导入` SCSS` 全局变量文件

```typescript
typescript

复制代码// vite.config.ts
css: {
    // CSS 预处理器
    preprocessorOptions: {
        //define global scss variable
        scss: {
            javascriptEnabled: true,
            additionalData: `@use "@/styles/variables.scss" as *;`
        }
    }
}
```

`style ` 标签使用`SCSS`全局变量

```html
html

复制代码<!-- src/components/HelloWorld.vue -->
<template>
  <div class="box" />
</template>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: $bg-color;
}
</style>
```

上面导入的 `SCSS` 全局变量在 `TypeScript` 不生效的，需要创建一个以 `.module.scss` 结尾的文件

```scss
scss

复制代码// src/styles/variables.module.scss

// 导出 variables.scss 文件的变量
:export{
    bgColor:$bg-color
}
```

`TypeScript` 使用 `SCSS` 全局变量

```html
html

复制代码<!-- src/components/HelloWorld.vue -->
<script setup lang="ts">
  import variables from "@/styles/variables.module.scss";
  console.log(variables.bgColor)  
</script>

<template>
  <div style="width:100px;height:100px" :style="{ 'background-color': variables.bgColor }" />
</template>
```

## 整合 UnoCSS

> UnoCSS 是一个具有高性能且极具灵活性的即时原子化 CSS 引擎 。

参考：[Vite 安装 UnoCSS 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Funocss%2Funocss%2Ftree%2Fmain%2Fpackages%2Fvite)

安装依赖

```bash
bash

复制代码npm install -D unocss
```

vite.config.ts 配置

```typescript
typescript

复制代码// vite.config.ts
import UnoCSS from 'unocss/vite'

export default {
  plugins: [
    UnoCSS({ /* options */ }),
  ],
}
main.ts ` 引入 `uno.css
typescript

复制代码// src/main.ts
import 'uno.css'
```

`VSCode` 安装 `UnoCSS` 插件

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a6562bf4d744e1ca1225576b3706457~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=906&h=289&s=19190&e=png&b=2d2d2d)

再看下具体使用方式和实际效果：

| 代码                                                         | 效果                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9068ea5c10b04955b125419cbe85c5f4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1143&h=282&s=25189&e=png&b=2c2c2c) | ![image-20230222220856251](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f05b623abe8a4740b75cba2951dce9f6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=450&h=282&s=11457&e=png&b=242424) |

如果`UnoCSS` 插件智能提示不生效，请参考：[VSCode插件UnoCSS智能提示不生效解决](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fu013737132%2Farticle%2Fdetails%2F129212770)  。

## 整合 Pinia

> Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。

参考：[Pinia 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fzh%2Fgetting-started.html)

**安装依赖**

```bash
bash

复制代码npm install pinia
main.ts` 引入 `pinia
typescript

复制代码// src/main.ts
import { createPinia } from "pinia";
import App from "./App.vue";

createApp(App).use(createPinia()).mount("#app");
```

**定义 Store**

根据 [Pinia 官方文档-核心概念](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2Fzh%2Fcore-concepts%2F) 描述 ，Store 定义分为`选项式`和`组合式` ,  先比较下两种写法的区别：

| 选项式 Option Store                                          | 组合式 Setup Store                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e90f6b1a82ce408988f02049b4c5034f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=656&h=405&s=20310&e=png&b=2b2b2b) | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b56fc68b9304bbb8c8cc7ef22340328~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=720&h=405&s=29787&e=png&b=2b2b2b) |

至于如何选择，官方给出的建议 ：`选择你觉得最舒服的那一个就好` 。

这里选择组合式，新建文件 `src/store/counter.ts`

```typescript
typescript

复制代码// src/store/counter.ts
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  // ref变量 → state 属性
  const count = ref(0);
  // computed计算属性 → getters
  const double = computed(() => {
    return count.value * 2;
  });
  // function函数 → actions
  function increment() {
    count.value++;
  }

  return { count, double, increment };
});
```

**父组件**

```html
html

复制代码<!-- src/App.vue -->
<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";

import { useCounterStore } from "@/store/counter";
const counterStore = useCounterStore();
</script>

<template>
  <h1 class="text-3xl">vue3-element-admin-父组件</h1>
  <el-button type="primary" @click="counterStore.increment">count++</el-button>
  <HelloWorld />
</template>
```

**子组件**

```html
html

复制代码<!-- src/components/HelloWorld.vue -->
<script setup lang="ts">
import { useCounterStore } from "@/store/counter";
const counterStore = useCounterStore();
</script>

<template>
  <el-card  class="text-left text-white border-white border-1 border-solid mt-10 bg-[#242424]" >
    <template #header> 子组件 HelloWorld.vue</template>
    <el-form>
      <el-form-item label="数字："> {{ counterStore.count }}</el-form-item>
      <el-form-item label="加倍："> {{ counterStore.double }}</el-form-item>
    </el-form>
  </el-card>
</template>
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4089181af2744128dcb67cebf5ca66d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=987&h=536&s=44331&e=gif&f=35&b=242424)

## 环境变量

> Vite 环境变量主要是为了区分开发、测试、生产等环境的变量

参考： [Vite 环境变量配置官方文档](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fenv-and-mode.html)

**env配置文件**

项目根目录新建 `.env.development` 、`.env.production`

- 开发环境变量配置：.env.development

  ```properties
  properties
  
  复制代码# 变量必须以 VITE_ 为前缀才能暴露给外部读取
  VITE_APP_TITLE = 'vue3-element-admin'
  VITE_APP_PORT = 3000
  VITE_APP_BASE_API = '/dev-api'
  ```

- 生产环境变量配置：.env.production

  ```properties
  properties
  
  复制代码VITE_APP_TITLE = 'vue3-element-admin'
  VITE_APP_PORT = 3000
  VITE_APP_BASE_API = '/prod-api'
  ```

**环境变量智能提示**

新建 `src/types/env.d.ts`文件存放环境变量TS类型声明

```typescript
typescript

复制代码// src/types/env.d.ts
interface ImportMetaEnv {
  /**
   * 应用标题
   */
  VITE_APP_TITLE: string;
  /**
   * 应用端口
   */
  VITE_APP_PORT: number;
  /**
   * API基础路径(反向代理)
   */
  VITE_APP_BASE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

使用自定义环境变量就会有智能提示，环境变量的读取和使用请看下一节的跨域处理中的 `vite.config.ts`的配置。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f741fdfefa6e472abb653df6870ae198~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=164&s=24659&e=png&b=2d2d2d)

## 反向代理解决跨域

**跨域原理**

 浏览器同源策略:  协议、域名和端口都相同是同源，浏览器会限制非同源请求读取响应结果。

本地开发环境通过 `Vite` 配置反向代理解决浏览器跨域问题，生产环境则是通过 `nginx` 配置反向代理 。

**`vite.config.ts` 配置代理**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d46ac625e904bf18ac17400a58cbee1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1488&h=631&s=75679&e=png&b=2b2b2b)

表面肉眼看到的请求地址: `http://localhost:3000/dev-api/api/v1/users/me`

真实访问的代理目标地址: `http://vapi.youlai.tech/api/v1/users/me`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa7b51083e8a477aa4a5dafdfaee6e92~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1898&h=220&s=23140&e=png&b=202124)

## 整合 Axios

> Axios 基于promise可以用于浏览器和node.js的网络请求库

参考： [Axios 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.axios-http.cn%2Fdocs%2Fintro)

**安装依赖**

```bash
bash

复制代码npm install axios
```

**Axios 工具类封装**

```typescript
typescript

复制代码//  src/utils/request.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStoreHook } from '@/store/modules/user';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    // 登录成功
    if (code === '00000') {
      return response.data;
    }

    ElMessage.error(msg || '系统出错');
    return Promise.reject(new Error(msg || 'Error'));
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期，跳转登录页
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear(); // @vueuse/core 自动导入
          window.location.href = '/';
        });
      }else{
          ElMessage.error(msg || '系统出错');
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
```

**登录接口实战**

访问 [vue3-element-admin 在线接口文档](https://link.juejin.cn?target=http%3A%2F%2Fvue3.youlai.tech%2F%23%2Fapi%2Fapidoc)， 查看登录接口请求参数和响应数据类型

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29bcf39de8194870ad0e6aad145ea0d4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2560&h=1599&s=245550&e=png&b=fefdfd)

点击 **生成代码** 获取登录响应数据 `TypeScript` 类型定义

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bb68c0721164a0db4150fc0f2a639e8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2181&h=1049&s=156879&e=png&b=fefdfd)

将类型定义复制到 `src/api/auth/types.ts` 文件中

```typescript
typescript

复制代码/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refreshToken?: string;
  /**
   * token 类型
   */
  tokenType?: string;
}
```

登录 API 定义

```typescript
typescript

复制代码// src/api/auth/index.ts
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, LoginResult } from './types';

/**
 * 登录API 
 * 
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    params: data
  });
}
```

登录 API 调用

```typescript
typescript

复制代码// src/store/modules/user.ts
import { loginApi } from '@/api/auth';
import { LoginData } from '@/api/auth/types';

/**
 * 登录调用
 *
 * @param {LoginData}
 * @returns
 */
function login(loginData: LoginData) {
  return new Promise<void>((resolve, reject) => {
    loginApi(loginData)
      .then(response => {
        const { tokenType, accessToken } = response.data;
        token.value = tokenType + ' ' + accessToken; // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
```

## vue-router 动态路由

**安装 vue-router**

```bash
bash

复制代码npm install vue-router@next
```

**路由实例**

创建路由实例，顺带初始化静态路由，而动态路由需要用户登录，根据用户拥有的角色进行权限校验后进行初始化

```typescript
typescript

复制代码// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'homepage', affix: true }
      }
    ]
  }
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' });
  location.reload();
}

export default router;
```

**全局注册路由实例**

```typescript
typescript

复制代码// main.ts
import router from "@/router";

app.use(router).mount('#app')
```

**动态权限路由**

路由守卫  `src/permission.ts` ，获取当前登录用户的角色信息进行动态路由的初始化

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52b1695ef69842898e5df156a95d1025~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1483&h=1093&s=154398&e=png&b=2b2b2b)

最终调用 `permissionStore.generateRoutes(roles)` 方法生成动态路由

```typescript
typescript

复制代码// src/store/modules/permission.ts 
import { listRoutes } from '@/api/menu';

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([]);

  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      listRoutes()
        .then(({ data: asyncRoutes }) => {
          // 根据角色获取有访问权限的路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  // 导出 store 的动态路由数据 routes 
  return { routes, setRoutes, generateRoutes };
});
```

接口获取得到的路由数据

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e3321bad35a4fb8a14aa2b72698ba23~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1576&h=1374&s=191995&e=png&b=202224)

根据路由数据 (routes)生成菜单的关键代码

| src/layout/componets/Sidebar/index.vue                       | src/layout/componets/Sidebar/SidebarItem.vue                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf5f6c74dfb045e4b006873ef5b57f84~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=816&h=952&s=121794&e=png&b=2b2b2b) | ![image-20230326145836872](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84426fc24114f489e08fe62cc0f6ebe~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=842&h=940&s=99601&e=png&b=2b2b2b) |

## 按钮权限

除了 Vue 内置的一系列指令 (比如 `v-model` 或 `v-show`) 之外，Vue 还允许你注册自定义的指令 (Custom Directives)，以下就通过自定义指令的方式实现按钮权限控制。

参考：[Vue 官方文档-自定义指令](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fguide%2Freusability%2Fcustom-directives.html)

**自定义指令**

```typescript
typescript

复制代码// src/directive/permission/index.ts

import { useUserStoreHook } from '@/store/modules/user';
import { Directive, DirectiveBinding } from 'vue';

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 「超级管理员」拥有所有的按钮权限
    const { roles, perms } = useUserStoreHook();
    if (roles.includes('ROOT')) {
      return true;
    }
    // 「其他角色」按钮权限校验
    const { value } = binding;
    if (value) {
      const requiredPerms = value; // DOM绑定需要的按钮权限标识

      const hasPerm = perms?.some(perm => {
        return requiredPerms.includes(perm);
      });

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(
        "need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\""
      );
    }
  }
};
```

**全局注册自定义指令**

```typescript
typescript

复制代码// src/directive/index.ts
import type { App } from 'vue';

import { hasPerm } from './permission';

// 全局注册 directive 方法
export function setupDirective(app: App<Element>) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('hasPerm', hasPerm);
}
typescript

复制代码// src/main.ts
import { setupDirective } from '@/directive';

const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
```

**组件使用自定义指令**

```html
html

复制代码// src/views/system/user/index.vue
<el-button v-hasPerm="['sys:user:add']">新增</el-button>
<el-button v-hasPerm="['sys:user:delete']">删除</el-button>
```

## 国际化

> 国际化分为两个部分，Element Plus 框架国际化（官方提供了国际化方式）和自定义国际化（通过 vue-i18n 国际化插件）

### Element Plus 国际化

简单的使用方式请参考 [Element Plus 官方文档-国际化示例](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.gitee.io%2Fzh-CN%2Fguide%2Fi18n.html%23configprovider)，以下介绍 `vue3-element-admin` 整合 `pinia` 实现国际化语言切换。

Element Plus 提供了一个 Vue 组件 [ConfigProvider](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.gitee.io%2Fen-US%2Fcomponent%2Fconfig-provider.html) 用于全局配置国际化的设置。

```html
html

复制代码<!-- src/App.vue -->
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
</script>

<template>
  <el-config-provider :locale="appStore.locale" >
    <router-view />
  </el-config-provider>
</template>
```

定义 `store`

```typescript
typescript

复制代码// src/store/modules/app.ts
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import defaultSettings from '@/settings';

// 导入 Element Plus 中英文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

// setup
export const useAppStore = defineStore('app', () => {
    
  const language = useStorage('language', defaultSettings.language);
    
  /**
   * 根据语言标识读取对应的语言包
   */
  const locale = computed(() => {
    if (language?.value == 'en') {
      return en;
    } else {
      return zhCn;
    }
  });

  /**
   * 切换语言
   */
  function changeLanguage(val: string) {
    language.value = val;
  }

  return {
    language,
    locale,
    changeLanguage
  };
});
```

切换语言组件调用

```html
html

复制代码<!-- src/components/LangSelect/index.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const { locale } = useI18n();

function handleLanguageChange(lang: string) {
  locale.value = lang;
  appStore.changeLanguage(lang);
  if (lang == 'en') {
    ElMessage.success('Switch Language Successful!');
  } else {
    ElMessage.success('切换语言成功！');
  }
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div>
      <svg-icon icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="appStore.language === 'zh-cn'"
          command="zh-cn"
        >
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

从 `Element Plus` 分页组件看下国际化的效果

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57bc4af5edce436a954de457e9a65e2d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2242&h=661&s=62697&e=png&b=fffefe)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dc41fdf81194debb05574bc52d2a16e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2234&h=665&s=68943&e=png&b=fffefe)

### vue-i18n 自定义国际化

> i18n 英文全拼 internationalization ,国际化的意思，英文 i 和 n 中间18个英文字母

参考：[vue-i18n 官方文档 - installation](https://link.juejin.cn?target=https%3A%2F%2Fvue-i18n.intlify.dev%2Fguide%2Finstallation.html)

**安装 vue-i18n**

```bash
bash

复制代码npm install vue-i18n@9
```

**自定义语言包**

创建 `src/lang`/package 语言包目录，存放自定义的语言文件

| 中文语言包 zh-cn.ts                                          | 英文语言包 en.ts                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/971331f5734747b793b928093064daa1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=580&h=712&s=38220&e=png&b=2b2b2b) | ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/167e3c5699874a03b24398e6daddf46a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=580&h=715&s=54471&e=png&b=2b2b2b) |

**创建 `i18n` 实例**

```typescript
typescript

复制代码// src/lang/index.ts
import { createI18n } from 'vue-i18n';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
// 本地语言包
import enLocale from './package/en';
import zhCnLocale from './package/zh-cn';

const messages = {
  'zh-cn': {
    ...zhCnLocale
  },
  en: {
    ...enLocale
  }
};
// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages
});
// 导出 i18n 实例
export default i18n;
```

**i18n 全局注册**

```typescript
typescript

复制代码// main.ts

// 国际化
import i18n from '@/lang/index';

app.use(i18n).mount('#app');
```

**登录页面国际化使用**

> $t 是 i18n 提供的根据 key 从语言包翻译对应的 value 方法

```html
html

复制代码<span>{{ $t("login.title") }}</span>
```

在登录页面 `src/view/login/index.vue` 查看如何使用

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9d521608054457a6c735f65e6598f0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1599&h=570&s=99189&e=gif&f=68&b=2c3949)

## 暗黑模式

Element Plus 2.2.0 版本开始支持暗黑模式，启用方式参考 [Element Plus 官方文档 - 暗黑模式](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.gitee.io%2Fzh-CN%2Fguide%2Fdark-mode.html)， 官方也提供了示例 [element-plus-vite-starter 模版](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Felement-plus%2Felement-plus-vite-starter) 。

这里根据官方文档和示例讲述 [vue3-element-admin](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyoulaiorg%2Fvue3-element-admin) 是如何使用 VueUse 的 [useDark](https://link.juejin.cn?target=https%3A%2F%2Fvueuse.org%2Fcore%2FuseDark%2F) 方法实现暗黑模式的动态切换。

**导入 Element Plus 暗黑模式变量**

```typescript
typescript

复制代码// src/main.ts
import 'element-plus/theme-chalk/dark/css-vars.css'
```

**切换暗黑模式设置**

```html
html

复制代码<!-- src/layout/components/Settings/index.vue -->
<script setup lang="ts">

import IconEpSunny from '~icons/ep/sunny';
import IconEpMoon from '~icons/ep/moon';

/**
 * 暗黑模式
 */
const settingsStore = useSettingsStore();
const isDark = useDark();
const toggleDark = () => useToggle(isDark);

</script>

<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">项目配置</h3>
    <el-divider>主题</el-divider>

    <div class="flex justify-center" @click.stop>
      <el-switch
        v-model="isDark"
        @change="toggleDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
      />
    </div>
  </div>
</template>
```

**自定义变量**

除了 Element Plus 组件样式之外，应用中还有很多自定义的组件和样式，像这样的:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a4b8771e91c495a9ddf52692b07d0c0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1217&h=496&s=26826&e=png&b=2b2b2b)

应对自定义组件样式实现暗黑模式步骤如下：

新建 `src/styles/dark.scss`

```scss
scss

复制代码html.dark {
  /* 修改自定义元素的样式 */   
  .navbar {
    background-color: #141414;
  }
}
```

在 Element Plus 的样式之后导入它

```typescript
typescript

复制代码// main.ts
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark.scss';
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cea72d658be48b2a6091018ad88521f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2546&h=1338&s=1818291&e=gif&f=49&b=d9d9d9)

## 组件封装

### wangEditor 富文本

参考：[  wangEditor 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.wangeditor.com%2Fv5%2Ffor-frame.html%23vue3)

**安装 wangEditor**

```bash
bash

复制代码npm install @wangeditor/editor @wangeditor/editor-for-vue@next 
```

**wangEditor 组件封装**

```html
html

复制代码<!-- src/components/WangEditor/index.vue -->
<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      :defaultConfig="editorConfig"
      v-model="defaultHtml"
      @onChange="handleChange"
      style="height: 500px; overflow-y: hidden"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

// API 引用
import { uploadFileApi } from "@/api/file";

const props = defineProps({
  modelValue: {
    type: [String],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const defaultHtml = useVModel(props, "modelValue", emit);

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const mode = ref("default"); // 编辑器模式
const toolbarConfig = ref({}); // 工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      async customUpload(file: any, insertFn: any) {
        uploadFileApi(file).then((response) => {
          const url = response.data.url;
          insertFn(url);
        });
      },
    },
  },
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

function handleChange(editor: any) {
  emit("update:modelValue", editor.getHtml());
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
```

**使用案例**

```html
html

复制代码<!-- wangEditor富文本编辑器示例 -->
<script setup lang="ts">
import Editor from '@/components/WangEditor/index.vue';
const value = ref('初始内容');
</script>

<template>
  <div class="app-container">
    <editor v-model="value" style="height: 600px" />
  </div>
</template>
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b6a29f795a04fb38ba2c01dc25b5770~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2067&h=828&s=306722&e=png&b=f9f4f4)

### Echarts 图表

参考：[📊 Echarts 官方示例](https://link.juejin.cn?target=https%3A%2F%2Fecharts.apache.org%2Fexamples%2Fzh%2Findex.html)

**安装 Echarts**

```bash
bash

复制代码npm install echarts
```

**组件封装**

```html
html

复制代码<!-- src/views/dashboard/components/Chart/BarChart.vue --> 
<template>
  <el-card>
    <template #header> 线 + 柱混合图 </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

const props = defineProps({
  id: {
    type: String,
    default: 'barChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  }
});

const options = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['收入', '毛利润', '收入增长率', '利润增长率'],
    textStyle: {
      color: '#999'
    }
  },
  xAxis: [
    {
      type: 'category',
      data: ['浙江', '北京', '上海', '广东', '深圳'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 10000,
      interval: 2000,
      axisLabel: {
        formatter: '{value} '
      }
    },
    {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value}%'
      }
    }
  ],
  series: [
    {
      name: '收入',
      type: 'bar',
      data: [7000, 7100, 7200, 7300, 7400],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    },
    {
      name: '毛利润',
      type: 'bar',
      data: [8000, 8200, 8400, 8600, 8800],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#25d73c' },
          { offset: 0.5, color: '#1bc23d' },
          { offset: 1, color: '#179e61' }
        ])
      }
    },
    {
      name: '收入增长率',
      type: 'line',
      yAxisIndex: 1,
      data: [60, 65, 70, 75, 80],
      itemStyle: {
        color: '#67C23A'
      }
    },
    {
      name: '利润增长率',
      type: 'line',
      yAxisIndex: 1,
      data: [70, 75, 80, 85, 90],
      itemStyle: {
        color: '#409EFF'
      }
    }
  ]
};

onMounted(() => {
  // 图表初始化
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);

  // 大小自适应
  window.addEventListener('resize', () => {
    chart.resize();
  });
});
</script>
```

**组件使用**

```html
html

复制代码<script setup lang="ts">
import BarChart from './components/BarChart.vue';
</script>

<template>
  <BarChart id="barChart" height="400px"width="300px" />
</template>
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db504247d7594563bd0241a145ce45b9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2195&h=793&s=223265&e=png&b=202122)

### 图标选择器

**组件封装**

```html
html

复制代码<!-- src/components/IconSelect/index.vue -->
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    require: false
  }
});

const emit = defineEmits(['update:modelValue']);
const inputValue = toRef(props, 'modelValue');

const visible = ref(false); // 弹窗显示状态

const iconNames: string[] = []; // 所有的图标名称集合

const filterValue = ref(''); // 筛选的值
const filterIconNames = ref<string[]>([]); // 过滤后的图标名称集合

const iconSelectorRef = ref(null);
/**
 * 加载 ICON
 */
function loadIcons() {
  const icons = import.meta.glob('../../assets/icons/*.svg');
  for (const icon in icons) {
    const iconName = icon.split('assets/icons/')[1].split('.svg')[0];
    iconNames.push(iconName);
  }
  filterIconNames.value = iconNames;
}

/**
 * 筛选图标
 */
function handleFilter() {
  if (filterValue.value) {
    filterIconNames.value = iconNames.filter(iconName =>
      iconName.includes(filterValue.value)
    );
  } else {
    filterIconNames.value = iconNames;
  }
}

/**
 * 选择图标
 */
function handleSelect(iconName: string) {
  emit('update:modelValue', iconName);
  visible.value = false;
}

/**
 * 点击容器外的区域关闭弹窗 VueUse onClickOutside
 */
onClickOutside(iconSelectorRef, () => (visible.value = false));

onMounted(() => {
  loadIcons();
});
</script>

<template>
  <div class="iconselect-container" ref="iconSelectorRef">
    <el-input
      v-model="inputValue"
      readonly
      @click="visible = !visible"
      placeholder="点击选择图标"
    >
      <template #prepend>
        <svg-icon :icon-class="inputValue" />
      </template>
    </el-input>

    <el-popover
      shadow="none"
      :visible="visible"
      placement="bottom-end"
      trigger="click"
      width="400"
    >
      <template #reference>
        <div
          @click="visible = !visible"
          class="cursor-pointer text-[#999] absolute right-[10px] top-0 height-[32px] leading-[32px]"
        >
          <i-ep-caret-top v-show="visible"></i-ep-caret-top>
          <i-ep-caret-bottom v-show="!visible"></i-ep-caret-bottom>
        </div>
      </template>

      <!-- 下拉选择弹窗 -->
      <el-input
        class="p-2"
        v-model="filterValue"
        placeholder="搜索图标"
        clearable
        @input="handleFilter"
      />
      <el-divider border-style="dashed" />

      <el-scrollbar height="300px">
        <ul class="icon-list">
          <li
            class="icon-item"
            v-for="(iconName, index) in filterIconNames"
            :key="index"
            @click="handleSelect(iconName)"
          >
            <el-tooltip :content="iconName" placement="bottom" effect="light">
              <svg-icon
                color="var(--el-text-color-regular)"
                :icon-class="iconName"
              />
            </el-tooltip>
          </li>
        </ul>
      </el-scrollbar>
    </el-popover>
  </div>
</template>
```

**组件使用**

```html
html

复制代码<!-- src/views/demo/IconSelect.vue -->
<script setup lang="ts">
const iconName = ref('edit');
</script>

<template>
  <div class="app-container">
    <icon-select v-model="iconName" />
  </div>
</template>
```

**效果预览**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5c20f4c468b4bc6bba71090d6566198~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1599&h=741&s=259798&e=gif&f=50&b=0b0b0b)

## 规范配置

### 代码统一规范

[【vue3-element-admin】ESLint+Prettier+Stylelint+EditorConfig 约束和统一前端代码规范](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fu013737132%2Farticle%2Fdetails%2F130190788)

- Eslint： JavaScript 语法规则和代码风格检查；
- Stylelint:  CSS 统一规范和代码检测；
- Prettier：全局代码格式化。

### Git 提交规范

[【vue3-element-admin】Husky + Lint-staged + Commitlint + Commitizen + cz-git 配置 Git 提交规范](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fu013737132%2Farticle%2Fdetails%2F130191363)

- Husky + Lint-staged 整合实现 Git 提交前代码规范检测/格式化；
- Husky + Commitlint + Commitizen + cz-git 整合实现生成规范化且高度自定义的 Git commit message。

## 启动部署

### 项目启动

```bash
bash

复制代码# 安装 pnpm
npm install pnpm -g

# 安装依赖
pnpm install

# 项目运行
pnpm run dev
```

### 项目部署

```bash
bash

复制代码# 项目打包
pnpm run build:prod
```

生成的静态文件在工程根目录 dist 文件夹

## FAQ

### 1: defineProps is not defined

- **问题描述**

  'defineProps' is not defined.eslint no-undef

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9e0b6e175a34bdc9bf41b92ec28cad5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1320&h=184&s=26700&e=png&b=333537)

- **解决方案**

  根据 [Eslint 官方解决方案](https://link.juejin.cn?target=https%3A%2F%2Feslint.vuejs.org%2Fuser-guide%2F%23compiler-macros-such-as-defineprops-and-defineemits-generate-no-undef-warnings)描述，解析器使用 `vue-eslint-parser` v9.0.0 + 版本

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a3af918ea7483588fa2b2ce35ab5c9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1123&h=289&s=28342&e=png&b=202022)

  安装 `vue-eslint-parser` 解析器

  ```bash
  bash
  
  复制代码npm install -D vue-eslint-parser
  ```

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1833c8bbe1ef4dfca2daefc5c7396c2e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1026&h=56&s=6047&e=png&b=2b2b2b)

  `.eslintrc.js` 关键配置( `v9.0.0` 及以上版本无需配置编译宏 `vue/setup-compiler-macros`)如下 ：

  ```bash
  bash
  
  复制代码  parser: 'vue-eslint-parser',
    extends: [
      'eslint:recommended',
  	// ...		
    ],
  ```

  重启 `VSCode` 已无报错提示

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b05393f17ba47b39a2b7ab4df36fdec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1211&h=257&s=17054&e=png&b=2b2b2b)

### 2: Vite 首屏加载慢(白屏久)

- **问题描述**

  > Vite 项目启动很快，但首次打开界面加载慢?

  参考文章：[为什么有人说 vite 快，有人却说 vite 慢](https://juejin.cn/post/7129041114174062628)

  vite 启动时，并不像 webpack 那样做一个全量的打包构建，所以启动速度非常快。启动以后，浏览器发起请求时， `Dev Server`  要把请求需要的资源发送给浏览器，中间需要经历预构建、对请求文件做路径解析、加载源文件、对源文件做转换，然后才能把内容返回给浏览器，这个时间耗时蛮久的，导致白屏时间较长。

  **解决方案升级 vite 4.3 版本** [github.com/vitejs/vite…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Fblob%2Fmain%2Fpackages%2Fvite%2FCHANGELOG.md) ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f93998b33be4cf7aa39ecc92d52023d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1616&h=715&s=101241&e=png&b=242930)

## 结语

本篇从项目介绍、环境准备、VSCode 的代码规范配置 、整合各种框架 、再到最后的启动部署，完整讲述如何基于 Vue3 + Vite4 + TypeScript + Element Plus 等主流技术栈从 0 到 1构建一个企业应用级管理前端框架。

项目有问题建议 [issue](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyoulaiorg%2Fvue3-element-admin%2Fissues) 或者可以通过项目 [关于我们](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fyoulaiorg%2Fvue3-element-admin%23%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC) 加入交流群反馈。

作者：有来技术
链接：https://juejin.cn/post/7228990409909108793
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
