# Git&GitHub

 

## **1** **版本控制工具应该具备的功能**

 

### 协同修改

多人并行不悖的修改服务器端的同一个文件。



### 数据备份

不仅保存目录和文件的当前状态，还能够保存每一个提交过的历史状态。



### 版本管理

在保存每一个版本的文件信息的时候要做到不保存重复数据，以节约存储空间，提高运行效率。这方面 SVN 采用的是增量式管理的方式，而 **Git** **采取了文件系统快照的方式**。



### 权限控制

对团队中参与开发的人员进行权限控制。

对团队外开发者贡献的代码进行审核——Git 独有。



### 历史记录

查看修改人、修改时间、修改内容、日志信息。

将本地文件恢复到某一个历史状态。

分支管理

允许开发团队在工作过程中多条生产线同时推进任务，进一步提高效率。

 

## **2** **版本控制简介**

 

**2.1**版本控制工程设计领域中使用版本控制管理工程蓝图的设计过程。在 IT 开发过程中也可以使用版本控制思想管理代码的版本迭代。

**2.2**版本控制工具

思想：版本控制

实现：版本控制工具

 

集中式版本控制工具：

CVS、**SVN**、VSS……

**单点故障**

![img](/Users/jiusonghuang/pic-md/20220122132842.png) 

**分布式版本控制工具：**(每个用户机,也都有版本历史)意味可以本地库传本地不建议这么做**

**Git**、Mercurial、Bazaar、Darcs……

![image-20220122135538422](/Users/jiusonghuang/pic-md/20220122135538.png)

## **3 Git** **简介** 

### 3.1、Git 简史

  ![img](/Users/jiusonghuang/pic-md/20220122132904.jpg)



### 3.2、Git 官网和 Logo	

**官网地址：**[**https://git-scm.com/**](https://git-scm.com/)

**Logo**：**

![img](/Users/jiusonghuang/pic-md/20220122132914.jpg) 



### 3.3、Git 的优势 

**大部分操作在本地完成，不需要联网**

**完整性保证**(提交每条数据进行hash运算)**

**尽可能添加数据而不是删除或修改数据**

**分支操作非常快捷流畅**(1因为用快照,2每个分支只是创建一个指针)**

**与** **Linux** **命令全面兼容**()**

 

### **3.4、Git** **安装** **windows安装**

https://www.cnblogs.com/wlming/p/12213876.html Windows安装

(linux直接yum install -y git),加-y自动选择y，全自动

 ![img](/Users/jiusonghuang/pic-md/20220122132923.jpg)

2下面默认设置就行:下图(下一步) **3**这个的下一步也使用默认 直接下一步

![img](/Users/jiusonghuang/pic-md/20220122132929.jpg) 

 

**4** **选择默认的文本编辑器**

![img](/Users/jiusonghuang/pic-md/20220122132935.jpg) 

**5** 然后修改环境变量(选第一完全不修改),下面选项第二个(是被认为安全的)

![image-20220122140125722](/Users/jiusonghuang/pic-md/20220122140125.png)

**6** 选择客服端**本地库和远程库连接方式**(1通用连接2使用Windows连接方式)

![img](/Users/jiusonghuang/pic-md/20220122132950.jpg) 

**7** **选择换行符的方式**(**1**检查文件时LF 转为 CRLF 提交相反)

![image-20220122135811389](/Users/jiusonghuang/Library/Application%20Support/typora-user-images/image-20220122135811389.png) 

8 **选择终端**(1Git默认终端(是liunx命令)2选择Windows终端(wind命令))

![img](/Users/jiusonghuang/pic-md/20220122133003.jpg) 

**9** 使用默认(选择第二个需要安装.NET framework c4.5.1以上版本)

NET framework安装失败解决方案:

https://jingyan.baidu.com/article/fb48e8bee50ebf6e632e1464.html 

![img](/Users/jiusonghuang/pic-md/20220122133009.jpg) 

 

**10** 

![img](/Users/jiusonghuang/pic-md/20220122133015.jpg) 

**11** (1加载他的git Bash终端2查看更新的文档)

![image-20220122135501717](/Users/jiusonghuang/pic-md/20220122135501.png)

### 3.5、Git 结构 

![img](/Users/jiusonghuang/pic-md/20220122133036.jpg) 

### 3.6、Git和代码托管中心

**代码托管中心的任务：**维护远程库**

局域网环境下

**GitLab 服务器**

外网环境下

**GitHub**

**码云**

### 3.7、本地库和远程库(上面3.5是git结构)

**3.7.1 团队内部协作**

![img](/Users/jiusonghuang/pic-md/20220122133043.jpg) 

**3.7.2** **跨团队协作** **p9**

![img](/Users/jiusonghuang/pic-md/20220122133049.jpg) 

 



## 4 Git 命令行操作 

### 4.1、本地库初始化

**命令：**`git init` (切换到目录>右键Git Bash Here>用liunx命令到对应目录下>初始化)

**效果:** 会在当前目录 生成.git目录(隐藏的)

![img](/Users/jiusonghuang/pic-md/20220122133056.jpg) 

注意：.git 目录中存放的是本地库相关的子目录和文件，不要删除，也不要胡乱修改。



### 4.2、设置签名(本地库初始化后,要执行的)

#### 形式

用户名：hong

Email 地址：hong.@qq.com

作用：区分不同开发人员的身份

辨析：这里设置的签名和登录远程库(代码托管中心的账号、密码没有任何关系)



#### 命令

##### 项目级别/仓库级别：

`git config user.name hong`

`git config user.email hong.@qq.com`

信息保存位置：**./.git/config 文件**

![img](/Users/jiusonghuang/pic-md/20220122133103.jpg) 

##### 系统用户级别：

`git config --global user.name hong`

`git config --global user.email hong.@qq.com`

信息保存位置：**~/.gitconfig** **文件** **(家目录下c/user)**

![img](/Users/jiusonghuang/pic-md/20220122133109.jpg) 



**级别优先级**

1就近原则：项目级别优先于系统用户级别，二者都有时采用项目级别的签名

2如果只有系统用户级别的签名，就以系统用户级别的签名为准3二者都没有不允许



### 4.3、基本操作

#### 4.3.1 状态查看

**` git status`**  

​	第一代表是那个分区的，第二是否提交，第三有没有可提交的文件和提示

​	查看工作区、暂存区状态



#### 4.3.2 添加/撤回>暂存区 

**`git add [file name]`**  

​	提交到暂存区,并且转换换行符

​	将工作区的“新建/修改”**添加到暂存区**

**`git add .`**

​	将工作区的所有文件提交到缓存区

**`git rm --cached [file name]`**  

​	从缓存区撤回

**`git rm -r --cached .`**

​	清空缓存区





#### 4.3.3 提交

**`git commit file`** 

​	这种方式提交会进入到提交信息输入页面。

**`git commit -m "commit message" [file name]`**

​	将暂存区的内容提交到本地库，不会进入信息输入页面。

**` git restore <file>`**

​	 撤销某个文件修改的操作 

**`git reset HEAD <file>`**

​	可以把暂存区的修改撤销掉 (unstage)，重新放回工作区

**`git commit -m "commit message" .`**

​	将暂存区的所有内容提交到本地库



#### 4.3.4 查看历史记录(4种查询)

##### git log 

查看版本记录

![img](/Users/jiusonghuang/pic-md/20220122133118.png) 

多屏显示控制方式：空格向下翻页 ,b 向上翻页 ,q 退出(超过了自动多屏)



##### git log --pretty=oneline 

每个历史只显示一行(hash值和日志)

 ![img](/Users/jiusonghuang/pic-md/20220122133128.png)



##### git log --oneline  

每个历史只显示一行且显示hash的部分值

 ![img](/Users/jiusonghuang/pic-md/20220122133137.png)



##### git reflog  

显示历史只显示一行，并且显示指针(要移动到版本多少步)

 ![img](/Users/jiusonghuang/pic-md/20220122133146.png)

HEAD@{移动到当前版本需要多少步}



#### 4.3.5 前进后退 (三种方式)

**本质:指针移动**

  ![img](/Users/jiusonghuang/pic-md/20220122133152.jpg)

##### 1、基于`索引值`操作 [推荐]

​	`git reset --hard [局部索引值]`

​	`git reset --hard a6ace91`



##### 2、使用`^符号`：只能后退

​	`git reset --hard HEAD^^`

​	注意：一个`^`表示后退一步，`n个^`表示后退 n 步



##### 3、使用`~符号`：只能后退

​	`git reset --hard HEAD~n `

​	表示后退 n 步

​	`git reset --hard HEAD~3 `

​	表示后退3步



#### 4.3.6 reset 命令的三个参数对比 

(查看命令帮助文档: **git help reset**)

##### --soft 参数

**仅仅在本地库移动** HEAD 指针 (查看状态时,绿色提示,本地库和暂存区不同步)，相当于撤销了 commit 操纵

![img](/Users/jiusonghuang/pic-md/20220122133201.jpg) 



##### --mixed 参数

在本地库移动 HEAD 指针，相当于撤销了 add、commit 操纵

重置**暂存区**

![img](/Users/jiusonghuang/pic-md/20220122133207.jpg) 



##### --hard 参数

在本地库移动 HEAD 指针

**重置暂存区**

**重置工作区**



#### 4.3.7 删除文件并找回

在 `Git` 日志中提交一次文件，突然不想要这个文件了 ( 如何删除？ )；删除后又想找回这个文件 ( 如何找回 )？

**前提：**

​	删除前，文件存在时的状态提交到了本地库。此时日志中就保存了文件存在时的记录。

**删除操作：** 

​	进入的文件目录 

​	**`rm aaa.txt` 删除本地文件** 

 	**然后将本次删除操作提交到暂存区 `git add aaa.txt`** 

​	**然后提交到本地仓库 `git commit -m ”delete aaa” aaa.txt`，此时日志中就保存了文件删除的记录** 

**找回操作：**

​	前提：`Git` 日志中保存了文件存在的记录。

​	`git reset --hard [指针位置] `

​	**删除操作已经提交到本地库**：指针位置指向历史记录 ( 回到之前未删除版本 ) 

​	**删除操作尚未提交到本地库**：指针位置使用 HEAD ( `git reset --hard HEAD` ) 回到当前指向的版本 



#### 4.3.8 比较文件差异  

`git diff [文件名]`   

​	将**工作区文件**和**暂存区**进行比较

`git diff [本地库中历史版本] [文件名]`  

​	将**工作区文件**和**本地库历史记录**进行比较

​	`git diff HEAD^ apple.txt`  可以用**HEAD**或者版本**索引值**

**不带文件名比较所有的文件**



### 4.4、分支管理

#### 4.4.2 什么是分支？

1、在版本控制过程中，使用多条线同时推进多个任务。

![img](/Users/jiusonghuang/pic-md/20220122133216.jpg) 

2、分支的好处？

​	同时并行推进多个功能开发，提高开发效率

​	各个分支在开发过程中，如果某一个分支开发失败，不会对其他分支有任何影响。失败的分支删除重新开始即可。



#### 4.4.3 分支操作 

**创建分支:**  

​	`git branch [分支名]` 



**查看分支:**  

​	`git branch -v`



**切换分支:**  

​	`git checkout [分支名]` 



**合并分支:**

​	`git merge [有新内容分支名]`

​	**第一步：**

​		切换到接受修改的分支 (被合并,增加新内容) 上 

​		`git checkout [被合并分支名] `

​	**第二步：**

​		执行 merge 命令 (合并分支指令)

​		`git merge [有新内容分支名]`



**解决冲突：**

​	**冲突原因：**

​		2个分支，修改同一文件，同一位置，修改内容不一样时。

​	**冲突的表现：**

   ![img](/Users/jiusonghuang/pic-md/20220122133225.jpg)

​	**冲突的解决：**

​		第一步：编辑文件，删除特殊符号

​		第二步：把文件修改到满意的程度，保存退出

​		第三步：git add [文件名]

​		第四步：git commit -m "日志信息"

​	**注意：此时 commit 一定不能带具体文件名**



## 5 Git 基本原理

### 5.1、哈希  

![img](/Users/jiusonghuang/pic-md/20220122133232.jpg) 

**哈希是一个系列的加密算法，**各个不同的哈希算法虽然加密强度不同，但是有以下

几个共同点：

①不管输入数据的数据量有多大,输入同一个哈希算法,得到的加密结果长度固定。

②哈希算法确定，输入数据确定，输出数据能够保证不变

③哈希算法确定，输入数据有变化，输出数据一定有变化，而且通常变化很大

④哈希算法不可逆

**Git 底层采用的是 SHA-1 算法。**

哈希算法可以被用来验证文件。原理如下图所示：(传输前后hash值对比)

 ![img](/Users/jiusonghuang/pic-md/20220122133238.jpg)

**Git** **就是**靠这种机制**来从根本上**保证数据完整性**的。**



### 5.2、Git 保存版本的机制

#### 5.2.1 集中式版本控制工具的文件管理机制

以文件变更列表的方式存储信息。这类系统将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异。SVN

 ![img](/Users/jiusonghuang/pic-md/20220122133245.png)

#### 5.2.2 Git 的文件管理机制

Git 把数据看作是小型文件系统的一组快照。每次提交更新时 Git 都会对当前的全部文件制作一个快照并**保存这个快照的索引**。为了高效，如果文件没有修改， Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。所以 Git 的工作方式可以称之为**快照流**。

![img](/Users/jiusonghuang/pic-md/20220122133254.png) 

#### 5.2.3 Git 文件管理机制细节

Git 的“提交对象” (每个文件对应的hash值)

![img](/Users/jiusonghuang/pic-md/20220122133301.jpg) 

提交对象及其父对象形成的链条

![img](/Users/jiusonghuang/pic-md/20220122133307.jpg) 



### 5.3Git 分支管理机制 

#### 5.3.1 分支的创建(就是新建一个指针)

 ![img](/Users/jiusonghuang/pic-md/20220122133315.jpg)

#### 5.3.2 分支的切换 (HEAD指向) 

![image-20220122133401670](/Users/jiusonghuang/pic-md/20220122133401.png)

 

#### 5.3.3 HEAD指向testing时提交了内容

 ![img](/Users/jiusonghuang/pic-md/20220122133437.jpg)

#### 5.3.4 切换回 master

  ![img](/Users/jiusonghuang/pic-md/20220122133443.jpg)

 

#### 5.3.5  HEAD指向master时 提交了数据

  ![img](/Users/jiusonghuang/pic-md/20220122133449.jpg)

 

## 6 GitHub

### 6.1、账号信息

GitHub 首页就是注册页面：https://github.com/

| ![img](/Users/jiusonghuang/pic-md/20220122133458.jpg) | Email 地址：atguigu2018ybuq@aliyun.comGitHub 账号：atguigu2018ybuq |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](/Users/jiusonghuang/pic-md/20220122133506.jpg) | Email 地址：atguigu2018lhuc@aliyun.comGitHub 账号：atguigu2018lhuc |
| ![img](/Users/jiusonghuang/pic-md/20220122133516.jpg) | Email 地址：atguigu2018east@aliyun.comGitHub 账号：atguigu2018east |



### 6.2、创建远程库 

![img](/Users/jiusonghuang/pic-md/20220122133526.png) 

![image-20220122140251381](/Users/jiusonghuang/pic-md/20220122140251.png)

### 6.3、创建远程库地址别名 

![img](/Users/jiusonghuang/pic-md/20220122133541.jpg) 

**`git remote -v`**  查看当前所有远程地址别名 

**`git remote add [别名] [远程地址]`**  添加远程地址

![img](/Users/jiusonghuang/pic-md/20220122133547.png) 



### 6.4、推送 

**`git push [别名] [分支名]`**  git push origin master  ( 回车可能需要等待一会会，弹出对话框 > 输入用户和密码 )

  ![img](/Users/jiusonghuang/pic-md/20220122133556.png)



### 6.5、克隆

`git clone [远程地址] `

![img](/Users/jiusonghuang/pic-md/20220122133606.jpg) 

成功:

![img](/Users/jiusonghuang/pic-md/20220122133613.jpg) 

**克隆效果：**

​	**完整的把远程库下载到本地**

​	**创建 origin 远程地址别名** (git remote -v查看远程库别名)

​	**初始化本地库**(就是:git init)



### 6.6、团队成员邀请(邀请用户才能提交)

 ![img](/Users/jiusonghuang/pic-md/20220122133619.jpg)

**和老师笔记不一样的地方**

![img](/Users/jiusonghuang/pic-md/20220122133628.jpg) 

 

![img](/Users/jiusonghuang/pic-md/20220122133635.jpg) 

“岳不群”其他方式**把邀请链接发送给“令狐冲”，“**令狐冲”**登录自己的** **GitHub** **账号，**访问邀请链接。

点击接受 >然后在执行推送

![img](/Users/jiusonghuang/pic-md/20220122133642.png) 

:推送了第一次在此推送不要输入用户名:git 本身不具备记录功能,Windows中**凭据管理器**记录用户名和密码

**控制面板\所有控制面板项\凭据管理器**(如果想切换用户:删除记录)**

![img](/Users/jiusonghuang/pic-md/20220122133652.jpg) 

 lhc>提交后>>然后推送 **git push origin master**



### 6.7、拉取 

pull=fetch+merge

**`git fetch [远程库地址别名origin] [远程分支名master]`**  抓去下来

**` git checkout origin/maste`r**  切换到链接地址 ( 别名 ) 的 master (可查看抓取下来内容)

切换回  **`git checkout master`**

**`git merge [远程库地址别名origin/master远程分支名]`**  合并

**`git pull [远程库地址别名] [远程分支名]`**  等于上面步骤



### 6.8、解决冲突 

**要点**

​	如果不是基于 GitHub 远程库的最新版所做的修改，不能推送，必须先拉取。

​	拉取下来后如果进入冲突状态，则按照**“分支冲突解决”**操作解决即可。

**类比**

​	债权人：老王

​	债务人：小刘

​	老王说：10 天后归还。小刘接受，双方达成一致。

​	老王媳妇说：5 天后归还。小刘不能接受。老王媳妇需要找老王确认后再执行。



### 6.9、跨团队协作

**1(**先复制**当前库地址**,发式给dfbb,然后有**dfbb登录**访问这个地址)>然后**Fork** 

  ![img](/Users/jiusonghuang/pic-md/20220122133709.jpg)

![img](/Users/jiusonghuang/pic-md/20220122133715.jpg)正在fork的界面

fork 过来的仓库说明 回多下面一行(forked from at...)说明fork来源

![img](/Users/jiusonghuang/pic-md/20220122133721.jpg) 

2 dfbb(”东方不败”)本地修改，然后推送到远程 git push origin master

**3** dfbb在远程库中选择Pull Request

![img](/Users/jiusonghuang/pic-md/20220122133727.jpg) 

![img](/Users/jiusonghuang/pic-md/20220122133739.jpg)3.2然后点击里面的New pull requset

![img](/Users/jiusonghuang/pic-md/20220122133743.jpg)3.3 然后点击 Create pull request

 3.4 然后发送消息给,fork的库(ybq(岳不群))

![img](/Users/jiusonghuang/pic-md/20220122133749.jpg) 

**4** ybq操作

![img](/Users/jiusonghuang/pic-md/20220122133758.jpg) 

**5**![img](/Users/jiusonghuang/pic-md/20220122133805.jpg)

**5.2**对话** **(这时还可以相互对话)**

![img](/Users/jiusonghuang/pic-md/20220122133812.jpg) 

![img](/Users/jiusonghuang/pic-md/20220122133822.png) 

**6** **审核代码**

![img](/Users/jiusonghuang/pic-md/20220122133830.jpg) 

**合并代码** **(回到对话Conversation>>合并操作如图)**

 

![img](/Users/jiusonghuang/pic-md/20220122133837.jpg) 

 

![img](/Users/jiusonghuang/pic-md/20220122133842.jpg) 

![img](/Users/jiusonghuang/pic-md/20220122133847.jpg) 

**上面操作完了就远程库就有合并内容>然后**>将远程库修改拉取到本地**

**6.10SSH 登录**记录用户**(http地址**	**如果不能记录登录用户)  p42**

1进入当前用户的家目录

$ **c**d ~**

2删除.ssh 目录

$ **rm -rvf .ssh**

3运行命令生成.ssh 密钥目录

$ **ssh-keygen -t rsa -C** **atguigu2018ybuq@aliyun.com** 

[注意：这里-C 这个参数是大写的 C] **3.2后面直接回车(使用默认)**

4进入.ssh 目录查看文件列表

$ **cd .ssh**

$ **ls -lF**

**5** 查看 id_rsa.pub 文件内容

$ **cat id_rsa.pub**

**6**复制 id_rsa.pub** 文件内容,登录 GitHub,**点击用户头像→Settings→SSH and GPG keys**

**→**New SSH Key

然后>>**key中**输入复制的密钥信息 Title 自定义输入标题

7回到工作区cd  > 创建远程地址别名

**git remote add origin_ssh git@github.com:atguigu2018ybuq/huashan.git**

8推送文件进行测试

## **7** **Eclipse 操作** **p43-p53**

**7.1**工程初始化为本地库** **(p44)** 先创建一个Maven工程,  

**工程→右键→Team→Share Project→Git**

 ![img](/Users/jiusonghuang/pic-md/20220122133858.jpg)

2 Create Repository

![img](/Users/jiusonghuang/pic-md/20220122133906.jpg) 

**3** **Finish**

 

**7.1.2**Eclipse中设置 签名**:window>prefer.>Team>Git>Configuration>Reposit....**

**1 设置用户名字 p45**

![img](/Users/jiusonghuang/pic-md/20220122133912.jpg) 

**2 设置用户email** 

![img](/Users/jiusonghuang/pic-md/20220122133918.jpg) 

**Eclipse查看git文件标识说明: window>prefer.>Team>Git>Label D..  p46**

![img](/Users/jiusonghuang/pic-md/20220122133924.jpg) 

**Eclipse:文件追踪添加到缓存区:**文件/项目> **右键>>Team>Commit**  **p47**

![img](/Users/jiusonghuang/pic-md/20220122133931.jpg) 

**Eclipse**查看项目中的所有文件的**Navigator窗口打开**

![img](/Users/jiusonghuang/pic-md/20220122133939.jpg) 

  

### 7.2、Eclipse 忽略文件 p47-49

**概念：Eclipse 特定文件**

这些都是 Eclipse 为了管理我们创建的工程而维护的文件,和开发的代码没有直接关系

**最好不要在 Git 中进行追踪，也就是把它们忽略。**

.classpath 文件

.project 文件

.settings 目录下所有文件

**为什么要忽略 Eclipse 特定文件呢？**同一个团队中很难保证大家使用相同的 IDE 工具，而 IDE 工具不同时，相关工程特定文件就有可能不同。如果这些文件加入版本控制，那么开发时很可能需要为了这些文件解决冲突。

**(**文件**忽略**)**GitHub 官网样例文件** **p48**

https://github.com/github/gitignore https://github.com/github/gitignore/blob/master/Java.gitignore

**文件**忽略**具体步骤** **p48**

**1** **编辑本地忽略配置文件，文件名任意**(eg:在家目录下创建**Java.gitignore** **)**

**1.2** **Java.gitignore** **文件编辑如下:** 

```vim
# Compiled class file *
.class

# Log file *
.log

# BlueJ files *
.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files #
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml 
hs_err_pid*

.classpath
.project
.settings 
target
```

**2**在~/.gitconfig 文件中引入上述文件** **:如下**

[core] 

excludesfile = **C:/Users/Lenovo/Java.gitignore** 

[**注意：这里路径中一定要使用“/”，不能使用“\”**]

3完成后在Eclipse查看.gitconfig 配置:**window>prefer.>Team>Git>Configuration**

![img](/Users/jiusonghuang/pic-md/20220122133948.jpg) 

**3.2** **重启eclipse >**Navigator窗口**查看忽略是否成功**

#### **7.2.2 提交暂存区/和提交到库 p49**

**1**提交到暂存区:**项目右键>Team> add to Index** **(或者上面p47** [**添加到缓存区**](#添加到缓存区)**)**

**2** 提交到本地库中: **项目右键>**Team>**Commit**  **(我的快捷键:**ctrl+shift+#**)**

![img](/Users/jiusonghuang/pic-md/20220122133954.jpg) 

### **7.3**推送到远程库** **p50 (:在GitHub创建新的远程库,名为TestGit)**

![image-20220122140339311](/Users/jiusonghuang/pic-md/20220122140339.png)

URI: 粘贴在GitHub复制的地址,后面2个默认;User账号,下面:密码

![img](/Users/jiusonghuang/pic-md/20220122134008.jpg) 

点击Add All Bran... > 然后下一步/或者直接Finish

![img](/Users/jiusonghuang/pic-md/20220122134014.jpg) 

可以添加一些日志信息>Finish

![image-20220122140403391](/Users/jiusonghuang/pic-md/20220122140403.png)

执行成功的结果

![image-20220122140426840](/Users/jiusonghuang/pic-md/20220122140427.png)

### **7.4Oxygen Eclipse** 克隆工程操作 **p51**

**1** **Import...导入工程**

![img](/Users/jiusonghuang/pic-md/20220122134821.jpg) 

![img](/Users/jiusonghuang/pic-md/20220122134828.png) 

**2** **到远程库复制工程地址**

![img](/Users/jiusonghuang/pic-md/20220122134037.jpg) 

**3粘贴到URL  如下: >然后点击next**

 ![image-20220122140446873](/Users/jiusonghuang/pic-md/20220122140447.png)

 

 

**4** 选择分支 Next

![image-20220122140512609](/Users/jiusonghuang/pic-md/20220122140512.png)

**5**指定工程的保存位置**(最好选择eclipse工作区) 然后next**

![img](/Users/jiusonghuang/pic-md/20220122134101.jpg) 

等待下载

6指定工程导入方式，**这里只能用：Import as general project** **(作为普通工程导入)**

![img](/Users/jiusonghuang/pic-md/20220122134111.jpg) 

**7** 点击Finish

![img](/Users/jiusonghuang/pic-md/20220122134118.jpg) 

 

**8** **转换工程类型 (导入进来的不适合编写.需要修改Eclipse工程)**

![img](/Users/jiusonghuang/pic-md/20220122134124.jpg) 

**9**最终效果** 

![img](/Users/jiusonghuang/pic-md/20220122134134.jpg) 

### **7.5Kepler Eclipse** **克隆工程操作**p52(版本比较低的Eclipse)** 

**问题：不能保存到**当前 Eclipse 工作区**目录** (和上面第**5**步不同)

放在工作区[第7 步时]不能导入,如下图:

![img](/Users/jiusonghuang/pic-md/20220122134141.png) 

正确做法：**保存到工作区以外的目录中**,其他的和上面都一样**

![img](/Users/jiusonghuang/pic-md/20220122134146.jpg) 

### **7.6**解决冲突** **p53**

**Eclipse制造冲突**

1分别修改TestGit和TestGit2同一文件同一位置

2 然后:都提交到本地库,快捷ctrl+shift+#(他们两人个是个的本地库)

3然后TestGit**推送到远程库**(这里不是首次推送和上面不同  如下:)

**工程右键>Team>Push Branch** **‘**master**’**)(所以默认直接下一步)>>等条读完(弹出对话窗口)

4**这时TestGit2不能推送**,会出现这个图![img](/Users/jiusonghuang/pic-md/20220122134158.jpg),因为不是最新版本,

更新:**右键>Team>pull**

**Eclipse解决冲突**

1 **冲突文件→右键→Team→Merge Tool** 

![img](/Users/jiusonghuang/pic-md/20220122134204.jpg) 

2修改完成后Eclipse正常执行[该文件] **add/commit** **操作即可**

## **8 Git** **工作流**(3种)p54-

**8.1概念在项目开发过程中使用** 

Git 的方式

### **8.2分类**

**8.2.1 集中式工作流像** **() p54**

 SVN 一样，集中式工作流以中央仓库作为项目所有修改的单点实体。所有修改都提交到 **Master 这个分支上**。

这种方式与 SVN 的主要区别就是开发人员有本地库。Git 很多特性并没有用到。

 

![img](/Users/jiusonghuang/pic-md/20220122134211.jpg)**8.2.2 GitFlow 工作流**(最金典,用得最多)**

Gitflow 工作流通过为**功能开发**、**发布准备**和**维护设立**了**独立的分支**，让发布迭代过程更流畅。严格的分支模型也为大型项目提供了一些非常必要的结构。

![img](/Users/jiusonghuang/pic-md/20220122134218.jpg) 

**8.2.3 Forking 工作流**()**

Forking 工作流是在 GitFlow 基础上，充分利用了 Git 的 **Fork 和 pull request 的功能**以达到代码审核的目的。更适合安全可靠地管理大团队的开发者，而且能接受不信任贡献者的提交。

 

![img](/Users/jiusonghuang/pic-md/20220122134224.jpg) 

### **8.3GitFlow 工作流详解** 

**8.3.1** **分支种类**

**主干分支 master** 

主要负责管理正在运行的生产环境代码,永远保持与正在运行的生产环境完全一致

**开发分支 develop** 

主要负责管理正在开发过程中的代码。一般情况下应该是最新的代码。

**bug 修理分支 hotfix**

主要负责管理生产环境下出现的紧急修复的代码。从主干分支分出，修理完毕并测试上线后，并回主干分支。并回后，视情况可以删除该分支。

**准生产分支（预发布分支） release** 

较大的版本上线前，会从开发分支中分出准生产分支，进行最后阶段的集成测试。该版本上线后，会合并到主干分支。生产环境运行一段阶段较稳定后可以视情况删除。

**功能分支 feature**  

为了不影响较短周期的开发工作，一般把中长期开发模块，会从开发分支中独立出来。开发完成后会合并到开发分支。

 

**8.3.2 GitFlow 工作流举例** **p54**

下面是**GitFlow 工作流举例**图**:**

![img](/Users/jiusonghuang/pic-md/20220122134233.jpg) 

**8.3.3 分支实战** **p55**

![img](/Users/jiusonghuang/pic-md/20220122134240.jpg) 

 

### **8.3.4 具体操作** **p56**

**1**创建分支**:** **右键>Team>Switch To >New Branch**

![img](/Users/jiusonghuang/pic-md/20220122134246.jpg) 

**2**给分支命名>Finish** (**创建后自动切换到分支**)

![img](/Users/jiusonghuang/pic-md/20220122134253.jpg) 

3修改分支hot_fix的happy.java的内容(要避免冲突),提交到本地库

**4** 远程推送到远程库

 **选择文件**happy.java**>>** **右键>> Repository>>Pish Branch** **’**hot_fix**’**

![img](/Users/jiusonghuang/pic-md/20220122134259.jpg) 

**4.2**  **然后下一步>>然后(没截图)push**

![img](/Users/jiusonghuang/pic-md/20220122134305.jpg) 

4.3 等待一会儿,弹出下面对话窗口说明成功了

![img](/Users/jiusonghuang/pic-md/20220122134311.jpg) 

**o5** **ybq拉取操作不不需要选择分支:(这里有TestGit2模拟岳不群)**

**项目右键>Team>Pull**

**补充:/\*上面操作如果说没有更新**(上面没问题**从这到**>**o6**之间不用看)**

**项目右键>Team>Remote>**Fetch Tags**

![img](/Users/jiusonghuang/pic-md/20220122134319.jpg) 

 

![img](/Users/jiusonghuang/pic-md/20220122134325.jpg) 

 

![img](/Users/jiusonghuang/pic-md/20220122134332.jpg) 

**o6**切换分支审查代码:**项目右键>Team>Switch To > Other**

![img](/Users/jiusonghuang/pic-md/20220122134343.jpg) 

**o7** 选择分支

![img](/Users/jiusonghuang/pic-md/20220122134348.jpg) 

**o8** 

![img](/Users/jiusonghuang/pic-md/20220122134355.jpg) 

**o9**创建新分支,选择**Check out new** **branch**为**检出**远程新分支**

![img](/Users/jiusonghuang/pic-md/20220122134403.png) 

**o10**切换回 master 

![img](/Users/jiusonghuang/pic-md/20220122134410.jpg) 

**o11**合并分支

![img](/Users/jiusonghuang/pic-md/20220122134426.jpg) 

![img](/Users/jiusonghuang/pic-md/20220122134431.jpg) 

 

**合并结果**

![img](/Users/jiusonghuang/pic-md/20220122134438.jpg) 

 **合并后直接提交到远程库**(本地库已经提交)

## **9 Gitlab** **服务器搭建过程** 

**9.1**官网地址

首页：https://about.gitlab.com/ 

安装说明：https://about.gitlab.com/installation/

**9.2**安装命令摘录

sudo yum install -y curl policycoreutils-python openssh-server cronie 

sudo lokkit -s http -s ssh 

sudo yum install postfix 

sudo service postfix start 

sudo chkconfig postfix on 

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash 

sudo EXTERNAL_URL="http://gitlab.example.com" yum -y install gitlab-ee

实际问题：yum 安装 gitlab-ee(或 ce)时，需要联网下载几百 M 的安装文件，非常耗时，所以应提前把所需 RPM 包下载并安装好。

下载地址为：

**https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/7/gitlab-ce-10.8.2-ce.0.el7.x86_64.rpm**

**9.3**调整后的安装过程 ee是企业版本 ce是社区版本

**sudo rpm -ivh /opt/gitlab-ce-10.8.2-ce.0.el7.x86_64.rpm** 

sudo yum install -y curl policycoreutils-python openssh-server cronie 

sudo lokkit -s http -s ssh 

sudo yum install postfix 

sudo service postfix start 

sudo chkconfig postfix on 

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-**c**e/script.rpm.sh | sudo bash 

sudo EXTERNAL_URL="http://gitlab.example.com" yum -y install gitlab-**c**e** 

当前步骤完成后重启。

### **9.4gitlab** 服务操作 60

初始化配置 gitlab

**gitlab-ctl reconfigure**

启动 gitlab 服务 

**gitlab-ctl start**

停止 gitlab 服务 

**gitlab-ctl stop**

**9.5**浏览器访问 61

访问 Linux 服务器 IP 地址即可，如果想访问 EXTERNAL_URL 指定的域名还需要配置域名服务器或本地 hosts 文件。

初次登录时需要为 **gitlab 的 root 用户设置密码。**

![img](/Users/jiusonghuang/pic-md/20220122134446.png) 

root/atguigu2018good

※应该会需要停止防火墙服务： **service firewalld stop**

 

 

