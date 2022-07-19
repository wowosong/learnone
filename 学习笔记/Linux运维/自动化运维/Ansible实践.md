# Ansible实践

## 自动化运维应用场景

### 云计算运维工程师核心职能

![运维自动化发展历程，运维职业发展路线插图](/Users/jiusonghuang/pic-md/20210603210931.png)
![运维自动化发展历程，运维职业发展路线插图(1)](/Users/jiusonghuang/pic-md/20210610223054.jpg)
![运维自动化发展历程，运维职业发展路线插图(2)](http://www.yunweipai.com/wp-content/uploads/2020/06/devops-800x600.jpg)
![运维自动化发展历程，运维职业发展路线插图(3)](/Users/jiusonghuang/pic-md/20210610223058.jpg)

**相关工具**

- 代码管理（SCM）：GitHub、GitLab、BitBucket、SubVersion
- 构建工具：maven、Ant、Gradle
- 自动部署：Capistrano、CodeDeploy
- 持续集成（CI）：Jenkins、Travis
- 配置管理：Ansible、SaltStack、Chef、Puppet
- 容器：Docker、Podman、LXC、第三方厂商如AWS
- 编排：Kubernetes、Core、Apache Mesos
- 服务注册与发现：Zookeeper、etcd、Consul
- 脚本语言：python、ruby、shell
- 日志管理：ELK、Logentries
- 系统监控：Prometheus、Zabbix、Datadog、Graphite、Ganglia、Nagios
- 性能监控：AppDynamics、New Relic、Splunk
- 压力测试：JMeter、Blaze Meter、loader.io
- 应用服务器：Tomcat、JBoss、IIS
- Web服务器：Apache、Nginx
- 数据库：MySQL、Oracle、PostgreSQL等关系型数据库；mongoDB、redis等NoSQL数据库
- 项目管理（PM）：Jira、Asana、Taiga、Trello、Basecamp、Pivotal Tracker

### 运维职业发展路线

![运维自动化发展历程，运维职业发展路线插图(4)](/Users/jiusonghuang/pic-md/20210610223102.jpg)

## 企业实际应用场景分析

![运维自动化企业应用场景以及技术分析插图](/Users/jiusonghuang/pic-md/20210610223107.png)

### Dev开发环境

 使用者：程序员
​ 功能：程序员个人的办公电脑或项目的开发测试环境，部署开发软件，测试个人或项目整体的BUG的环境
​ 管理者：程序员

### 测试环境

 使用者：QA测试工程师
​ 功能：测试经过Dev环境测试通过的软件的功能和性能，判断是否达到项目的预期目标，生成测试报告
​ 管理者：运维
​ 说明：测试环境往往有多套,测试环境满足测试功能即可，不宜过多
​ 1、测试人员希望测试环境有多套,公司的产品多产品线并发，即多个版本，意味着多个版本同步测试
​ 2、通常测试环境有多少套和产品线数量保持一样

### 预发布环境

 使用者：运维
​ 功能：使用和生产环境一样的数据库，缓存服务等配置，测试是否正常

### 发布环境

 包括代码发布机，有些公司为堡垒机（安全屏障）

 使用者：运维
​ 功能：发布代码至生产环境
​ 管理者：运维（有经验）
​ 发布机：往往需要有2台（主备）

### 生产环境

 使用者：运维，少数情况开放权限给核心开发人员，极少数公司将权限完全开放给开发人员并其维护
​ 功能：对用户提供公司产品的服务
​ 管理者：只能是运维
​ 生产环境服务器数量：一般比较多，且应用非常重要。往往需要自动工具协助部署配置应用

### 灰度环境

 属于生产环境的一部分
​ 使用者：运维
​ 功能：在全量发布代码前将代码的功能面向少量精准用户发布的环境,可基于主机或用户执行灰度发布
​ 案例：共100台生产服务器，先发布其中的10台服务器，这10台服务器就是灰度服务器
​ 管理者：运维
​ 灰度环境：往往该版本功能变更较大，为保险起见特意先让一部分用户优化体验该功能，待这部分用户使用没有重大问题的时候，再全量发布至所有服务器

### 程序发布

程序发布要求：
不能导致系统故障或造成系统完全不可用
不能影响用户体验

预发布验证：
新版本的代码先发布到服务器（跟线上环境配置完全相同，只是未接入到调度器）

灰度发布：
基于主机，用户，业务

发布路径：
/webapp/tuangou
/webapp/tuangou-1.1
/webapp/tuangou-1.2

**发布过程：**

1. 在调度器上下线一批主机(标记为maintenance 状态)
2. 关闭服务
3. 部署新版本的应用程序
4. 启动服务
5. 在调度器上启用这一批服务器

自动化灰度发布：

- 脚本
- 发布平台

### 自动化运维应用场景

- 文件传输
- 应用部署
- 配置管理
- 任务流编排

### 常用自动化运维工具

- Ansible：python，Agentless，中小型应用环境
- Saltstack：python，一般需部署agent，执行效率更高
- Puppet：ruby, 功能强大，配置复杂，重型，适合大型环境
- Fabric：python，agentless
- Chef：ruby，国内应用少
- Cfengine
- func

## Ansible基础入门

### Ansible 特性

- 模块化：调用特定的模块完成特定任务，支持自定义模块，可使用任何编程语言写模块
- Paramiko（python对ssh的实现），PyYAML，Jinja2（模板语言）三个关键模块
- 基于Python语言实现
- 部署简单，基于python和SSH(默认已安装)，agentless，无需代理不依赖PKI（无需ssl）
- 安全，基于OpenSSH
- 幂等性：一个任务执行1遍和执行n遍效果一样，不因重复执行带来意外情况
- 支持playbook编排任务，YAML格式，编排任务，支持丰富的数据结构
- 较强大的多层解决方案role

### Ansible 架构

#### Ansible 组成

![Ansible教程-Anaible基础入门插图](/Users/jiusonghuang/pic-md/20210610223113.png)

组合INVENTORY、API、MODULES、PLUGINS的绿框，可以理解为是ansible命令工具，其为核心执行工具

- INVENTORY：Ansible管理主机的清单/etc/anaible/hosts
- MODULES：Ansible执行命令的功能模块，多数为内置核心模块，也可自定义
- PLUGINS：模块功能的补充，如连接类型插件、循环插件、变量插件、过滤插件等，该功能不常用
- API：供第三方程序调用的应用程序编程接口

#### Ansible 命令执行来源

- USER 普通用户，即SYSTEM ADMINISTRATOR
- PLAYBOOKS：任务剧本（任务集），编排定义Ansible任务集的配置文件，由Ansible顺序依次执行，通常是JSON格式的YML文件
- CMDB（配置管理数据库） API 调用
- PUBLIC/PRIVATE CLOUD API调用
- USER-> Ansible Playbook -> Ansibile

### 注意事项

- 执行ansible的主机一般称为主控端，中控，master或堡垒机
- 主控端Python版本需要2.6或以上
- 被控端Python版本小于2.4，需要安装python-simplejson
- 被控端如开启SELinux需要安装libselinux-python
- windows 不能做为主控端

## Ansible 安装和入门

### Ansible安装

ansible的安装方法有多种

#### EPEL源的rpm包安装:

```bash
[root@ansible ~]#yum install ansible
```

#### 编译安装

```
yum -y install python-jinja2 PyYAML python-paramiko python-babel python-crypto
tar xf ansible-1.5.4.tar.gz
cd ansible-1.5.4
python setup.py build
python setup.py install
mkdir /etc/ansible
cp -r examples/* /etc/ansible
```

#### Git方式

```bash
git clone git://github.com/ansible/ansible.git --recursive
cd ./ansible
source ./hacking/env-setup
```

#### pip 安装

pip 是安装Python包的管理器，类似 yum

```bash
yum install python-pip python-devel
yum install gcc glibc-devel zibl-devel  rpm-bulid openssl-devel
pip install  --upgrade pip
pip install ansible --upgrade
```

#### 确认安装

```bash
[root@ansible ~]#ansible --version
ansible 2.9.5
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.6/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.6.8 (default, Nov 21 2019, 19:31:34) [GCC 8.3.1 20190507 (Red Hat 8.3.1-4)]
```

## Ansible相关工具

- /usr/bin/ansible 主程序，临时命令执行工具
- /usr/bin/ansible-doc 查看配置文档，模块功能查看工具
- /usr/bin/ansible-galaxy 下载/上传优秀代码或Roles模块的官网平台
- /usr/bin/ansible-playbook 定制自动化任务，编排剧本工具
- /usr/bin/ansible-pull 远程执行命令的工具
- /usr/bin/ansible-vault 文件加密工具
- /usr/bin/ansible-console 基于Console界面与用户交互的执行工具

**利用ansible实现管理的主要方式：**

- Ad-Hoc 即利用ansible命令，主要用于临时命令使用场景
- Ansible-playbook 主要用于长期规划好的，大型项目的场景，需要有前期的规划过程

### ansible-doc

此工具用来显示模块帮助

格式

```bash
ansible-doc [options] [module...]
-l, --list          #列出可用模块
-s, --snippet       #显示指定模块的playbook片段
```

范例：

```bash
#列出所有模块
ansible-doc -l  
#查看指定模块帮助用法
ansible-doc ping  
#查看指定模块帮助用法
ansible-doc -s  ping 
```

### ansible

此工具通过ssh协议，实现对远程主机的配置管理、应用部署、任务执行等功能

建议：使用此工具前，先配置ansible主控端能基于密钥认证的方式联系各个被管理节点

范例：利用sshpass批量实现基于key验证

```bash
#!/bin/bash
ssh-keygen -f /root/.ssh/id_rsa  -P ''
NET=192.168.100
export SSHPASS=magedu
for IP in {1..200};do 
    sshpass -e ssh-copy-id  NET.IP 
done
```

格式：

```bash
ansible <host-pattern> [-m module_name] [-a args]
```

选项说明：

```bash
--version           #显示版本
-m module           #指定模块，默认为command
-v                  #详细过程 –vv  -vvv更详细
--list-hosts        #显示主机列表，可简写 --list
-k, --ask-pass      #提示输入ssh连接密码，默认Key验证    
-C, --check         #检查，并不执行
-T, --timeout=TIMEOUT #执行命令的超时时间，默认10s
-u, --user=REMOTE_USER #执行远程执行的用户
-b, --become        #代替旧版的sudo 切换
--become-user=USERNAME  #指定sudo的runas用户，默认为root
-K, --ask-become-pass  #提示输入sudo时的口令
```

**ansible的Host-pattern**
用于匹配被控制的主机的列表
All ：表示所有Inventory中的所有主机

范例

```bash
ansible all –m ping
```

*:通配符

```
ansible  “*”  -m ping 
ansible  192.168.1.* -m ping
ansible  “srvs”  -m ping
```

**或关系**

```
ansible “websrvs:appsrvs”  -m ping 
ansible “192.168.1.10:192.168.1.20”  -m ping
```

**逻辑与**

```bash
#在websrvs组并且在dbsrvs组中的主机
ansible “websrvs:&dbsrvs” –m ping 
```

**逻辑非**

```bash
#在websrvs组，但不在dbsrvs组中的主机
#注意：此处为单引号
ansible ‘websrvs:!dbsrvs’ –m ping 
```

**综合逻辑**

```bash
ansible ‘websrvs:dbsrvs:&appsrvs:!ftpsrvs’ –m ping
```

**正则表达式**

```bash
ansible “websrvs:dbsrvs” –m ping 
ansible “~(web|db).*\.magedu\.com” –m ping 
```

**ansible命令执行过程**

**1.加载自己的配置文件 默认/etc/ansible/ansible.cfg**

**2.加载自己对应的模块文件，如：command**

**3.通过ansible将模块或命令生成对应的临时py文件，并将该文件传输至远程服务器的对应执行用户$HOME/.ansible/tmp/ansible-tmp-数字/XXX.PY文件**

**4.给文件+x执行**

**5.执行并返回结果**

**6.删除临时py文件，退出**

**ansible 的执行状态：**

```bash
[root@centos8 ~]#grep -A 14 '\[colors\]' /etc/ansible/ansible.cfg 
[colors]
#highlight = white
#verbose = blue
#warn = bright purple
#error = red
#debug = dark gray
#deprecate = purple
#skip = cyan
#unreachable = red
#ok = green
#changed = yellow
#diff_add = green
#diff_remove = red
#diff_lines = cyan
```

- 绿色：执行成功并且不需要做改变的操作
- 黄色：执行成功并且对目标主机做变更
- 红色：执行失败

**ansible使用范例**

```bash
#以wang用户执行ping存活检测
ansible all -m ping -u wang  -k
#以wang sudo至root执行ping存活检测
ansible all -m ping -u wang -k -b
#以wang sudo至mage用户执行ping存活检测
ansible all -m ping -u wang -k -b --become-user=mage
#以wang sudo至root用户执行ls 
ansible all -m command  -u wang -a 'ls /root' -b --become-user=root   -k -K
```

### ansible-playbook

此工具用于执行编写好的 playbook 任务

范例：

```bash
ansible-playbook hello.yml
cat  hello.yml
---
#hello world yml file
- hosts: websrvs
  remote_user: root  
  tasks:
    - name: hello world
      command: /usr/bin/wall hello world
```

### ansible-vault

此工具可以用于加密解密yml文件

格式：

```bash
ansible-vault [create|decrypt|edit|encrypt|rekey|view]
```

范例

```bash
ansible-vault encrypt hello.yml     #加密
ansible-vault decrypt hello.yml     #解密
ansible-vault view hello.yml        #查看
ansible-vault edit  hello.yml       #编辑加密文件
ansible-vault rekey  hello.yml      #修改口令
ansible-vault create new.yml        #创建新文件
```

### ansible-console

此工具可交互执行命令，支持tab，ansible 2.0+新增

提示符格式：

```
执行用户@当前操作的主机组 (当前组的主机数量)[f:并发数]$
```

常用子命令：

- 设置并发数： forks n 例如： forks 10
- 切换组： cd 主机组 例如： cd web
- 列出当前组主机列表： list
- 列出所有的内置命令： ?或help

范例



```
[root@ansible ~]#ansible-console
Welcome to the ansible console.
Type help or ? to list commands.

root@all (3)[f:5]list
10.0.0.8
10.0.0.7
10.0.0.6
root@all (3)[f:5] cd websrvs
root@websrvs (2)[f:5]list
10.0.0.7
10.0.0.8
root@websrvs (2)[f:5] forks 10
root@websrvs (2)[f:10]cd appsrvs
root@appsrvs (2)[f:5] yum name=httpd state=present
root@appsrvs (2)[f:5]$ service name=httpd state=started
```

### ansible-galaxy

此工具会连接 [https://galaxy.ansible.com](http://www.yunweipai.com/go?_=ae1f7f3df2aHR0cHM6Ly9nYWxheHkuYW5zaWJsZS5jb20=) 下载相应的roles

范例：

```bash
#列出所有已安装的galaxy
ansible-galaxy list
#安装galaxy
ansible-galaxy install geerlingguy.mysql
ansible-galaxy install geerlingguy.redis
#删除galaxy
ansible-galaxy remove geerlingguy.redis
```

## Ansible常用模块

2015年底270多个模块，2016年达到540个，2018年01月12日有1378个模块，2018年07月15日1852个模块,2019年05月25日（ansible 2.7.10）时2080个模块，2020年03月02日有3387个模块

虽然模块众多，但最常用的模块也就2，30个而已，针对特定业务只用10几个模块

常用模块帮助文档参考：

```
https://docs.ansible.com/ansible/latest/modules/modules_by_category.html
```

### Command 模块

功能：在远程主机执行命令，此为默认模块，可忽略-m选项

注意：此命令不支持 $VARNAME < > | ; & 等，用shell模块实现

范例：

```bash
[root@localhost wowosong]# ansible 192.168.177.129 -m command -a 'chdir=/etc cat centos-release'192.168.177.129 | CHANGED | rc=0 >>
CentOS Linux release 8.3.2011
[root@ansible ~]#ansible websrvs -m command -a 'chdir=/etc creates=/data/f1.txt cat centos-release'
10.0.0.7 | CHANGED | rc=0 >>
CentOS Linux release 7.7.1908 (Core)
10.0.0.8 | SUCCESS | rc=0 >>
skipped, since /data/f1.txt exists
[root@ansible ~]#ansible websrvs -m command -a 'chdir=/etc removes=/data/f1.txt cat centos-release'
10.0.0.7 | SUCCESS | rc=0 >>
skipped, since /data/f1.txt does not exist
10.0.0.8 | CHANGED | rc=0 >>
CentOS Linux release 8.1.1911 (Core)

ansible websrvs -m command -a ‘service vsftpd start’ 
ansible websrvs -m command -a ‘echo magedu |passwd --stdin wang’   
ansible websrvs -m command -a 'rm -rf /data/'
ansible websrvs -m command -a 'echo hello > /data/hello.log'
ansible websrvs -m command -a "echo $HOSTNAME"
```

### Wget模块

该模块主要用于从http、ftp、https服务器上下载文件（类似于wget），主要有如下选项：

get_url模块，该模块主要用于从http、ftp、https服务器上下载文件（类似于wget 选项： url： 指定要下载的文件的URL地址 

例子：ansible webservers -m get_url -a ‘url= http://nginx.org/download/nginx-1.15.7.tar.gz  dest=/root/’

 get_url: url=https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo dest=/etc/yum.repos.d/docker-ce.repo

### get_url模块 



### Shell模块

功能：和command相似，用shell执行命令

范例：

```bash
[root@ansible ~]#ansible websrvs -m shell -a "echo HOSTNAME"
10.0.0.7 | CHANGED | rc=0 >>
ansible
10.0.0.8 | CHANGED | rc=0 >>
ansible
[root@ansible ~]#ansible websrvs -m shell -a 'echoHOSTNAME'
10.0.0.7 | CHANGED | rc=0 >>
centos7.wangxiaochun.com
10.0.0.8 | CHANGED | rc=0 >>
centos8.localdomain

[root@ansible ~]#ansible websrvs -m shell -a 'echo centos | passwd --stdin wang'
10.0.0.7 | CHANGED | rc=0 >>
Changing password for user wang.
passwd: all authentication tokens updated successfully.
10.0.0.8 | CHANGED | rc=0 >>
Changing password for user wang.
passwd: all authentication tokens updated successfully.
[root@ansible ~]#ansible websrvs -m shell -a 'ls -l /etc/shadow'
10.0.0.7 | CHANGED | rc=0 >>
---------- 1 root root 889 Mar  2 14:34 /etc/shadow
10.0.0.8 | CHANGED | rc=0 >>
---------- 1 root root 944 Mar  2 14:34 /etc/shadow
[root@ansible ~]#ansible websrvs -m shell -a 'echo hello > /data/hello.log'
10.0.0.7 | CHANGED | rc=0 >>

10.0.0.8 | CHANGED | rc=0 >>

[root@ansible ~]#ansible websrvs -m shell -a 'cat  /data/hello.log'
10.0.0.7 | CHANGED | rc=0 >>
hello
10.0.0.8 | CHANGED | rc=0 >>
hello
```

注意：调用bash执行命令 类似 cat /tmp/test.md | awk -F‘|’ ‘{print 1,1,2}’ &> /tmp/example.txt 这些复杂命令，即使使用shell也可能会失败，解决办法：写到脚本时，copy到远程，执行，再把需要的结果拉回执行命令的机器

范例：将shell模块代替command，设为模块

```bash
[root@ansible ~]#vim /etc/ansible/ansible.cfg
#修改下面一行
module_name = shell
```

### Script模块

功能：在远程主机上运行ansible服务器上的脚本

范例：

```
ansible websrvs  -m script -a getHostName.sh
```

#/bin/bash
echo $HOSTNAME
echo `ip address show`               

[root@centos128 wowosong]# ansible 192.168.177.129 -m script -a getHostName.sh 
192.168.177.129 | CHANGED => {
    "changed": true,
    "rc": 0,
    "stderr": "Shared connection to 192.168.177.129 closed.\r\n",
    "stderr_lines": [
        "Shared connection to 192.168.177.129 closed."
    ],
    "stdout": "centos129\r\n1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
 group default qlen 1000 link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host lo valid_lft forever preferred_lft forever inet6 ::1/128 scope host valid_lft forever preferred_lft forever 2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000 link/ether 00:0c:29:66:79:f4 brd ff:ff:ff:ff:ff:ff inet 192.168.177.129/24 brd 192.168.177.255 scope global dynamic noprefixroute ens33 valid_lft 1177sec preferred_lft 1177sec inet6 fe80::7f0b:4bb0:a343:1f7d/64 scope link noprefixroute valid_lft forever preferred_lft forever 3: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000 link/ether 52:54:00:ba:36:31 brd ff:ff:ff:ff:ff:ff inet 192.168.122.1/24 brd 192.168.122.255 scope global virbr0 valid_lft forever preferred_lft forever 4: virbr0-nic: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel master virbr0 state DOWN group default qlen 1000 link/ether 52:54:00:ba:36:31 brd ff:ff:ff:ff:ff:ff\r\n",    "stdout_lines": [
        "centos129",
        "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen
 1000 link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host lo valid_lft forever preferred_lft forever inet6 ::1/128 scope host valid_lft forever preferred_lft forever 2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000 link/ether 00:0c:29:66:79:f4 brd ff:ff:ff:ff:ff:ff inet 192.168.177.129/24 brd 192.168.177.255 scope global dynamic noprefixroute ens33 valid_lft 1177sec preferred_lft 1177sec inet6 fe80::7f0b:4bb0:a343:1f7d/64 scope link noprefixroute valid_lft forever preferred_lft forever 3: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000 link/ether 52:54:00:ba:36:31 brd ff:ff:ff:ff:ff:ff inet 192.168.122.1/24 brd 192.168.122.255 scope global virbr0 valid_lft forever preferred_lft forever 4: virbr0-nic: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel master virbr0 state DOWN group default qlen 1000 link/ether 52:54:00:ba:36:31 brd ff:ff:ff:ff:ff:ff"    ]
}

### Copy模块

功能：从ansible服务器主控端复制文件到远程主机

```bash
#如目标存在，默认覆盖，此处指定先备份
ansible websrvs -m copy -a “src=/root/test1.sh dest=/tmp/test2.sh   owner=wang  mode=600 backup=yes” 
#指定内容，直接生成目标文件    
ansible websrvs -m copy -a "content='test line1\ntest line2' dest=/tmp/test.txt"
#复制/etc/下的文件，不包括/etc/目录自身
ansible websrvs -m copy -a “src=/etc/ dest=/backup”
```

[root@centos128 wowosong]# ansible 192.168.177.129 -m copy -a "src=`pwd`/getHostName.sh des
t=/root/getHostName1.sh"

![image-20210201094448531](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201094448531.png)

![image-20210201130415945](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201130415945.png)

![image-20210201131115112](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201131115112.png)

### Fetch模块

功能：从远程主机提取文件至ansible的主控端，copy相反，目前不支持目录

范例：

```
ansible websrvs -m fetch -a ‘src=/root/test.sh dest=/data/scripts’ 
```

范例：

![image-20210201131354715](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201131354715.png)

```
[root@ansible ~]#ansible   all -m  fetch -a 'src=/etc/redhat-release dest=/data/os'
[root@ansible ~]#tree /data/os/
/data/os/
├── 10.0.0.6
│   └── etc
│       └── redhat-release
├── 10.0.0.7
│   └── etc
│       └── redhat-release
└── 10.0.0.8
    └── etc
        └── redhat-release

6 directories, 3 files
```

### File模块

功能：设置文件属性

范例：

```bash
#创建空文件
ansible all -m  file  -a 'path=/data/test.txt state=touch'
ansible all -m  file  -a 'path=/data/test.txt state=absent' 删除文件
ansible all -m file -a "path=/root/test.sh owner=wang mode=755“ 修改文件权限
#创建目录
ansible all -m file -a "path=/data/mysql state=directory owner=mysql group=mysql"
#创建软链接
ansible all -m file -a ‘src=/data/testfile  dest=/data/testfile-link state=link’
```

![image-20210201132335409](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201132335409.png)

### unarchive模块

功能：解包解压缩

实现有两种用法：
1、将ansible主机上的压缩包传到远程主机后解压缩至特定目录，设置copy=yes
2、将远程主机上的某个压缩包解压缩到指定路径下，设置copy=no

常见参数：

- copy：默认为yes，当copy=yes，拷贝的文件是从ansible主机复制到远程主机上，如果设置为copy=no，会在远程主机上寻找src源文件
- remote_src：和copy功能一样且互斥，yes表示在远程主机，不在ansible主机，no表示文件在ansible主机上
- src：源路径，可以是ansible主机上的路径，也可以是远程主机上的路径，如果是远程主机上的路径，则需要设置copy=no
- dest：远程主机上的目标路径
- mode：设置解压缩后的文件权限

范例：

```bash
ansible all -m unarchive -a 'src=/data/foo.tgz dest=/var/lib/foo'
ansible all -m unarchive -a 'src=/tmp/foo.zip dest=/data copy=no mode=0777'
ansible all -m unarchive -a 'src=https://example.com/example.zip dest=/data copy=no'
```

Bash

Copy

### Archive模块

功能：打包压缩

范例：

```bash
ansible websrvs -m archive  -a 'path=/var/log/ dest=/data/log.tar.bz2 format=bz2  owner=wang mode=0600'
```

Bash

Copy

### Hostname模块

功能：管理主机名

范例：

```bash
ansible node1 -m hostname -a “name=websrv” 
ansible 192.168.100.18 -m hostname -a 'name=node18.magedu.com'
```

![image-20210201135157614](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201135157614.png)

### Cron模块

功能：计划任务
支持时间：minute，hour，day，month，weekday

范例：

```bash
#备份数据库脚本
[root@centos8 ~]#cat mysql_backup.sh 
mysqldump -A -F --single-transaction --master-data=2 -q -uroot |gzip > /data/mysql_date +%F_%T.sql.gz
#创建任务
ansible 10.0.0.8 -m cron -a 'hour=2 minute=30 weekday=1-5 name="backup mysql" job=/root/mysql_backup.sh'
ansible websrvs   -m cron -a "minute=*/5 job='/usr/sbin/ntpdate 172.20.0.1 &>/dev/null' name=Synctime"
#禁用计划任务
ansible websrvs   -m cron -a "minute=*/5 job='/usr/sbin/ntpdate 172.20.0.1 &>/dev/null' name=Synctime disabled=yes"
#启用计划任务
ansible websrvs   -m cron -a "minute=*/5 job='/usr/sbin/ntpdate 172.20.0.1 &>/dev/null' name=Synctime disabled=no"
#删除任务
ansible websrvs -m cron -a "name='backup mysql' state=absent"
ansible websrvs -m cron -a 'state=absent name=Synctime'
```

### Yum模块

功能：管理软件包，只支持RHEL，CentOS，fedora，不支持Ubuntu其它版本

范例：

```bash
ansible websrvs -m yum -a ‘name=httpd state=present’  #安装
ansible websrvs -m yum -a ‘name=httpd state=absent’  #删除
```

### Service模块

功能：管理服务

范例：

```bash
ansible all -m service -a 'name=httpd state=started enabled=yes'
ansible all -m service -a 'name=httpd state=stopped'
ansible all -m service -a 'name=httpd state=reloaded’
ansible all -m shell -a "sed -i 's/^Listen 80/Listen 8080/' /etc/httpd/conf/httpd.conf"
ansible all -m service -a 'name=httpd state=restarted' 
```

### User模块

功能：管理用户

范例：

```bash
#创建用户
ansible all -m user -a 'name=user1 comment=“test user” uid=2048 home=/app/user1 group=root'

ansible all -m user -a 'name=nginx comment=nginx uid=88 group=nginx groups="root,daemon" shell=/sbin/nologin system=yes create_home=no  home=/data/nginx non_unique=yes'

#删除用户及家目录等数据
ansible all -m user -a 'name=nginx state=absent remove=yes'
```

![image-20210201140030968](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201140030968.png)

### Group模块

功能：管理组

范例：

```bash
#创建组
ansible websrvs -m group  -a 'name=nginx gid=88 system=yes'
#删除组
ansible websrvs -m group  -a 'name=nginx state=absent'
```

### Lineinfile模块

ansible在使用sed进行替换时，经常会遇到需要转义的问题，而且ansible在遇到特殊符号进行替换时，存在问题，无法正常进行替换 。其实在ansible自身提供了两个模块：lineinfile模块和replace模块，可以方便的进行替换

功能：相当于sed，可以修改文件内容

范例：

```bash
ansible all -m   lineinfile -a "path=/etc/selinux/config regexp='^SELINUX=' line='SELINUX=enforcing'"
ansible all -m lineinfile  -a 'dest=/etc/fstab state=absent regexp="^#"'
```

### Replace模块

该模块有点类似于sed命令，主要也是基于正则进行匹配和替换

范例：

```bash
ansible all -m replace -a "path=/etc/fstab regexp='^(UUID.*)' replace='#\1'"  
ansible all -m replace -a "path=/etc/fstab regexp='^#(.*)' replace='\1'"
```

### Setup模块

功能： setup 模块来收集主机的系统信息，这些 facts 信息可以直接以变量的形式使用，但是如果主机较多，会影响执行速度，可以使用`gather_facts: no`来禁止 Ansible 收集 facts 信息

范例：

```bash
ansible all -m setup
ansible all -m setup -a "filter=ansible_nodename"
ansible all -m setup -a "filter=ansible_hostname"
ansible all -m setup -a "filter=ansible_domain"
ansible all -m setup -a "filter=ansible_memtotal_mb"
ansible all -m setup -a "filter=ansible_memory_mb"
ansible all -m setup -a "filter=ansible_memfree_mb"
ansible all -m setup -a "filter=ansible_os_family"
ansible all -m setup -a "filter=ansible_distribution_major_version"
ansible all -m setup -a "filter=ansible_distribution_version"
ansible all -m setup -a "filter=ansible_processor_vcpus"
ansible all -m setup -a "filter=ansible_all_ipv4_addresses"
ansible all -m setup -a "filter=ansible_architecture"
ansible all -m  setup  -a "filter=ansible_processor*"
```

范例：

```bash
[root@ansible ~]#ansible all  -m  setup -a 'filter=ansible_python_version'
10.0.0.7 | SUCCESS => {
    "ansible_facts": {
        "ansible_python_version": "2.7.5",
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false
}
10.0.0.6 | SUCCESS => {
    "ansible_facts": {
        "ansible_python_version": "2.6.6",
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false
}
10.0.0.8 | SUCCESS => {
    "ansible_facts": {
        "ansible_python_version": "3.6.8",
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false
}
```

## Ansible-Playbook详解

### playbook介绍

![Ansible-Playbook详解插图](/Users/jiusonghuang/pic-md/20210610223134.png)

playbook 剧本是由一个或多个“play”组成的列表
play的主要功能在于将预定义的一组主机，装扮成事先通过ansible中的task定义好的角色。Task实际是调用ansible的一个module，将多个play组织在一个playbook中，即可以让它们联合起来，按事先编排的机制执行预定义的动作
Playbook 文件是采用YAML语言编写的

#### YAML 语言

##### YAMl 语言介绍

YAML是一个可读性高的用来表达资料序列的格式。YAML参考了其他多种语言，包括：XML、C语言、Python、Perl以及电子邮件格式RFC2822等。Clark Evans在2001年在首次发表了这种语言，另外Ingy döt Net与Oren Ben-Kiki也是这语言的共同设计者,目前很多软件中采有此格式的文件，如:ubuntu，anisble，docker，k8s等
YAML：YAML Ain’t Markup Language，即YAML不是XML。不过，在开发的这种语言时，YAML的意思其实是："Yet Another Markup Language"（仍是一种标记语言）

YAML 官方网站：[http://www.yaml.org](http://www.yunweipai.com/go?_=f2fb54694baHR0cDovL3d3dy55YW1sLm9yZw==)

##### YAML 语言特性

- YAML的可读性好
- YAML和脚本语言的交互性好
- YAML使用实现语言的数据类型
- YAML有一个一致的信息模型
- YAML易于实现
- YAML可以基于流来处理
- YAML表达能力强，扩展性好

##### YAML语法简介

- 在单一文件第一行，用连续三个连字号“-” 开始，还有选择性的连续三个点号( … )用来表示文件的结尾
- 次行开始正常写Playbook的内容，一般建议写明该Playbook的功能
- 使用#号注释代码
- 缩进必须是统一的，不能空格和tab混用
- 缩进的级别也必须是一致的，同样的缩进代表同样的级别，程序判别配置的级别是通过缩进结合换行来实现的
  YAML文件内容是区别大小写的，key/value的值均需大小写敏感
- 多个key/value可同行写也可换行写，同行使用，分隔
- v可是个字符串，也可是另一个列表
- 一个完整的代码块功能需最少元素需包括 name 和 task
- 一个name只能包括一个task
- YAML文件扩展名通常为yml或yaml

YAML的语法和其他高阶语言类似，并且可以简单表达清单、散列表、标量等数据结构。其结构（Structure）通过空格来展示，序列（Sequence）里的项用"-"来代表，Map里的键值对用":"分隔，下面介绍常见的数据结构。

## Playbook核心元素

- Hosts 执行的远程主机列表
- Tasks 任务集
- Variables 内置变量或自定义变量在playbook中调用
- Templates 模板，可替换模板文件中的变量并实现一些简单逻辑的文件
- Handlers 和 notify 结合使用，由特定条件触发的操作，满足条件方才执行，否则不执行
- tags 标签 指定某条任务执行，用于选择运行playbook中的部分代码。ansible具有幂等性，因此会自动跳过没有变化的部分，即便如此，有些代码为测试其确实没有发生变化的时间依然会非常地长。此时，如果确信其没有变化，就可以通过tags跳过此些代码片断

### hosts 组件

Hosts：playbook中的每一个play的目的都是为了让特定主机以某个指定的用户身份执行任务。hosts用于指定要执行指定任务的主机，须事先定义在主机清单中

```bash
one.example.com
one.example.com:two.example.com
192.168.1.50
192.168.1.*
Websrvs:dbsrvs      #或者，两个组的并集
Websrvs:&dbsrvs     #与，两个组的交集
webservers:!phoenix  #在websrvs组，但不在dbsrvs组
```

案例：

```yaml
- hosts: websrvs:appsrvs
```

### remote_user 组件

remote_user: 可用于Host和task中。也可以通过指定其通过sudo的方式在远程主机上执行任务，其可用于play全局或某任务；此外，甚至可以在sudo时使用sudo_user指定sudo时切换的用户

```yaml
- hosts: websrvs
  remote_user: root
  tasks:
    - name: test connection
      ping:
      remote_user: magedu
      sudo: yes                 #默认sudo为root
      sudo_user:wang        #sudo为wang
```

### task列表和action组件

play的主体部分是task list，task list中有一个或多个task,各个task 按次序逐个在hosts中指定的所有主机上执行，即在所有主机上完成第一个task后，再开始第二个task
task的目的是使用指定的参数执行模块，而在模块参数中可以使用变量。模块执行是幂等的，这意味着多次执行是安全的，因为其结果均一致
每个task都应该有其name，用于playbook的执行结果输出，建议其内容能清晰地描述任务执行步骤。如果未提供name，则action的结果将用于输出

**task两种格式：**
(1) action: module arguments
(2) module: arguments 建议使用

注意：shell和command模块后面跟命令，而非key=value

范例：

```yaml
---
- hosts: websrvs
  remote_user: root
  tasks:
    - name: install httpd
      yum: name=httpd 
    - name: start httpd
      service: name=httpd state=started enabled=yes
```

### 其它组件

某任务的状态在运行后为changed时，可通过“notify”通知给相应的handlers
任务可以通过"tags“打标签，可在ansible-playbook命令上使用-t指定进行调用

### ShellScripts VS Playbook 案例

```yaml
#SHELL脚本实现
#!/bin/bash
# 安装Apache
yum install --quiet -y httpd 
# 复制配置文件
cp /tmp/httpd.conf /etc/httpd/conf/httpd.conf
cp/tmp/vhosts.conf /etc/httpd/conf.d/
# 启动Apache，并设置开机启动
systemctl enable --now httpd 

#Playbook实现
---
- hosts: websrvs
  remote_user: root
  tasks:
    - name: "安装Apache"
      yum: name=httpd
    - name: "复制配置文件"
      copy: src=/tmp/httpd.conf dest=/etc/httpd/conf/
    - name: "复制配置文件"
      copy: src=/tmp/vhosts.conf dest=/etc/httpd/conf.d/
    - name: "启动Apache，并设置开机启动"`	
      service: name=httpd state=started enabled=yes
```

## Ansible-Playbook企业案例

### playbook 命令

格式

```bash
ansible-playbook <filename.yml> ... [options]
```

常见选项

```bash
-C --check          #只检测可能会发生的改变，但不真正执行操作
--list-hosts        #列出运行任务的主机
--list-tags         #列出tag
--list-tasks        #列出task
--limit 主机列表      #只针对主机列表中的主机执行
-v -vv  -vvv        #显示过程
```

范例

```bash
ansible-playbook  file.yml  --check #只检测
ansible-playbook  file.yml  
ansible-playbook  file.yml  --limit websrvs
```

### Playbook 初步

#### 利用 playbook 创建 mysql 用户

范例：mysql_user.yml

```yaml
---
- hosts: dbsrvs
  remote_user: root

  tasks:
    - {name: create group, group: name=mysql system=yes gid=306}
    - name: create user
      user: name=mysql shell=/sbin/nologin system=yes group=mysql uid=306 home=/data/mysql create_home=no   
```

#### 利用 playbook 安装 nginx

范例：install_nginx.yml

```bash
---
# install nginx 
- hosts: websrvs
  remote_user: root  
  tasks:
    - name: add group nginx
      user: name=nginx state=present
    - name: add user nginx
      user: name=nginx state=present group=nginx
    - name: Install Nginx
      yum: name=nginx state=present
    - name: web page
      copy: src=files/index.html dest=/usr/share/nginx/html/index.html
    - name: Start Nginx
      service: name=nginx state=started enabled=yes
```

![image-20210201150956750](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210201150956750.png)

#### 利用 playbook 安装和卸载 httpd

范例：install_httpd.yml

```bash
---
#install httpd 
- hosts: websrvs
  remote_user: root
  gather_facts: no
  tasks:
    - name: Install httpd
      yum: name=httpd state=present
    - name: Install configure file
      copy: src=files/httpd.conf dest=/etc/httpd/conf/
    - name: web html
      copy: src=files/index.html  dest=/var/www/html/
    - name: start service
      service: name=httpd state=started enabled=yes

ansible-playbook   install_httpd.yml --limit 10.0.0.8
```

范例：remove_httpd.yml

```yaml
#remove_httpd.yml
---
- hosts: websrvs
  remote_user: root

  tasks:
    - name: remove httpd package
      yum: name=httpd state=absent
    - name: remove apache user 
      user: name=apache state=absent
    - name: remove config file
      file: name=/etc/httpd  state=absent
    - name: remove web html
      file: name=/var/www/html/index.html state=absent
```

#### 利用 playbook 安装mysql

**范例：安装mysql-5.6.46-linux-glibc2.12**

```bash
[root@ansible ~]#ls -l /data/ansible/files/mysql-5.6.46-linux-glibc2.12-x86_64.tar.gz 
-rw-r--r-- 1 root root 403177622 Dec  4 13:05 /data/ansible/files/mysql-5.6.46-linux-glibc2.12-x86_64.tar.gz

[root@ansible ~]#cat /data/ansible/files/my.cnf 
[mysqld]
socket=/tmp/mysql.sock
user=mysql
symbolic-links=0
datadir=/data/mysql
innodb_file_per_table=1
log-bin
pid-file=/data/mysql/mysqld.pid

[client]
port=3306
socket=/tmp/mysql.sock

[mysqld_safe]
log-error=/var/log/mysqld.log

[root@ansible ~]#cat /data/ansible/files/secure_mysql.sh 
#!/bin/bash
/usr/local/mysql/bin/mysql_secure_installation <<EOF

y
magedu
magedu
y
y
y
y
EOF

[root@ansible ~]#tree /data/ansible/files/
/data/ansible/files/
├── my.cnf
├── mysql-5.6.46-linux-glibc2.12-x86_64.tar.gz
└── secure_mysql.sh

0 directories, 3 files

[root@ansible ~]#cat /data/ansible/install_mysql.yml
---
# install mysql-5.6.46-linux-glibc2.12-x86_64.tar.gz
- hosts: dbsrvs
  remote_user: root
  gather_facts: no
  tasks:
    - name: install packages
      yum: name=libaio,perl-Data-Dumper,perl-Getopt-Long
    - name: create mysql group
      group: name=mysql gid=306 
    - name: create mysql user
      user: name=mysql uid=306 group=mysql shell=/sbin/nologin system=yes create_home=no home=/data/mysql
    - name: copy tar to remote host and file mode 
      unarchive: src=/data/ansible/files/mysql-5.6.46-linux-glibc2.12-x86_64.tar.gz dest=/usr/local/ owner=root group=root 
    - name: create linkfile  /usr/local/mysql 
      file: src=/usr/local/mysql-5.6.46-linux-glibc2.12-x86_64 dest=/usr/local/mysql state=link
    - name: data dir
      shell: chdir=/usr/local/mysql/  ./scripts/mysql_install_db --datadir=/data/mysql --user=mysql
      tags: data
    - name: config my.cnf
      copy: src=/data/ansible/files/my.cnf  dest=/etc/my.cnf 
    - name: service script
      shell: /bin/cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
    - name: enable service
      shell: /etc/init.d/mysqld start;chkconfig --add mysqld;chkconfig mysqld on  
      tags: service
    - name: PATH variable
      copy: content='PATH=/usr/local/mysql/bin:$PATH' dest=/etc/profile.d/mysql.sh
    - name: secure script
      script: /data/ansible/files/secure_mysql.sh
      tags: script
```

**范例：install_mariadb.yml**

```bash
---
#Installing MariaDB Binary Tarballs
- hosts: dbsrvs
  remote_user: root
  gather_facts: no
  tasks:
    - name: create group
      group: name=mysql gid=27 system=yes
    - name: create user
      user: name=mysql uid=27 system=yes group=mysql shell=/sbin/nologin home=/data/mysql create_home=no
    - name: mkdir datadir
      file: path=/data/mysql owner=mysql group=mysql state=directory
    - name: unarchive package
      unarchive: src=/data/ansible/files/mariadb-10.2.27-linux-x86_64.tar.gz dest=/usr/local/ owner=root group=root
    - name: link
      file: src=/usr/local/mariadb-10.2.27-linux-x86_64 path=/usr/local/mysql state=link 
    - name: install database
      shell: chdir=/usr/local/mysql   ./scripts/mysql_install_db --datadir=/data/mysql --user=mysql
    - name: config file
      copy: src=/data/ansible/files/my.cnf  dest=/etc/ backup=yes
    - name: service script
      shell: /bin/cp  /usr/local/mysql/support-files/mysql.server  /etc/init.d/mysqld
    - name: start service
      service: name=mysqld state=started enabled=yes
    - name: PATH variable
      copy: content='PATH=/usr/local/mysql/bin:$PATH' dest=/etc/profile.d/mysql.sh
```

## Ansible-Playbook中使用变量

### Playbook中使用变量

变量名：仅能由字母、数字和下划线组成，且只能以字母开头

**变量定义：**

```
variable=value
```

范例：

```
http_port=80
```

**变量调用方式：**

通过{{ variable_name }} 调用变量，且变量名前后建议加空格，有时用“{{ variable_name }}”才生效

**变量来源：**

1.ansible 的 setup facts 远程主机的所有变量都可直接调用

2.通过命令行指定变量，优先级最高

```bash
   ansible-playbook -e varname=value
```

3.在playbook文件中定义

```bash
   vars:
     - var1: value1
     - var2: value2
```

4.在独立的变量YAML文件中定义

```
   - hosts: all
     vars_files:
       - vars.yml
```

5.在 /etc/ansible/hosts 中定义

主机（普通）变量：主机组中主机单独定义，优先级高于公共变量
组（公共）变量：针对主机组中所有主机定义统一变量

6.在role中定义

### 使用 setup 模块中变量

本模块自动在playbook调用，不要用ansible命令调用

案例：使用setup变量

```bash
---
#var.yml
- hosts: all
  remote_user: root
  gather_facts: yes

  tasks:
    - name: create log file
      file: name=/data/{{ ansible_nodename }}.log state=touch owner=wang mode=600

ansible-playbook  var.yml
```

### 在playbook 命令行中定义变量

范例：

```
vim var2.yml
---
- hosts: websrvs
  remote_user: root
  tasks:
    - name: install package
      yum: name={{ pkname }} state=present

ansible-playbook  –e pkname=httpd  var2.yml
```

### 在playbook文件中定义变量

范例：

```bash
vim var3.yml
---
- hosts: websrvs
  remote_user: root
  vars:
    - username: user1
    - groupname: group1

  tasks:
    - name: create group
      group: name={{ groupname }} state=present
    - name: create user
      user: name={{ username }} group={{ groupname }} state=present

ansible-playbook -e "username=user2 groupname=group2”  var3.yml
```

### 使用变量文件

可以在一个独立的playbook文件中定义变量，在另一个playbook文件中引用变量文件中的变量，比playbook中定义的变量优化级高

```bash
vim vars.yml
---
# variables file
package_name: mariadb-server
service_name: mariadb

vim  var4.yml
---
#install package and start service
- hosts: dbsrvs
  remote_user: root
  vars_files:
    - /root/vars.yml

  tasks:
    - name: install package
      yum: name={{ package_name }}
      tags: install
    - name: start service
      service: name={{ service_name }} state=started enabled=yes
```

范例：

```bash
cat  vars2.yml
---
var1: httpd
var2: nginx

cat  var5.yml
---         
- hosts: web
  remote_user: root
  vars_files:
    - vars2.yml

   tasks:
     - name: create httpd log
       file: name=/app/{{ var1 }}.log state=touch
     - name: create nginx log
       file: name=/app/{{ var2 }}.log state=touch
```

### 主机清单文件中定义变量

#### 主机变量

在inventory 主机清单文件中为指定的主机定义变量以便于在playbook中使用

范例：

```
[websrvs]
www1.magedu.com http_port=80 maxRequestsPerChild=808
www2.magedu.com http_port=8080 maxRequestsPerChild=909
```

#### 组（公共）变量

在inventory 主机清单文件中赋予给指定组内所有主机上的在playbook中可用的变量，如果和主机变是同名，优先级低于主机变量

范例：

```
[websrvs]
www1.magedu.com
www2.magedu.com

[websrvs:vars]
ntp_server=ntp.magedu.com
nfs_server=nfs.magedu.com
```

范例：

```bash
vim /etc/ansible/hosts
[websrvs]
192.168.0.101 hname=www1 domain=magedu.io
192.168.0.102 hname=www2 

[websvrs:vars]
mark=“-”
domain=magedu.org

ansible  websvrs  –m hostname –a ‘name={{ hname }}{{ mark }}{{ domain }}’
bash
#命令行指定变量： 
ansible  websvrs  –e domain=magedu.cn –m hostname –a    ‘name={{ hname }}{{ mark }}{{ domain }}’
```

## Ansible的配置文件

Ansible的一些的设置可以通过配置文件完成。在大多数场景下默认的配置就能满足大多数用户的需求，在一些特殊场景下，用户还是需要自行修改这些配置文件。

用户可以修改一下配置文件来修改设置,他们的被读取的顺序如下:

```
* ANSIBLE_CONFIG (一个环境变量)
* ansible.cfg (位于当前目录中)
* .ansible.cfg (位于家目录中)
* /etc/ansible/ansible.cfg
```

Ansible 将会按以上顺序逐个查询这些文件,直到找到一个为止,并且使用第一个寻找到个配置文件的配置，这些配置将不会被叠加

## Inventory文件

## Playbooks

### Playbooks 介绍

Playbooks 与 adhoc 相比,是一种完全不同的运用 ansible 的方式,是非常之强大的.

简单来说,playbooks 是一种简单的配置管理系统与多机器部署系统的基础.与现有的其他系统有不同之处,且非常适合于复杂应用的部署.

Playbooks 可用于声明配置,更强大的地方在于,在 playbooks 中可以编排有序的执行过程,甚至于做到在多组机器间,来回有序的执行特别指定的步骤.并且可以同步或异步的发起任务.

我们使用 adhoc 时,主要是使用 /usr/bin/ansible 程序执行任务.而使用 playbooks 时,更多是将之放入源码控制之中,用之推送你的配置或是用于确认你的远程系统的配置是否符合配置规范.

在如右的连接中: [ansible-examples repository](https://github.com/ansible/ansible-examples) ,有一些整套的playbooks,它们阐明了上述的这些技巧.我们建议你在另一个标签页中打开它看看,配合本章节一起看.

即便学完 playbooks 这个章节,仍有许多知识点只是入门的级别,完成本章的学习后,可回到文档索引继续学习.

#### playbook基础

##### 主机与用户

你可以为 playbook 中的每一个 play，个别地选择操作的目标机器是哪些，以哪个用户身份去完成要执行的步骤（called tasks）。

- hosts 行的内容是一个或多个组或主机的 patterns,以逗号为分隔符,详见 [*Patterns*](http://www.ansible.com.cn/docs/intro_patterns.html) 章节.

  remote_user 就是账户名:`--- - hosts: webservers  remote_user: root `

参数 remote_user 以前写做 user,在 Ansible 1.4 以后才改为 remote_user.主要为了不跟 user 模块混淆（user 模块用于在远程系统上创建用户）.

再者,在每一个 task 中,可以定义自己的远程用户:

```
---
- hosts: webservers
  remote_user: root
  tasks:
    - name: test connection
      ping:
      remote_user: yourname
```

也支持从 sudo 执行命令:

```
---
- hosts: webservers
  remote_user: yourname
  sudo: yes
```

同样的,你可以仅在一个 task 中,使用 sudo 执行命令,而不是在整个 play 中使用 sudo:

```
---
- hosts: webservers
  remote_user: yourname
  tasks:
    - service: name=nginx state=started
      sudo: yes
```

你也可以登陆后,sudo 到不同的用户身份,而不是使用 root:

```
---
- hosts: webservers
  remote_user: yourname
  sudo: yes
  sudo_user: postgres
```

**Important**

当使用 sudo_user 切换到 非root 用户时,模块的参数会暂时写入 /tmp 目录下的一个随机临时文件. 当命令执行结束后,临时文件立即删除.这种情况发生在普通用户的切换时,比如从 ‘bob’ 切换到 ‘timmy’, 切换到 root 账户时,不会发生,如从 ‘bob’ 切换到 ‘root’,直接以普通用户或root身份登录也不会发生. 如果你不希望这些数据在短暂的时间内可以被读取（不可写）,请避免在 sudo_user 中传递未加密的密码. 其他情况下,’/tmp’ 目录不被使用,这种情况不会发生.Ansible 也有意识的在日志中不记录密码参数.

##### Tasks 列表

每一个 play 包含了一个 task 列表（任务列表）.一个 task 在其所对应的所有主机上（通过 host pattern 匹配的所有主机）执行完毕之后,下一个 task 才会执行.有一点需要明白的是（很重要）,在一个 play 之中,所有 hosts 会获取相同的任务指令,这是 play 的一个目的所在,也就是将一组选出的 hosts 映射到 task.（注:此处翻译未必准确,暂时保留原文）

在运行 playbook 时（从上到下执行）,如果一个 host 执行 task 失败,这个 host 将会从整个 playbook 的 rotation 中移除. 如果发生执行失败的情况,请修正 playbook 中的错误,然后重新执行即可.

每个 task 的目标在于执行一个 moudle, 通常是带有特定的参数来执行.在参数中可以使用变量（variables）.

modules 具有”幂等”性,意思是如果你再一次地执行 moudle（译者注:比如遇到远端系统被意外改动,需要恢复原状）,moudle 只会执行必要的改动,只会改变需要改变的地方.所以重复多次执行 playbook 也很安全.

对于 command module 和 shell module,重复执行 playbook,实际上是重复运行同样的命令.如果执行的命令类似于 ‘chmod’ 或者 ‘setsebool’ 这种命令,这没有任何问题.也可以使用一个叫做 ‘creates’ 的 flag 使得这两个 module 变得具有”幂等”特性 （不是必要的）.

每一个 task 必须有一个名称 name,这样在运行 playbook 时,从其输出的任务执行信息中可以很好的辨别出是属于哪一个 task 的. 如果没有定义 name,‘action’ 的值将会用作输出信息中标记特定的 task.

如果要声明一个 task,以前有一种格式: “action: module options” （可能在一些老的 playbooks 中还能见到）.现在推荐使用更常见的格式:”module: options” ,本文档使用的就是这种格式.

下面是一种基本的 task 的定义,service moudle 使用 key=value 格式的参数,这也是大多数 module 使用的参数格式:

```
tasks:
  - name: make sure apache is running
    service: name=httpd state=running
```

比较特别的两个 modudle 是 command 和 shell ,它们不使用 key=value 格式的参数,而是这样:

```
tasks:
  - name: disable selinux
    command: /sbin/setenforce 0
```

在 action 行中可以使用变量.假设在 ‘vars’ 那里定义了一个变量 ‘vhost’ ,可以这样使用它:

```
tasks:
  - name: create a virtual host file for {{ vhost }}
    template: src=somefile.j2 dest=/etc/httpd/conf.d/{{ vhost }}
```

这些变量在 tempates 中也是可用的,稍后会讲到.

**在一个基础的 playbook 中,所有的 task 都是在一个 play 中列出,稍后将介绍一种更合理的安排 task 的方式:使用 ‘include:’ 指令.**

##### Handlers: 在发生改变时执行的操作

曾提到过,module具有”幂等”性,所以当远端系统被人改动时,可以重放 playbooks 达到恢复的目的. **playbooks 本身可以识别这种改动,并且有一个基本的 event system（事件系统）,可以响应这种改动.**

（当发生改动时）’notify’ actions 会在 playbook 的每一个 task 结束时被触发,而且即使**有多个不同的 task 通知改动的发生, ‘notify’ actions 只会被触发一次.**

比如多个 resources 指出因为一个配置文件被改动,所以 apache 需要重新启动,但是重新启动的操作只会被执行一次。

这里有一个例子,当一个文件的内容被改动时,重启两个 services:

```
- name: template configuration file
  template: src=template.j2 dest=/etc/foo.conf
  notify:
     - restart memcached
     - restart apache
```

‘notify’ 下面列出的即是 handlers。

Handlers 也是一些 task 的列表,通过名字来引用，它们和一般的 task 并没有什么区别。Handlers 是由通知者进行 notify， 如果没有被 notify，handlers 不会执行。不管有多少个通知者进行了 notify，等到 play 中的所有 task 执行完成之后，handlers 也只会被执行一次.

这里是一个 handlers 的示例:

```
handlers:
    - name: restart memcached
      service:  name=memcached state=restarted
    - name: restart apache
      service: name=apache state=restarted
```

**Handlers 最佳的应用场景是用来重启服务,或者触发系统重启操作.除此以外很少用到了.**

**handlers 会按照声明的顺序执行**

##### 执行一个 playbook

既然现在你已经学习了 playbook 的语法,那要如何运行一个 playbook 呢？这很简单,这里的示例是并行的运行 playbook,并行的级别 是10（译者注:是10个并发的进程？）:

```
ansible-playbook playbook.yml -f 10
```

### Playbook 角色(Roles) 和 Include 语句

当我们刚开始学习运用 playbook 时，可能会把 playbook 写成一个很大的文件，到后来可能你会希望这些文件是可以方便去重用的，所以需要重新去组织这些文件。

基本上，使用 include 语句引用 task 文件的方法，可允许你将一个配置策略分解到更小的文件中。使用 include 语句引用 tasks 是将 tasks 从其他文件拉取过来。因为 handlers 也是 tasks，所以你也可以使用 include 语句去引用 handlers 文件。handlers 文件来自 ‘handlers:’ section。

Playbook 同样可以使用 include 引用其他 playbook 文件中的 play。这时被引用的 play 会被插入到当前的 playbook 中，当前的 playbook 中就有了一个更长的的 play 列表。

当你开始思考这些概念：tasks, handlers, variables 等等，是否可以将它们抽象为一个更大的概念呢。我们考虑的不再是”将这些 tasks，handlers，variables 等等应用到这些 hosts 中”，而是有了更抽象的概念，比如：”这些 hosts 是 dbservers” 或者 “那些 hosts 是 webservers”（译者注：dbserver，webservers 即是”角色”）。这种思考方式在编程中被称为”封装”，将其中具体的功能封装了起来。

Roles 的概念来自于这样的想法：通过 include 包含文件并将它们组合在一起，组织成一个简洁、可重用的抽象对象。这种方式可使你将注意力更多地放在大局上，只有在需要时才去深入了解细节。

我们将从理解如何使用 include 开始，这样你会更容易理解 roles 的概念。但我们的终极目标是让你理解 roles，roles 是一个很棒的东西，每次你写 playbook 的时候都应该使用它。

#### playbook引入文件并鼓励复用

假如你希望在多个 play 或者多个 playbook 中重用同一个task 列表，你可以使用 include files 做到这一点。 当我们希望为系统定义一个角色时，使用 include 去包含 task 列表是一种很好用的方法。需要记住的是，一个 play 所要达成 的目标是将一组系统映射为多个角色。下面我们来看看具体是如何做的：

一个 task include file 由一个普通的 task 列表所组成，像这样:

```
---
# possibly saved as tasks/foo.yml

- name: placeholder foo
  command: /bin/foo

- name: placeholder bar
  command: /bin/bar
```

- name: install the latest version of Apache
  yum:
       name: httpd
       state: installed
- name: systemc config port 8080
  lineinfile:
       path: /etc/httpd/conf/httpd.conf
       regexp: '^Listen '
       line: 'Listen 8080'
- name: sytemctl enable Apache
  service:
       name: httpd
       enabled: yes
       state: started
- name: systemctl restart apache
  service:
       name: httpd
       state: restarted
- name: open port 8080 for Apache
  firewalld:
       port: 8081/tcp
       permanent: yes
       state: enabled                        

include 指令看起来像下面这样，在一个 playbook 中，Include 指令可以跟普通的 tasks 混合在一起使用:

```
tasks:
  - include: tasks/foo.yml
```

#helloworld yml file
- hosts: centos128
  #- hosts: 192.168.177.129
  name: wowosong
  vars_files:

  - /home/wowosong/test.yml
    remote_user: root
    tasks:

  - include: tasks/installApach.yml
    ~                                        

你也可以给 include 传递变量。我们称之为 ‘参数化的 include’。

举个例子，如果我们要部署多个 wordpress 实例，我们可将所有的 wordpress task 写在一个 wordpress.yml 文件中， 然后像下面这样使用 wordpress.yml 文件:

```
tasks:
  - include: wordpress.yml wp_user=timmy
  - include: wordpress.yml wp_user=alice
  - include: wordpress.yml wp_user=bob
```

如果你运行的是 Ansible 1.4 及以后的版本，include 语法可更为精简，这种写法同样允许传递列表和字典参数:

```
tasks:
 - { include: wordpress.yml, wp_user: timmy, ssh_keys: [ 'keys/one.txt', 'keys/two.txt' ] }
```

使用上述任意一种语法格式传递变量给 include files 之后，这些变量就可以**在 include 包含的文件中使用了**。 关于变量的详细使用方法请查看 [*Variables*](http://www.ansible.com.cn/docs/playbooks_variables.html) 。变量可以这样去引用:

```
{{ wp_user }}
```

**(除了显式传递的参数，所有在 vars section 中定义的变量也可在这里使用)**

从 1.0 版开始，Ansible 支持另一种传递变量到 include files 的语法，这种语法支持结构化的变量:

```
tasks:

  - include: wordpress.yml
    vars:
        wp_user: timmy
        some_list_variable:
          - alpha
          - beta
          - gamma
```

在 Playbooks 中可使用 include 包含其他 playbook，我们将在稍后的章节介绍这个用法。

Note

**从 1.0 版开始，task include 语句可以在任意层次使用。**在这之前，include 语句只能在单个层次使用，所以在之前版本中由 include 所包含的文件，其中不能再有 include 包含出现。

Include 语句也可以用在 ‘handlers’ section 中，比如，你希望定义一个重启 apache 的 handler， 你只需要定义一次，然后便可在所有的 playbook 中使用这个 handler。你可以创建一个 handlers.yml 文件如下:

```
---
# this might be in a file like handlers/handlers.yml
- name: restart apache
  service: name=apache state=restarted
```

然后在你的主 playbook 文件中，在一个 play 的最后使用 include 包含 handlers.yml:

```
handlers:
  - include: handlers/handlers.yml
```

Include 语句可以和其他非 include 的 tasks 和 handlers 混合使用。

Include 语句也可用来将一个 playbook 文件导入另一个 playbook 文件。这种方式允许你定义一个顶层的 playbook，这个顶层 playbook 由其他 playbook 所组成。

举个例子:

```
- name: this is a play at the top level of a file
  hosts: all
  remote_user: root
  tasks:
  - name: say hi
    tags: foo
    shell: echo "hi..."
- include: load_balancers.yml
- include: webservers.yml
- include: dbservers.yml
```

注意：当你在 playbook 中引用其他 playbook 时，不能使用变量替换。

### Roles

你现在已经学过 tasks 和 handlers，那怎样组织 playbook 才是最好的方式呢？简单的回答就是：使用 roles ! **Roles 基于一个已知的文件结构，去自动的加载某些 vars_files，tasks 以及 handlers。**基于 roles 对内容进行分组，使得我们可以容易地与其他用户分享 roles 。

一个项目的结构如下:

```
site.yml
webservers.yml
fooservers.yml
roles/
   common/
     files/
     templates/
     tasks/
     handlers/
     vars/
     defaults/
     meta/
   webservers/
     files/
     templates/
     tasks/
     handlers/
     vars/
     defaults/
     meta/
```

一个 playbook 如下:

```
---
- hosts: webservers
  roles:
     - common
     - webservers
```

这个 playbook 为一个角色 ‘x’ 指定了如下的行为：**名称需要保存为main.yml**

- 如果 roles/x/tasks/main.yml 存在, 其中列出的 tasks 将被添加到 play 中
- 如果 roles/x/handlers/main.yml 存在, 其中列出的 handlers 将被添加到 play 中
- **如果 roles/x/vars/main.yml 存在, 其中列出的 variables 将被添加到 play 中**
- 如果 roles/x/meta/main.yml 存在, 其中列出的 “角色依赖” 将被添加到 roles 列表中 (1.3 and later)
- 所有 copy tasks 可以引用 roles/x/files/ 中的文件，不需要指明文件的路径。
- 所有 script tasks 可以引用 roles/x/files/ 中的脚本，不需要指明文件的路径。
- 所有 template tasks 可以引用 roles/x/templates/ 中的文件，不需要指明文件的路径。
- 所有 include tasks 可以引用 roles/x/tasks/ 中的文件，不需要指明文件的路径。

在 Ansible 1.4 及之后版本，**你可以为”角色”的搜索设定 roles_path 配置项**。使用这个配置项将所有的 common 角色 check out 到一个位置，以便在多个 playbook 项目中可方便的共享使用它们。查看 [*Ansible的配置文件*](http://www.ansible.com.cn/docs/intro_configuration.html) 详细了解设置这个配置项的细节，该配置项是在 ansible.cfg 中配置。

如果 roles 目录下有文件不存在，这些文件将被忽略。比如 roles 目录下面缺少了 ‘vars/’ 目录，这也没关系。

注意：你仍然可以在 playbook 中松散地列出 tasks，vars_files 以及 handlers，这种方式仍然可用，但 roles 是一种很好的具有组织性的功能特性，我们强烈建议使用它。**如果你在 playbook 中同时使用 roles 和 tasks，vars_files 或者 handlers，roles 将优先执行。**

而且，如果你愿意，也可以使用参数化的 roles，这种方式通过添加变量来实现，比如:

```
---

- hosts: webservers
  roles:
    - common
    - { role: foo_app_instance, dir: '/opt/a',  port: 5000 }
    - { role: foo_app_instance, dir: '/opt/b',  port: 5001 }
```

当一些事情不需要频繁去做时，你也可以为 roles 设置触发条件，像这样:

```
---

- hosts: webservers
  roles:
    - { role: some_role, when: "ansible_os_family == 'RedHat'" }
```

它的工作方式是：将条件子句应用到 role 中的每一个 task 上。关于”条件子句”的讨论参见本文档后面的章节。

最后，你可能希望给 roles 分配指定的 tags。比如:

```
---

- hosts: webservers
  roles:
    - { role: foo, tags: ["bar", "baz"] }
```

如果 play 仍然包含有 ‘tasks’ section，这些 tasks 将在所有 roles 应用完成之后才被执行。

如果你希望定义一些 tasks，让它们在 roles 之前以及之后执行，你可以这样做:

```
---
- hosts: webservers
  pre_tasks:
    - shell: echo 'hello'
  roles:
    - { role: some_role }
  tasks:
    - shell: echo 'still busy'
  post_tasks:
    - shell: echo 'goodbye'
```

如果对 tasks 应用了 tags（**tags 是一种实现部分运行 playbook 的机制，将在后面的章节讨论**），需确保给 pre_tasks 以及 post_tasks 也同样应用 tags，并且将它们一并传递。特别是当 pre_tasks 和 post_tasks 被用来监视 “停止窗口控制” 或者 “负载均衡” 时要确保这样做。

#### 角色默认变量（V1.3新特性）

角色默认变量允许你为 included roles 或者 dependent roles(见下) 设置默认变量。要创建默认变量，只需在 roles 目录下添加 **defaults/main.yml** 文件。这些变量在**所有可用变量中拥有最低优先级**，可能被其他地方定义的变量(包括 inventory 中的变量)所覆盖。

#### 角色依赖(Role Dependencies)

“角色依赖” 使你可以自动地将其他 roles 拉取到现在使用的 role 中。”角色依赖” 保存在 roles 目录下的 meta/main.yml 文件中。这个文件应包含一列 roles 和 为之指定的参数，下面是在 roles/webservers/meta/main.yml 文件中的示例:**role需要在role中存在**，切记误循环引用，形成引入依赖。

```
---
dependencies:
  - { role: common, some_parameter: 3 }
```

![image-20210302145539903](C:\Users\wowosong\AppData\Roaming\Typora\typora-user-images\image-20210302145539903.png)

“角色依赖” 可以通过绝对路径指定，如同顶级角色的设置:

```
---
dependencies:
   - { role: '/path/to/common/roles/foo', x: 1 }
```

“角色依赖” 也可以通过源码控制仓库或者 tar 文件指定，使用逗号分隔：路径、一个可选的版本（tag, commit, branch 等等）、一个可选友好角色名（尝试从源码仓库名或者归档文件名中派生出角色名）:

```
---
dependencies:
  - { role: 'git+http://git.example.com/repos/role-foo,v1.1,foo' }
  - { role: '/path/to/tar/file.tgz,,friendly-name' }
```

“角色依赖” **总是在 role （包含”角色依赖”的role）之前执行**，并且是递归地执行。默认情况下，作为 “角色依赖” 被添加的 role 只能被添加一次，如果另一个 role 将一个相同的角色列为 “角色依赖” 的对象，它不会被重复执行。但这种默认的行为可被修改，通过添加 allow_duplicates: yes 到meta/main.yml 文件中。 比如，一个 role 名为 ‘car’，它可以添加名为 ‘wheel’ 的 role 到它的 “角色依赖” 中:

```
---
dependencies:
- { role: wheel, n: 1 }
- { role: wheel, n: 2 }
- { role: wheel, n: 3 }
- { role: wheel, n: 4 }
```

wheel 角色的 meta/main.yml 文件包含如下内容:

```
---
allow_duplicates: yes
dependencies:
- { role: common }
```

### 变量（Variable）

已经存在的自动化技术使得重复做事变得更加容易，但你的所有系统有时则不会这样。 在有些系统中你想设置一些行为或者配置,这与其它系统稍有不同。

并且远程系统的可视行为或状态会影响我们配置这些系统。（比如你需要得到一个系统的IP地址,甚至用该值来配置另一个系统）。

你可能有一些非常相似的模板或配置文件，而有些变量则稍微不同. Ansible中的变量用来处理系统间的不同。

**为了理解变量,你也需要深入阅读 [*条件选择*](http://www.ansible.com.cn/docs/playbooks_conditionals.html) 和 [*循环*](http://www.ansible.com.cn/docs/playbooks_loops.html).有用的模块(比如”group_by”模块和”when”条件)也可以结合变量使用,用于管理系统间的不同之处。**

强烈建议你学习 ansible-examples github代码库,里面有大量使用变量的例子。

https://github.com/ansible/ansible-examples/tree/master/wordpress-nginx_rhel7/group_vars

#### 合法的变量名

在使用变量之前最好先知道什么是合法的变量名. **变量名可以为字母,数字以及下划线.变量始终应该以字母开头.** “foo_port”是个合法的变量名.”foo5”也是. “foo-port”, “foo port”, “foo.port” 和 “12”则不是合法的变量名.

#### 在Inventory中定义变量

我们已经在其它文档中覆盖了大量关于使用变量的场景,所以这里没多少新的知识点,权当加深记忆.

通常你想基于一个机器位于哪个群组而设置变量.比如,位于波士顿的很多机器会使用 ‘boston.ntp.example.com’ 作为NTP服务器.

请看 [*Inventory文件*](http://www.ansible.com.cn/docs/intro_inventory.html) 文档来学习在inventory中使用多种方式来定义变量.

#### 在playbook中定义变量

在playbook中,可以直接定义变量,如下所示:

```
- hosts: webservers
  vars:
    http_port: 80
```

这种所见即所得的方式非常好.

#### 在文件和role中定义变量

事实上在其它地方我们也讲过这点了. 正如在 [*Playbook Roles and Include Statements*](http://www.ansible.com.cn/docs/playbooks_roles.html) 描述的一样,变量也可以通过文件包含在playbook中,该变量可以作为或者不作为“Ansible Role”的一部分.使用role是首选,因为它提供了一个很好的组织体系.

#### 使用变量: 关于Jinja2

Ansible允许你使用Jinja2模板系统在playbook中引用变量.借助Jinja你能做很多复杂的操作,首先你要学习基本使用. 例如,在简单的模板中你可以这样做:

```
My amp goes to {{ max_amp_value }}
```

这就是变量替换最基本的形式. 你也可以在playbook中直接这样用,你偶尔想这样做:

```
template: src=foo.cfg.j2 dest={{ remote_install_path }}/foo.cfg
```

In the above example, we used a variable to help decide where to place a file. 在上述的例子中,我们使用变量来决定文件放置在哪里. 在模板中**你自动会获取在主机范围之内的所有变量的访问权**.事实上更多,你可以读取其它主机的变量.我们将演示如何做.

**在模板中Jinja2可以用循环和条件语句**,而在playbook中则不行.Ansible playbook是纯粹的机器解析的YAML.这是一个非常重要的功能,这意味着根据文件可以生成代码,或者其它系统工具能够读取Ansible文件.虽然并不是所有人都需要这个功能,但我们不能封锁可能性.

#### YAML陷阱

YAML语法要求如果值以{{ foo }}开头的话我们需要将整行用双引号包起来。**这是为了确认你不是想声明一个YAML字典。**该知识点在 [*YAML 语法*](http://www.ansible.com.cn/docs/YAMLSyntax.html) 页面有所讲述。

这样是不行的:

```
- hosts: app_servers
  vars:
      app_path: {{ base_path }}/22
```

你应该这么做:

```
- hosts: app_servers
  vars:
       app_path: "{{ base_path }}/22"
```

## 使用Facts获取的信息

还有其它地方可以获取变量,这些变量是自动发现的,而不是用户自己设置的.

Facts通过访问远程系统获取相应的信息. 一个例子就是远程主机的IP地址或者操作系统是什么. 使用以下命令可以查看哪些信息是可用的:，，

```
ansible hostname -m setup
```

这会返回巨量的变量数据,比如对于Ubutu 12.04系统,Ansible 1.4获取的信息显示如下:

可以在playbook中这样引用以上例子中第一个硬盘的模型:

```
{{ ansible_devices.sda.model }}
```

同样,作为系统报告的主机名如以下所示:

```
{{ ansible_nodename }}
```

不合格的主机名显示了句号(.)之前的字符串:

```
{{ ansible_hostname }}
```

在模板和条件判断(请看 `playbook_conditionals` )中会经常使用Facts。

还可以使用Facts根据特定的条件动态创建主机群组，请查看 [*模块相关*](http://www.ansible.com.cn/docs/modules.html) 文档中的 ‘group_by’ 小节获取详细内容。以及参见 [*条件选择*](http://www.ansible.com.cn/docs/playbooks_conditionals.html) 章节讨论的广义条件语句部分。