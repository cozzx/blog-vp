---
title: elasticsearch
description: elasticsearch 的安装和使用
date: 2023-07-29
tags:
  - elasticsearch
---

## 安装

### docker 安装

### 安装 es8

命令：

```sh
docker run -d --name es8 \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -e "discovery.type=single-node" \
  -v /data/es8/data:/usr/share/elasticsearch/data \
  -v /data/es8/config:/usr/share/elasticsearch/config \
  -v /data/es8/plugins:/usr/share/elasticsearch/plugins \
  --privileged \
  --network es-net \
  -p 9200:9200 \
  -p 9300:9300 \
elasticsearch:8.12.2
```

说明：

1. `ES_JAVA_OPTS`: 环境变量，设置内置JVM启动参数
2. `discovery.type`: 环境变量，设置为在单节点环境下运行
3. `/data/es8/data`: 映射数据卷
4. `/data/es8/config`: 映射配置卷
5. `/data/es8/plugins`: 映射插件卷
6. `privileged`: 赋予宿主机权限
7. `network`: 指定运行网络
8. `9200`: api 操作 es 端口
9. `9300`: es 节点之间通信及数据传输端口

配置：

es8.0 以上默认开启了 ssl 认证，需要 https 访问或者关闭 SSL 认证。

容器配置文件：`/usr/share/elasticsearch/config/elasticsearch.yml`

- 默认 https 访问，当前版本自带证书，kibana 也需要配置证书
- 关闭 ssl 认证，使用 http 访问
  - `xpack.security.http.ssl: enabled: false`
  - 新增用户：`elasticsearch-users useradd admin`
  - 添加权限：`elasticsearch-users roles -a superuser admin`, `elasticsearch-users roles -a kibana_system admin`

- 关闭鉴权
  - `xpack.security.enabled: false`

### 安装 kibana

命令：

```sh
docker run -d --name kb8 \
  -e ELASTICSEARCH_HOSTS=http://es8:9200 \
  -v /data/kb8/config:/usr/share/kibana/config \
  --network=es-net \
  -p 5601:5601 \
kibana:8.12.2
```

说明：

1. `ELASTICSEARCH_HOSTS`: 环境变量，设置es访问地址
2. `/data/kb8/config`: 映射配置卷
3. `network`: 指定运行网络
4. `5601`: web 访问端口

配置：

容器配置文件路径：`/usr/share/kibana/config/kibana.yml`

- 默认 csp 模式为 true，会对浏览器进行安全检查
  - 配置文件添加用户名密码 `elasticsearch.username: adminelasticsearch.password: Pass1234`
- 可关闭 csp 模式，配置文件添加 `csp.strict: false`

### 安装 ik 分词器

```sh
docker exec -it es8 ./bin/elasticsearch-plugin install https://github.com/infinilabs/analysis-ik/releases/download/v8.12.2/elasticsearch-analysis-ik-8.12.2.zip
```

## 1.4.IK分词器

Elasticsearch的关键就是倒排索引，而倒排索引依赖于对文档内容的分词，而分词则需要高效、精准的分词算法，IK分词器就是这样一个中文分词算法。

### 1.4.1.安装IK分词器

**方案一**：在线安装

运行一个命令即可：

```Shell
docker exec -it es ./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip
```

然后重启es容器：

```Shell
docker restart es
```

**方案二**：离线安装

如果网速较差，也可以选择离线安装。

首先，查看之前安装的Elasticsearch容器的plugins数据卷目录：

```Shell
docker volume inspect es-plugins
```

结果如下：

```JSON
[
    {
        "CreatedAt": "2024-11-06T10:06:34+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/es-plugins/_data",
        "Name": "es-plugins",
        "Options": null,
        "Scope": "local"
    }
]
```

可以看到elasticsearch的插件挂载到了`/var/lib/docker/volumes/es-plugins/_data`这个目录。我们需要把IK分词器上传至这个目录。

找到课前资料提供的ik分词器插件，课前资料提供了`7.12.1`版本的ik分词器压缩文件，你需要对其解压：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NGY0ZjUyMzdlYzY4NjI0MGYxOTM5ZGVjYjEwNjlmZGVfTzJWMzI5M0JidWVHdEYyOENUMVVPZkZZQ20xT1MyOEJfVG9rZW46T3paR2IzV3ZJb29sYWJ4VUFRQ2NvdVBzbmlkXzE3MTQ1MTY2OTI6MTcxNDUyMDI5Ml9WNA)

然后上传至虚拟机的`/var/lib/docker/volumes/es-plugins/_data`这个目录：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=MjM0ZTBhN2M0YTM0M2YzMThiM2FjOTRjN2I1NWJjNWRfYm5Hcm9yMHJqRWN4bWg1cWJZMkpOR2hzcGl6bGtRdW1fVG9rZW46QThmZ2J5TUZ6b2h0cjF4VGFwNGNjMGtRbng4XzE3MTQ1MTY2OTI6MTcxNDUyMDI5Ml9WNA)

最后，重启es容器：

```Shell
docker restart es
```

### 1.4.2.使用IK分词器

IK分词器包含两种模式：

-  `ik_smart`：智能语义切分 
-  `ik_max_word`：最细粒度切分 
