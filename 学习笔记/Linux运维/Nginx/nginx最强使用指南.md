# 一、简介

创始人: 伊戈尔·赛索耶夫

Nginx(engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（俄文：Рамблер）开发的，第一个公开版本0.1.0发布于2004年10月4日。

其将源代码以类BSD许可证的形式发布，因它的稳定性、丰富的功能集、示例配置文件和低系统资源的消耗而闻名。2011年6月1日，nginx 1.0.4发布。

Nginx是一款轻量级的Web服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器，在BSD-like 协议下发行。其特点是占有内存少，并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好，中国大陆使用nginx网站用户有：百度、京东、新浪、网易、腾讯、淘宝等。

# 二、优点

## 1. 可以高并发连接

官方测试Nginx能够支撑5万并发连接，实际生产环境中可以支撑2~4万并发连接数。
原因，主要是Nginx使用了最新的epoll（Linux2.6内核）和kqueue（freeBSD）网路I/O模型，而Apache使用的是传统的Select模型，
其比较稳定的Prefork模式为多进程模式，需要经常派生子进程，所以消耗的CPU等服务器资源，要比Nginx高很多。

## 2. 内存消耗少

Nginx+PHP（FastCGI）服务器，在3万并发连接下，开启10个Nginx进程消耗150MB内存，15MB*10=150MB
开启的64个PHP-CGI进程消耗1280内存，20MB*64=1280MB，加上系统自身消耗的内存，总共消耗不到2GB的内存。
如果服务器的内存比较小，完全可以只开启25个PHP-CGI进程，这样PHP-CGI消耗的总内存数才500MB。

## 3. 成本低廉

购买F5BIG-IP、NetScaler等硬件负载均衡交换机，需要十多万到几十万人民币，
而Nginx为开源软件，采用的是2-clause BSD-like协议，可以免费试用，并且可用于商业用途。
BSD开源协议是一个给使用者很大自由的协议，协议指出可以自由使用、修改源代码、也可以将修改后的代码作为开源或专用软件再发布。

## 4. 配置文件非常简单

网络和程序一样通俗易懂，即使，非专用系统管理员也能看懂。

## 5. 支持Rewrite重写

能够根据域名、URL的不同，将http请求分到不同的后端服务器群组。

## 6. 内置的健康检查功能

如果NginxProxy后端的某台Web服务器宕机了，不会影响前端的访问。

## 7. 节省带宽

支持GZIP压缩，可以添加浏览器本地缓存的Header头。

## 8. 稳定性高

用于反向代理，宕机的概率微乎其微。

## 9. 支持热部署

Nginx支持热部署，它的自动特别容易，并且，几乎可以7天*24小时不间断的运行~~~~
即使，运行数个月也不需要重新启动，还能够在不间断服务的情况下，对软件版本进行升级

# 三、Nginx、Apache、Lighttpd 对比

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071142480.png)

# 四、Nginx支持功能

## 1. 代理

[参考地址](https://www.cnblogs.com/gbq-dog/p/10653054.html)

通常我们都知道Nginx性能很高，尤其是作为一个代理服务器，因为它用的是epoll模型，就比如Python Django Web的性能不行，我们可能就会在前端加一个nginx代理，从而提高总体的处理性能问题，代理服务技术是在互联网早期就出现被使用的。一般实现代理技术的方式就是在服务器上安装代理服务软件，让其成为一个代理服务器，从而实现代理技术。常用的代理技术分为正向代理、反向代理和透明代理。

## 2. 正向代理

[参考地址](https://www.jianshu.com/p/e233dcf003c6)

正向代理的过程，它隐藏了真实的请求客户端，服务端不知道真实的客户端是谁，客户端请求的服务都被代理服务器代替来请求，某些科学上网工具扮演的就是典型的正向代理角色。
用浏览器访问[http://www.google.com](http://www.google.com/) 时，被残忍的block，于是你可以在国外搭建一台代理服务器，让代理帮我去请求google.com，代理把请求返回的相应结构再返回给我。

egg: 科学上网

## 3. 反向代理

反向代理服务器会帮我们把请求转发到真实的服务器那里去。
Nginx就是性能非常好的反向代理服务器，用来做负载均衡。

正向代理隐藏真实客户端，反向代理隐藏真实服务端

![image-20220110221716590](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071142869.png)

## 4. 透明代理

透明代理的意思是客户端根本不需要知道有代理服务器的存在，它改变你的request fields（报文），并会传送真实IP。
注意，加密的透明代理则是属于匿名代理，意思是不用设置使用代理了。

透明代理实践的例子就是时下很多公司使用的行为管理软件。如下图所示

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071142476.png)

用户A和用户B并不知道行为管理设备充当透明代理行为，当用户A或用户B向服务器A或服务器B提交请求的时候，透明代理设备根据自身策略拦截并修改用户A或B的报文，并作为实际的请求方，向服务器A或B发送请求，当接收信息回传，透明代理再根据自身的设置把允许的报文发回至用户A或B，如上图，如果透明代理设置不允许访问服务器B，那么用户A或者用户B就不会得到服务器B的数据。

# 五、安装与部署

## 1. 安装nginx

教程地址 : https://www.cnblogs.com/boony...

## 2. 常用命令

```
cd /usr/local/nginx/sbin/
./nginx 
./nginx -s stop
./nginx -s quit
./nginx -s reload
```

## 3. 基础配置

```properties
## 全局模块 配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
#user  nobody; #user administrator administrators;  #配置用户或者组，默认为nobody nobody。
worker_processes  1;  #允许生成的进程数，默认为1
worker_cpu_affinity 01;#cpu粘黏性，减少线程切换带来的性能损耗
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
#error_log #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
#error_log  logs/error.log; 
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

## events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。 
events { 
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}

## http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
http {
    include       mime.types; #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #自定义格式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"'; 

    #access_log  logs/access.log  main; #combined为日志格式的默认值

    sendfile        on; #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    #sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    #sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。

    #keepalive_timeout  0;
    keepalive_timeout  65; #连接超时时间，默认为75s，可以在http，server，location块。

    gzip  on;
    gzip_min_length     1k;
    gzip_buffers        4 16k;
    gzip_http_version   1.1;
    gzip_comp_level     2;
    gzip_types text/plain application/x-javascript text/css application/xml;
    gzip_vary on;
 	# 关闭响应头里面 server 属性的具体版本号
    server_tokens      off;

    ## server块：配置虚拟主机的相关参数，一个http中可以有多个server。

    # 分配方式 Nginx的upstream支持5种分配方式，下面将会详细介绍，其中，前三种为Nginx原生支持的分配方式，后两种为第三方支持的分配方式：
    # upstream mysvr {   @tosearch https://blog.csdn.net/daily886/article/details/84313917
    #     server 127.0.0.1:7878;
    #     server 192.168.10.121:3333 backup;  #热备
    # }

    upstream backend {
        # ip_hash;
        fair;
        server 127.0.0.1:8888;
        server 127.0.0.1:9090;
        server 127.0.0.1:9191;
    }

    server {
        listen       9797; # 端口号
        server_name  localhost; # 监听地址

        #charset koi8-r;
        
        location /api/ {
           proxy_pass http://backend;
           proxy_set_header Host $host:$server_port;
       }
        #access_log  logs/host.access.log  main;
        ## location块：配置请求的路由，以及各种页面的处理情况。
        location / { #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
            #root path;  #根目录
            #index vv.txt;  #设置默认页
            #    proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
            #    deny 127.0.0.1;  #拒绝的ip
            #    allow 172.18.5.54; #允许的ip    
            root   html;
            index  index.html index.htm;
        }
        location ^~  \.(gif|jpg|jpeg|png|css|js|ico)$ {
        alias  /root/dev-flask/fanxiangce-master/app/static;
        expires 1h;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m; 指定客户端可以重用会话参数的时间（超时之后不可使用）

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

## 4. location配置说明

[参考地址](https://segmentfault.com/a/1190000019138014)

### a. location匹配命令

```
~      波浪线表示执行一个正则匹配，区分大小写  
~\*    表示执行一个正则匹配，不区分大小写  
^~     ^~表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录  
\=     进行普通字符精确匹配  
@      "@" 定义一个命名的 location，使用在内部定向时，例如 error\_page, try\_files
```

### b. location 匹配的优先级(与location在配置文件中的顺序无关)

```
\= 精确匹配会第一个被处理。如果发现精确匹配，nginx停止搜索其他匹配。  
普通字符匹配，正则表达式规则和长的块规则将被优先和查询匹配，也就是说如果该项匹配还需去看有没有正则表达式匹配和更长的匹配。  

^~ 则只匹配该规则，nginx停止搜索其他匹配，否则nginx会继续处理其他location指令。  
最后匹配理带有"~"和"~\*"的指令，如果找到相应的匹配，则nginx停止搜索其他匹配；当没有正则表达式或者没有正则表达式被匹配的情况下，那么匹配程度最高的逐字匹配指令会被使用。
```

# 六、读后提问?

```
location = / {
   #规则A
}
location = /login {
   #规则B
}
location ^~ /static/ {
   #规则C
}
location ~ \.(gif|jpg|png|js|css)$ {
   #规则D
}
location ~* \.png$ {
   #规则E
}
location / {
   #规则F
}
```

会有怎样的匹配结果呢?

```
那么产生的效果如下：
访问根目录 /， 比如 http://localhost/ 将匹配规则 A
访问 http://localhost/login 将匹配规则 B，http://localhost/register 则匹配规则 F
访问 http://localhost/static/a.html 将匹配规则 C
访问 http://localhost/a.gif, http://localhost/b.jpg 将匹配规则 D和规则 E，但是规则 D 顺序优先，规则 E不起作用，而 http://localhost/static/c.png则优先匹配到规则 C
访问 http://localhost/a.PNG 则匹配规则 E，而不会匹配规则 D，因为规则 E 不区分大小写
访问 http://localhost/category/id/1111 则最终匹配到规则 F，因为以上规则都不匹配，这个时候应该是 nginx 转发请求给后端应用服务器，比如 FastCGI（PHP），tomcat（jsp），nginx 作为反向代理服务器存在
```

# 七、特别配置upstream介绍

从本质上说，upstream属于handler，只是他不产生自己的内容，而是通过请求后端服务器得到内容，所以才称为upstream（上游）。请求并取得响应内容的整个过程已经被封装到nginx内部，所以upstream模块只需要开发若干回调函数，完成构造请求和解析响应等具体的工作。
[参考地址](http://tengine.taobao.org/book/chapter_05.html)

## upstream分配方式

https://blog.csdn.net/jiangguilong2000/article/details/52278255
http://www.ishenping.com/ArtInfo/22367.html
Nginx的upstream支持5种分配方式，下面将会详细介绍，其中，前三种为Nginx原生支持的分配方式，后两种为第三方支持的分配方式：

### 1. 轮询

```
轮询是upstream的默认分配方式，即每个请求按照时间顺序轮流分配到不同的后端服务器，如果某个后端服务器down掉后，能自动剔除。  
upstream backend {  
    server 192.168.1.101:8888;  
    server 192.168.1.102:8888;  
    server 192.168.1.103:8888;  
}
```

### 2. weight

```
轮询的加强版，即可以指定轮询比率，weight和访问几率成正比，主要应用于后端服务器异质的场景下。  
upstream backend {  
    server 192.168.1.101 weight=1;  
    server 192.168.1.102 weight=2;  
    server 192.168.1.103 weight=3;  
}
```

### 3. ip_hash

```
每个请求按照访问ip（即Nginx的前置服务器或者客户端IP）的hash结果分配，这样每个访客会固定访问一个后端服务器，可以解决session一致问题。  
upstream backend {  
    ip\_hash;  
    server 192.168.1.101:7777;  
    server 192.168.1.102:8888;  
    server 192.168.1.103:9999;  
}
```

### 4. fair

[安装地址](https://www.cnblogs.com/xiaohanlin/p/9904487.html)

```
fair顾名思义，公平地按照后端服务器的响应时间（rt）来分配请求，响应时间短即rt小的后端服务器优先分配请求。  
upstream backend {  
    server 192.168.1.101;  
    server 192.168.1.102;  
    server 192.168.1.103;  
    fair;  
}
```

### 5. url_hash

```
与ip_hash类似，但是按照访问url的hash结果来分配请求，使得每个url定向到同一个后端服务器，主要应用于后端服务器为缓存时的场景下。
upstream backend {
    server 192.168.1.101;
    server 192.168.1.102;
    server 192.168.1.103;
    hash $request_uri;
    hash_method crc32;
}
其中，hash_method为使用的hash算法，需要注意的是：此时，server语句中不能加weight等参数。
```

