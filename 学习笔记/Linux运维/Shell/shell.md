1.安装docker-ce
拷贝installdockerce的shell脚本
2.安装mysql数据库
选择mysql5.7版本
同步数据库和表结构，可能会同步部分数据（不确定）；
数据库my.cnf配置文件中lower_table_name大小写忽略，导致系统登录异常；
消息系统msg初始化应用数据，才能正常推送消息；
数据库备份脚本
docker exec mysql mysql -e "show databases;" -uroot -pAbcd1234 | grep -Ev "edu_zipkin|mysql|information_schema|performance_schema|sys|Database" | xargs docker exec mysql mysqldump -uroot -pAbcd1234 --databases | gzip > /root/mysql-backup/backupall-$(date +%Y%m%d%H%M%S).sql.gz

rabbitMQ的IP配置错误
3.安装nginx
拷贝/etc/nginx.conf 到新环境的Nginx同目录下覆盖原配置文件，
拷贝原Nginx下的conf.d下的gateway和cert.conf（/etc/nginx/cert）到新环境的Nginx同目录下；
4.配置config中的配置文件；
在gitlab中创建文件夹配置项目的配置文件；
5.拷贝docker-compose（public）配置文件
6.修改config.env，设置配置文件查询文件夹，用哪个yml配置文件
6.拷贝docker-compose（hbd）配置文件
7.登录公司镜像仓库
 docker login -udocker -pdocker  http://docker.hanboard.com.cn:81
8.docker-compose up 拉起镜像
（1）基础模块镜像拉起：直接docker-compose up -d 拉起所有模块  镜像中代码不是最新的，已遇到考勤、问卷等系统代码未合并到master分支或未最新打包，
业务配置数据太多，URL 等配置死。
（1）问卷配置移动端填卷URL，问卷系统运维平台应用注册时 前端运维环境配置很容易错误
（2）业务系统镜像拉起：先拉起registry (2)再拉起cloud-config (3)拉起网关cloud-gateway(4)拉起剩余业务系统