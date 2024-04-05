# 常用命令

## sh数据库

> create database DB character set utf8

## 用户与权限

1. 创建用户

   > create user xxx@% identified by 'password';

2. 赋予权限

   > grant all on DB.* to USER@HOST identified by “PWD” ;
   >
   > grant select,insert,update on DB.* to USER@HOST identified by “PWD”;
   >
   > grant update,delete on DB.TABLE to USER@HOST identified by “PWD”;

3. 回收权限

   > revoke all on DB.TABLE from USER@HOST;

4. 刷新权限

   > flush privileges;

5. 修改密码

   > ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';  

6. 删除用户

   > drop user USER@'%';

## 备份

> mysqldump -uroot -p DB[:TABLE] > /tmp/mysql.sql

## 修复

> /usr/local/webserver/mysql/bin/mysqlcheck -hDB_HOST -uDB_USER -pDB_PWD --auto-repair --databases sop --fast
