# mongodb

[官网手册](https://www.mongodb.com/docs/manual)

## 数据库连接

mongo --host 127.0.0.1 --port 28000 -u admin -p admin

## 数据库操作

show databases(show dbs)

### 集合操作

```mongodb

db.createCollection('movie')

show collections

db.collection.update({}, {$rename:{"旧键名称":"新键名称"}}, false, true)

db.movie.drop()
```

### 数据操作

```mongodb
 db.menu.insert(
  {
   "id" : 35,
   "label" : "链接",
   "level" : 2,
   "link" : "/systemLink",
   "order" : 140,
   "pid" : 32,
   "icon" : "null",
   "is_show" : 1,
   "code" : "system_link"
  }
 )
 
 db.menu.find({"role": "administrator"}).pretty()
```

```mongodb
db.deviceAlarm.update({$or: [{'id': '625'},{'id': '626'},{'id': '627'},{'id': '628'},{'id': '629'},{'id': '630'},{'id': '631'}]}, {$set: {'type': NumberLong(3)}}, {multi: true})

db.alarmStatistics.update({$or: [{'id': '625'},{'id': '626'},{'id': '627'},{'id': '628'},{'id': '629'},{'id': '630'},{'id': '631'}]}, {$set: {'type': NumberLong(3)}}, {multi: true})
```

## 备份与恢复

### 备份

mongodump

```shell
-h 服务器地址
-d 需要备份的数据库实例
-o 备份的数据存放位置

--host
--port
--db
--out
```
