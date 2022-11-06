



*   [Docker 入门笔记](#/Docker?id=docker-%e5%85%a5%e9%97%a8%e7%ac%94%e8%ae%b0 "Docker 入门笔记")

*   [1 Docker 安装](#/Docker?id=_1-docker-%e5%ae%89%e8%a3%85 "1 Docker 安装")

*   [1.1 YUM方式](#/Docker?id=_11-yum%e6%96%b9%e5%bc%8f "1.1 YUM方式")

*   [2 Docker 架构](#/Docker?id=_2-docker-%e6%9e%b6%e6%9e%84 "2 Docker 架构")
*   [3 Docker 使用](#/Docker?id=_3-docker-%e4%bd%bf%e7%94%a8 "3 Docker 使用")

*   [3.1 Docker Hello World](#/Docker?id=_31-docker-hello-world "3.1 Docker Hello World")
*   [3.2 Docker image](#/Docker?id=_32-docker-image "3.2 Docker image")
*   [3.3 Docker Container](#/Docker?id=_33-docker-container "3.3 Docker Container")
*   [3.4 Docker Repository](#/Docker?id=_34-docker-repository "3.4 Docker Repository")
*   [3.5 Docker Network](#/Docker?id=_35-docker-network "3.5 Docker Network")

*   [4 Dokcerfile](#/Docker?id=_4-dokcerfile "4 Dokcerfile")

*   [4.1 Docker 命令](#/Docker?id=_41-docker-%e5%91%bd%e4%bb%a4 "4.1 Docker 命令")
*   [4.2 Dockerfile 实例（lnmp）](#/Docker?id=_42-dockerfile-%e5%ae%9e%e4%be%8b%ef%bc%88lnmp%ef%bc%89 "4.2 Dockerfile 实例（lnmp）")
*   [4.3 Dockerfile 实例（Django）](#/Docker?id=_43-dockerfile-%e5%ae%9e%e4%be%8b%ef%bc%88django%ef%bc%89 "4.3 Dockerfile 实例（Django）")

# [Docker 入门笔记](#/Docker?id=docker-%e5%85%a5%e9%97%a8%e7%ac%94%e8%ae%b0)

## [1 Docker 安装](#/Docker?id=_1-docker-%e5%ae%89%e8%a3%85)

> CentOS 7

### [1.1 YUM方式](#/Docker?id=_11-yum%e6%96%b9%e5%bc%8f)

```sh
# 配置阿里云yum源
cat >/etc/yum.repos.d/docker.repo<<EOF
[docker-ce-edge]
name=Docker CE Edge - \$basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/7/\$basearch/edge
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
EOF

# 安装
yum -y install docker-ce

# 查看版本
docker --version

# 启动
systemctl start docker
systemctl enable docker
systemctl status docker

# 配置docker镜像源【阿里云】
cat >> /etc/docker/daemon.json << EOF
{
  "registry-mirrors": ["https://b9pmyelo.mirror.aliyuncs.com"]
}
EOF


### dokcer 卸载 ###
[root@centos79 ~]# yum list installed | grep docker
docker-client.x86_64                2:1.13.1-208.git7d71120.el7_9      @extras  
docker-common.x86_64                2:1.13.1-208.git7d71120.el7_9      @extras  
[root@centos79 ~]# yum remove docer-client.x86_64 docker-common.x86_64 -y
```

## [2 Docker 架构](#/Docker?id=_2-docker-%e6%9e%b6%e6%9e%84)

*   **镜像（Image）**：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
*   **容器（Container）**：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
*   **仓库（Repository）**：仓库可看成一个代码控制中心，用来保存镜像。

## [3 Docker 使用](#/Docker?id=_3-docker-%e4%bd%bf%e7%94%a8)

[Docker 教程 | 菜鸟教程](https://www.runoob.com/docker/docker-tutorial.html)

### [3.1 Docker Hello World](#/Docker?id=_31-docker-hello-world)

```sh
docker run ubuntu /bin/echo "hello world"

# 查看docker全部命令
dokcer
# 查看docker具体命令用法
docker images --help
```

### [3.2 Docker image](#/Docker?id=_32-docker-image)

```sh
# docker images  查看本地下载的镜像
[root@centos79 ~]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
docker.io/ubuntu    latest              d13c942271d6        About an hour ago   72.8 MB
#  REPOSITORY：表示镜像的仓库源
#  TAG：镜像的标签
#  IMAGE ID：镜像ID
#  CREATED：镜像创建时间
#  SIZE：镜像大小


# docker search ubuntu 查找镜像
[root@centos79 ~]# docker search ubuntu
INDEX       NAME                                                                DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
docker.io   docker.io/ubuntu                                                    Ubuntu is a Debian-based Linux operating s...   13451     [OK]       
docker.io   docker.io/dorowu/ubuntu-desktop-lxde-vnc                            Docker image to provide HTML5 VNC interfac...   599                  [OK]
docker.io   docker.io/websphere-liberty                                         WebSphere Liberty multi-architecture image...   282       [OK] 
#  NAME: 镜像仓库源的名称
#  DESCRIPTION: 镜像的描述
#  OFFICIAL: 是否 docker 官方发布
#  stars: 类似 Github 里面的 star，表示点赞、喜欢的意思
#  AUTOMATED: 自动构建


# 获取指定版本镜像 repository:tag
docker pull ubuntu:15.10

# 删除镜像
docker rmi ubuntu:15.10
```

### [3.3 Docker Container](#/Docker?id=_33-docker-container)

```sh
# docker run 启动容器【使用ubuntu:15.10镜像创建容器】【容器短暂存活】
docker run ubuntu:15.10 /bin/echo "hello world"
# 如果未提前下载镜像，运行镜像时，会自动下载【使用镜像创建容器】【容器一直存活】
docker run nginx
# 使用docker ps查看存活的容器

# 使用命令行模式进入容器
docker run -it ubuntu /bin/bash
## 参数说明
#  -i: 交互式操作。
#  -t: 终端。
#  ubuntu: ubuntu 镜像。
#  /bin/bash：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。

#  exit 退出终端
root@2c20633e5576:/# exit

# 启动已经停止的容器
[root@centos79 ~]# docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS               NAMES
2c20633e5576        ubuntu              "/bin/bash"              2 minutes ago       Exited (0) 3 seconds ago                          compassionate_kowalevski
# 根据容器ID启动容器
docker start 2c20633e5576
# docker ps 查看正在运行的容器

# 后台运行容器，并指定名字
docker run -itd --name ubuntu-test ubuntu /bin/bash 

[root@centos79 ~]# docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
be23ba2e8f19        ubuntu              "/bin/bash"         3 seconds ago       Up 2 seconds                            ubuntu-test
2c20633e5576        ubuntu              "/bin/bash"         5 minutes ago       Up 2 minutes                            compassionate_kowalevski

# 停止容器
docker stop <容器 ID>

# 进入容器
# 在使用 -d 参数时，容器启动后会进入后台。此时想要进入容器，可以通过以下指令进入：
#   docker attach
#   docker exec：推荐大家使用 docker exec 命令，因为此退出容器终端，不会导致容器的停止。
docker attach <容器 ID>
docker exec -it <容器 ID> /bin/bash

# 导出容器
docker export <容器 ID> > ubuntu.tar
# 导入容器
cat docker/ubuntu.tar | docker import - test/ubuntu:v1

# 删除容器
docker rm -f <容器 ID>
```

### [3.4 Docker Repository](#/Docker?id=_34-docker-repository)

*   [Docker Hub 官方](https://registry.hub.docker.com/)
    
*   [Aliyun Docker Hub](https://cr.console.aliyun.com/) 【推荐使用阿里云的镜像仓库】
    

按照提示信息创建属于自己的镜像仓库。

### [3.5 Docker Network](#/Docker?id=_35-docker-network)

我们使用docker run创建Docker容器时，可以用--net选项指定容器的网络模式，Docker有以下4种网络模式：

*   bridge模式，使用--net=bridge指定，**默认**设置
*   host模式，使用--net=host指定，容器内部网络空间共享宿主机空间，效果类似于直接在宿主机上启动一个进程，端口信息和宿主机共用
*   container模式，使用--net=container:NAME\_or\_ID指定，指定容器与特定容器共享网络命名空间
*   none模式，使用--net=none指定，网络模式为空，即保留网络命名空间，但是不做任何网络相关的配置（网卡、IP、路由等）

## [4 Dokcerfile](#/Docker?id=_4-dokcerfile)

### [4.1 Docker 命令](#/Docker?id=_41-docker-%e5%91%bd%e4%bb%a4)

[Docker 命令大全](https://www.runoob.com/docker/docker-command-manual.html)

```sh
# 容器生命周期管理
docker run --name mynginx -p 80:80 -d nginx:latest
docker start mynginx
docker stop mynginx
docker restart mynginx
docker kill mynginx
docker rm mynginx
docker pause mynginx
docker unpause mynginx
docker create --name mynginx -p 80:80 nginx:latest
docker exec -it mynginx /bin/bash

# 容器操作
docker ps
docker inspect nginx:latest
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mynginx
dokcer top mynginx
docker attach mynginx
docker events -f "images"="nginx:latest" --since="2021-10-01"
docker logs --since="2016-07-01" --tail=10 mynginx
docker wait
docker export -o nginx-`date +%Y%m%d`.tar 96f7f14e99ab
docker port mynginx

# 容器rootfs命令
docker commit -a "commit user" -m "commit info" 96f7f14e99ab mynginx:v1
docker cp /www/nginx 96f7f14e99ab:/www/
docker diff mynginx

# 镜像仓库
docker login -u docker_user -p docker_passwd
docker logout
docker pull nginx
docker push mynginx:v1
docker search nginx

# 本地镜像管理
docker images
docker rmi 96f7f14e99ab
docker tag nginx:latest mynginx:v1
docker build -f /path/to/Dockerfile -t mynginx:v1 .
docker history mynginx:v1
docker save -o mynginx_v1.tar mynginx:v1
docker load < mynginx_v1.tar.gz
docker import mynginx_v1.tar mynginx :v1

# Info|Version
docker info
docker version
docker -v
```

### [4.2 Dockerfile 实例（lnmp）](#/Docker?id=_42-dockerfile-%e5%ae%9e%e4%be%8b%ef%bc%88lnmp%ef%bc%89)

lnmp

```dockerfile
FROM nginx
RUN 
WORKDIR /data/lnmp/nginx
EXPOSE 80
CMD

FROM php
RUN
WORKDIR /data/lnmp/php
EXPOSE 9000
CMD
```

```sh
#/bin/bash
function mysql() {
    docker run --name mysql-lnmp --restart=always --net lnmp -p 3306:3306 \
    -v /data/mysql/data:/var/lib/mysql \
    -v /data/mysql/conf:/etc/mysql/conf.d/ \
    -v /data/mysql/logs:logs \
    -e MYSQL_ROOT_PASSWORD=123456
    -d mysql --character-set-server=utf8
}

function nginx() {
    docker run --name nginx-lnmp --restart=always --net lnmp -p 80:80 \
    -v /data/nginx/html:/data/nginx/html \
    -v /data/nginx/logs:/data/nginx/logs \
    -d nginx 
}

function php() {
    docker run --name php-lnmp --restart=always --net lnmp -p 9000:9000 \
    -v /data/php/log:/data/php/log \
    -d php
}

$1
```

### [4.3 Dockerfile 实例（Django）](#/Docker?id=_43-dockerfile-%e5%ae%9e%e4%be%8b%ef%bc%88django%ef%bc%89)

【Django项目介绍】

*   项目地址：[https://gitee.com/agagin/python-demo.git](https://gitee.com/agagin/python-demo.git) （`./python-demo-master.zip` 含 `dockerfile`）
*   Python3 + Django + uwsgi + nginx + mysql
*   内部服务端口 8002

【构建命令】

```sh
docker build . -t ImageName:ImageTag -f Dockerfile
```

【Dockerfile】

```dockerfile
# dockerfiles/myblog/Dockerfile
# version 1.0

# Base images 基础镜像
FROM centos:centos7.5.1804

# MAINTAINER 维护者信息
LABEL maintainer="123456@qq.com"

# ENV 设置环境变量
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# RUN 执行以下命令
RUN curl -so /etc/yum.repos.d/centos-7.repo http://mirrors.aliyun.com/repo/Centos-7.repo && rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
RUN yum install -y python36 python3-devel gcc pcre-devel zlib-devel make net-tools nginx

# 工作目录
WORKDIR /opt/myblog

# 拷贝文件至工作目录
COPY . .

# 拷贝nginx配置文件
COPY myblog.conf /etc/nginx

# 安装依赖的插件
RUN pip3 install -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com -r requirements.txt

RUN chmod +x run.sh && rm -rf ~/.cache/pip

# EXPOSE 映射端口
EXPOSE 8002

# 容器启动时执行命令
CMD ["./run.sh"]
```

执行构建：

```sh
docker build . -t myblog:v1 -f Dockerfile
```

创建网络：（若不指定网络，需要进入mysql容器中，通过ifconfig命令查看mysql容器ip）

```sh
docker network create --subnet=172.18.0.0/16 mynet
```

运行mysql：

```sh
docker run -d -p 3306:3306 --name mysql -v /opt/mysql:/var/lib/mysql --net mynet --ip 172.18.0.2 -e MYSQL_DATABASE=myblog -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7
```

启动应用：

```sh
docker run -d -p 8002:8002 --name myblog --net mynet --ip 172.18.0.3 -e MYSQL_HOST=172.18.0.2 -e MYSQL_USER=root -e MYSQL_PASSWD=123456 myblog:v1
```

数据迁移：

```sh
docker exec -it myblog bash

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
```
