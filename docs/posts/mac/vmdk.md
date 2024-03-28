---
title: .img镜像转.vmdk格式
description: 使用 qemu 转换镜像
date: 2022-04-05
tags:
  - mac
  - qemu
---

### 使用 qemu 转换镜像

1. brew install qemu

2. qemu-img convert -f raw source.img -O vmdk target.vmdk
