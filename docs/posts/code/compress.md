---
title: 压缩和加压缩
description: linux 中的压缩和解压缩
date: 2023-07-29
tags:
  - command
  - linux
---

## 压缩解压缩

### zip

`zip -r name.zip ./*` : 压缩当前目录的所有文件为 name.zip

`zip -er name.zip ./*` : 压缩当前目录的所有文件为 name.zip, 并指定密码

`unzip name.zip -d /tmp` : 解压到指定目录

### tar

`tar -cvzf name.tgz ./*` : 打包当前目录的所有文件并压缩为 name.tgz

`tar -xvzf name.tgz -C /tmp` : 解压并解包到指定目录
