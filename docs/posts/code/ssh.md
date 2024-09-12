---
title: SSH问题
description: SSH
date: 2024-09-04
tags:
  - ssh
---

## SSH问题

### ssh客户端问题

#### ssh 连接远程服务器，提示 “no matching key exchange method found. their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group1-sha1”

当你尝试使用SSH连接到远程服务器时，如果遇到错误消息“no matching key exchange method found. their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group1-sha1”，这通常意味着SSH客户端不支持服务器提供的密钥交换方法。这些方法（diffie-hellman-group-exchange-sha1和diffie-hellman-group1-sha1）被认为是较不安全的，因此许多现代SSH客户端默认可能已禁用它们。

可以通过修改SSH客户端的配置文件来允许使用这些密钥交换方法。在Linux系统中，通常是修改 `~/.ssh/config` 文件：

```
Host [主机名或IP地址]
  KexAlgorithms +diffie-hellman-group-exchange-sha1,diffie-hellman-group1-sha1
```

这里的 `[主机名或IP地址]` 应该替换为你尝试连接的服务器的主机名或IP地址。

#### ssh 连接远程服务器，提示 “no matching cipher found, their offer: aes128-cdc,3des-cbc,des-cbc”

当你尝试使用SSH连接到远程服务器时，如果遇到错误消息“no matching cipher found, their offer: aes128-cbc,3des-cbc,des-cbc”，这表示SSH客户端不支持服务器提供的任何加密算法。通常，这是因为客户端配置为仅使用更安全的加密算法，而服务器提供的算法（如aes128-cbc, 3des-cbc, des-cbc）被认为不够安全。

你可以通过修改SSH客户端的配置文件来允许使用服务器提供的加密算法。在Linux系统中，通常是修改 `~/.ssh/config` 文件：

```
Host [主机名或IP地址]
  3des-cbc
```

这里的 `[主机名或IP地址]` 应该替换为你尝试连接的服务器的主机名或IP地址。
