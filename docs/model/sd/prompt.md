## Stabel diffution Prompt

### 提示词基础原理

1. ﻿﻿提示词与提示词之间要用英文逗号分隔
2. ﻿﻿提示词之间是可以换行，但换行时也是要记得在结尾加上逗号来进行区分
3. ﻿﻿每个提示词自身权重默认值都是1，但越靠前的提示词会分配更高的权重
4. ﻿﻿控制在75个单词以内

### 提示词的各种符号

1. 小括号：增加权重，1层1.1倍；(red) 1.1，最多三层：1.331；直接指定权重，例如（red:1.3）；一般设置为0.3-1.5之间。
2. 中括号：减少权重，1层0.9倍；[red] 0.9，最多三层：0.729
3. 大括号：增加权重，1层1.05倍；{red} 1.05，最多三层：1.15
4. 尖括号：调用lora，\<lora:文件触发:权重\>，例如：1girl,in hand / \<lora:hanfu:0.6\>
5. 下划线：起连接作用，例如：a plate of coffee cake / a plate of coffee_cake

### 控制提示词的生效时间

1. [提示词:0-1数值] ：整体画面采样到达数值进程百分比后才开始计算提示词的采样
2. [提示词::0-1数值] ：提示词的采样从一开始就计算直到数值的百分比结束
3. [提示词1:提示词2:0-1数值] ：数值的百分比前计算提示词1采样，数值的百分比后计算提示词2采样
4. [提示词1:提示词2]﻿﻿ ：交替采样

### 提示词标准格式

#### 画质画风提升词

1. 画质词：

   - 通用：(masterpiece:1.2), best quality, highres,extremely detailed CG,perfect lighting,8k wallpaper,
   - 真实系： 

   - 插画风：Illustration, painting, paintbrush, 

   - 二次元：anime, comic, game CG, 
   - 3D场景：3D,C4D render,unreal engine,octane render,

2. 画风词

   - Cyberpunk 赛博朋克
   - 8bit/16bit pixel 像素风
   - studio ghibli 宫崎骏风格
   - pixel style 皮克斯风格
   - Chinese ink style 水墨画风格

#### 画面主体描述

根据实际需求展开填写

人物/年龄/发型/头发颜色/情绪表情/衣服装束/正在做什么/

#### 环境/场景/灯光/构图

下雨天的咖啡厅/阳光明媚的沙滩

正面视觉

人物特写

#### lora

加载lora/hypernetwork等出发内容

#### 负面词

NSFW, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)),((grayscale)), skin spots, acnes, skin blemishes, age spot, (ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.5), (too many fingers:1.5), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit,bad hands, missing fingers, (((extra arms and legs))),

### 必备提示词插件

1. One Button Prompt
2. sd-dynamic-prompts
3. prompt-all-in-one