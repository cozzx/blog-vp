## 常用命令

### 工具

#### 备份

```sh
mysqldump -uUSER -p DB[:TABLE] > /tmp/mysql.sql
```

#### 修复

```sh
mysqlcheck -uUSER -p --auto-repair --databases sop --fast
```

### DCL

用于数据库的访问控制和安全

#### 创建用户

```sql
create user xxx@% identified by 'password';
```

#### 赋予权限

```sql
grant all on DB.* to USER@HOST identified by “PWD” ;

grant select,insert,update on DB.* to USER@HOST identified by “PWD”;

grant update,delete on DB.TABLE to USER@HOST identified by “PWD”;
```

#### 回收权限

```sql
revoke all on DB.TABLE from USER@HOST;
```

#### 刷新权限

```sql
flush privileges;
```

#### 修改密码

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';  
```

#### 删除用户

```sql
drop user USER@'%';
```

### DDL

用于定义数据库的结构

#### 创建数据库

```sql
create database DB character set utf8mb4;
```

### DML

用于数据库中的数据操作

## 优化

