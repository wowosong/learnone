# 使用Web界面

geoserver有一个基于浏览器的Web管理界面应用程序，用于配置geoserver的所有方面，从添加和发布数据到更改服务设置。

Web管理界面通过Web浏览器访问，网址为：

```
http://<host>:<port>/geoserver
```

对于服务器上的默认安装，链接为：

```
http://localhost:8080/geoserver
```

当应用程序启动时，它会显示欢迎页面。

## 登录

要更改任何服务器设置或配置数据，必须首先对用户进行身份验证。

1. 导航到Web界面的右上角以登录到GeoServer。默认管理凭据为：

   - 用户名： `admin`
   - 密码： `geoserver`

   备注

    

   这些可以在 [安全性](https://www.osgeo.cn/geoserver-user-manual/security/index.html#security) 部分。

   ![../../_images/login-page.png](https://www.osgeo.cn/geoserver-user-manual/_images/login-page.png)

   登录

2. 登录后，欢迎屏幕将更改以显示可用的管理功能。这些主要显示在页面左侧的菜单中。

在geoserver中，术语“层”是指表示地理特征集合的栅格或矢量数据集。矢量层类似于“特征类型”，栅格层类似于“覆盖”。所有层都有一个数据源，称为存储。层与定义存储的工作区关联。图层可以分为两种类型的数据：栅格和矢量。<span style='color:red'>**这两种格式在存储空间信息的方式上有所不同。矢量类型将有关特征类型的信息存储为数学路径—点作为单个X、Y坐标，直线作为一系列X、Y坐标，多边形作为一系列X、Y坐标，起点和终点位于同一位置。栅格格式数据是地球表面特征的基于单元的表示。每个单元格都有一个不同的值，具有相同值的所有单元格都代表特定的功能。**</span>