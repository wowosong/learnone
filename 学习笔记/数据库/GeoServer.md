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

# 使用参数化SQL视图

SQL视图参数是通过添加 `viewparams` WMS的参数 `GetMap` 或者WFS `GetFeature` 请求。这个 `viewparams` 参数是 `key:value` 对，用分号分隔：

> ```
> viewparams=p1:v1;p2:v2;...
> ```

如果值包含分号或逗号，则必须用反斜杠转义这些值（例如 `\,` 和 `\;` ）

例如， `popstates` SQL视图层可以通过调用 [层预览](https://www.osgeo.cn/geoserver-user-manual/data/webadmin/layerpreview.html#layerpreview) . 最初不提供参数值，因此使用默认值并显示所有状态。

要显示所有居住人口超过2000万的州，以下参数将添加到 `GetMap` 请求： `&viewparams=low:20000000`

# SQL WHERE子句的占位符

SQL `WHERE` geoserver使用上下文过滤器（例如WMS查询的边界框过滤器）生成的子句将添加到SQL视图定义周围。当我们有额外的操作可以在用geoserver生成的过滤器过滤的行的顶部完成时，这就变得很方便（性能更好）。

此功能的典型用例是在过滤结果的基础上执行分析函数：

```sql
SELECT STATION_NAME,
       MEASUREMENT,
       MEASUREMENT_TYPE,
       LOCATION
FROM
  (SELECT STATION_NAME,
          MEASUREMENT,
          MEASUREMENT_TYPE,
          LOCATION,
          ROW_NUMBER() OVER(PARTITION BY STATION_ID, MEASUREMENT_TYPE
                            ORDER BY TIME DESC) AS RANK
   FROM
     (SELECT st.id AS STATION_ID,
             st.common_name AS STATION_NAME,
             ob.value AS MEASUREMENT,
             pr.param_name AS MEASUREMENT_TYPE,
             ob.time AS TIME,
             st.position AS LOCATION
      FROM meteo.meteo_stations st
      LEFT JOIN meteo.meteo_observations ob ON st.id = ob.station_id
      LEFT JOIN meteo.meteo_parameters pr ON ob.parameter_id = pr.id

      -- SQL WHERE clause place holder for GeoServer
      WHERE 1 = 1 :where_clause:) AS stations_filtered) AS stations

WHERE RANK = 1;
```

在使用显式 `:where_clause:` 持证人：

> - 它需要添加到一个位置，其中geoserver已知的所有属性都已存在。
> - 这个 `:where_clause:` 只能出现一次

当A `WHERE` 子句占位符存在，geoserver将始终添加一个显式 `AND` 在生产开始时 `WHERE` 条款。这样就可以注入 `WHERE` 在复杂表达式的中间。