```json
version: '2.2'
services:
    customer-server:
        image: '192.168.99.13:10000/safecloud/test/customer-server' 
        restart: always
        mem_limit: 1g
        ports:
            - '29102:29102'
        volumes:
            - '/usr/share/fonts/chinese/:/usr/share/fonts/chinese/'
            - '/data/docker/safecloud/customer-server/logs/:/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        healthcheck:
            test: ["CMD", "curl", "-f", "http://localhost:29102/customer/actuator/health", "||", "exit", "1"]
            interval: 30s
            timeout: 10s 
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    platform-server:
        image: '192.168.99.13:10000/safecloud/test/platform-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29100:29100'
        environment:
            - 'server.port=29100'
        volumes:
            - '/data/docker/safecloud/platform-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    lpg-server:
        image: '192.168.99.13:10000/safecloud/test/lpg-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29101:29100'
        volumes:
            - '/data/docker/safecloud/lpg-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    client-server:
        image: '192.168.99.13:10000/safecloud/test/client-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29103:29103'
        volumes:
            - '/data/docker/safecloud/client-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    stock-server:
        image: '192.168.99.13:10000/safecloud/test/stock-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29104:29104'
        volumes:
            - '/data/docker/safecloud/stock-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    jtt808-server: 
        image: '192.168.99.13:10000/safecloud/jtt808-server'
        restart: always
        ports:
            - '8000:8000'
            - '7611:7611'
        volumes:
            - '/home/docker/safecloud/jtt808-server/logs/:/usr/src/myapp/logs/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    lpg-frontend:
        image: '192.168.99.13:10000/lpg/test/lpg-frontend'
        volumes:
            - '/usr/share/nginx/lpgfrontend/:/frontend/'
    platform-frontend:
        image: '192.168.99.13:10000/safecloud/test/platform-frontend'
        volumes:
            - '/usr/share/nginx/lpgadmin/:/frontend/'

```

 这篇文章重点讲解docker compose的相关概念和命令。Compose是单机编排容器集群或者是分布式服务容器的应用工具。通过Compose，可以使用YAML文件来配置应用程序的服务。然后，使用一个命令，就可以从配置中创建并启动所有服务。

　　Docker-Compose是一个容器编排工具。通过一个.yml或.yaml文件，将所有的容器的部署方法、文件映射、容器端口映射等情况写在一个配置文件里，执行docker compose up命令就像执行脚本一样，一个一个的安装并部署容器。如下图所示，通过docker compose可以创建一个docker的集群。

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202402051654400.png)

## 1.使用Dockerfile创建镜像

  我们可以使用Dockerfile文件，创建一个属于自己的镜像，首先是编写Dockerfile文件，然后是使用docker build命令。

  可以使用nvidia的官方镜像，其中已经有了大部分的依赖包，下面是拉取pytorch镜像的命令：

  官方地址：https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch

```
docker pull nvcr.io/nvidia/pytorch:23.05-py3
```

  下面是Dockerfile文件，在nvidia镜像基础之上，安装了一些包，同时使用了ENTRYPOINT命令在容器启动时创建了一个jupyter-lab服务：

```dockerfile
FROM nvcr.io/nvidia/pytorch:23.05-py3
WORKDIR /workspace
USER root
EXPOSE 8888
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y && apt-get install git -y
# RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && pip install -r /workspace/requirements.txt
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install diffusers --upgrade
RUN pip3 install torch torchvision torchaudio
RUN pip install invisible_watermark transformers accelerate safetensors
RUN apt-get update
ENTRYPOINT ["jupyter-lab","--no-browser","--allow-root","--port=8888","--ip=0.0.0.0","--NotebookApp.token=123456"]
```

  进入Dockerfile所在的目录执行build命令，并取个tag名称，注意后面有个'.'

```shell
docker build -t my-image:20240205 .
```

## 2.上传镜像到私人仓库

  使用以下命令给镜像打标签：

```
docker tag my-image:20240205 registry.example.com/my-image:20240205
```

  使用以下命令将镜像推送至registry.example.com私人仓库：

```
docker push registry.example.com/my-image:20240205
```

  使用以下命令拉取私人仓库中的镜像：

```shell
docker pull registry.example.com/my-image:20240205
```

## 3.使用Docker Compose启动一个jupyter-lab服务

  首先编写好yaml文件，也可以搭配docker-entrypoint.sh使用，因为镜像里起了jupyter-lab服务，所以下面的yaml注释了entrypoint，下面是docke-compose.yaml文件：

```yml
version: '3.9'
 
services:
  dl-train:
    image: registry.example.com/my-image:20240205
    ports:
      - "8811:8811"
    volumes:
      - "/home/lxj/workspace/models:/workspace/models"
      - "/home/lxj/workspace/src:/workspace/src"
    networks:
      - sdnet
    restart: always
    # entrypoint: ["sh","/workspace/src/jupyter-lab/docker-entrypoint.sh"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ['0']
              capabilities: [gpu]
networks:
  sdnet:
    ipam:
      driver: default
      config:
        - subnet: 192.168.12.0/24
```

  下面是docker-entrypoint.sh文件，可以在里面写一些pip语句安装一些包：

```shell
#!/bin/bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip install --upgrade jupyterlab
# jupyter labextension install @jupyter-widgets/jupyterlab-manager
jupyter-lab --no-browser --allow-root --port=8811 --ip=0.0.0.0 --NotebookApp.token=123456
```

  最后进入yaml所在的目录，运行启动命令即可：

```sh
docker compose up -d
```

## 4.Docker Compose常用命令

  当我们起了一个容器后，需要对容器有一些操作，比如查看容器中服务的日志，停止容器重新启动，接下来讲一下docker compose中操作容器的常用命令：

```shell
# 运行容器
docker compose up

# 在后台运行容器
docker compose up -d

# 指定yaml在后台运行容器
docker compose -f docker-compose.prod.yaml up -d

# 查看日志
docker compose logs -f <service-name>

# 也可以直接使用容器ID查看容器日志
docker logs -f <container-id>

# 进入容器
docker attach <container-id> 不推荐，退出容器时，容器会停止
docker exec -it <container-id> /bin/bash 推荐使用

# 停止容器，并删除相应的配置，推荐使用，如果使用docker stop并不会删除容器的network和volume，使用下面的命令可以停止并删除由docker compose文件定义的容器、网络和卷
docker compose down
```

## 5.总结

  以上就是docke compose单机编排容器集群的讲解，使用yaml文件可以直观明了的使用容器，不管是日常做深度学习实验起一个单容器，还是部署一整个线上服务集群，使用docker compose容器编排技术都是十分方便快捷的。
