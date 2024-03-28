---
title: 环境变量加载顺序
description: 环境变量加载顺序
date: 2022-04-05
tags:
  - mac
  - env
---

### 环境变量加载顺序

## 加载顺序

1. `/etc/profile` 系统级，系统启动时加载

  ```shell
  \# System-wide .profile for sh(1)

  if [ -x /usr/libexec/path_helper ]; then
    eval \`/usr/libexec/path_helper -s`
  fi

  if [ "${BASH-no}" != "no" ]; then
    [ -r /etc/bashrc ] && . /etc/bashrc
  fi
  ```

2. `/etc/paths` 系统级，系统启动时加载，内容为PATH

```shell
/usr/local/bin
/usr/local/sbin
/usr/bin
/bin
/usr/sbin
/sbin
```

3. `~/.bash_profile` 用户级，当登录时以及每次打开新的shell时,该文件被读取

4. `~/.profile` 用户级，为系统的每个用户设置环境信息,当用户第一次登录时,该文件被执行

5. `~/.bashrc` 用户级，每一个运行bash shell的用户执行此文件.当bash shell被打开时,该文件被读取
