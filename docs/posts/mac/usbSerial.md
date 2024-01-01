---
title: iterm 串口连接
description: 使用 iterm 连接串口设备串口
date: 2023-07-29
tags:
  - mac
  - iterm
  -  serial
---

### iterm 连接串口

1. 下载驱动：<https://plugable.com/pages/prolific-drivers>

2. 选择端口：/dev/tty.usbserial-xxxx

3. 执行：`screen /dev/tty.usbserial-xxxx 115200`
