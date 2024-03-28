---
title: SSL 证书
description: 申请 SSL 证书
date: 2023-07-29
tags:
  - ssl
  - cert
---

## 申请 SSL 证书

### FreeSSL 申请证书

这种方式申请证书比较简单，而且还可以申请到为期一年的 “亚洲诚信” 的证书，但是，目前此网站申请证书需要进行手机验证。

### Acme 脚本申请证书

Acme 脚本申请证书，是我们用到的最常见的一种证书的申请方式，它有很多的申请方法，大家只需要找到一种适合自己的也就好了。

不管用下面的何种方式申请，都需要安装 Acme，有一部分的申请场景需要用到相关的插件，所以我们需要提前安装。

下面环境的安装方式，大家根据自己的系统选择命令安装就好了。

1. apt update \-y #Debian/Ubuntu 命令
2. apt install \-y curl #Debian/Ubuntu 命令
3. apt install \-y socat #Debian/Ubuntu 命令

1. yum update \-y #CentOS 命令
2. yum install \-y curl #CentOS 命令
3. yum install \-y socat #CentOS 命令

安装 Acme 脚本

1. `curl <https://get.acme.sh> | sh`

> **重要申明**
>
> ---
>
> **2021 年 6 月 17 日更新：**
>
> **从 acme.sh v 3.0.0 开始，acme.sh 使用 Zerossl 作为默认 ca，您必须先注册帐户（一次），然后才能颁发新证书。**
>
> **具体操作步骤如下：**
>
> 1、安装 Acme 脚本之后，请先执行下面的命令（下面的邮箱为你的邮箱）  
> `~/.acme.sh/acme.sh --register-account -m xxxx@xxxx.com`
>
> 2、其他的命令暂时没有变动

#### 80 端口空闲的验证申请

如果你还没有运行任何 web 服务, 80 端口是空闲的, 那么 Acme.sh 还能假装自己是一个 WebServer, 临时监听在 80 端口, 完成验证

- ~/.acme.sh/acme.sh \--issue \-d mydomain.com \--standalone

#### Nginx 的方式验证申请

这种方式需要你的服务器上面已经部署了 Nginx 环境，并且保证你申请的域名已经在 Nginx 进行了 conf 部署。（被申请的域名可以正常被打开）

- ~/.acme.sh/acme.sh \--issue \-d mydomain.com \--nginx

#### http 的方式验证申请

这种方式需要你的服务器上面已经部署了网站环境。（被申请的域名可以正常被打开）

原理：Acme 自动在你的网站根目录下放置一个文件, （这个文件可以被互联网访问）来验证你的域名所有权,完成验证. 然后就可以生成证书了.

实例代码：（后面的路径请更改为你的 `网站根目录` `绝对路径` ）

- ~/.acme.sh/acme.sh \--issue \-d mydomain.com \-d <www.mydomain.com> \--webroot /home/wwwroot/mydomain.com/

#### DNS 验证的方式申请证书

这种方式的好处是, 你不需要任何服务器, 不需要任何公网 ip, 只需要 dns 的解析记录即可完成验证. 坏处是，如果不同时配置 Automatic DNS API，使用这种方式 acme.sh 将无法自动更新证书，每次都需要手动再次重新解析验证域名所有权。

Acme.sh 目前支持 cloudflare, dnspod, cloudxns, godaddy 以及 ovh 等数十种解析商

该方式可以申请多域名、泛域名证书，达到很多域名可以共用一张证书的目的。

#### 安装证书到指定文件夹

注意, 默认生成的证书都放在安装目录下: ~/.acme.sh/, 请不要直接使用此目录下的证书文件。  
正确的使用方法是使用 `--install-cert` 命令,并指定目标位置, 然后证书文件会被copy到相应的位置，比如下面的代码

- ~/.acme.sh/acme.sh \--installcert \-d mydomain.com \--key\-file /root/private.key \--fullchain\-file /root/cert.crt

上面的 `/root/private.key` 以及 `/root/cert.crt` 是把密钥和证书安装到 `/root` 目录，并改名为 `private.key` 和 `cert.crt`

#### 更新证书

目前证书在 `60` 天以后会自动更新, 你无需任何操作. 今后有可能会缩短这个时间, 不过都是自动的, 你不用关心.

#### 更新 Acme 脚本

升级 Acme.sh 到最新版本

1. ~/.acme.sh/acme.sh \--upgrade

如果你不想手动升级, 可以开启自动升级:

1. ~/.acme.sh/acme.sh \--upgrade \--auto\-upgrade

之后, acme.sh 就会自动保持更新了.
