# **.ansible笔记**

## **一**、ansible的主要组成部分

​    ![0](/Users/jiusonghuang/pic-md/20210610222741.png)

1、ansible playbook：任务剧本（任务集），编排定义ansible任务集的配置文件，由ansible顺序依次执行，通常是json格式的yml文件。

inventory：ansible管理主机的清单/etc/ansible/hosts

modules：ansible执行命令的功能模块，多数为内置核心模块，也可自定义

plugins：模块功能的补充，如连接类型的插件、循环插件，变量插件，过滤插件，改功能不常用

api：供第三方程序调用的应用程序编程接口

ansible：组合inventory，api，modules，plugins的绿框，可以理解为ansible命令工具，其为核心执行工具

2、ansible命令执行来源

user：普通用户，即system administrator

cmdb（配置管理数据库）api调用

public/private cloud api调用

user --> ansible playbook --> ansible

3、利用ansible实现管路的方式：

Ad-Hoc 即ansible命令。主要用于临时命令使用场景

ansible-playbook 主要用于长期规划好的，大型项目的场景，需要有提前的规划

4、ansible-playbook执行过程

将已经编排好的任务集写入ansible-playbook

通过ansible-playbook命令分拆任务集至逐条ansible命令，按预定规则逐条执行

5、ansible的主要操作对象

HOSTS主机

NETWORKING网络设备

6、注意事项

执行ansible的主机一般称为主控端，中控，master或者堡垒机

主控端python版本需要在2.6或者以上

被控端python版本小鱼2.4需要安装python-simplejson

被控端如开启SELinux需要安装libselinux-python

Windows不能作为主控端

## **二、安装**

rpm包安装：EPEL源

yum -y install ansible

编译安装：

yum -y install python-jinjia2 PyYAML python-paramiko python-babel python-crypto

tar -xf ansible-1.5.2.tar.gz

cd ansible-1.5.4

python setup.py build

python setup.py install

mkdir /etc/ansible

cp -r examples/* /etc/ansible/

Git方式

 git clone git://github.com/ansible/ansible.git --recursive

cd ./ansible

source ./hacking/env-setup

pip安装：pip是安装python包的管理器，类似于yum

yum -y install python-pip python-devel

yum -y install gcc glib-devel zlibl-devel rpm-build openssl-devel

pip install --upgrade pip

pip install ansible --upgrade

确认安装：ansible --version

## **三、相关文件**

### 配置文件

/etc/ansible/ansible.cfg 主配置文件，哦诶之ansible工作特性

/etc/ansible/hosts 主机清单

/etc/ansible/roles/ 存放角色的目录

### 程序

/usr/bin/ansible 主程序，临时命令执行工具

/usr/bin/ansible-doc 查看配置文档，模块功能查看工具

/usr/bin/ansible-galaxy 下载/上传优秀代码或者Roles模块的官网平台

/usr/bin/ansible-play-book 定制自动化任务，编排剧本工具 

/usr/bin/ansible-pull 远程执行的命令的工具

/usr/bin/ansible-vault 文件加密工具

/usr/bin/ansible-console 基于Console界面与用户交互的执行工具

### 主机清单inventory

inventory主机清单：ansible的主要功用在于批量主机操作，为了方便的使用其中的部分主机，可以在inventory file中将其分组命名

默认的inventory file为/etc/ansible/hosts

inventory file可以有多个，且也可以通过Dynamic Inventory来动态完成

/etc/ansible/hosts文件格式

inventory文件遵循INI文件风格，中括号的字符为组名。可以将同一个主机同事归并到不通的组中；此外，当如若目标主机使用了非默认的ssh端口，还可以在主机名称之后使用冒号加端口号来标明

eg：	

ntp.magedu.com

[webservers]

www1.magedu.com:2222

www2.magedu.com

[dbservers]

db1.magedu.com

db2.magedu.com

如果主机名称遵相似的命名模式，还可以使用列表的方式标识个主机

eg：

[wedservers]

www[01:100].example.com

[dbservers]

db-[a:f].example.com

## **四、ansible配置文件**

ansible 配置文件/etc/ansible/ansible.cfg(一般保持默认)

[defaults]

\#inventory      = /etc/ansible/hosts  #主机列表配置文件

\#library        = /usr/share/my_modules/ #库文件存放目录

\#module_utils   = /usr/share/my_module_utils/ 

\#remote_tmp     = ~/.ansible/tmp #临时py命令文件存放在远程主机目录

\#local_tmp      = ~/.ansible/tmp #本机临时命令执行目录

\#forks          = 5 #默认并发数（同时执行5个操作，eg五台主机五台的执行）

\#poll_interval  = 15 

\#sudo_user      = root #默认sudo用户

\#ask_sudo_pass = True #每次执行ansible命令是否询问ssh密码

\#ask_pass      = True

\#transport      = smart

\#remote_port    = 22

\#module_lang    = C

\#module_set_locale = False

\#host_key_checking = False #检查对应服务的的host_key，建议取消注释

​    ![0](/Users/jiusonghuang/pic-md/20210610222752.png)

\#log_path = /var/log/ansible.log #日志文件

## **五、ansible 系列命令**

ansible ansible-doc  ansible-playbook  ansible-vault  ansible-console  ansible-galaxy ansible-pull

### **1、ansible-doc 显示模块帮助**

ansible-doc [options][module]

-a  显示所有模块文档

-l，--list 列出可用模块

-s，--snippet 显示指定模块的playbook片段

实例：

ansible-doc -l 列出所有模块

ansible-doc ping 查看指定模块的帮助用法

ansible-doc -s ping 查看指定模块的帮助用法

ansible通过ssh实现配置管理、应用部署，任务执行等功能，建议配置ansible段能基于密钥认证的方式联系各被管理节点

### **2、ansible[-m module_name] [-a args]**

--version 显示版本

-m module 指定模块，默认为command

-v 详细过程 -vv -vvv 更详细

--list-host 显示主机列表，可简写--list

-k ，--ask-pass 提示输入ssh连接密码。默认key验证

-K， --ask-become-pass  提示输入sudo时的口令

-C，--check 检查不执行

-T --timeout=TIMEOUT 执行命令的超时时间，默认10s

-u --user=REMOTE——USER 执行远程执行的用户

-b， --become 代替旧版本的sudo切换

### **3、ansible的Host-pattern  匹配主机的列表**

all：表示所有Inventory中的所有主机

*：通配符

ansible “*” -m ping

ansible 192.168.1.* -m ping

ansible “*srvs” -m ping

或关系

ansible “webserver:dbserver” -m ping

ansible "webserver:dbserver" -m ping #执行在web组并且在dbserver组中的主机（忽略重复的）

与关系

ansible "webserver:&dbserver" -m ping

只执行在web组并且也在dbserver组中的主机

逻辑非

ansible 'webserver:!dbserver' -m ping  **【注意此处只能使用单引号！】**

综合逻辑

ansible 'webserver:dbserver:&webserver:!dbserver' -m ping

正则表达式

ansible "webserver:&dbserver" -m ping

ansible "~(web|db).*\.magedu.\com" -m ping

### **4、ansible命令执行过程**

a 加载自己的配置文件 默认/etc/ansible/ansible.cfg

b 加载自己对应的模块 如command

c 通过ansible将模块或命令生成对应的临时py文件，并将改文件传输至远程服务器的对应执行用户SHOME/.ansible/tmp/ansible-tmp-数字/XXX.py文件

d 文件见+x执行

e 执行并返回结果

f 删除临时py文件，sleep 0退出

### **5、执行状态**

绿色：执行成功并且不需要做改变的操作

黄色：执行成功并且对目标主机做变更

红色：执行失败

​    ![0](/Users/jiusonghuang/pic-md/20210610222805.png)

### **6、**ansible常见模块

**ping：**

**command**：在远程主机执行命令，默认模块。可忽略-m选项

ansible srvs -m command -a ‘systemctl restart sshd’

ansible srvs -m command -a 'echo magedu | passwd --stdin wang '不成功

此命令不支持$VRNAME< >  | ; & 等，需要用shell模块实现

**shell**：和command相似，用shell执行命令

ansible srv -m shell -a ‘echo magedu | passwd --stdin wang’

调用bash执行命令 类似cat /tmp/stanley.md | awk -F '|' '{print $1,$2}' & >/tmp/example.txt 这些复杂命令，及时使用shell也可能会失败，解决办法：写到脚本时，copy到远程，执行，再把需要的结果拉回执行命令的机器

**script**：运行脚本

-a “/PATH/TO/SCRIPT_FILE”

ansible webserver -m script -a f1.sh

**copy**：从服务器复制文件到客户端

ansible all -m copy -a 'src=/data/test1 dest=/data/test1 backup=yes mode=000 owner=zhang'  ##如目标存在，默认覆盖，此处是指先备份，并修改全向属主

ansible all -m shell -a 'ls -l /data/'

ansible all -m copy -a "content='test content\n' dest=/tmo/f1.txt" 利用内容，直接生成目标文件

**fetch**：从客户端取文件至服务器端，与copy相反，目录可以先tar

ansible all -m fetch -a ‘src=/root/a.sh dest=/data/f2.sh'

​    ![0](/Users/jiusonghuang/pic-md/20210610222815.png)

**file**:设置文件属性（状态，属组，属主，权限）

ansible all -m file -a “path=/root/a.sh owner=zhang mode=755”

ansible all -m file -a 'src=/data/test1 dest=/tmp/test state=link'

ansible all -m file -a ’name=/data/f3 state=touch‘  #创建文件

ansible all -m file -a ’name=/data/f3 state=absent‘ #删除文件

ansible all -m file -a ’name=/data state=directory‘ #创建目录

ansible all -m file -a ’src=/etc/fstab dest=/data/fstab.link state=link‘

**archive**打包模块

**unarchive** 解打包模块

**hostname** 管理主机名

ansible 192.168.10.24 -m hostname -a “name=kso-bj6-zw-zhangwei”#永久生效（但hosts文件需要手动更改）

**cron** 计划任务

支持时间：minute，hour，day，month，weekday

ansible all -m cron -a "minute=*/5 weekday=1,3,5 job='/usr/sbin/ntpfata 172.16.0.1 & >/dev/null' name=Synctime" 创建任务

ansible all -m cron -a "disabled=true job='/usr/sbin/ntpfata 172.16.0.1 & >/dev/null' name=Synctime" 禁用任务（加#号注释）

ansible all -m cron -a "disabled=no  job='/usr/sbin/ntpfata 172.16.0.1 & >/dev/null' name=Synctime" 启用任务

ansible all -m  cron -a 'state=absent name=Synctime' 删除任务

**yum**：管理包

ansible all -m yum -a 'name=httpd state=latest'安装

ansible all -m yum -a 'name=httpd state=ansent' 卸载

ansible all -m yum  -a 'name=dstat update_cache=yes' 更新缓存

【注：dstat--监控工具https://www.jianshu.com/p/49b259cbcc79】

**service**：管理服务

ansible all -m service -a 'name=httpd state=stopped'

ansible all -m service -a 'name=httpd state=started enabled=yes'

ansible all -m service -a 'name=httpd state=reload'

ansible all -m service -a 'name=httpd state=restart'

**user**:管理用户

ansible all -m user -a 'name=user1 comment="test user" uid=2048 home=/data/home/user1 group=root'  创建用户，以及uid，家目录，并描述（comment）

ansible all -m user -a 'name=zhangwei shell=/sbin/nologin  system=yes home=/data/home/zhangwei'    创建不可登陆的系统用户

ansible all -m user -a 'name=zhangwei state=absent remove=yes'删除用户及家目录

**group**：管理组

ansible all -m group -a "name=testgroup system=yes"

ansible all -m group -a "name=testgroup state=absent"

ansible-doc -s moudul #简短介绍模块使用方法

ansible-doc modul  #详细介绍模块使用方法

### **7、**ansible系列命令

**ansible-galaxy**    链接：https：//galaxy.ansible.com下载对应的role

列出所有已安装的galaxy

ansible-galaxy list

安装galaxy

ansible-galaxy install geerlingguy.redis

删除galaxy

ansible-galaxy remove geerlingguy.redis

**ansible-pull**

推送命令至远程，效率无限提升，对运维要求较高

**ansible-playbook**

ansible-playbook hello.yml    【书写注意空格，行首注意对齐】

cat hello.yml 

\---

\# hello test yml file

\- hosts: all

  remote_user: root    #远程用户

  tasks:

​        \- name: look hostname

​          command: hostname

**ansible-vault** 管理加密解密yml文件

ansible-vault [create | decrypt | edit | encrypt | rekey | view]

ansible-vaullt encrypt hello.yml 加密

ansible-vault decrypt hello.yml 解密

ansible-vault view hello.yml 查看

ansible-vault edit hello.yml 编辑加密文件

ansible-vault rekey hello.yml 修改口令

ansible-vault create new.yml 创建新文件

**ansible-console：**	2.0+新增，可交互执行命令，支持tab

root@test(2)[f:10] $

执行用户@当前操作的主机组（当前组的主机数量）[f:并发数]$

设置并发数：fock n 例如：fock 10

切换组：cd 主机组 例如：cd webserver 

列出当前组的主机列表：list

列出所有内置命令：？或help

示例：

root@all (2)[f:5]$ list

root@all (2)[f:5]$ cd webserver

root@dbserver (2)[f:5]$ list

root@dbserver (2)[f:5]$ yum name=httpd state=present

root@dbserver (2)[f:5]$ service name=httpd state=restart

### **8、**playbook

**a.playbook流程介绍**

​    ![0](/Users/jiusonghuang/pic-md/20210610222824.png)

playbook是由一个或者多个“play”组成的列表

play的主要功能在于将事先归并为一组的主机装扮成事先通过ansible中的task定义好的角色。从根本上来讲，所谓task无非是调用ansible的一个module。将多个play组织在一个playbook中，即可以让他们联同起来按照事先编排的机制同唱一台大戏。

palybook采用YAML预言编写

**b.yaml介绍**

YAML是一个可读性高用来表达资料序列的格式。YAML参考了其他多种语言，包括：XML、C语言、Python、Perl以及电子邮件格式RFC2822等。Clark Evans在2001年在首次发表了这种语言，另外Ingy dot Net与Oren Ben-Kiki也是这种语言的共同设计者。

YAML Ain't Markup Language，即TAML不是XML。不过，在开发这种语言时，YAML的意思其实是：Yet Another Markup Language（仍是一种标记语言）

特性

YAML的可读性好

YAML和脚本语言的交互性好

YAML使用实现语言的数据类型

YAML有一个一致的信息模型

YAML易于实现

YAML可以基于流来处理

YAML表达能力强，扩展性好

更多内容及规范参见http://www.yaml.org

**c.YAML语法简介**

（1）、注意

在单一档案中，可以连续三个连字号（---）区分多个档案。另外，还有选择性的连续三个点号（...）用来表示档案结尾

次行动开始正常些playbook的内容，一般建议些明该playbook的功能

使用#号注释代码

缩进必须是统一的，不能空格和tab混用

缩进的级别也必须是一致的，同样的缩进代表同样的级别，程序判断配置的级别是通过缩进结合换行来实现的

YAML文件内容和linux系统大小写判断方式保持一致，是区别大小写的，k/v的值均需大小写敏感

k/v的值可同行写也可换行写。同行的话，使用：号分割

v可是一个字符串，也可是另一个列表

一个完成的代码块功能需最少元素包括 name:    task

一个name只能包括一个task

YAML文件扩展名通常为yml或者yaml

（2）list：列表，其所有元素均使用“-”打头

示例：

\# Alist of tasty fruits

\- Apple

\- Orange

\- Strawberry

\- Mango

 （3）Dictionary：字典，通常由说个key与value构成

示例：

\---

\# An employee record

name:Example Developer

 job:Developer

skill:Elite

也可将key:value放置于{}中进行表示，用“，”分隔多个key:value

示例：

\---

\# An employee record

{name:Example Developer,job:Developer,skill:Elite}

YAML的语法和其他高阶语言类似，并且可以简单表达清单，散列表、标量等数据结构。其	机构（Structure）通过空格来展示，序列（Sequence）里的项目“-”来代表，Map李的键值对用“：”分割。

**d.playbook的核心元素(**[**http://www.ansible.com.cn/**](http://www.ansible.com.cn/)**)中文网**

hosts  执行的远程主机列表

tasks  任务集

varniables  内置变量或自定义变量在playbook中调用

templates  模板，可替换模板文件中的变量并实现一些简单逻辑文件

hanslers 和notity结合使用，有特定条件出发操作，满足条件方可执行，否则不执行

tags  标签 指定某条任务执行，用于选择运行playbook中部分代码。ansible具有幂等性，因此会自动化跳过没有变化的部分，即便如此，有些代码为此时其确实没有发生变化的时间依然会非常的长。此时，确信其没有变化，就可以通过tags跳过此些代码片段。

**e.playbook基础组件**

hosts：

playbook中的每一个play的目的都是为了让某个或某些主机以某个指定的用户身份执行任务。hosts用于指定要执行指定任务的主机，须事先定义在主机清单中

可以是如下形式：

one.example.com

one.example.com:two.example.com

192.168.1.50

192.168.1.*

webserver:dbserver 两个组的并集

webserver:&dbserver 两个组的交集

webserver:!dbserver 在webserver组中  但不在dbserver组中

示例： - hosts：webserver:sbserver

​    ![0](/Users/jiusonghuang/pic-md/20210610222834.png)

remote_user:

可用于Host和task中。也可以通过制定其通过sudo的方式在远程主机上执行任务，其可用于play全局或某任务；此外；甚至可以在sudo时使用sudo_user: root时切换到用户。

\- hosts: web

  remote_user: root

  tasks:

​     \- name: test connection

​       ping

​       remote_user: zhangwei

​       sudo: yes   #默认sudo为root

​       sudo_user: wang   #sudo为wang

tasks：

任务列表

格式：（1）action: module arguments 

​              (2) module: arguments 【建议使用】

​              注意：shell和command模块后面跟命令，而非key=value

某任务的状态在运行后为change时，可通过‘notify’通知给相应的handlers

某任务可以通过‘tags’打标签，而后可在ansible-playbook命令上使用-t指定进行调用

示例：

tasks：

   \- name: disable selinux

​     command: /sbin/setenforce 0

如果命令或脚本的退出码不为零，可以使用如下方式替代

tasks:

   \- name: run this conamnd and ignore the result

​      shell : /usr/bin/sommecommand || /bin/true

或者使用ignore_errors来忽略错误信息：

tasks:

  \- name: run this conamnd and ignore the result

​     shell : /usr/bin/sommecommand

​     ignore_errors: True

运行playbook方式

ansible-playbook   ... [options]

常见选项

--check (-C)只检测可能会发生的改变，但不真正执行操作

--list-hosts 列出运行任务的主机

--limit 主机列表 只针对主机列表中的主机执行

-v 显示过程 -vv -vvv更详细

示例：

ansible-playbook file.yml --check 只检测

ansible-playbook file.yml

ansible-playbook file.yml --limit webserver

ansible-playbook file.yml --list-hosts  # 查看主机

ansible-playbook file.yml --list-tasks  #查看任务列表

ansible-playbook file.yml --list-tags  # 查看标签

**练习**

​    ![0](/Users/jiusonghuang/pic-md/20210610222841.png)

​    ![0](/Users/jiusonghuang/pic-md/20210610222849.png)

**注意 ：上图中copy连续使用两次，这是错误操作，这种操作只会执行最下面的copy，其余copy不会执行！！应该将其分开，分为两个name。**

​    ![0](/Users/jiusonghuang/pic-md/20210610222904.png)

**f.handlers和notify结合使用触发条件**

handlers

是tasks列表，这些task与前述的task并没有本质上的不同，用于当关注的资源发生变化时，才会采取一定的操作

notify 此action可用于在每个play的最后被出发，这样可以避免多次有改变发生时，每次都执行指定的操作，仅在所有的变化发生完后一次性执行指定的操作。在notify中列出的操作称为handler，也即notify中调用handler中定义的操作

​               

```
 --- 
 - hosts: all  
 remote_user: root   
 tasks:    
 - name: install Apache      
 		yum: name=httpd state=installed    
 - name: copy conf      
 		copy: src=/etc/httpd/conf/httpd.conf dest=/etc/httpd/conf/ backup=yes     
 notify: service restart   
 - name: service Apache     
 		service: name=httpd state=started enabled=yes  
 handlers:    
 - name: service restart    
 		service: name=httpd state=restarted    
```

​          

小贴士：selinux的开启导致apache更换端口后启动不成功。

​    ![0](/Users/jiusonghuang/pic-md/20210610222910.png)

**g.playbook中tags的使用**

​    ![0](/Users/jiusonghuang/pic-md/20210610222921.png)

ansible-playbook -t conf httpd.yml    **【使用-t 指定标签名字】**

ansible-playbook -t conf,service httpd.yml

ansible-playbook  httpd.yml --list-tsgs  #查看标签列表

注意：tags标签命名可以相同，不通模块下写入相同tags标签，执行时，打入标签的模块会同时执行

**h.playbook中变量的使用**

变量名：仅能由字母、数字和下划线组成，且只能以字母开头

变量来源：

（1）ansible setup facts 远程主机的所有变量都可以直接调用

eg：ansible all -m setup #查看远程主机的所有变量

​        ansible all -m setup -a 'filter=ansible_hostname'#过滤主机中的变量

​        ansible all -m setup -a 'filter=ansible_hostname' ##过滤主机的主机全名 

这里查找到的变量可以直接在playbook中调用

（2）在/etc/ansible/hosts中定义

 普通变量：主机组中主机单独定义，优先级高与公共变量

公共组变量：针对主机组中所有主机定义统一变量

​    ![0](/Users/jiusonghuang/pic-md/20210610222926.png)

**普通变量的优先级高于公共变量**

​    ![0](/Users/jiusonghuang/pic-md/20210610222930.png)

（3）通过命令行指定变量，优先级最高

ansible-playbook -e varname=value

eg：

```
hosts: web 

 remote_user: root   

tasks:    

- name: install pkname     

	yum: name={{ pkname }}   

- name: start serivece     
  service: name={{ pkname }} state=started enabled=yes     

```

​                ansible-playbook -e 'pkname=httpd'    test.yml              

（4）在playbook中定义

vars: 

​          \- var1: value1

​           \- var2: value2

​    ![0](/Users/jiusonghuang/pic-md/20210610222934.png)

​                ansible-playbook  test.yml              

（5）在role中定义

​       （6）使用变量文件

可以单独顶一个文件存放变量值

eg：

[root@192-168-10-22 ansible]# cat vars.yml 

```
var1: vsftpd  #注意空格

var2: httpd  #注意空格

```

[root@192-168-10-22 ansible]# cat test.yml 

```
---

- hosts: web

  remote_user: root

  vars_files:    #注意是var_files。“s”

    - vars.yml 

  tasks:

    - name: install package

      yum: name={{ var1 }}

    - name: create file

      file: name=/data/{{ var2 }}.log state=touch

```

**变量的优先级：命令行中的-e > playbook中定义的变量 > 主机清单中定义的变量**

**9、****模板templates**

文本文件，嵌套有脚本（使用模板编程语言编写）

jinja2语言，使用字面量，有下面形式:

字符串：使用单引号或者双引号

数字：整数，浮点数

列表：[item1，itme2,...]

元组：（item1，itme2,...）

字典：{key1:value1,key2:value2,...}

布尔型：true/false

算术运算：+，-，*，/，//，%，**

比较操作：==,！=,>,>=,<,<=

逻辑运算：and,or,not

流表达式：For If When（循环语句）

小记：在模板目录template下写入模板文件，文件中可以直接调用setup变量（src可以直接书写模板目录下的文件）

**10、when**

条件测试：如果需要根据变量，facts或此前任务的执行结果来作为某task执行与否的前提时要用到条件测试，通过when语句实现，在task中使用，jinja2的语法格式

when语句

在task后添加when子句即可使用户条件测试；when语句支持jinji2表达式语法

示例：

```
- name: 'shutdown redhad flavored systems'

  command: /sbin/shutdown -h now

  when: ansible_os_family == "RedHat"

```

**10、迭代：with_items**

迭代：当有需要重复执行的任务时，可以使用迭代机制

对迭代项的引用，固定变量名为“iftem”

要在task中使用with_items给定要迭代的元素列表

列表格式：

字符串

字典

​    ![0](/Users/jiusonghuang/pic-md/20210610222939.png)

**10.1迭代嵌套子变量**

​    ![0](/Users/jiusonghuang/pic-md/20210610222943.png)

**11、playbook中template模板对于for  if 循环的使用**

​    ![0](/Users/jiusonghuang/pic-md/20210610222948.png)

​    ![0](/Users/jiusonghuang/pic-md/20210610222952.png)

**for：**

yml文件             

```
 --- - hosts: web server  
 remote_user: root  
 vars:    
 ports:      
   - listen_port: 84     
   - listen_port: 85      
   - listen_port: 86   
 tasks:    
   - name: copy conf   
    template: src=for1.conf.j2 dest=/data/for1.conf      
```

​        

模板文件：

```
  {% for port in ports %}   #port自定义变量 
  server{       
  		listen {{ port.listen_port }} 
  } 
  {% endfor %}              

```

&&

**yml文件**

```
  --- 
  - hosts: web
  remote_user: root 
  vars:    
  ports:    
    - web1: 
      port: 81      
      name: web1.magedu.com        
      rootdir: /data/website1      
    - web2:        
      port: 82        
      name: web2.magedu.com        
      rootdir: /data/website2  
  tasks:    
  	- name: copy conf     
  		template: src=for2.conf.j2 dest=/data/for2.conf
```

​              

**模板文件：**

```
 {% for p in ports %}    
 #p自定义变量 
   server{  
     listen {{ p.port }} 
     servername {{ p.name }}      
     documentroot {{ p.rootdir }} 
   } 
 {% endfor %}  
```

​            

**if：**

**yml文件**

```
                --- 
                - hosts: web  
                remote_user: root 
                vars:   
                  ports:      
                    - web1:       
                      port: 81        
                      name: web1.magedu.com        
                      rootdir: /data/website1      
                    - web2:       
                      port: 82        
                      #name: web2.magedu.com      
                      rootdir: /data/website2   
                tasks:    - name: copy conf     
                template: src=if.conf.j2 dest=/data/if.conf  
```

​            

**模板文件：**

```
                {% for p in ports %} 
                server{     
                listen {{ p.port }}
                {% if p.name is defined %} 
                #如果p.name被定义就执行下面的servername，否则不执行     
                servername {{ p.name }} {% endif %}    
                documentroot {{ p.rootdir }} 
                } 
                {% endfor %}      
```

​        

​    ![0](/Users/jiusonghuang/pic-md/20210610223016.png)

**I.roles**

ansible自1.2版本引入的新特性，用于层次性，结构化地组织playbook。roles能够根据层次结构自动装载变量文件、tasks以及handlers等。要使用roles只需要在playbook中使用include指令即可。简单来讲，roles就是通过分别将变量、文件、任务、模板及处理器放置于单独的目录中，并可以便捷地include它们的一种机制。角色一般用于主机构建服务的场景中，但也可以使用于构建守护进程等场景中

复杂场景：建议使用roles，代码复用度高

变更指定主机或主机组

如命令不规范，维护和传承成本大

某些功能需要多个playbook，通过includes可以实现

**roles的使用**

​    ![0](/Users/jiusonghuang/pic-md/20210610223021.png)

roles目录结构

playbook.yml

roles

project/

tasks/

files/

vars/  不常用

defaults/  不常用

templates/

handlers/

meta/  不常用

**roles各目录的作用**

/roles/project/:项目名称，有以下目录

files/：存放由copy模块或scripts模块等调用的文件

template/：template模块	查找所需要模板文件的目录

tasks/：定义tasks，roles的基本元素，至少应该包含一个名为main.yml的文件；其他的文件需要在此文件中通过include进行调用

handlers/：至少应该包含一个名为main.yml的文件；其他的文件需要在此文件中通过include进行调用

vars/：定义变量，至少应该包含一个名为main.yml的文件；其他的文件需要在此文件中通过include进行调用

meta/：定义当前角色的特殊设定及其依赖关系，至少应该包含一个名为main.yml的文件；其他的文件需要在此文件中通过include进行调用

default/：设定默认变量时使用此目录中的main.yml文件