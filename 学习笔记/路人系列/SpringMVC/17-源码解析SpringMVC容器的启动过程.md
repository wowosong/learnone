

# 源码解析SpringMVC容器的启动过程

本文将通过阅读源码的方式带大家了解springmv容器启动的过程，SpringMVC中的各种组件都是在容器启动的过程中组装的，所以如果熟悉整个过程后，你可以随意对SpringMVC进行扩展，SpringMVC会被你玩的出神入化。

## 目录

*   [目录](#%E7%9B%AE%E5%BD%95)
*   [1、前言](#1%E3%80%81%E5%89%8D%E8%A8%80)
*   [2、回顾全注解方式2个关键类](#2%E3%80%81%E5%9B%9E%E9%A1%BE%E5%85%A8%E6%B3%A8%E8%A7%A3%E6%96%B9%E5%BC%8F2%E4%B8%AA%E5%85%B3%E9%94%AE%E7%B1%BB)
    *   [2.1、MVC初始化类](#2.1%E3%80%81MVC%E5%88%9D%E5%A7%8B%E5%8C%96%E7%B1%BB)
    *   [2.2、MVC配置类](#2.2%E3%80%81MVC%E9%85%8D%E7%BD%AE%E7%B1%BB)
*   [2、SpringMVC容器的生命周期(9个阶段)](#2%E3%80%81SpringMVC%E5%AE%B9%E5%99%A8%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F(9%E4%B8%AA%E9%98%B6%E6%AE%B5))
*   [3、阶段1：Servlet容器初始化](#3%E3%80%81%E9%98%B6%E6%AE%B51%EF%BC%9AServlet%E5%AE%B9%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96)
    *   [3.1、ServletContainerInitializer](#3.1%E3%80%81ServletContainerInitializer)
    *   [3.2、SpringServletContainerInitializer](#3.2%E3%80%81SpringServletContainerInitializer)
    *   [3.3、SpringServletContainerInitializer#onStartup方法](#3.3%E3%80%81SpringServletContainerInitializer#onStartup%E6%96%B9%E6%B3%95)
    *   [3.4、WebApplicationInitializer：web应用初始化](#3.4%E3%80%81WebApplicationInitializer%EF%BC%9Aweb%E5%BA%94%E7%94%A8%E5%88%9D%E5%A7%8B%E5%8C%96)
    *   [3.5、进入AbstractDispatcherServletInitializer#onStartup方法](#3.5%E3%80%81%E8%BF%9B%E5%85%A5AbstractDispatcherServletInitializer#onStartup%E6%96%B9%E6%B3%95)
*   [4、阶段2：创建父容器](#4%E3%80%81%E9%98%B6%E6%AE%B52%EF%BC%9A%E5%88%9B%E5%BB%BA%E7%88%B6%E5%AE%B9%E5%99%A8)
    *   [4.1、过程](#4.1%E3%80%81%E8%BF%87%E7%A8%8B)
    *   [4.2、①：负责创建父容器](#4.2%E3%80%81%E2%91%A0%EF%BC%9A%E8%B4%9F%E8%B4%A3%E5%88%9B%E5%BB%BA%E7%88%B6%E5%AE%B9%E5%99%A8)
    *   [4.2、②：创建ContextLoaderListener监听器](#4.2%E3%80%81%E2%91%A1%EF%BC%9A%E5%88%9B%E5%BB%BAContextLoaderListener%E7%9B%91%E5%90%AC%E5%99%A8)
*   [5、阶段3&4：创建springmvc容器&注册DispatcherServlet](#5%E3%80%81%E9%98%B6%E6%AE%B53&4%EF%BC%9A%E5%88%9B%E5%BB%BAspringmvc%E5%AE%B9%E5%99%A8&%E6%B3%A8%E5%86%8CDispatcherServlet)
*   [6、阶段5：启动父容器：ContextLoaderListener](#6%E3%80%81%E9%98%B6%E6%AE%B55%EF%BC%9A%E5%90%AF%E5%8A%A8%E7%88%B6%E5%AE%B9%E5%99%A8%EF%BC%9AContextLoaderListener)
    *   [6.1、过程](#6.1%E3%80%81%E8%BF%87%E7%A8%8B)
    *   [6.2、代码①：配置父容器以及启动父容器](#6.2%E3%80%81%E4%BB%A3%E7%A0%81%E2%91%A0%EF%BC%9A%E9%85%8D%E7%BD%AE%E7%88%B6%E5%AE%B9%E5%99%A8%E4%BB%A5%E5%8F%8A%E5%90%AF%E5%8A%A8%E7%88%B6%E5%AE%B9%E5%99%A8)
    *   [6.3、ApplicationContextInitializer接口：容器启动前用来初始化容器](#6.3%E3%80%81ApplicationContextInitializer%E6%8E%A5%E5%8F%A3%EF%BC%9A%E5%AE%B9%E5%99%A8%E5%90%AF%E5%8A%A8%E5%89%8D%E7%94%A8%E6%9D%A5%E5%88%9D%E5%A7%8B%E5%8C%96%E5%AE%B9%E5%99%A8)
*   [7、阶段6：启动springmvc容器：DispatcherServlet#init()](#7%E3%80%81%E9%98%B6%E6%AE%B56%EF%BC%9A%E5%90%AF%E5%8A%A8springmvc%E5%AE%B9%E5%99%A8%EF%BC%9ADispatcherServlet#init())
    *   [7.1、DispatcherServlet类图](#7.1%E3%80%81DispatcherServlet%E7%B1%BB%E5%9B%BE)
    *   [7.2、HttpServletBean#init()](#7.2%E3%80%81HttpServletBean#init())
    *   [7.3、FrameworkServlet#initServletBean](#7.3%E3%80%81FrameworkServlet#initServletBean)
    *   [7.4、FrameworkServlet#initWebApplicationContext](#7.4%E3%80%81FrameworkServlet#initWebApplicationContext)
    *   [7.5、FrameworkServlet#configureAndRefreshWebApplicationContext](#7.5%E3%80%81FrameworkServlet#configureAndRefreshWebApplicationContext)
*   [8、阶段7：springmvc容器启动过程中处理@WebMVC](#8%E3%80%81%E9%98%B6%E6%AE%B57%EF%BC%9Aspringmvc%E5%AE%B9%E5%99%A8%E5%90%AF%E5%8A%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%A4%84%E7%90%86@WebMVC)
    *   [8.1、SpringMVC配置类被处理](#8.1%E3%80%81SpringMVC%E9%85%8D%E7%BD%AE%E7%B1%BB%E8%A2%AB%E5%A4%84%E7%90%86)
    *   [8.2、@EnableWebMvc：配置springmvc所需组件](#8.2%E3%80%81@EnableWebMvc%EF%BC%9A%E9%85%8D%E7%BD%AEspringmvc%E6%89%80%E9%9C%80%E7%BB%84%E4%BB%B6)
    *   [8.3、进入DelegatingWebMvcConfiguration类](#8.3%E3%80%81%E8%BF%9B%E5%85%A5DelegatingWebMvcConfiguration%E7%B1%BB)
    *   [8.4、WebMvcConfigurationSupport：配置springmvc所需所有组件](#8.4%E3%80%81WebMvcConfigurationSupport%EF%BC%9A%E9%85%8D%E7%BD%AEspringmvc%E6%89%80%E9%9C%80%E6%89%80%E6%9C%89%E7%BB%84%E4%BB%B6)
    *   [8.5、WebMvcConfigurer接口](#8.5%E3%80%81WebMvcConfigurer%E6%8E%A5%E5%8F%A3)
*   [9、阶段8：组装DispatcherServlet中各种SpringMVC需要的组件](#9%E3%80%81%E9%98%B6%E6%AE%B58%EF%BC%9A%E7%BB%84%E8%A3%85DispatcherServlet%E4%B8%AD%E5%90%84%E7%A7%8DSpringMVC%E9%9C%80%E8%A6%81%E7%9A%84%E7%BB%84%E4%BB%B6)
    *   [9.1、触发ContextRefreshListener监听器](#9.1%E3%80%81%E8%A7%A6%E5%8F%91ContextRefreshListener%E7%9B%91%E5%90%AC%E5%99%A8)
    *   [9.2、进入FrameworkServlet.this.onApplicationEvent(event);](#9.2%E3%80%81%E8%BF%9B%E5%85%A5FrameworkServlet.this.onApplicationEvent(event);)
    *   [9.3、进入DispatcherServlet#onRefresh](#9.3%E3%80%81%E8%BF%9B%E5%85%A5DispatcherServlet#onRefresh)
    *   [9.4、DispatcherServlet#initStrategies：初始化DispatcherServlet中的组件](#9.4%E3%80%81DispatcherServlet#initStrategies%EF%BC%9A%E5%88%9D%E5%A7%8B%E5%8C%96DispatcherServlet%E4%B8%AD%E7%9A%84%E7%BB%84%E4%BB%B6)
    *   [9.5、initHandlerMappings(context);](#9.5%E3%80%81initHandlerMappings(context);)
    *   [9.6、DispatcherServlet#getDefaultStrategies：兜底的方案查找组件](#9.6%E3%80%81DispatcherServlet#getDefaultStrategies%EF%BC%9A%E5%85%9C%E5%BA%95%E7%9A%84%E6%96%B9%E6%A1%88%E6%9F%A5%E6%89%BE%E7%BB%84%E4%BB%B6)
*   [10、阶段9：销毁容器](#10%E3%80%81%E9%98%B6%E6%AE%B59%EF%BC%9A%E9%94%80%E6%AF%81%E5%AE%B9%E5%99%A8)
    *   [10.1、销毁springmvc容器：DispatcherServlet#destroy](#10.1%E3%80%81%E9%94%80%E6%AF%81springmvc%E5%AE%B9%E5%99%A8%EF%BC%9ADispatcherServlet#destroy)
    *   [10.2、销毁父容器：ContextLoaderListener#contextDestroyed](#10.2%E3%80%81%E9%94%80%E6%AF%81%E7%88%B6%E5%AE%B9%E5%99%A8%EF%BC%9AContextLoaderListener#contextDestroyed)
*   [11、带大家debug代码](#11%E3%80%81%E5%B8%A6%E5%A4%A7%E5%AE%B6debug%E4%BB%A3%E7%A0%81)
    *   [11.1、拉取源码](#11.1%E3%80%81%E6%8B%89%E5%8F%96%E6%BA%90%E7%A0%81)
    *   [11.2、将下面这个模块发布到tomcat](#11.2%E3%80%81%E5%B0%86%E4%B8%8B%E9%9D%A2%E8%BF%99%E4%B8%AA%E6%A8%A1%E5%9D%97%E5%8F%91%E5%B8%83%E5%88%B0tomcat)
    *   [11.2、按照下面配置设置断点，启动，调试代码](#11.2%E3%80%81%E6%8C%89%E7%85%A7%E4%B8%8B%E9%9D%A2%E9%85%8D%E7%BD%AE%E8%AE%BE%E7%BD%AE%E6%96%AD%E7%82%B9%EF%BC%8C%E5%90%AF%E5%8A%A8%EF%BC%8C%E8%B0%83%E8%AF%95%E4%BB%A3%E7%A0%81)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 1、前言

SpringMVC，建议大家使用全注解的方式，全注解的方式及原理不了解的，先去看一下这篇文章：[SpringMVC全注解方式如何使用？](http://www.itsoku.com/course/6/152)

上面的文章看懂以后再来看本文，否则将出现消化不良的现象。

本文以全注解的方式为基础，来解说SpringMVC容器启动的整个流程。

## 2、回顾全注解方式2个关键类

全注解的方式重点就在于2个类：MVC初始化类、MVC配置类

### 2.1、MVC初始化类

> 代码如下，这个类需要继承AbstractAnnotationConfigDispatcherServletInitializer，会有web容器来调用，这个类中有4个方法需要实现，干了4件事情
> 
> *   getRootConfigClasses()：获取父容器的配置类
> *   getServletConfigClasses()：获取springmvc容器的配置类，这个配置类相当于springmvc xml配置文件的功能
> *   getServletMappings()：获取DispatcherServlet能够处理的url，相当于web.xml中为servlet指定的url-pattern
> *   getServletFilters()：定义所有的Filter

```java
/**
 * ①：1、创建Mvc初始化类，需要继承AbstractAnnotationConfigDispatcherServletInitializer类
 */
public class MvcInit extends AbstractAnnotationConfigDispatcherServletInitializer {
    /**
     * springmvc容器的父容器spring配置类
     * 实际工作中我们的项目比较复杂，可以将controller层放在springmvc容器中
     * 其他层，如service层、dao层放在父容器了，bean管理起来更清晰一些
     * 也可以没有父容器，将所有bean都放在springmvc容器中
     *
     * @return
     */
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[0];
    }

    /**
     * ②：2、设置springmvc容器的spring配置类
     *
     * @return
     */
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{MvcConfig.class};
    }

    /**
     * ③：3、配置DispatcherServlet的url-pattern
     *
     * @return
     */
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    /**
     * ④：4、注册拦截器
     *
     * @return
     */
    @Override
    protected Filter[] getServletFilters() {
        //添加拦截器，解决乱码问题
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceRequestEncoding(true);
        characterEncodingFilter.setForceResponseEncoding(true);
        return new Filter[]{characterEncodingFilter};
    }
}
```

### 2.2、MVC配置类

> 代码如下，这个配置类相当于springmvc xml配置文件的功能，可以在里面定义springmvc各种组件

```java
/**
 * 1.开启springmvc注解配置
 * 2、配置视图解析器
 * 3、配置截器
 * 4、配置静态资源访问
 * 5、配置文件上传解析器
 * 6、配置全局异常处理器
 */
@Configuration
@ComponentScan("com.javacode2018.springmvc.chat12")
@EnableWebMvc //1：使用EnableWebMvc开启springmvc注解方式配置
public class MvcConfig implements WebMvcConfigurer {

    /**
     * 2、添加视图解析器（可以添加多个）
     *
     * @param registry
     */
    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/view/");
        resolver.setSuffix(".jsp");
        resolver.setOrder(Ordered.LOWEST_PRECEDENCE);
        registry.viewResolver(resolver);
    }

    @Autowired
    private MyInterceptor myInterceptor;

    /**
     * 3、添加拦截器（可以添加多个）
     *
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(this.myInterceptor).addPathPatterns("/**");
    }


    /**
     * 4、配置静态资源访问处理器
     *
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("/static/");
    }

    /**
     * 5、配置文件上传解析器
     *
     * @return
     */
    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        //maxUploadSizePerFile:单个文件大小限制（byte）
        //maxUploadSize：整个请求大小限制（byte）
        commonsMultipartResolver.setMaxUploadSizePerFile(10 * 1024 * 1024);
        commonsMultipartResolver.setMaxUploadSize(100 * 1024 * 1024);
        return commonsMultipartResolver;
    }
}
```

## 2、SpringMVC容器的生命周期(9个阶段)

1.  阶段1：Servlet容器初始化
2.  阶段2：创建父容器
3.  阶段3：创建springmvc容器
4.  阶段4：Servlet容器中注册DispatcherServlet
5.  阶段5：启动父容器：ContextLoaderListener
6.  阶段6：启动springmvc容器：DispatcherServlet#init()
7.  阶段7：springmvc容器启动过程中处理@WebMVC
8.  阶段8：组装DispatcherServlet中各种SpringMVC需要的组件
9.  阶段9：销毁2个容器

## 3、阶段1：Servlet容器初始化

### 3.1、ServletContainerInitializer

咱们知道servlet3.0中新增了一个接口：`ServletContainerInitializer`，这个接口功能特别的牛逼，有了它之后，web.xml配置文件可要可不要了。

```java
public interface ServletContainerInitializer {
    public void onStartup(Set<Class<?>> c, ServletContext ctx)
        throws ServletException; 
}
```

这个接口的实现类，如果满足下面2个条件，Servlet容器启动的过程中会自动实例化这些类，然后调用他们的onStartUp方法，然后我们就可以在这些类的onStartUp方法中干活了，在web.xml干的所有事情，都可以在这个方法中干，特别强大：

> 1.  这个类必须实现ServletContainerInitializer接口，且非抽象类
> 2.  这个类的全类名必须要放在`META-INF/services/javax.servlet.ServletContainerInitializer`这个文件中

### 3.2、SpringServletContainerInitializer

下面重点来了，springmvc提供了一个类`SpringServletContainerInitializer`，满足了上面个条件。

![cea97fe3-ad9f-482d-81e5-a0d8ea26e6ea](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081737298.png)

spring-web-5.3.6.jar!\\META-INF\\services\\javax.servlet.ServletContainerInitializer

![8eb64baf-6263-484a-9fb5-99d9ea81b872](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081737296.png)

所以SpringServletContainerInitializer的onStart方法会servlet容器自动被调用

### 3.3、SpringServletContainerInitializer#onStartup方法

这个类的源码，大家先看一下，这个类干的事情：

> 1.  类上有@HandlesTypes(WebApplicationInitializer.class) 这个注解，注解的值为`WebApplicationInitializer.class`，所以onStartup方法的第一个参数是`WebApplicationInitializer`类型的集合，这个集合由web容器自动扫描获取，然后传入进来
> 2.  实例化WebApplicationInitializer集合
> 3.  对WebApplicationInitializer集合进行排序
> 4.  循环调用WebApplicationInitializer的onStartup方法

```java
@HandlesTypes(WebApplicationInitializer.class) //@1
public class SpringServletContainerInitializer implements ServletContainerInitializer {

    @Override
    public void onStartup(@Nullable Set<Class<?>> webAppInitializerClasses, ServletContext servletContext)
            throws ServletException {

        List<WebApplicationInitializer> initializers = Collections.emptyList();

        if (webAppInitializerClasses != null) {
            initializers = new ArrayList<>(webAppInitializerClasses.size());
            for (Class<?> waiClass : webAppInitializerClasses) {
                // Be defensive: Some servlet containers provide us with invalid classes,
                // no matter what @HandlesTypes says...
                if (!waiClass.isInterface() && !Modifier.isAbstract(waiClass.getModifiers()) &&
                        WebApplicationInitializer.class.isAssignableFrom(waiClass)) {
                    try {
                        initializers.add((WebApplicationInitializer)
                                ReflectionUtils.accessibleConstructor(waiClass).newInstance());
                    }
                    catch (Throwable ex) {
                        throw new ServletException("Failed to instantiate WebApplicationInitializer class", ex);
                    }
                }
            }
        }

        if (initializers.isEmpty()) {
            servletContext.log("No Spring WebApplicationInitializer types detected on classpath");
            return;
        }

        servletContext.log(initializers.size() + " Spring WebApplicationInitializers detected on classpath");
        AnnotationAwareOrderComparator.sort(initializers);
        for (WebApplicationInitializer initializer : initializers) {
            initializer.onStartup(servletContext);
        }
    }

}
```

下面重点要看`WebApplicationInitializer`接口了。

### 3.4、WebApplicationInitializer：web应用初始化

接口比较简单，就一个方法，参数是servlet上下文对象，有了个对象，可以干web.xml中的一切事情了，比如注册servlet、filter、监听器等等

```java
public interface WebApplicationInitializer {

    void onStartup(ServletContext servletContext) throws ServletException;

}
```

如下图，看一下类的继承关系，咱们的MvcInit就实现了这个接口，所以MvcInit的onStartup方法会被调费用

![24f94fd1-caf4-41ad-9769-cea1c83e24f9](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081737242.png)

关键代码在这3个类中

![5f2a7d9f-075e-4b16-8355-e558f234e4a6](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081738036.png)

### 3.5、进入AbstractDispatcherServletInitializer#onStartup方法

```java
public void onStartup(ServletContext servletContext) throws ServletException {
    super.onStartup(servletContext);
    registerDispatcherServlet(servletContext);
}
```

**这里是重点：这个方法中干了4件事情**

> 1.  创建父容器，只是实例化了，并未启动
> 2.  创建了监听器ContextLoaderListener，这是一个ServletContextListener类型的监听器，稍后会在这个监听器中启动父容器
> 3.  创建springmvc容器，只是实例化了，并未启动，启动的事情会在DispatcherServlet#init中做，稍后会说
> 4.  Servlet容器中注册DispatcherServlet

下面，咱们来详细看这几个步骤，把这几个步骤作为阶段来解读。

## 4、阶段2：创建父容器

父容器可有可无，并不是必须的，为了更好的管理bean，springmvc建议我们用父子容器，controller之外的bean，比如service，dao等，建议放到父容器中，controller层的和springmvc相关的一些bean放在springmvc容器中，咱们继续。

### 4.1、过程

`AbstractDispatcherServletInitializer#onStartup`方法中会调用父类的`onStartup`，即`AbstractContextLoaderInitializer#onStartup`，我们进到这个方法中，代码如下图，干了2个事情

> 1.  图中编号①：创建父容器，只是实例化了，并未启动
> 2.  图中编号②：创建了一个监听器ContextLoaderListener，这是一个ServletContextListener类型的监听器，稍后会在这个监听器中启动父容器

![c88abafb-8972-4b96-998a-48605f1eeb62](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081738061.png)

下面来分别来细说下上面2段代码干的活。

### 4.2、①：负责创建父容器

`AbstractAnnotationConfigDispatcherServletInitializer#createRootApplicationContext`，只是创建了一个`AnnotationConfigWebApplicationContext`对象，并将父容器配置类rootConfigClass注册到容器中，并没有启动这个容器，若rootConfigClass为空，父容器不会被创建，所以父容器可有可无。

![6f3ef43c-c5fd-4bb9-9cee-b861ab4c2bd5](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081738584.png)

### 4.2、②：创建ContextLoaderListener监听器

代码如下，创建的时候将父容器对象rootAContext传进去了。

```java
ContextLoaderListener listener = new ContextLoaderListener(rootAppContext);
//getRootApplicationContextInitializers()返回置为ApplicationContextInitializer数组，是个函数式接口，在父容器初始化的过程中，会作为一个扩展点预留给开发者用
listener.setContextInitializers(getRootApplicationContextInitializers());
servletContext.addListener(listener);
```

ContextLoaderListener，这是一个ServletContextListener类型的监听器，所以在web容器启动和销毁的过程中会被调用，如下图，这个监听器干了2件事

> 1.  contextInitialized方法：这个方法会在web容器启动时被调用，内部负责启动父容器
> 2.  在contextDestroyed方法：这个方法会在web容器销毁时被调用，内部负责关闭父容器

![da894e53-074a-40eb-83b6-e3a8f91bc12a](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081738371.png)

## 5、阶段3&4：创建springmvc容器&注册DispatcherServlet

在回到`AbstractDispatcherServletInitializer#onStartup`，看这个方法的第二行，如下图

![bb408421-e0cb-4ad6-a09e-374ddb5530bc](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081738889.png)

`registerDispatcherServlet`源码如下

```java
protected void registerDispatcherServlet(ServletContext servletContext) {
    //①：DispatcherServlet的servlet名称，默认为：dispatcher
    String servletName = getServletName();

    //②：创建springmvc容器
    WebApplicationContext servletAppContext = createServletApplicationContext();

    //③：创建DispatcherServlet,注意这里将springmvc容器对象做为参数传递给DispatcherServlet了
    FrameworkServlet dispatcherServlet = createDispatcherServlet(servletAppContext);
    //设置ApplicationContextInitializer列表，可以对springmvc容器在启动之前进行定制化
    dispatcherServlet.setContextInitializers(getServletApplicationContextInitializers());

    //④：将 dispatcherServlet 注册到servlet上下文中
    ServletRegistration.Dynamic registration = servletContext.addServlet(servletName, dispatcherServlet);
    registration.setLoadOnStartup(1);
    registration.addMapping(getServletMappings());
    registration.setAsyncSupported(isAsyncSupported());

    //⑤：注册Filter
    Filter[] filters = getServletFilters();
    if (!ObjectUtils.isEmpty(filters)) {
        for (Filter filter : filters) {
            registerServletFilter(servletContext, filter);
        }
    }
    //⑥：这个方法预留给咱们自己去实现，可以对dispatcherServlet做一些特殊的配置
    customizeRegistration(registration);
}

protected FrameworkServlet createDispatcherServlet(WebApplicationContext servletAppContext) {
    return new DispatcherServlet(servletAppContext);
}
```

## 6、阶段5：启动父容器：ContextLoaderListener

### 6.1、过程

上面的`onStartup`方法执行完毕之后，会执行监听器`ContextLoaderListener`的初始化，会进入到他的`contextInitialized`方法中

![225d4afe-0dbf-4f35-ac16-011c5fdfff27](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739808.png)

`initWebApplicationContext`源码如下，截取了主要的几行

```java
public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
    //this.context就是父容器对象
    ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) this.context;
    //①：配置及启动父容器
    configureAndRefreshWebApplicationContext(cwac, servletContext);
    //将父容器丢到servletContext中进行共享，方便其他地方获取
    servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
}
```

### 6.2、代码①：配置父容器以及启动父容器

```java
//①：配置及启动父容器
configureAndRefreshWebApplicationContext(cwac, servletContext);
```

`configureAndRefreshWebApplicationContext`方法关键代码如下

```java
protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac, ServletContext sc) {
    //①：定制上线文，这里主要是遍历ApplicationContextInitializer列表，调用每个ApplicationContextInitializer#initialize方法来对容器进行定制，相当于一个扩展点，可以有程序员自己控制
    customizeContext(sc, wac);
    //②：刷新容器，就相当于启动容器了，此时就会组装里面的bean了
    wac.refresh();
}
```

`customizeContext`方法，我们进去看一下，这里涉及到了一个新的类，所以有必要去看一下，混个脸熟，源码如下，这是给开发者留的一个扩展点，通过`ApplicationContextInitializer`这个来做扩展，这是一个函数式接口，下面代码会遍历`ApplicationContextInitializer`列表，然后调用其`initialize`方法，我们可以在这个方法中对spring上线文进行定制

```java
protected void customizeContext(ServletContext sc, ConfigurableWebApplicationContext wac) {
        List<Class<ApplicationContextInitializer<ConfigurableApplicationContext>>> initializerClasses =
                determineContextInitializerClasses(sc);

    for (Class<ApplicationContextInitializer<ConfigurableApplicationContext>> initializerClass : initializerClasses) {
        Class<?> initializerContextClass =
            GenericTypeResolver.resolveTypeArgument(initializerClass, ApplicationContextInitializer.class);
        if (initializerContextClass != null && !initializerContextClass.isInstance(wac)) {
            throw new ApplicationContextException(String.format(
                "Could not apply context initializer [%s] since its generic parameter [%s] " +
                "is not assignable from the type of application context used by this " +
                "context loader: [%s]", initializerClass.getName(), initializerContextClass.getName(),
                wac.getClass().getName()));
        }
        this.contextInitializers.add(BeanUtils.instantiateClass(initializerClass));
    }

    AnnotationAwareOrderComparator.sort(this.contextInitializers);
    for (ApplicationContextInitializer<ConfigurableApplicationContext> initializer : this.contextInitializers) {
        initializer.initialize(wac);
    }
}
```

### 6.3、ApplicationContextInitializer接口：容器启动前用来初始化容器

是个函数式接口，在容器启动之前用来对容器进行定制，作为一个扩展点预留给开发者用，父容器和springmvc容器都用到了。

```java
@FunctionalInterface
public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext> {

    /**
     * 初始化给定的spring容器
     * @param applicationContext the application to configure
     */
    void initialize(C applicationContext);

}
```

## 7、阶段6：启动springmvc容器：DispatcherServlet#init()

到目前为止父容器已经启动完毕了，此时DispatcherServlet会被初始化，会进入到他的init()方法中。

### 7.1、DispatcherServlet类图

![1d3cda77-163f-4076-be2c-16ec5d24962a](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739179.png)

### 7.2、HttpServletBean#init()

> 这个方法会调用`initServletBean()`这个方法，其他的先不看

![04622976-8014-4b67-b819-0867ad927b1a](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739508.png)

### 7.3、FrameworkServlet#initServletBean

> 提取了关键的代码，就2行

```java
@Override
protected final void initServletBean() throws ServletException {
    //初始化springmvc容器，就是启动springmvc容器
    this.webApplicationContext = initWebApplicationContext();
    //这个方法内部是空的，预留给子类去实现的，目前没啥用
    initFrameworkServlet();
}
```

下面咱们进到`initWebApplicationContext`方法中去。

### 7.4、FrameworkServlet#initWebApplicationContext

> 关键代码如下，干了3件事情：
> 
> 1.  从servlet上线文对象中找到父容器
> 2.  为springmvc容器指定父容器
> 3.  调用configureAndRefreshWebApplicationContext方法配置springmvc容器以及启动容器，这个是关键咯

```java
protected WebApplicationContext initWebApplicationContext() {
    //①：从servlet上线文中获取父容器
    WebApplicationContext rootContext =
        WebApplicationContextUtils.getWebApplicationContext(getServletContext());
    WebApplicationContext wac = null;
    //②：this.webApplicationContext就是springmvc容器，此时这个对对象不为null，所以满足条件
    if (this.webApplicationContext != null) {
        wac = this.webApplicationContext;
        if (wac instanceof ConfigurableWebApplicationContext) {
            ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) wac;
            //springmvc容器未启动
            if (!cwac.isActive()) {
                //springmvc容器未设置父容器，则给其设置父容器，此时rootContext可能为空，这个没什么关系
                if (cwac.getParent() == null) {
                    cwac.setParent(rootContext);
                }
                //③：配置springmvc容器以及启动springmvc容器
                configureAndRefreshWebApplicationContext(cwac);
            }
        }
    }
    //这里省略了一部分代码，如果springmvc采用配置文件的方式会走这部分代码
    ......
    //返回容器
    return wac;
}
```

### 7.5、FrameworkServlet#configureAndRefreshWebApplicationContext

> 为了让大家看清楚，如下代码，这里只提取了关键代码，主要干了3件事情
> 
> 1.  代码①：向springmvc容器中添加了一个ContextRefreshListener监听器，这个监听器非常非常重要，springmvc容器启动完毕之后会被调用，**会出现在阶段8中**
> 2.  代码②：给开发者预留的一个扩展点，通过ApplicationContextInitializer#initialize方法对容器进行定制
> 3.  代码③：启动容器

```java
protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac) {
    //①：向springmvc容器中添加了一个监听器对象，这个监听器特别重要，稍后在
    wac.addApplicationListener(new SourceFilteringListener(wac, new ContextRefreshListener()));
    //②：扩展点：循环遍历ApplicationContextInitializer列表，调用其initialize方法对容器进行定制
    applyInitializers(wac);
    //③：刷新容器，相当于启动容器
    wac.refresh();
}
```

## 8、阶段7：springmvc容器启动过程中处理@WebMVC

### 8.1、SpringMVC配置类被处理

此时springmvc容器启动了，此时注意下`MvcConfig`这个类，由于其上有@Conguration注解，所以会被当做一个配置类被处理，这个类有2个非常重要的特征。

> 1.  标注了@EnableWebMvc注解
> 2.  实现了WebMvcConfigurer接口

![99b80981-ace4-4a6b-b4af-e68e24c9a1d6](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739903.png)

下面来说说这2个特征的作用。

### 8.2、@EnableWebMvc：配置springmvc所需组件

看一下这个注解的源码，如下，重点在于它上面的`@Import(DelegatingWebMvcConfiguration.class)`注解，这个注解的功能不知道的，可以回头去看我的spring系列，从头看一遍。

![0bc69ada-4c91-4a77-93bb-accc779956bd](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739516.png)

### 8.3、进入DelegatingWebMvcConfiguration类

代码如下，先注意下面3个特征

> 1.  代码编号①：标注有@Configuration注解，说明是一个配置类
> 2.  代码编号②：继承了WebMvcConfigurationSupport类，这个类中有很多@Bean标注的方法，用来定义了springmvc需要的所有组件
> 3.  代码编号③：注入了`WebMvcConfigurer`列表，注意下，我们的WebConfig类就实现了WebMvcConfigurer这个接口，内部提供了很多方法可以用来对springmvc的组件进行自定义配置

![36c5e2e2-4870-4bc6-8e82-190454cf36d1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081739827.png)

先来看看WebMvcConfigurationSupport这个类。

### 8.4、WebMvcConfigurationSupport：配置springmvc所需所有组件

这个类中会定义springmvc需要的所有组件，比如：RequestMapping、HandlerAdapter、HandlerInterceptor、HttpMessageConverter、HandlerMethodArgumentResolver、HandlerMethodReturnValueHandler等等，所以如果你感觉@WebMVC注解满足不了你的需求时，你可以直接继承这个类进行扩展。

这个类的源码我就不贴了，截几个图给大家看看

![d1e65c66-4d6d-4705-806e-548fe9290e8a](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081740083.png)

### 8.5、WebMvcConfigurer接口

这个接口就是我们用来对springmvc容器中的组件进行定制的，WebMvcConfigurationSupport中创建springmvc组件的时候，会自动调用WebMvcConfigurer中对应的一些方法，来对组件进行定制，比如可以在WebMvcConfigurer中添加拦截器、配置默认servlet处理器、静态资源处理器等等，这个接口的源码如下

```java
public interface WebMvcConfigurer {

    /**
     * 配置PathMatchConfigurer
     */
    default void configurePathMatch(PathMatchConfigurer configurer) {
    }

    /**
     * 配置ContentNegotiationConfigurer
     */
    default void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    }

    /**
     * 异步处理配置
     */
    default void configureAsyncSupport(AsyncSupportConfigurer configurer) {
    }

    /**
     * 配置默认servlet处理器
     */
    default void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    }

    /**
     * 配置Formatter
     */
    default void addFormatters(FormatterRegistry registry) {
    }

    /**
     * 添加拦截器
     */
    default void addInterceptors(InterceptorRegistry registry) {
    }

    /**
     * 静态资源配置
     */
    default void addResourceHandlers(ResourceHandlerRegistry registry) {
    }

    /**
     * 跨越的配置
     */
    default void addCorsMappings(CorsRegistry registry) {
    }

    /**
     * 配置ViewController
     */
    default void addViewControllers(ViewControllerRegistry registry) {
    }

    /**
     * 注册视图解析器（ViewResolverRegistry）
     */
    default void configureViewResolvers(ViewResolverRegistry registry) {
    }

    /**
     * 注册处理器方法参数解析器（HandlerMethodArgumentResolver）
     */
    default void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    }

    /**
     * 注册处理器方法返回值处理器（HandlerMethodReturnValueHandler）
     */
    default void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> handlers) {
    }

    /**
     * 注册http报文转换器（HttpMessageConverter）
     */
    default void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    }

    /**
     * 扩展报文转换器
     */
    default void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    }

    /**
     * 配置异常解析器（HandlerExceptionResolver）
     */
    default void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
    }

    /**
     * 扩展异常解析器（HandlerExceptionResolver）
     */
    default void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
    }

    /**
     * 获得验证器
     */
    @Nullable
    default Validator getValidator() {
        return null;
    }

    /**
     * 获得MessageCodesResolver
     */
    @Nullable
    default MessageCodesResolver getMessageCodesResolver() {
        return null;
    }

}
```

## 9、阶段8：组装DispatcherServlet中各种SpringMVC需要的组件

### 9.1、触发ContextRefreshListener监听器

大家回头看一下8.5中，有这样一段代码，注册了一个监听器`ContextRefreshListener`

![29822716-9a55-426f-a3f6-382b75f1bd24](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081740543.png)

再来看看这个监听器的源码，如下图，包含2点信息

> 1.  会监听ContextRefreshedEvent事件
> 2.  监听到事件之后将执行`FrameworkServlet.this.onApplicationEvent(event);`，稍后会具体说这个代码

![59a2feea-0f26-475e-803d-5b9162b15712](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081740058.png)

如下代码，springmvc容器启动完毕之后，会发布一个`ContextRefreshedEvent`事件，会触发上面这个监听器的执行

![25d811e8-289d-464a-974a-a437083fa572](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081740918.png)

### 9.2、进入FrameworkServlet.this.onApplicationEvent(event);

```java
public void onApplicationEvent(ContextRefreshedEvent event) {
    //标记已收到刷新事件
    this.refreshEventReceived = true;
    synchronized (this.onRefreshMonitor) {
        onRefresh(event.getApplicationContext());
    }
}
```

上面的`onRefresh(event.getApplicationContext());`会进到`DispatcherServlet#onRefresh`方法中。

### 9.3、进入DispatcherServlet#onRefresh

```java
protected void onRefresh(ApplicationContext context) {
    initStrategies(context);
}
```

里面会调用`initStrategies`方法。

### 9.4、DispatcherServlet#initStrategies：初始化DispatcherServlet中的组件

代码如下，这里面会初始化DispatcherServlet中的各种组件，这里的所有方法初始化的过程基本上差不多，就是先从springmvc容器中找这个组件，如果找不到一般会有一个兜底的方案

```java
protected void initStrategies(ApplicationContext context) {
    //初始化MultipartResolver
    initMultipartResolver(context);
    //初始化LocaleResolver
    initLocaleResolver(context);
    //初始化ThemeResolver
    initThemeResolver(context);
    //初始化HandlerMappings
    initHandlerMappings(context);
    //初始化HandlerAdapters
    initHandlerAdapters(context);
    //初始化HandlerExceptionResolvers
    initHandlerExceptionResolvers(context);
    //初始化RequestToViewNameTranslator
    initRequestToViewNameTranslator(context);
    //初始化视图解析器ViewResolvers
    initViewResolvers(context);
    //初始化FlashMapManager
    initFlashMapManager(context);
}
```

下面我们以`initHandlerMappings(context);`为例来看一下是如何初始化这些组件的。

### 9.5、initHandlerMappings(context);

源码如下，就是先从容器中找，找不到走兜底的方案。

```java
private void initHandlerMappings(ApplicationContext context) {
    this.handlerMappings = null;
    //是否需要查找所有的HandlerMapping，默认为true
    if (this.detectAllHandlerMappings) {
        //从容器中查找所有的HandlerMapping
        Map<String, HandlerMapping> matchingBeans =
                BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerMapping.class, true, false);
        //对HandlerMapping列表进行排序
        if (!matchingBeans.isEmpty()) {
            this.handlerMappings = new ArrayList<>(matchingBeans.values());
            AnnotationAwareOrderComparator.sort(this.handlerMappings);
        }
    }
    else {
        try {
            //查找名称为handlerMapping的HandlerMapping
            HandlerMapping hm = context.getBean("handlerMapping", HandlerMapping.class);
            this.handlerMappings = Collections.singletonList(hm);
        }
        catch (NoSuchBeanDefinitionException ex) {
        }
    }

    // 如果没有找到HandlerMapping，则走兜底的方案
    if (this.handlerMappings == null) {
        this.handlerMappings = getDefaultStrategies(context, HandlerMapping.class);
    }
}
```

下面我们来看一下兜底的代码如何走的，进入getDefaultStrategies方法

### 9.6、DispatcherServlet#getDefaultStrategies：兜底的方案查找组件

这个方法的源码就不贴出来了，这里只说一下兜底的处理过程，springmvc有个配置文件：`spring-webmvc-5.3.6.jar!\org\springframework\web\servlet\DispatcherServlet.properties`，properties格式的文件，key为组件的完整类名，value为多个实现类的列表，在这个配置文件中指定了每种类型的组件兜底的情况下对应的实现类，比如没有找到RequestMapping的情况下，如下图红框的部分，有3个兜底的实现类，然后springmvc会实例化这3个类作为RequestMapping。

![47e47b6a-17fa-4e1e-83d6-6363c0091513](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081740127.png)

## 10、阶段9：销毁容器

### 10.1、销毁springmvc容器：DispatcherServlet#destroy

> DispatcherServlet销毁的时候会关闭springmvc容器

```java
public void destroy() {
    if (this.webApplicationContext instanceof ConfigurableApplicationContext && !this.webApplicationContextInjected) {
        ((ConfigurableApplicationContext) this.webApplicationContext).close();
    }
}
```

### 10.2、销毁父容器：ContextLoaderListener#contextDestroyed

> 父容器是在监听器中启动的，所以销毁的也是监听器负责的

```java
public void contextDestroyed(ServletContextEvent event) {
    closeWebApplicationContext(event.getServletContext());
    ContextCleanupListener.cleanupAttributes(event.getServletContext());
}
```

springmvc容器的生命周期到此就结束了，想掌握好这个过程，建议大家debug走几遍，就熟悉了，下面带大家debug一下代码。

## 11、带大家debug代码

### 11.1、拉取源码

```java
https://gitee.com/javacode2018/springmvc-series
```

### 11.2、将下面这个模块发布到tomcat

![d45a04ad-cbb6-4cb5-bdd7-97521d23fdbf](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081741598.png)

### 11.2、按照下面配置设置断点，启动，调试代码

依次在下面这些方法中设置断点，然后启动tomcat，一步步调试，我相信你们肯定可以吃透的。

```java
1、org.springframework.web.SpringServletContainerInitializer#onStartup：入口
2、org.springframework.web.servlet.support.AbstractDispatcherServletInitializer#onStartup
3、org.springframework.web.context.AbstractContextLoaderInitializer#onStartup
4、org.springframework.web.context.AbstractContextLoaderInitializer#registerContextLoaderListener：创建父容器
5、org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#createRootApplicationContext
6、org.springframework.web.servlet.support.AbstractDispatcherServletInitializer#registerDispatcherServlet
7、org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#createServletApplicationContext：创建springmvc容器 & 注册DispatcherServlet
8、org.springframework.web.context.ContextLoaderListener#contextInitialized
9、org.springframework.web.context.ContextLoader#initWebApplicationContext
10、org.springframework.web.context.ContextLoader#configureAndRefreshWebApplicationContext：启动父容器
11、org.springframework.web.servlet.HttpServletBean#init
12、org.springframework.web.servlet.FrameworkServlet#initServletBean
13、org.springframework.web.servlet.FrameworkServlet#initWebApplicationContext：初始化springmvc容器&启动springmvc容器
14、org.springframework.web.servlet.FrameworkServlet#configureAndRefreshWebApplicationContext：启动springmvc容器
15、org.springframework.web.servlet.FrameworkServlet.ContextRefreshListener#onApplicationEvent
16、org.springframework.web.servlet.DispatcherServlet#onRefresh
17、org.springframework.web.servlet.DispatcherServlet#initStrategies：组装Dispathcer中各种springmvc组件
```
