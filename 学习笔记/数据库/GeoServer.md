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