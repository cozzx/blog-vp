# Redis 10大数据类型

## 概述

Redis 中的数据类型指的是 value 的数据类型，key 的数据类型都是字符串。

### 分类

1. Redis 字符串 (string)
2. Redis 列表 (list)
3. Redis 哈希表 (hash)
4. Redis 集合 (set)
5. Redis 有序集合 (zset)
6. Redis 地理位置 (geo)
7. Redis 基数统计 (hyperloglog)
8. Redis 位图 (bitmap)
9. Redis 位域 (bitfield)
10. Redis 流 (stream)

## 操作命令

官网地址：[Redis 官网](https://redis.io/commands) [Redis 中文网](http://www.redis.cn/commands.html)

key 不区分大小写，数据类型区分大小写。

### 键操作

- keys * : 查看当前库所有 key
- exists key : 判断 key 是否存在
- type key : 查看 key 的类型
- del key : 根据 key 删除数据
- unlink key : 非阻塞删除，将 key 从 keyspace 元数据中删除，真正的删除在后续异步中操作
- ttl key : 查看过期时间，-1 表示永不过期，-2 表示已经过期
- expire key : 设置过期时间，单位秒
- move key [0-15] : 将当前数据库的数据移动到指定数据库
- select [0-15] : 切换数据库
- dbsize : 查看当前数据库 key 的数量
- flushdb : 清空当前数据库
- Flushall : 清空所有数据库

### 数据操作

帮助命令：help@类型，例如 help @string

#### string

- set key value : 设置值
- get key : 获取值
- ttl key : 查看过期时间
- getrange key start end : 获取值的子字符串
- getset key : 设置值并返回旧值
- getbit key offset : 获取指定偏移量上的位
- mget key1 [key2...] : 获取多个值
- setbit key offset value : 设置或清除指定偏移量上的位
- setex key second value : 将 value 关联到 key 并将 key 的过期时间设置为 second
- setnx key value : 当 key 不存在时设置 value
- setrange key offset value : 将 value 覆写指定 key 的值，从偏移量 offset 开始
- strlen key : 返回值的长度
- mset key value [key value] : 设置多个键值对
- msetnx key value [key value] : 当所有给定 key 都不存在时，设置多个键值对
- psetex key millisecond value : 以毫秒单位设置 key 的生存时间
- incr key : 数字值加 1
- incrby key increment : 数字值加增量值 increment
- incrbyfloat key increment : 数字值加浮点增量值 increment
- decr key : 数字值减 1
- decrby key decrement : 数字值减增量值 decrement
- decrbyfloat key decrement : 数字值减浮点增量值 decrement
- append key value : 如果 key 的值已经存在并且是字符串，append 将 value 添加到 key 原来值的末尾

#### list

- blpop key1 [key2] timeout 
