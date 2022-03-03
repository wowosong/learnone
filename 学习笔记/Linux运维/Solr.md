# 内存溢出

线上solr突然启动不了，一启动就自动kill了，报错：

java.lang.OutOfMemoryError: Java heap space-XX:OnOutOfMemoryError="/opt/solr/bin/oom_solr.sh 8983 /opt/solr/server/logs" Executing /bin/sh -c "/opt/solr/bin/oom_solr.sh 8983 /opt/solr/server/logs"...

Running OOM killer script for process 18671 for Solr on port 8983

Killed process 18671

因为solr使用的内存满了（机器内存还很充足）。

处理方案一：

修改/opt/solr-5.5.1/bin下的solr文件：

JAVA_MEM_OPTS=()

if [ -z "$SOLR_HEAP" ] && [ -n "$SOLR_JAVA_MEM" ]; then

  JAVA_MEM_OPTS=($SOLR_JAVA_MEM)

else

  SOLR_HEAP="${SOLR_HEAP:-2g}"

  JAVA_MEM_OPTS=("-Xms$SOLR_HEAP" "-Xmx$SOLR_HEAP")

fi

在上面的配置后面添加两行：

SOLR_JAVA_MEM="-Xms2g -Xmx2g"

JAVA_MEM_OPTS=($SOLR_JAVA_MEM)

方案二（推荐）:

修改solr-5.5.3/bin/solr.in.sh

SOLR_HEAP="512m"

为：

SOLR_HEAP="8g"

方案三（没有试过）：

solr的启动脚本里默认情况下最大启动内存为512M ，通过启动参数 -m 重启内存为2G

[root@kaifa-19 bin]# ./solr start -m 2g
 