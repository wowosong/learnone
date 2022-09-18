SpringMVC —请求源码流程

有道云链接：http://note.youdao.com/noteshare?id=ec3ca523300ad31d7f6f673b9e92bbeb&sub=1D1BF1D55D0148879F53878CB24F8214

SpringMVC —请求源码流程

前言

从Servlet到SpringMVC

传统Servlet：

SpringMVC

SpringMVC的具体执行流程：

HandlerMapping

# 前言

Spring官网的MVC模块介绍：

```
Spring Web MVC is the original web framework built on the Servlet API and has been included in the Spring Framework from the very beginning. The formal name, “Spring Web MVC,” comes from the name of its source module (spring-webmvc), but it is more commonly known as “Spring MVC”.
```

Spring Web MVC是基于Servlet API构建的原始Web框架，从一开始就已包含在Spring框架中。正式名称“ Spring Web MVC”来自其源模块的名称（spring-web mvc），但它通常被称为“ Spring MVC”。

# 从Servlet到SpringMVC

最典型的MVC就是JSP + servlet + javabean的模式。

## 传统Servlet：

![](./16-SpringMVC%E2%80%94%E8%AF%B7%E6%B1%82%E6%BA%90%E7%A0%81%E6%B5%81%E7%A8%8B1.assets/20220118221531.png)

弊端：

1.xml下配置servlet的映射非常麻烦 开发效率低

2.必须要继承父类、重写方法 侵入性强

2.如果想在一个Servlet中处理同一业务模块的的功能分发给不同方法进行处理非常麻烦

3.参数解析麻烦:单个参数（转换类型）--->pojo对象 Json文本--->pojo对象

4.数据响应麻烦:pojo对象--->json ... Content-type

5.跳转页面麻烦, 对path的控制、 如果使用其他模板也很麻烦 、设置编码麻烦...等等...

所以SpringMVC 就是在Servlet的基础上进行了封装，帮我把这些麻烦事都给我们做了。

Web框架的升级是一个不断偷懒的过程

**从最开始的Servlet到现在的SpringMVC、SpringBoot等等**

## SpringMVC

基于xml的实现方式：

1.给Servlet容器配置一个DispatcherServlet（web.xml )

2.添加SpringMVC的配置信息

*   继承类/实现接口方式：

```xml
implements HttpRequestHandler 
不同的HandlerMapping
<!--通过设置属性的方式去设置映射路径-->
<bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
<property name="mappings">
    <props>
        <prop key="httpRequest">simpleController</prop>
    </props>
</property>
<!--BeanNameUrlHandlerMapping 一定要为Controller设置一个有效映射地址的名字  如@Controller("/xxxx")-->
```
*   注解方式：

配置控制器@Controller和处理方法的映射—@RequstMapping 即可

其实SpringMVC请求原理很简单：说白了就是用一个DispatcherServlet 封装了一个Servlet的调度中心， 由调度中心帮我们调用我们的处理方法：

在这个过程中调度中心委托给各个组件执行具体工作 ，比如帮我们**映射方法请求、帮我解析参数、调用处理方法、响应数据和页面** 等

这就相当于你在家自己做饭和去饭店吃饭的区别了， 在家你买菜、洗菜、蒸饭、炒菜、洗碗都得自己来.

饭店都给你做好了， 你只要分服务员说你吃什么、就能得到响应. 殊不知呢， 你只是说了吃什么（请求）， 后厨（DispatcherServlet）就有配菜员你给找到菜单-对应的食材（映射） 、切菜员切菜（解析参数）、 厨师给你炒菜（调用处理方法）、装盘（处理返回值)、 炒完给你端出来（响应）

# SpringMVC的具体执行流程：

Spring MVC 是围绕前端控制器模式设计的，其中：中央 Servlet DispatcherServlet 为请求处理流程提供统一调度，实际工作则交给可配置组件执行。这个模型是灵活的且开放的，我们可以通过自己去定制这些组件从而进行定制自己的工作流。

![img](./16-SpringMVC%E2%80%94%E8%AF%B7%E6%B1%82%E6%BA%90%E7%A0%81%E6%B5%81%E7%A8%8B1.assets/20220118221548.png)

DispatcherServlet： 前端调度器 ， 负责将请求拦截下来**分发到各控制器**方法中

HandlerMapping: 负责根据请求的URL和配置@RequestMapping映射去匹配， 匹配到会返回Handler（具体控制器的方法）

HandlerAdaper: 负责调用Handler-具体的方法- 返回视图的名字 Handler将它封装到ModelAndView(封装视图名，request域的数据）

ViewReslover: 根据ModelAndView里面的视图名地址去找到具体的jsp封装在View对象中

View：进行视图渲染（将jsp转换成html内容 --这是Servlet容器的事情了） 最终response到的客户端

1.  用户发送请求至前端控制器DispatcherServlet

2.  DispatcherServlet收到请求调用处理器映射器HandlerMapping。

1.  处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。

3.  DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter，执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作

4.  执行处理器Handler(Controller，也叫页面控制器)。

1.  Handler执行完成返回ModelAndView

2.  HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet

5.  DispatcherServlet将ModelAndView传给ViewReslover视图解析器

1.  ViewReslover解析后返回具体View

6.  DispatcherServlet对View进行渲染视图（即将模型数据model填充至视图中）。

7.  DispatcherServlet响应用户。

整个调用过程其实都在doDispatch中体现了：

1.  用户发送请求至前端控制器DispatcherServlet

*   由于它是个Servlet会先进入service方法——>doGet/doPost——>processRequest——>doService——>doDispatch ↓

*   这个doDispatch非常重要--体现了整个请求流程

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
   try {
      try {
          // 文件上传相关
         processedRequest = checkMultipart(request);
         multipartRequestParsed = (processedRequest != request);
        // DispatcherServlet收到请求调用处理器映射器HandlerMapping。
        // 处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。
         mappedHandler = getHandler(processedRequest);
         if (mappedHandler == null) {
            noHandlerFound(processedRequest, response);
            return;
         }

         4.DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter,
         HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
         // Process last-modified header, if supported by the handler.  HTTP缓存相关
         String method = request.getMethod();
         boolean isGet = HttpMethod.GET.matches(method);
         if (isGet || HttpMethod.HEAD.matches(method)) {
            long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
            if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
               return;
            }
         }
         // 前置拦截器
         if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            // 返回false就不进行后续处理了
            return;
         }
         // 执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作
         // 执行处理器Handler(Controller，也叫页面控制器)。
         // Handler执行完成返回ModelAndView
         // HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet
         mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
         if (asyncManager.isConcurrentHandlingStarted()) {
           return;
         }
         // 如果没有视图，给你设置默认视图  json忽略
         applyDefaultViewName(processedRequest, mv);
         //后置拦截器
         mappedHandler.applyPostHandle(processedRequest, response, mv);
      }
      catch (Exception ex) {
         dispatchException = ex;
      }
      catch (Throwable err) {
         // As of 4.3, we're processing Errors thrown from handler methods as well,
         // making them available for @ExceptionHandler methods and other scenarios.

         dispatchException = new NestedServletException("Handler dispatch failed", err);
      }
      // DispatcherServlet将ModelAndView传给ViewReslover视图解析器
      // ViewReslover解析后返回具体View
      // DispatcherServlet对View进行渲染视图（即将模型数据model填充至视图中）。
      // DispatcherServlet响应用户。
      processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
   }
   catch (Exception ex) {
      triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
   }
   catch (Throwable err) {
      triggerAfterCompletion(processedRequest, response, mappedHandler,
            new NestedServletException("Handler processing failed", err));
   }
   finally {
      if (asyncManager.isConcurrentHandlingStarted()) {
         // Instead of postHandle and afterCompletion
         if (mappedHandler != null) {            mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
         }
      }
      else {
         // Clean up any resources used by a multipart request.
         if (multipartRequestParsed) {
            cleanupMultipart(processedRequest);
         }
      }
   }
```
详细过程我们课程中分析....

## HandlerMapping

在整个过程中，涉及到非常多的组件，每个组件解析各个环节，其中HandlerMapping最为重要它是用来映射请求的，我们就着重介绍下HandlerMapping的解析过程和请求映射过程：

附上流程图：

﻿[https://www.processon.com/view/link/615ea79e1efad4070b2d6707](https://www.processon.com/view/link/615ea79e1efad4070b2d6707)﻿

![1642514121-9ee0a878b6d3c6cf168ff88d4142fabe](./16-SpringMVC%E2%80%94%E8%AF%B7%E6%B1%82%E6%BA%90%E7%A0%81%E6%B5%81%E7%A8%8B1.assets/202202091655566.png)

