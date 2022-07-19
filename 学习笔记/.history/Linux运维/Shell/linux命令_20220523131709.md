Linux

# linux命令

## scp

scp test.txt root@192.168.177.129:/root/

scp -r root@192.168.62.10:/root/ /home/administrator/Desktop/new/

scp  -P 2026 -r root@ssh.hanboard.com.cn:/data/solr-8.3.0   /data/solr-8.3.0/ 



# vim字符操作

​	i 当前插入

​	I 行首插入

​	a 当前字符之后插入

​	A 行尾插入

​	o 下一行插入

​	O 上一行插e入

​	x 向后删除一个字符

​	X 向前删除一个字符

​	u 撤销一步  两下u 撤销所有

​	Ctrl+r 恢复上一步

 

   行操作

​	home键或^ 行首 $行尾

​	end键或dd 删除一行 Ndd

​	yy 复制一行 Nyy 复制N行

​	p  将复制行粘贴 P上粘

# SSH密钥认证

通过SSH协议，用户可以通过终端机访问和使用远程linux服务器，ssh的端口为22。但每次进行连接都要输入密码。如果管理几台到十几台集群，那可以应付的的过来。如果集群增加了几百，上千台。那么使用SSH管理起来就不方便了。所以SSH有没有更简便的方法呢？有的，在linux集群中，由一台管理机通过SSH管理其它的远程linux服务器，这种方法被称为SSH密钥认证管理服务器。原理如下图:

![img](/Users/jiusonghuang/pic-md/202201241553815.png)

### 创建密钥对:公钥和私钥

![image-20210128140158031](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210128140158031.png)

查看是否密钥创建成功,密钥生成后，保存在/root/.ssh/下，这是一个隐藏目录。

其中：id_dsa是私钥，id_dsa.pub是公钥

![image-20210128140245330](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210128140245330.png)

### 公钥拷贝到所有被管理机

![image-20210128144226896](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210128144226896.png)

![image-20210128144538799](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210128144538799.png)