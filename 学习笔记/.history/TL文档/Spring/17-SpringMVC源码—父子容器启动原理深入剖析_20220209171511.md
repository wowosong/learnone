

# 有道云笔记

有道云链接：http://note.youdao.com/noteshare?id=a9ea60905defbf27166e0baf8f5840de&sub=C4A9D5873E364EAB9C6C2E8DDF41CF16

1、Spring整合SpringMVC

2、零配置SpringMVC实现方式：

3、实现基于SPI规范的SpringMVC

4、SPI的方式SpringMVC启动原理

流程图：

源码流程

创建父容器——ContextLoaderListener

创建子容器——DispatcherServlet

4. 初始化ContextLoaderListener

5\. 初始化DispatcherServlet

总结

用几道面试题做个总结:

1、Spring整合SpringMVC

特性：

说到Spring整合SpringMVC唯一的体现就是父子容器：

*   通常我们会设置父容器（Spring）管理Service、Dao层的Bean, 子容器(SpringMVC)管理Controller的Bean .

*   子容器可以访问父容器的Bean, 父容器无法访问子容器的Bean。

实现：

相信大家在SSM框架整合的时候都曾在web.xml配置过这段：

```xml
   <!--spring 基于web应用的启动-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <!--全局参数：spring配置文件-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-core.xml</param-value>
    </context-param>
    <!--前端调度器servlet-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--设置配置文件的路径-->
        <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-mvc.xml</param-value>
    </init-param>
        <!--设置启动即加载-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
```

但是它的作用是什么知道吗？

有人可能只知道DispatcherServlet叫前端控制器，是SpringMVC处理前端请求的一个核心调度器

那它为什么能处理请求？处理之前做了什么准备工作呢？又是怎么和Spring结合起来的呢？

为什么有了DispatcherServlet还要个ContextLoaderListener， 配一个不行吗？干嘛要配俩啊？

看完本文你就会有答案！

还有人可能会觉得， 我现在都用SpringBoot开发， 哪还要配这玩意.......

这就是典型的SpringBoot使用后遗症，SpringBoot降低了使用难度，但是从某种程度来说，也让初级的程序员变得更加小白，把实现原理都隐藏起来了而我们只管用，一旦涉及扩展就束手无策。

那当然我们今天不讲SpringBoot,我们今天用贴近SpringBoot的方式来讲SpringMVC。

也就是零配置（零xml）的放式来说明SpringMVC的原理！！

此方式作为我们本文重点介绍，也是很多人缺失的一种方式， 其实早在Spring3+就已经提供， 只不过我们直到SpringBoot才使用该方式进行自动配置， 这也是很多人从xml调到SpringBoot不适应的原因， 因为你缺失了这个版本。 所以我们以这种方式作为源码切入点既可以理解到XML的方式又能兼顾到SpringBoot的方式 。

2、零配置SpringMVC实现方式：

那没有配置就需要省略掉web.xml 怎么省略呢？

在Servlet3.0提供的规范文档中可以找到2种方式：

1.  注解的方式

1.  @WebServlet

2.  @WebFilter

3.  @WebListener

但是这种方式不利于扩展， 并且如果编写在jar包中tomcat是无法感知到的。

2.  SPI的方式

在Serlvet3-1的规范手册中：就提供了一种更加易于扩展可用于共享库可插拔的一种方式，参见8.2.4：

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190925217.png)

也就是让你在应用META-INF/services 路径下 放一个 javax.servlet.ServletContainerInitailizer ——即SPI规范

啥？？ 啥是SPI??

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190925093.png)

SPI 我们叫他服务接口扩展,(Service Provider Interface) 直译服务提供商接口， 不要被这个名字唬到了， 其实很好理解的一个东西：

其实就是根据Servlet厂商（服务提供商）提供要求的一个接口， 在固定的目录（META-INF/services）放上以接口全类名 为命名的文件， 文件中放入接口的实现的全类名，该类由我们自己实现，按照这种约定的方式（即SPI规范），服务提供商会调用文件中实现类的方法， 从而完成扩展。

﻿[SPI演示案例](https://github.com/xulisha123/sample_code/tree/main/spi-parent)：

假设我们自己是服务提供商： 现在要求的一个接口 IUserDao

1.在固定的目录放上接口的文件名

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190925658.png)

2.文件中放入实现类（该实现类由你实现）：

一行一个实现类。

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190926642.png)

3.通过java.util.ServiceLoader提供的ServiceLoader就可以完成SPI的实现类加载

```java
public class App {

    public static void main(String[] args) {

        ServiceLoader<IUserDao> daos = ServiceLoader.load(IUserDao.class);
        for (IUserDao dao : daos) {
            dao.save();
        }
    }
```

ok 那我们知道了SPI是什么，我们是不是可以在Web应用中，在Servlet的SPI放入对应的接口文件：

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190926921.png)

放入实现类：

![img](https://gitee.com/wowosong/pic-md/raw/master/202202091656589.png)

通过ServletContext就可以动态注册三大组件：以Servlet注册为例：

```java
    public class TulingSpringServletContainerInitializer extends SpringServletContainerInitializer {

        @Override

        public void onStartup(Set<Class<?>> webAppInitializerClasses, ServletContext servletContext) throws ServletException {

            // 通过servletContext动态添加Servlet

            servletContext.addServlet("spiServlet", new HttpServlet() {

                @Override

                protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

                    resp.getWriter().write("spiServlet--doGet");

                }

            }).addMapping("/spiServlet.do");

        }

```

当然在SpringMVC中， 这个接口文件和实现类都把我们实现好了，甚至ContextLoaderListener和DispatcherServlet都帮我们注册好了，我们只要让他生效，来，看看他是怎么做的：

![img](https://gitee.com/wowosong/pic-md/raw/master/202202091656178.png)

3、实现基于SPI规范的SpringMVC

TulingStarterInitializer

*   此类继承AbstractAnnotationConfigDispatcherServletInitializer 这是个啥？ 待会我们讲原理来介绍

*   getRootConfigClasses 提供父容器的配置类

*   getServletConfigClasses 提供子容器的配置类

*   getServletMappings 设置DispatcherServlet的映射

    ```java
        public  class TulingStarterInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
           /**
            * 方法实现说明:IOC 父容器的启动类
            * @author:xsls
            * @date:2019/7/31 22:12
          */
           @Override
           protected Class<?>[] getRootConfigClasses() {
              return new Class[]{RootConfig.class};
           }
           /**
            * 方法实现说明 IOC子容器配置 web容器配置
            * @author:xsls
            * @date:2019/7/31 22:12
            */
           @Override
           protected Class<?>[] getServletConfigClasses() {
              return new Class[]{WebAppConfig.class};
           }
           /**
            * 方法实现说明
            * @author:xsls
            * @return: 我们前端控制器DispatcherServlet的拦截路径
            * @exception:
            * @date:2019/7/31 22:16
            */
           @Override
           protected String[] getServletMappings() {
              return new String[]{"/"};
             }
        }
    ```

    RootConfig

*   父容器的配置类 =以前的spring.xml

*   扫描的包排除掉@Controller

    ```java
    
        @Configuration
        @ComponentScan(basePackages = "com.tuling",excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ANNOTATION,value={RestController.class,Controller.class}),
    		@ComponentScan.Filter(type = ASSIGNABLE_TYPE,value =WebAppConfig.class ),
        })
       public class RootConfig {
    }
    
    ```

    WebAppConfig

*   子容器的配置类 =以前的spring-mvc.xml

*   扫描的包：包含掉@Controller

    ```java
    @Configuration
    @ComponentScan(basePackages = {"com.tuling"},includeFilters = {
    @ComponentScan.Filter(type = FilterType.ANNOTATION,value = {RestController.class, Controller.class})},useDefaultFilters =false)
    @EnableWebMvc   // ≈<mvc:annotation-driven/>
        public class WebAppConfig implements WebMvcConfigurer{
           /**
            * 配置拦截器
            * @return
            */
           @Bean
           public TulingInterceptor tulingInterceptor() {
              return new TulingInterceptor();
           }
           /**
            * 文件上传下载的组件
            * @return
            */
           @Bean
           public MultipartResolver multipartResolver() {
              CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
              multipartResolver.setDefaultEncoding("UTF-8");
              multipartResolver.setMaxUploadSize(1024*1024*10);
             return multipartResolver;
           }
           /**
            * 注册处理国际化资源的组件
            * @return
            */
        		/*
       		 @Bean
           public AcceptHeaderLocaleResolver localeResolver() {
              AcceptHeaderLocaleResolver acceptHeaderLocaleResolver = new AcceptHeaderLocaleResolver();
              return acceptHeaderLocaleResolver;
           }*/
          @Override
           public void addInterceptors(InterceptorRegistry registry) {
              registry.addInterceptor(tulingInterceptor()).addPathPatterns("/*");
           }
           /**
            * 方法实现说明:配置试图解析器
            * @author:xsls
            * @exception:
            * @date:2019/8/6 16:23
            */
           @Bean
           public InternalResourceViewResolver internalResourceViewResolver() {
              InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
              viewResolver.setSuffix(".jsp");
              viewResolver.setPrefix("/WEB-INF/jsp/");
              return viewResolver;
           }
           @Override
           public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
              converters.add(new MappingJackson2HttpMessageConverter());
           }
    ```

    自己去添加个Controller进行测试

OK， 现在可以访问你的SpringMVC了

4、SPI的方式SpringMVC启动原理

接着我们来看看SPI方式的原理是什么：

SpringMVC 大致可以分为 启动 和请求 2大部分， 所以我们本文先研究启动部分

流程图：

![202202091656979](https://gitee.com/wowosong/pic-md/raw/master/202202091713344.png)

源码流程

1.  外置Tomcat启动的时候通过SPI 找到我们应用中的/META-INF/service/javax.servlet.ServletContainerInitializer

<img src="https://gitee.com/wowosong/pic-md/raw/master/202201190927381.png" alt="img" style="zoom:50%;" />

2.  调用SpringServletContainerInitializer.onStartUp()

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190927826.png)

1.  调用onStartUp()前会先找到@HandlesTypes(WebApplicationInitializer.class) 所有实现了WebApplicationInitializer的类，传入到OnStartup的webAppInitializerClasses参数中，并传入Servlet上下文对象。

2.  重点关注这组类：他们组成了父子容器

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190927986.png)

3.  找到所有WebApplicationInitializer的实现类后， 不是接口、不是抽象则通过反射进行实例化（所以，你会发现内部实现类都是抽象的，你想让其起作用我们必须添加一个自定义实现类，在下文提供我的自定义实现类）

4.  调用所有上一步实例化后的对象的onStartup方法

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190927772.png)

![202201190928727](https://gitee.com/wowosong/pic-md/raw/master/202202091700757.png)

1\. 首先来到AbstractDispatcherServletInitializer#onStartup再执行super.onStartup(servletContext);

```java
   @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
       //实例化我们的spring root上下文
       super.onStartup(servletContext);
       //注册我们的DispatcherServlet   创建我们spring web 上下文对象
       registerDispatcherServlet(servletContext);
```

创建父容器——ContextLoaderListener

2.父类AbstractContextLoaderInitializer#onStartup执行registerContextLoaderListener(servletContext);

1.  createRootApplicationContext()该方法中会创建父容器

1.  该方法是抽象方法，实现类是AbstractAnnotationConfigDispatcherServletInitializer

1.  调用getRootConfigClasses();方法获取父容器配置类（此抽象方法在我们自定义的子类中实现提供我们自定义的映射路径 ）

2.  创建父容器，注册配置类

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928839.png)

2.  会创建ContextLoaderListener并通过ServletContext注册

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928266.png)

看完大家是不是感觉跟我们XML的配置ContextLoaderListener对上了：

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928003.png)

创建子容器——DispatcherServlet

3.回到AbstractDispatcherServletInitializer#onStartup再执行registerDispatcherServlet(servletContext);

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928067.png)

registerDispatcherServlet方法说明：

1.  调用createServletApplicationContext创建子容器

1.  该方法是抽象方法，实现类是AbstractAnnotationConfigDispatcherServletInitializer

1.  创建子容器（下图很明显不多介绍）

2.  调用抽象方法：getServletConfigClasses();获得配置类（此抽象方法在我们自定义的子类中实现提供我们自定义的配置类 ）

3.  配置类除了可以通过ApplicationContext()构造函数的方式传入 ， 也可以通过这种方式动态添加，不知道了吧~

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928602.png)

2.  调用createDispatcherServlet(servletAppContext);创建DispatcherServlet

3.  设置启动时加载：registration.setLoadOnStartup(1);

4.  调用抽象方法设置映射路径：getServletMappings()（此抽象方法在我们自定义的子类中实现提供我们自定义的映射路径 ）

看完大家是不是感觉跟我们XML的配置DispatcherServlet对上了

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928937.png)

4. 初始化ContextLoaderListener

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928452.png)

ContextLoaderListener加载过程比较简单：

外置tomcat会帮我们调用ContextLoaderListener#contextInitialized 进行初始化

1.  xml的方式下会判断容器为空时创建父容器

2.  在里面会调用父容器的refresh方法加载

3.  将父容器存入到Servlet域中供子容器使用

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190928659.png)

5\. 初始化DispatcherServlet

![202201190928855](https://gitee.com/wowosong/pic-md/raw/master/202202091703820.png)

可以看到流程比ContextLoaderListener流程更多

外置tomcat会帮我们调用DispatcherServlet#init()   进行初始化--->重点关注：initWebApplicationContext方法

1.  getWebApplicationContext(getServletContext())获得父容器（从之前的Servlet域中拿到）

2.  cwac.setParent(rootContext);给子容器设置父容器

3.  调用configureAndRefreshWebApplicationContext(cwac);

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929158.png)

1.  注册一个监听器（该监听会初始化springmvc所需信息）

1.  ContextRefreshedEvent可以看到该监听器监听的是容器refreshed事件， 会在finishRefresh中发布

2.  刷新容器

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929017.png)

当执行refresh 即加载ioc容器 完了会调用finishRefresh():

1.  publishEvent(new ContextRefreshedEvent(this));发布ContextRefreshedEvent事件

2.  触发上面的ContextRefreshListener监听器：

```java
---->FrameworkServlet.this.onApplicationEvent(event);
-------->onRefresh(event.getApplicationContext());
-------------->initStrategies(context);
    protected void initStrategies(ApplicationContext context) {
       //初始化我们web上下文对象的 用于文件上传下载的解析器对象
       initMultipartResolver(context);
       //初始化我们web上下文对象用于处理国际化资源的
       initLocaleResolver(context);
       //主题解析器对象初始化
       initThemeResolver(context);
       //初始化我们的HandlerMapping
       initHandlerMappings(context);
       //实例化我们的HandlerAdapters
       initHandlerAdapters(context);
       //实例化我们处理器异常解析器对象
       initHandlerExceptionResolvers(context);
       initRequestToViewNameTranslator(context);
       //给DispatcherSerlvet的ViewResolvers处理器
       initViewResolvers(context);
       initFlashMapManager(context);

```

这里面的每一个方法不用太细看， 就是给SpringMVC准备初始化的数据， 为后续SpringMVC处理请求做准备

基本都是从容器中拿到已经配置的Bean（RequestMappingHandlerMapping、RequestMappingHandlerAdapter、HandlerExceptionResolver ）放到dispatcherServlet中做准备:

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929398.png)

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929203.png)

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929274.png)

...

但是这些Bean又是从哪来的呢？？ 来来来， 回到我们的WebAppConfig

我们使用的一个@EnableWebMvc

1.  导入了DelegatingWebMvcConfiguration@Import(DelegatingWebMvcConfiguration.class)

2.  DelegatingWebMvcConfiguration的父类就配置了这些Bean

3.  而且我告诉你SpringBoot也是用的这种方式，

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929394.png)

总结

1.  Tomcat在启动时会通过SPI注册 ContextLoaderListener和DispatcherServlet对象

1.  同时创建父子容器

1.  分别创建在ContextLoaderListener初始化时创建父容器设置配置类

2.  在DispatcherServlet初始化时创建子容器 即2个ApplicationContext实例设置配置类

2.  Tomcat在启动时执行ContextLoaderListener和DispatcherServlet对象的初始化方法， 执行容器refresh进行加载

3.  在子容器加载时 创建SpringMVC所需的Bean和预准备的数据：(通过配置类+@EnableWebMvc配置（DelegatingWebMvcConfiguration）——可实现WebMvcConfigurer进行定制扩展）

1.  RequestMappingHandlerMapping，它会处理@RequestMapping 注解

2.  RequestMappingHandlerAdapter，则是处理请求的适配器，确定调用哪个类的哪个方法，并且构造方法参数，返回值。

3.  HandlerExceptionResolver 错误视图解析器

4.  addDefaultHttpMessageConverters 添加默认的消息转换器（解析json、解析xml）

5.  等....

12.  子容器需要注入父容器的Bean时（比如Controller中需要@Autowired Service的Bean）; 会先从子容器中找，没找到会去父容器中找： 详情见AbstractBeanFactory#doGetBean方法

     ```java
      /** 
          * 一般情况下,只有Spring 和SpringMvc整合的时才会有父子容器的概念, 
          * 作用：
          * 比如我们的Controller中注入Service的时候，发现我们依赖的是一个引用对象，那么他就会调用getBean去把service找出来
          * 但是当前所在的容器是web子容器，那么就会在这里的 先去父容器找
          */
         BeanFactory parentBeanFactory = getParentBeanFactory();
         //若存在父工厂,且当前的bean工厂不存在当前的bean定义,那么bean定义是存在于父beanFacotry中
         if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {
            //获取bean的原始名称
            String nameToLookup = originalBeanName(name);
            //若为 AbstractBeanFactory 类型，委托父类处理
            if (parentBeanFactory instanceof AbstractBeanFactory) {
               return ((AbstractBeanFactory) parentBeanFactory).doGetBean(
                     nameToLookup, requiredType, args, typeCheckOnly);
            }
            else if (args != null) {
              //  委托给构造函数 getBean() 处理
               return (T) parentBeanFactory.getBean(nameToLookup, args);
            }
            else {
               // 没有 args，委托给标准的 getBean() 处理
               return parentBeanFactory.getBean(nameToLookup, requiredType);
            }
     
     ```

     用几道面试题做个总结:

Spring和SpringMVC为什么需要父子容器？不要不行吗？

就实现层面来说不用子父容器也可以完成所需功能（参考：SpringBoot就没用子父容器）

1.  所以父子容器的主要作用应该是早期Spring为了划分框架边界。有点单一职责的味道。service、dao层我们一般使用spring框架来管理、controller层交给springmvc管理

2.  规范整体架构 使 父容器service无法访问子容器controller、子容器controller可以访问父容器 service

3.  方便子容器的切换。如果现在我们想把web层从spring mvc替换成struts，那么只需要将spring-mvc.xml替换成Struts的配置文件struts.xml即可，而spring-core.xml不需要改变。

4.  为了节省重复bean创建

是否可以把所有Bean都通过Spring容器来管理？（Spring的applicationContext.xml中配置全局扫描)

不可以，这样会导致我们请求接口的时候产生404。 如果所有的Bean都交给父容器，SpringMVC在初始化HandlerMethods的时候（initHandlerMethods）无法根据Controller的handler方法注册HandlerMethod，并没有去查找父容器的bean；

也就无法根据请求URI 获取到 HandlerMethod来进行匹配.

![img](https://gitee.com/wowosong/pic-md/raw/master/202201190929363.png)

是否可以把我们所需的Bean都放入Spring-mvc子容器里面来管理（springmvc的spring-servlet.xml中配置全局扫描）?

可以 ， 因为父容器的体现无非是为了获取子容器不包含的bean,  如果全部包含在子容器完全用不到父容器了，  所以是可以全部放在springmvc子容器来管理的。

虽然可以这么做不过一般应该是不推荐这么去做的，一般人也不会这么干的。如果你的项目里有用到事物、或者aop记得也需要把这部分配置需要放到Spring-mvc子容器的配置文件来，不然一部分内容在子容器和一部分内容在父容器,可能就会导致你的事物或者AOP不生效。 所以如果aop或事物如果不生效也有可能是通过父容器(spring)去增强子容器(Springmvc)，也就无法增强 这也是很多同学会遇到的问题。
