# Springboot 与SpringCloud版本对应



![image-20211114181403031](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211114181403.png)

# Cloud升级

![image-20211114183448405](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211114183448.png)

![image-20211115152721790](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211115152739.png)

Maven 构建时需要注意JDK版本要保持一致。project中的JDK和preference中的JDK版本，并注意重新导入pom文件会改变JDK版本

![image-20211116210758753](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211116210759.png)

部署eureka集群保持高可用

![image-20211116230148155](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211116230149.png)

![image-20211117202901806](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211117202902.png)

![image-20211117203140624](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211117203140.png)

consul 启动命令

```
consul agent -dev -ui -client 0.0.0.0  开启UI界面和允许其他客户端访问
```

```
lookup WIN-0MEFH5DJSEQ on 100.100.2.138:53: no such host consul 
关闭heartbeat:
    enabled: true
```

![image-20211119212512194](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211119212512.png)

![image-20211118131106006](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211118131221.png)

![image-20211119213745206](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211119213745.png)

![image-20211119215200339](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211119215200.png)

Ribbon原理+JUC(CAS自旋锁的复习)

![image-20211120143253141](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211120143253.png)

![image-20211124110949398](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/202111241110581.png)

![image-20211124114136190](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/202111241141838.png)

Springcloud-config

![image-20211124215712943](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211124215714.png)

![image-20211124220811851](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211124220815.png)

![image-20211124224934253](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/20211124224934.png)

![image-20211125135234230](./SpringCloud(%E5%B0%9A%E7%A1%85%E8%B0%B7).assets/202111251742316-166847351260419.png)

