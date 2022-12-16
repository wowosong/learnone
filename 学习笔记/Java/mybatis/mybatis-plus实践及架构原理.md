# mybatis-plus 实践及架构原理

**mybatis** 增强工具包，简化 **CURD** 操作。 

启动加载 XML 配置时注入单表 SQL 操作 ，为简化开发工作提供生产率而生。mybatis-plus 只做增强不做改变，这里不提倡 SQL 写在代码中。 

**Maven** 坐标 http://search.maven.org/#search%7Cga%7C1%7Cmybatis-plus 

```xml
<dependency> 
  <groupId>com.baomidou</groupId> 
  <artifactId>mybatis-plus</artifactId> 
  <version>maven 官方最新版本号为准</version> 
</dependency> 
```

功能

1、单表CURD （简单+批量）操作，自动完成。 

2、分页插件，Count 查询自动或自定义SQL 查询。 

3、Spring 根据不同环境加载不同配置支持。 

使用

1、代码自动生成，查看类com.baomidou.mybatisplus.test.AutoGeneratorTest 

2、使用方法，查看类com.baomidou.mybatisplus.test.UserMapperTest 

**mybatis 架构图**

![image-20210709220630492](https://gitee.com/wowosong/pic-md/raw/master/202212152320779.png)

![image-20210709220710270](https://gitee.com/wowosong/pic-md/raw/master/202212152320900.png)

![image-20210709220745461](https://gitee.com/wowosong/pic-md/raw/master/202212152320015.png)

![image-20210709220807474](./mybatis-plus%E5%AE%9E%E8%B7%B5%E5%8F%8A%E6%9E%B6%E6%9E%84%E5%8E%9F%E7%90%86.assets/20210709220807.png)

![image-20210709220832171](https://gitee.com/wowosong/pic-md/raw/master/202212152320482.png)

![image-20210709220913827](https://gitee.com/wowosong/pic-md/raw/master/202212152320751.png)

![image-20210709220930918](https://gitee.com/wowosong/pic-md/raw/master/202212152321450.png)

![image-20210709220946357](https://gitee.com/wowosong/pic-md/raw/master/202212152321679.png)

![image-20210709221004589](https://gitee.com/wowosong/pic-md/raw/master/202212152321454.png)