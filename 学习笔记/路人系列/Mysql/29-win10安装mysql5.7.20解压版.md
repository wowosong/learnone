

#    win10安装mysql5.7.20解压版   

[MySQL教程](http://www.itsoku.com/course/3)  ->  win10安装mysql5.7.20解压版

[上一篇：MySQL系列测试库脚本](http://www.itsoku.com/course/3/196)

mysql安装包可到官网下载，地址：`https://dev.mysql.com/downloads/mysql`

![20190827141538631](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091725933.png)

1、首先解压文件包，我这解压到E:\\install\_work\\mysql目录下：  
![20190827141552029](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091725003.png)

2、发现mysql根目录下没有data目录和my.ini文件，不要紧，初始化mysql的时候系统会自动创建一个data目录，我们只需创建一个my.ini文件即可。  
新建记事本，将下面代码复制到记事本中：

```txt
[Client]
port = 3306

[mysqld]
#设置3306端口
port = 3306
# 设置mysql的安装目录
basedir=E:\install_work\mysql
# 设置mysql数据库的数据的存放目录
datadir=E:\install_work\mysql\data
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
```

3、初始化mysql，搜索cmd找到命令提示符，右键以管理员身份运行，进入bin目录，输入以下命令：

```plain
mysqld --initialize --user=mysql --console
```

![20190827141635389](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091726408.png)

初始化成功后，系统会在mysql目录下创建data目录，并生成初始密码。

![20190827141650914](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091727887.png)

为防止丢失，我们先将密码保存到文本中。

4、输入以下命令安装mysql：  
mysqld —install mysql  
显示Service successfully installed.表示安装成功。

![20190827141732838](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091727356.png)

5、输入以下命令启动mysql：  
net start mysql

![20190827141748934](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091727772.png)

如果启动失败，可在计算机服务中找到mysql右击手动启动mysql服务

6、输入以下命令登录mysql：  
mysql -u root -p，输入初始密码，复制初始密码，点击右键可粘贴。

![20190827141811255](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091728433.png)

7、修改mysql登录密码，输入以下命令（注意要输入分号）  
set password=password(‘新密码’);

![20190827141834475](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091728659.png)

8、为了方便后续操作，我们需要配置mysql的环境变量。  
选择Path，将我们的bin目录添加到环境变量中。  
（1）新建系统变量 MYSQL\_HOME （mysql根目录），并配置变量值为E:\\install\_work\\mysql；

![20190827141851280](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091728382.png)

（2）编辑系统变量 Path ，将 ;%MYSQL\_HOME%\\bin 添加到 Path 变量值后面。

![20190827141924215](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401091728809.png)

配置好后，下次即可用新密码登陆mysql。

可能遇到的问题  

1、输入mysqld —initialize —user=mysql —console时出现：

由于系统找不到MSVCR120.dll，无法继续执行代码。重新安装程序可能会解决此问题

由于系统找不到MSVCP120.dll，无法继续执行代码。重新安装程序可能会解决此问题

解决方案：

下载DirectX修复工具增强版，参考地址：`http://blog.csdn.net/vbcom/article/details/7245186`
