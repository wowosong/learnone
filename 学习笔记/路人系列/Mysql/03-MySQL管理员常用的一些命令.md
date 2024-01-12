

#    MySQL管理员常用的一些命令   

环境：mysql5.7.25，cmd命令中进行演示。

在玩mysql的过程中，经常遇到有很多朋友在云上面玩mysql的时候，说我创建了一个用户为什么不能登录？为什么没有权限？等等各种问题，本文看完之后，这些都不是问题了。

## 本文主要内容

1.  介绍Mysql权限工作原理
2.  查看所有用户
3.  创建用户
4.  修改密码
5.  给用户授权
6.  查看用户权限
7.  撤销用户权限
8.  删除用户
9.  授权原则说明
10.  总结

## Mysql权限工作原理

**mysql是如何来识别一个用户的呢？**

mysql为了安全性考虑，采用`主机名+用户名`来判断一个用户的身份，因为在互联网中很难通过用户名来判断一个用户的身份，但是我们可以通过ip或者主机名判断一台机器，某个用户通过这个机器过来的，我们可以识别为一个用户，所以**mysql中采用用户名+主机名来识别用户的身份**。当一个用户对mysql发送指令的时候，mysql就是通过用户名和来源（主机）来断定用户的权限。

**Mysql权限验证分为2个阶段：**

1.  阶段1：连接数据库，此时mysql会根据你的用户名及你的来源（ip或者主机名称）判断是否有权限连接
2.  阶段2：对mysql服务器发起请求操作，如create table、select、delete、update、create index等操作，此时mysql会判断你是否有权限操作这些指令

## 权限生效时间

用户及权限信息放在库名为mysql的库中，mysql启动时，这些内容被读进内存并且从此时生效，所以如果通过直接操作这些表来修改用户及权限信息的，需要`重启mysql`或者执行`flush privileges;`才可以生效。

用户登录之后，mysql会和当前用户之间创建一个连接，此时用户相关的权限信息都保存在这个连接中，存放在内存中，此时如果有其他地方修改了当前用户的权限，这些变更的权限会在下一次登录时才会生效。

## 查看mysql中所有用户

用户信息在`mysql.user`表中，如下：

```java
mysql> use mysql;
Database changed
mysql> select user,host from user;
+---------------+--------------+
| user          | host         |
+---------------+--------------+
| test4         | 127.0.0.%    |
| test4         | 192.168.11.% |
| mysql.session | localhost    |
| mysql.sys     | localhost    |
| root          | localhost    |
| test2         | localhost    |
+---------------+--------------+
6 rows in set (0.00 sec)
```

## 创建用户

**语法：**

```java
create user 用户名[@主机名] [identified by '密码'];
```

> 说明：
> 
> 1.  主机名默认值为%，表示这个用户可以从任何主机连接mysql服务器
> 2.  密码可以省略，表示无密码登录

**示例1：不指定主机名**

> 不指定主机名时，表示这个用户可以从任何主机连接mysql服务器

```java
mysql> use mysql;
Database changed

mysql> select user,host from user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
+---------------+-----------+
3 rows in set (0.00 sec)

mysql> create user test1;
Query OK, 0 rows affected (0.00 sec)

mysql> select user,host from user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| test1         | %         |
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
+---------------+-----------+
4 rows in set (0.00 sec)

mysql> exit
Bye

C:\Users\Think>mysql -utest1
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 49
Server version: 5.7.25-log MySQL Community Server (GPL)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

上面创建了用户名为`test1`无密码的用户，没有指定主机，可以看出host的默认值为`%`，表示`test1`可以从任何机器登录到mysql中。

用户创建之后可以在`mysql`库中通过 `select user,host from user;`查看到。

**其他示例**

```java
create user 'test2'@'localhost' identified by '123';
```

说明：test2的主机为localhost表示本机，此用户只能登陆本机的mysql

```java
create user 'test3'@% identified by '123';
```

说明：test3可以从任何机器连接到mysql服务器

```java
create user 'test4'@'192.168.11.%' identified by '123';
```

说明：test4可以从192.168.11段的机器连接mysql

## 修改密码【3种方式】

**方式1：通过管理员修改密码**

```java
SET PASSWORD FOR '用户名'@'主机' = PASSWORD('密码');
```

**方式2：create user 用户名\[@主机名\] \[identified by ‘密码’\];**

```java
set password = password('密码');
```

**方式3：通过修改mysql.user表修改密码**

```java
use mysql;
update user set authentication_string = password('321') where user = 'test1' and host = '%';
flush privileges;
```

**注意：**

**通过表的方式修改之后，需要执行`flush privileges;`才能对用户生效。**

**5.7中user表中的authentication\_string字段表示密码，老的一些版本中密码字段是password。**

## 给用户授权

创建用户之后，需要给用户授权，才有意义。

**语法：**

```java
grant privileges ON database.table TO 'username'[@'host'] [with grant option]
```

**grant命令说明：**

*   priveleges (权限列表)，可以是`all`，表示所有权限，也可以是`select、update`等权限，多个权限之间用逗号分开。
*   ON 用来指定权限针对哪些库和表，格式为`数据库.表名` ，点号前面用来指定数据库名，点号后面用来指定表名，`*.*` 表示所有数据库所有表。
*   TO 表示将权限赋予某个用户, 格式为`username@host`，@前面为用户名，@后面接限制的主机，可以是IP、IP段、域名以及%，%表示任何地方。
*   WITH GRANT OPTION 这个选项表示该用户可以将自己拥有的权限授权给别人。注意：经常有人在创建操作用户的时候不指定WITH GRANT OPTION选项导致后来该用户不能使用GRANT命令创建用户或者给其它用户授权。  
    _备注：可以使用GRANT重复给用户添加权限，权限叠加，比如你先给用户添加一个select权限，然后又给用户添加一个insert权限，那么该用户就同时拥有了select和insert权限。_

**示例：**

```java
grant all on *.* to 'test1'@‘%’;
```

说明：给test1授权可以操作所有库所有权限，相当于dba

```java
grant select on seata.* to 'test1'@'%';
```

说明：test1可以对seata库中所有的表执行select

```java
grant select,update on seata.* to 'test1'@'%';
```

说明：test1可以对seata库中所有的表执行select、update

```java
grant select(user,host) on mysql.user to 'test1'@'localhost';
```

说明：test1用户只能查询mysql.user表的user,host字段

## 查看用户有哪些权限

**show grants for ‘用户名’\[@’主机’\]**

主机可以省略，默认值为%，示例：

```java
mysql> show grants for 'test1'@'localhost';
+--------------------------------------------------------------------+
| Grants for test1@localhost                                         |
+--------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'test1'@'localhost'                          |
| GRANT SELECT (host, user) ON `mysql`.`user` TO 'test1'@'localhost' |
+--------------------------------------------------------------------+
2 rows in set (0.00 sec)
```

**show grants;**

查看当前用户的权限，如：

```java
mysql> show grants;
+---------------------------------------------------------------------+
| Grants for root@localhost                                           |
+---------------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION |
| GRANT ALL PRIVILEGES ON `test`.* TO 'root'@'localhost'              |
| GRANT DELETE ON `seata`.* TO 'root'@'localhost'                     |
| GRANT PROXY ON ''@'' TO 'root'@'localhost' WITH GRANT OPTION        |
+---------------------------------------------------------------------+
4 rows in set (0.00 sec)
```

## 撤销用户的权限

**语法**

```java
revoke privileges ON database.table FROM '用户名'[@'主机'];
```

可以先通过`show grants`命令查询一下用户对于的权限，然后使用`revoke`命令撤销用户对应的权限，示例：

```java
mysql> show grants for 'test1'@'localhost';
+--------------------------------------------------------------------+
| Grants for test1@localhost                                         |
+--------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'test1'@'localhost'                          |
| GRANT SELECT (host, user) ON `mysql`.`user` TO 'test1'@'localhost' |
+--------------------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> revoke select(host) on mysql.user from test1@localhost;
Query OK, 0 rows affected (0.00 sec)

mysql> show grants for 'test1'@'localhost';
+--------------------------------------------------------------+
| Grants for test1@localhost                                   |
+--------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'test1'@'localhost'                    |
| GRANT SELECT (user) ON `mysql`.`user` TO 'test1'@'localhost' |
+--------------------------------------------------------------+
2 rows in set (0.00 sec)
```

上面我们先通过`grants`命令查看test1的权限，然后调用revoke命令撤销对`mysql.user`表`host`字段的查询权限，最后又通过grants命令查看了test1的权限，和预期结果一致。

## 删除用户【2种方式】

**方式1：**

**drop user ‘用户名’\[@‘主机’\]**，示例：

```java
mysql> drop user test1@localhost;
Query OK, 0 rows affected (0.00 sec)
```

drop的方式删除用户之后，用户下次登录就会起效。

**方式2：**

通过删除mysql.user表数据的方式删除，如下：

```java
delete from user where user='用户名' and host='主机';
flush privileges;
```

注意通过表的方式删除的，需要调用`flush privileges;`刷新权限信息（权限启动的时候在内存中保存着，通过表的方式修改之后需要刷新一下）。

## 授权原则说明

*   只授予能满足需要的最小权限，防止用户干坏事，比如用户只是需要查询，那就只给select权限就可以了，不要给用户赋予update、insert或者delete权限
*   创建用户的时候限制用户的登录主机，一般是限制成指定IP或者内网IP段
*   初始化数据库的时候删除没有密码的用户，安装完数据库的时候会自动创建一些用户，这些用户默认没有密码
*   为每个用户设置满足密码复杂度的密码
*   定期清理不需要的用户，回收权限或者删除用户

## 总结

1.  通过命令的方式操作用户和权限不需要刷新，下次登录自动生效
2.  通过操作mysql库中表的方式修改、用户信息，需要调用`flush privileges;`刷新一下，下次登录自动生效
3.  mysql识别用户身份的方式是：用户名+主机
4.  本文中讲到的一些指令中带主机的，主机都可以省略，默认值为%，表示所有机器
5.  mysql中用户和权限的信息在库名为mysql的库中
