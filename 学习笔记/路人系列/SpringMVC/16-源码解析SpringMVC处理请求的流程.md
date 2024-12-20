

# 源码解析SpringMVC处理请求的流程

[上一篇：全注解的方式 & 原理解析](http://www.itsoku.com/course/6/152)

[下一篇：源码解析SpringMVC容器的启动过程](http://www.itsoku.com/course/6/154)

本文将通过阅读源码的方式带大家了解springmvc处理请求的完整流程，干货满满。

## 目录

*   [目录](#%E7%9B%AE%E5%BD%95)
*   [1、先了解下SpringMVC常用的10组件](#1%E3%80%81%E5%85%88%E4%BA%86%E8%A7%A3%E4%B8%8BSpringMVC%E5%B8%B8%E7%94%A8%E7%9A%8410%E7%BB%84%E4%BB%B6)
    *   [1.1、DispatcherServlet：前端控制器](#1.1%E3%80%81DispatcherServlet%EF%BC%9A%E5%89%8D%E7%AB%AF%E6%8E%A7%E5%88%B6%E5%99%A8)
    *   [1.2、HandlerMapping：处理器映射器](#1.2%E3%80%81HandlerMapping%EF%BC%9A%E5%A4%84%E7%90%86%E5%99%A8%E6%98%A0%E5%B0%84%E5%99%A8)
    *   [1.3、HandlerExecutionChain：处理器执行链](#1.3%E3%80%81HandlerExecutionChain%EF%BC%9A%E5%A4%84%E7%90%86%E5%99%A8%E6%89%A7%E8%A1%8C%E9%93%BE)
    *   [1.4、handler：处理器](#1.4%E3%80%81handler%EF%BC%9A%E5%A4%84%E7%90%86%E5%99%A8)
    *   [1.5、HandlerAdapter：处理器适配器](#1.5%E3%80%81HandlerAdapter%EF%BC%9A%E5%A4%84%E7%90%86%E5%99%A8%E9%80%82%E9%85%8D%E5%99%A8)
    *   [1.6、ModelAndView：模型和视图](#1.6%E3%80%81ModelAndView%EF%BC%9A%E6%A8%A1%E5%9E%8B%E5%92%8C%E8%A7%86%E5%9B%BE)
    *   [1.7、ViewResolver：视图解析器](#1.7%E3%80%81ViewResolver%EF%BC%9A%E8%A7%86%E5%9B%BE%E8%A7%A3%E6%9E%90%E5%99%A8)
    *   [1.8、View：视图](#1.8%E3%80%81View%EF%BC%9A%E8%A7%86%E5%9B%BE)
    *   [1.9、HandlerExceptionResolver：处理器异常解析器](#1.9%E3%80%81HandlerExceptionResolver%EF%BC%9A%E5%A4%84%E7%90%86%E5%99%A8%E5%BC%82%E5%B8%B8%E8%A7%A3%E6%9E%90%E5%99%A8)
    *   [1.10、HttpMessageConverter：http报文转换器](#1.10%E3%80%81HttpMessageConverter%EF%BC%9Ahttp%E6%8A%A5%E6%96%87%E8%BD%AC%E6%8D%A2%E5%99%A8)
*   [2、处理流程：源码解析](#2%E3%80%81%E5%A4%84%E7%90%86%E6%B5%81%E7%A8%8B%EF%BC%9A%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90)
    *   [2.1、请求到达入口：doDispatch](#2.1%E3%80%81%E8%AF%B7%E6%B1%82%E5%88%B0%E8%BE%BE%E5%85%A5%E5%8F%A3%EF%BC%9AdoDispatch)
    *   [2.2、①：解析multipart类型的请求](#2.2%E3%80%81%E2%91%A0%EF%BC%9A%E8%A7%A3%E6%9E%90multipart%E7%B1%BB%E5%9E%8B%E7%9A%84%E8%AF%B7%E6%B1%82)
    *   [2.3、②：根据请求获取HandlerExecutionChain对象](#2.3%E3%80%81%E2%91%A1%EF%BC%9A%E6%A0%B9%E6%8D%AE%E8%AF%B7%E6%B1%82%E8%8E%B7%E5%8F%96HandlerExecutionChain%E5%AF%B9%E8%B1%A1)
    *   [2.4、③：根据处理器获取HandlerAdapter](#2.4%E3%80%81%E2%91%A2%EF%BC%9A%E6%A0%B9%E6%8D%AE%E5%A4%84%E7%90%86%E5%99%A8%E8%8E%B7%E5%8F%96HandlerAdapter)
    *   [2.5、④：调用拦截器的preHandle方法](#2.5%E3%80%81%E2%91%A3%EF%BC%9A%E8%B0%83%E7%94%A8%E6%8B%A6%E6%88%AA%E5%99%A8%E7%9A%84preHandle%E6%96%B9%E6%B3%95)
    *   [2.6、⑤：调用handler实际处理请求，获取ModelAndView对象](#2.6%E3%80%81%E2%91%A4%EF%BC%9A%E8%B0%83%E7%94%A8handler%E5%AE%9E%E9%99%85%E5%A4%84%E7%90%86%E8%AF%B7%E6%B1%82%EF%BC%8C%E8%8E%B7%E5%8F%96ModelAndView%E5%AF%B9%E8%B1%A1)
        *   [2.6.1、过程](#2.6.1%E3%80%81%E8%BF%87%E7%A8%8B)
        *   [2.6.2、step1：组装目标方法需要的参数：HandlerMethodArgumentResolver](#2.6.2%E3%80%81step1%EF%BC%9A%E7%BB%84%E8%A3%85%E7%9B%AE%E6%A0%87%E6%96%B9%E6%B3%95%E9%9C%80%E8%A6%81%E7%9A%84%E5%8F%82%E6%95%B0%EF%BC%9AHandlerMethodArgumentResolver)
        *   [2.6.3、step2：通过反射调用目标方法](#2.6.3%E3%80%81step2%EF%BC%9A%E9%80%9A%E8%BF%87%E5%8F%8D%E5%B0%84%E8%B0%83%E7%94%A8%E7%9B%AE%E6%A0%87%E6%96%B9%E6%B3%95)
        *   [2.6.4、step3：处理方法返回值：HandlerMethodReturnValueHandler](#2.6.4%E3%80%81step3%EF%BC%9A%E5%A4%84%E7%90%86%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%9AHandlerMethodReturnValueHandler)
    *   [2.7、⑥：调用拦截器的postHandle方法](#2.7%E3%80%81%E2%91%A5%EF%BC%9A%E8%B0%83%E7%94%A8%E6%8B%A6%E6%88%AA%E5%99%A8%E7%9A%84postHandle%E6%96%B9%E6%B3%95)
    *   [2.8、⑦：渲染视图](#2.8%E3%80%81%E2%91%A6%EF%BC%9A%E6%B8%B2%E6%9F%93%E8%A7%86%E5%9B%BE)
        *   [2.8.1、过程](#2.8.1%E3%80%81%E8%BF%87%E7%A8%8B)
        *   [2.8.2、step1：⑦-1：如果有异常，进行全局异常处理](#2.8.2%E3%80%81step1%EF%BC%9A%E2%91%A6-1%EF%BC%9A%E5%A6%82%E6%9E%9C%E6%9C%89%E5%BC%82%E5%B8%B8%EF%BC%8C%E8%BF%9B%E8%A1%8C%E5%85%A8%E5%B1%80%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86)
        *   [2.8.3、step2：⑦-2：渲染视图](#2.8.3%E3%80%81step2%EF%BC%9A%E2%91%A6-2%EF%BC%9A%E6%B8%B2%E6%9F%93%E8%A7%86%E5%9B%BE)
            *   [⑦-2-1：调用视图解析器解析视图名称得到视图View对象](#%E2%91%A6-2-1%EF%BC%9A%E8%B0%83%E7%94%A8%E8%A7%86%E5%9B%BE%E8%A7%A3%E6%9E%90%E5%99%A8%E8%A7%A3%E6%9E%90%E8%A7%86%E5%9B%BE%E5%90%8D%E7%A7%B0%E5%BE%97%E5%88%B0%E8%A7%86%E5%9B%BEView%E5%AF%B9%E8%B1%A1)
            *   [⑦-2-2：调用视图的render方法渲染视图，将结果输出到客户端](#%E2%91%A6-2-2%EF%BC%9A%E8%B0%83%E7%94%A8%E8%A7%86%E5%9B%BE%E7%9A%84render%E6%96%B9%E6%B3%95%E6%B8%B2%E6%9F%93%E8%A7%86%E5%9B%BE%EF%BC%8C%E5%B0%86%E7%BB%93%E6%9E%9C%E8%BE%93%E5%87%BA%E5%88%B0%E5%AE%A2%E6%88%B7%E7%AB%AF)
        *   [2.8.3、step3：⑦-3：调用拦截器的afterCompletion方法](#2.8.3%E3%80%81step3%EF%BC%9A%E2%91%A6-3%EF%BC%9A%E8%B0%83%E7%94%A8%E6%8B%A6%E6%88%AA%E5%99%A8%E7%9A%84afterCompletion%E6%96%B9%E6%B3%95)
*   [3、处理流程：纯文字描述](#3%E3%80%81%E5%A4%84%E7%90%86%E6%B5%81%E7%A8%8B%EF%BC%9A%E7%BA%AF%E6%96%87%E5%AD%97%E6%8F%8F%E8%BF%B0)
*   [4、小结](#4%E3%80%81%E5%B0%8F%E7%BB%93)
*   [5、案例代码](#5%E3%80%81%E6%A1%88%E4%BE%8B%E4%BB%A3%E7%A0%81)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 1、先了解下SpringMVC常用的10组件

### 1.1、DispatcherServlet：前端控制器

这个大家是最熟悉的，是一个servlet，是springmvc处理请求的入口，不需要咱们开发，由框架提供。

作用：统一处理请求和响应，整个流程控制的中心，由它来调用其他组件处理用户的请求。

### 1.2、HandlerMapping：处理器映射器

作用：根据请求的信息（如url、method、header等）查找请求处理器，即找到自定义的controller中处理请求的方法。

HandlerMapping接口源码如下，getHandler：根据请求查找请求处理器，会返回一个HandlerExecutionChain对象。

```java
public interface HandlerMapping {
    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
}
```

常见的实现类：

*   RequestMappingHandlerMapping：请求映射处理器映射，用来处理@RequestMapping定义的处理器的

### 1.3、HandlerExecutionChain：处理器执行链

HandlerMapping#getHandler方法会根据请求得到一个HandlerExecutionChain对象。

HandlerExecutionChain源码如下，主要包含了3个信息

*   handler：请求处理器，通常就是我们自定义的controller对象及方法
*   interceptorList：拦截器，当前请求匹配到的拦截器列表
*   interceptorIndex：拦截器索引，用来记录执行到第几个拦截器了

```java
public class HandlerExecutionChain {

    private final Object handler;

    private final List<HandlerInterceptor> interceptorList = new ArrayList<>();

    private int interceptorIndex = -1;

}
```

### 1.4、handler：处理器

通常需要我们自己开发，一般指我们自定义的controller，在DispatcherServlet的控制下handler对具体的请求进行处理。

### 1.5、HandlerAdapter：处理器适配器

他负责对handler的方法进行调用，由于handler的类型可能有很多种，每种handler的调用过程可能不一样，此时就需要用到适配器HandlerAdapte，适配器对外暴露了统一的调用方式（见其handle方法），内部将handler的调用过程屏蔽了，HandlerAdapter接口源码如下，主要有2个方法需要注意：

*   supports：当前HandlerAdapter是否支持handler，其内部主要就是判HandlerAdapter是否能够处理handler的调用
*   handle：其内部负责调用handler的来处理用户的请求，返回返回一个ModelAndView对象

```java
public interface HandlerAdapter {

    boolean supports(Object handler);

    @Nullable
    ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;

}
```

常见的实现类：

*   RequestMappingHandlerAdapter：其内部用来调用@RequestMapping标注的方法

### 1.6、ModelAndView：模型和视图

这个对象中主要用来存放视图的名称和共享给客户端的数据。

```java
public class ModelAndView {

    /*视图*/
    @Nullable
    private Object view;

    /*模型，用来存放共享给客户端的数据*/
    @Nullable
    private ModelMap model;

}
```

### 1.7、ViewResolver：视图解析器

这个是框架提供的，不需要咱们自己开发，它负责视图解析，根据视图的名称得到对应的视图对象（View）。

ViewResolver接口源码

```java
public interface ViewResolver {

    @Nullable
    View resolveViewName(String viewName, Locale locale) throws Exception;

}
```

这个接口有很多实现类，比如jsp的、freemarker、thymeleaf的等，他们都有各自对应的ViewResolver。

而比较常的实现类是`InternalResourceViewResolver`，这个大家应该比较熟悉吧，目前为止我们前面的文章用到的都是这个视图解析器，用来处理jsp格式的视图页面，带大家再回顾一下这个类的配置，如下

```xml
<!-- 添加视图解析器 -->
<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/view/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

**InternalResourceViewResolver比较重要，这里说下这个类的resolveViewName方法获取视图的过程**，大家也可以去阅读`InternalResourceViewResolver#resolveViewName方法获得`，大致的过程如下：

step1：判断视图viewName是否以`redirect:`开头，如果是，则返回`RedirectView`类型的视图对象，RedirectView是用来重定向的，RedirectView内部用到的是`response.sendRedirect(url)`进行页面重定向；否则继续向下step2

step2：判断viewName是否以`forward:`开头，如果是，则返回`InternalResourceView`类型的视图对象，InternalResourceView是用来做跳转的，InternalResourceView内部用到的是`request.getRequestDispatcher(path).forward(request, response)`进行页面跳转；否则继续向下step3

step3：判断当前项目是否存在jstl所需的类，如果是，则返回JstlView类型的视图，否则返回InternalResourceView类型的视图，这两个视图的render方法最终会通过`request.getRequestDispatcher(path).forward(request, response)`进行页面的跳转，跳转的路径是：InternalResourceViewResolver的前缀prefix + viewName+InternalResourceViewResolver的后缀prefix

### 1.8、View：视图

负责将结果展示给用户，View接口源码如下，render方法根据指定的模型数据（model）渲染视图，即render方法负责将结果输出给客户端。

```java
public interface View {
    void render(@Nullable Map<String, ?> model, HttpServletRequest request, HttpServletResponse response)
            throws Exception;
}
```

View接口常见的2个实现类

*   **RedirectView**：负责重定向的，内部通过`response.sendRedirect(url)`进行页面重定向
*   **InternalResourceViewResolver**：负责页面跳转的，内部通过`request.getRequestDispatcher(path).forward(request, response)`进行页面的跳转

### 1.9、HandlerExceptionResolver：处理器异常解析器

负责处理异常的，HandlerExceptionResolver接口有个`resolveException`方法，用来解析异常，返回异常情况下对应的ModelAndView对象

```java
public interface HandlerExceptionResolver {

    @Nullable
    ModelAndView resolveException(
            HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex);

}
```

### 1.10、HttpMessageConverter：http报文转换器

将请求报文转换为Java对象，或将Java对象转换为响应报文，在处理@RequestBody、RequestEntity、@ResponseBody、ResponseEntity的时候会用到

```java
public interface HttpMessageConverter<T> {

    /**
     * 是否可以将请求保温读取给方法参数指定的类型
     */
    boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);

    /**
     * 是否可以将响应的保温转换为方法参数指定的类型输出
     */
    boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

    /**
     * 当前转换器支持的类型
     */
    List<MediaType> getSupportedMediaTypes();

    /**
     * 当前转换器支持的类型
     */
    default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
        return (canRead(clazz, null) || canWrite(clazz, null) ?
                getSupportedMediaTypes() : Collections.emptyList());
    }

    /**
     * 将http保温转换为给定的类型，然后返回
     */
    T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException;

    /**
     * 将给定的对象t，转换为http报文输出到客户端
     */
    void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException;

}
```

## 2、处理流程：源码解析

### 2.1、请求到达入口：doDispatch

springmvc的所有请求，最终都会到达`org.springframework.web.servlet.DispatcherServlet#doDispatch`这个方法，整个请求的大致处理过程都在这个方法中，咱们从这个方法开始分析，源码如下，大家注意代码中的注释，带有标号，比如①、②、③这样需要的注释，大家需要注意了，这些是关键的步骤，稍后会对这些步骤做详细的说明

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //请求对象
    HttpServletRequest processedRequest = request;
    //处理器执行链对象
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;

    //获取异步处理管理器，servlet3.0后支持异步处理，可以在子线程中响应用户请求
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        //模型和视图
        ModelAndView mv = null;
        //异常对象
        Exception dispatchException = null;

        try {
            //①：解析multipart类型的请求，上传文件用的就是multipart类型的请求方式
            processedRequest = checkMultipart(request);
            //用来标记是否是multipart类型的请求
            multipartRequestParsed = (processedRequest != request);

            //②：根据请求获取HandlerExecutionChain对象
            mappedHandler = getHandler(processedRequest);
            //如果没有找到处理器，就404了
            if (mappedHandler == null) {
                noHandlerFound(processedRequest, response);
                return;
            }

            //③：根据处理器获取HandlerAdapter
            HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

            //④：调用拦截器的preHandle方法，若返回false，处理结束
            if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                return;
            }

            //⑤：调用handler实际处理请求，获取ModelAndView对象，这里会调用HandlerAdapter#handle方法处理请求，其内部会调用handler来处理具体的请求
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

            //判断异步请求不是已经开始了，开始了就返回了
            if (asyncManager.isConcurrentHandlingStarted()) {
                return;
            }
            //如果mv对象中没有视图 & DispatcherServlet配置了默认的视图，则给mv安排一个默认的视图
            applyDefaultViewName(processedRequest, mv);

            //⑥：调用拦截器的postHandle方法
            mappedHandler.applyPostHandle(processedRequest, response, mv);
        }
        catch (Exception ex) {
            dispatchException = ex;
        }
        catch (Throwable err) {
            dispatchException = new NestedServletException("Handler dispatch failed", err);
        }
        //⑦：处理分发结果，渲染视图(包含了正常处理和异常情况的处理)，将结果输出到客户端
        processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
    }
    catch (Exception ex) {
        //⑧：调用拦截器的afterCompletion方法
        triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
    }
    catch (Throwable err) {
        //⑧：调用拦截器的afterCompletion方法
        triggerAfterCompletion(processedRequest, response, mappedHandler,
                new NestedServletException("Handler processing failed", err));
    }
    finally {
        //对于异步处理的情况，调用异步处理的拦截器AsyncHandlerInterceptor的afterConcurrentHandlingStarted方法
        if (asyncManager.isConcurrentHandlingStarted()) {
            if (mappedHandler != null) {
                mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
            }
        }
        else {
            //对于multipart的请求，清理资源，比如文件上传的请求，在上传的过程中文件会被保存到临时文件中，这里就会对这些文件继续清理
            if (multipartRequestParsed) {
                cleanupMultipart(processedRequest);
            }
        }
    }
}
```

下面我们来对上面带有编号的步骤进行分析。

### 2.2、①：解析multipart类型的请求

```java
//①：解析multipart类型的请求，上传文件用的就是multipart类型的请求方式
processedRequest = checkMultipart(request);
```

`checkMultipart(request)`源码

```java
protected HttpServletRequest checkMultipart(HttpServletRequest request) throws MultipartException {
    //判断multipartResolver解析器是否存在 && 请求是否是multipart类型
    if (this.multipartResolver != null && this.multipartResolver.isMultipart(request)) {
        //将请求转换为multipart类型的请求对象，通常为MultipartHttpServletRequest类型
        return this.multipartResolver.resolveMultipart(request);
    }
    return request;
}
```

### 2.3、②：根据请求获取HandlerExecutionChain对象

```java
//②：根据请求获取HandlerExecutionChain对象
mappedHandler = getHandler(processedRequest);
```

`getHandler(processedRequest)`源码如下，遍历所有的处理器映射器`HandlerMapping`，调用他们的`getHandler`方法得到能够处理当前请求的`HandlerExecutionChain`对象，这个对象中包含了3个信息

*   handler：请求处理器，通常就是我们自定义的controller对象及方法
*   interceptorList：拦截器，当前请求匹配到的拦截器列表
*   interceptorIndex：拦截器索引，用来记录执行到第几个拦截器了

```java
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        for (HandlerMapping mapping : this.handlerMappings) {
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}
```

有兴趣的可以去看一下`RequestMappingHandlerMapping`这个类的源码，也是最常用的一个HandlerMapping，它会根据`@RequestMapping`来找到能够处当前请求的处理器，RequestMappingHandlerMapping#getHandler方法查找得到的HandlerExecutionChain对象中的handler类型为`HandlerMethod`，代码在下面这个位置

```java
org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#getHandlerInternal
```

![15456529-fbd2-4e63-beba-324bc70c6633](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081736114.png)

HandlerMethod对象中包含了能够处理请求的bean及方法信息

![6c698055-9e74-4a14-a2ba-276e131be207](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081736099.png)

### 2.4、③：根据处理器获取HandlerAdapter

```java
//③：根据处理器获取HandlerAdapter
HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
```

`getHandlerAdapter方法`源码，遍历`HandlerAdapter`列表，找到能够处理当前handler的`HandlerAdapter`，如果没找到会报错

```java
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        for (HandlerAdapter adapter : this.handlerAdapters) {
            if (adapter.supports(handler)) {
                return adapter;
            }
        }
    }

    throw new ServletException("No adapter for handler [" + handler +
                               "]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");
}
```

此方法通常返回的是`RequestMappingHandlerAdapter`类型的对象，`RequestMappingHandlerAdapter`这个类会根据`HandlerMethod`提供的信息，通过反射调用@RequestMapping标注的方法。

### 2.5、④：调用拦截器的preHandle方法

```java
//④：调用拦截器的preHandle方法，若返回false，处理结束
if (!mappedHandler.applyPreHandle(processedRequest, response)) {
    return;
}
```

`mappedHandler.applyPreHandle`源码如下，主要干了3个事情

*   循环调用拦截器的`preHandle`方法
*   如果某个拦截器的`preHandle`方法返回false，则反向依次调用那些preHandle方法返回ture的拦截器的afterCompletion方法；这句话有点绕，比如有3个拦截器，1、2的preHandler返回了true，而3返回的是false，那么这里将按照2、1的顺序调用他们的afterCompletion方法
*   记录拦截器的执行位置

```java
boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {
    for (int i = 0; i < this.interceptorList.size(); i++) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        //调用拦截器的preHandle方法
        if (!interceptor.preHandle(request, response, this.handler)) {
            //如果拦截器返回false，则反向依次调用那些preHandle方法返回ture的拦截器的afterCompletion方法
            triggerAfterCompletion(request, response, null);
            return false;
        }
        //记录当前拦截器执行的位置
        this.interceptorIndex = i;
    }
    return true;
}
```

`triggerAfterCompletion`方法源码如下，通过拦截器当前执行的位置`interceptorIndex`逆向调用拦截器的`afterCompletion`方法

```java
void triggerAfterCompletion(HttpServletRequest request, HttpServletResponse response, @Nullable Exception ex) {
    for (int i = this.interceptorIndex; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        try {
            interceptor.afterCompletion(request, response, this.handler, ex);
        }
        catch (Throwable ex2) {
            logger.error("HandlerInterceptor.afterCompletion threw exception", ex2);
        }
    }
}
```

### 2.6、⑤：调用handler实际处理请求，获取ModelAndView对象

#### 2.6.1、过程

```java
//⑤：调用handler实际处理请求，获取ModelAndView对象，这里会调用HandlerAdapter#handle方法处理请求，其内部会调用handler来处理具体的请求
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
```

ha.handler方法内部通通过程会走到`RequestMappingHandlerAdapter#invokeHandlerMethod`方法，这个方法内部会通过反射调用@RequestMapping标注的方法，这个方法内部代码比较复杂，咱们就不进去了，这里说一下这个方法主要做了3个非常重要的事情：

*   step1：组装目标方法需要的参数
*   step2：通过反射调用处理请求的目标方法，获取方法的返回值
*   step3：对方法的返回值进行处理

下面来细说一下这3个步骤，这些地方有好东西，大家集中注意力了。

#### 2.6.2、step1：组装目标方法需要的参数：HandlerMethodArgumentResolver

处理器的方法需要的参数有各种类型的，所以组装这些参数是比较关键的地方，组装参数的源码位于下面这个位置

```java
org.springframework.web.method.support.InvocableHandlerMethod#getMethodArgumentValues
```

获取方法需要的参数值，会用到`HandlerMethodArgumentResolver`这个对象，叫做：处理器方法参数解析器，用来解析请求，得到方法需要的参数，大家看一下这个接口，源码如下，主要有2个方法

*   `supportsParameter`：是否能够解析parameter指定的参数
*   `resolveArgument`：通过请求和parameter参数解析得到参数的值

```java
public interface HandlerMethodArgumentResolver {

    //判断当前解析器是否能处理这个parameter这个参数，也就是说是否能够将请求中的数据转换为parameter指定的参数的值
    boolean supportsParameter(MethodParameter parameter);

    //解析参数：从http请求中解析出控制器需要的参数的值
    Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;

}
```

这个接口有很多实现类，列几个比较熟悉的，当大家想知道springmvc可以接收哪些类型的参数，以及这些参数有什么特点的时候，可以去看看这些类的源码，你会秒懂的

| 实现类 | 对应的控制器参数 | 说明 |
| --- | --- | --- |
| PathVariableMapMethodArgumentResolver | @PathVariable 标注参数 | 从url中提取参数的值 |
| RequestHeaderMethodArgumentResolver | @RequestHeader标注参数 | 从http头中提取参数值 |
| RequestParamMethodArgumentResolver | @RequestParam标注参数 | http请求参数中获取值 |
| RequestResponseBodyMethodProcessor | @RequestBody标注参数 | 提取body数据，转换为参数类型 |
| ServletResponseMethodArgumentResolver | ServletResponse、OutputStream、Writer这3种类型的参数 | 这几种类型用来控制http请求的响应输出流 |
| HttpEntityMethodProcessorHttpEntity | HttpEntity类型的参数 | HttpEntity中包含了http请求头和body的所有信息 |
| ExpressionValueMethodArgumentResolver | @Value标注的参数 | spel表达式，从spring容器中获取值 |
| MapMethodProcessor | 参数为Map或者子类型 | \- |
| ModelMethodProcessor | 参数为org.springframework.ui.Model 或子类型 | \- |
| ModelAttributeMethodProcessor | @ModelAttribute标注的参数 | \- |

#### 2.6.3、step2：通过反射调用目标方法

也就是调用controller中的@RequestMapping标注的方法，代码位置

```java
org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod#invokeAndHandle
```

对应的源码如下，这个方法springmvc框架中主要有2个地方会调用

*   第1个地方是：调用处理请求的实际方法的时候
*   第2个地方是：方法有异常的时候，异常解析器里面也会用到这个方法，稍后后面会讲

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
                            Object... providedArgs) throws Exception {
    //1.通过反射调用目标方法，内部会组装目标方法需要的参数
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);

    //如果返回值为空，表示目标方法中已经完成了请求的所有处理，表示请求处理结束了，将执行mavContainer.setRequestHandled(true)标记请求处理完毕
    if (returnValue == null) {
        if (isRequestNotModified(webRequest) || getResponseStatus() != null || mavContainer.isRequestHandled()) {
            mavContainer.setRequestHandled(true);
            return;
        }
    }
    //若getResponseStatusReason()不为空，表示请求已经处理过了
    else if (StringUtils.hasText(getResponseStatusReason())) {
        mavContainer.setRequestHandled(true);
        return;
    }
    //走到这里，说明有返回值，标记请求未处理完毕
    mavContainer.setRequestHandled(false);
    //对返回值进行处理
    this.returnValueHandlers.handleReturnValue(
            returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
}
```

#### 2.6.4、step3：处理方法返回值：HandlerMethodReturnValueHandler

大家注意，上面代码中这部分代码，如下，会对反射调用的结果returnValue进行处理

```java
//对返回值进行处理
this.returnValueHandlers.handleReturnValue(
    returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
```

进入`handleReturnValue`方法内部去看一下，最终代码在下面这个位置

```java
org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite#handleReturnValue
```

这个方法的源码如下

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
    //根据返回值找到HandlerMethodReturnValueHandler
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    if (handler == null) {
        throw new IllegalArgumentException("Unknown return value type: " + returnType.getParameterType().getName());
    }
    //调用HandlerMethodReturnValueHandler#handleReturnValue处理返回值
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}

@Nullable
private HandlerMethodReturnValueHandler selectHandler(@Nullable Object value, MethodParameter returnType) {
    //根据返回值判断是否是异步请求
    boolean isAsyncValue = isAsyncReturnValue(value, returnType);
    for (HandlerMethodReturnValueHandler handler : this.returnValueHandlers) {
        if (isAsyncValue && !(handler instanceof AsyncHandlerMethodReturnValueHandler)) {
            continue;
        }
        if (handler.supportsReturnType(returnType)) {
            return handler;
        }
    }
    return null;
}
```

这里关键的信息要看`HandlerMethodReturnValueHandler`接口，这个接口用来处理返回值，看一下其源码，包含2个方法

*   supportsReturnType：是否能够处理returnType参数指定的返回值
*   handleReturnValue：处理返回值

```java
public interface HandlerMethodReturnValueHandler {

    boolean supportsReturnType(MethodParameter returnType);

    void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
            ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception;

}
```

此接口有很多实现类，如下图，图下的表格中会列出常见的一些及说明，建议大家抽空，都点开看看其源码

![4be2cec7-3c67-4317-8f36-605e95314603](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081736241.png)

| 实现类 | 说明 |
| --- | --- |
| ViewNameMethodReturnValueHandler | 返回值为视图名称时的解析器 |
| MapMethodProcessor | 返回值为Map的解析器 |
| StreamingResponseBodyReturnValueHandler | 返回值为ResponseEntity类型时的解析器 |
| DeferredResultMethodReturnValueHandler | 返回值为DeferredResult类型时的解析器，表示异步请求 |
| CallableMethodReturnValueHandler | 返回值为Callable类型时的解析器，表示异步请求 |
| ModelMethodProcessor | 返回值为Model类型时的解析器 |
| ModelAndViewMethodReturnValueHandler | 返回值为ModelAndView类型时的解析器 |
| RequestResponseBodyMethodProcessor | 方法上标注有@ResponseBody注解时返回值的解析器 |
| HttpEntityMethodProcessor | 返回值为HttpEntity类型但是非RequestEntity类型时的解析器 |

这里找一个比较有代表性的，带大家看一下，就以`RequestResponseBodyMethodProcessor`来说一下，这个会处理`@RequestBody`标注的方法，抽取其2个关键方法的代码，如下

```java
//判断类上或者目标方法上是否有@ResponseBody注解
@Override
public boolean supportsReturnType(MethodParameter returnType) {
    return (AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), ResponseBody.class) ||
            returnType.hasMethodAnnotation(ResponseBody.class));
}

//处理返回值
@Override
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
        throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {
    //1：标注为请求已处理，因为当前handleReturnValue方法会直接将结果输出到客户端，所以后续就不需要再进行视图渲染了，表示请求已经被处理了
    mavContainer.setRequestHandled(true);
    ServletServerHttpRequest inputMessage = createInputMessage(webRequest);
    ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);

    //2：将结果输出到客户端
    writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);
}
```

上面代码中，这里大家需要注意`handleReturnValue`方法，这个方法内部会直接将结果输出，后续就没有视图渲染的事情了，所以这里会调用`mavContainer.setRequestHandled(true)`，表示请求已经处理了。

### 2.7、⑥：调用拦截器的postHandle方法

```java
//⑥：调用拦截器的postHandle方法
mappedHandler.applyPostHandle(processedRequest, response, mv);
```

`mappedHandler.applyPostHandle`源码如下，逆序调用拦截器的`postHandle`方法

```java
org.springframework.web.servlet.HandlerExecutionChain#applyPostHandle

void applyPostHandle(HttpServletRequest request, HttpServletResponse response, @Nullable ModelAndView mv)
    throws Exception {

    for (int i = this.interceptorList.size() - 1; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        interceptor.postHandle(request, response, this.handler, mv);
    }
}
```

### 2.8、⑦：渲染视图

#### 2.8.1、过程

```java
 //⑦：处理分发结果，渲染视图(包含了正常处理和异常情况的处理)，将结果输出到客户端
 processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
```

`processDispatchResult`源码如下

```java
org.springframework.web.servlet.DispatcherServlet#processDispatchResult

private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
                                   @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv,
                                   @Nullable Exception exception) throws Exception {
    boolean errorView = false;

    if (exception != null) {
        Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);
        //⑦-1：如果有异常，进行全局异常处理
        mv = processHandlerException(request, response, handler, exception);
        errorView = (mv != null);
    }

    if (mv != null && !mv.wasCleared()) {
        //⑦-2：渲染视图
        render(mv, request, response);
        if (errorView) {
            //调用request.removeAttribute方法清理request中错误信息
            WebUtils.clearErrorRequestAttributes(request);
        }
    }

    if (mappedHandler != null) {
        //⑦-3：调用拦截器的afterCompletion方法
        mappedHandler.triggerAfterCompletion(request, response, null);
    }
}
```

这个方法主要干了3个事情

*   step1：⑦-1：如果有异常，进行全局异常处理
*   step2：⑦-2：渲染视图
*   step3：⑦-3：调用拦截器的afterCompletion方法

下面来解析这3个步骤

#### 2.8.2、step1：⑦-1：如果有异常，进行全局异常处理

```java
if (exception != null) {
    Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);
    //⑦-1：如果有异常，进行全局异常处理
    mv = processHandlerException(request, response, handler, exception);
    errorView = (mv != null);
}
```

`processHandlerException方法`源码，主要是遍历异常处理器`HandlerExceptionResolver`的`resolveException`来处理异常，稍后会说一下这个接口

```java
org.springframework.web.servlet.DispatcherServlet#processHandlerException

protected ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,
            @Nullable Object handler, Exception ex) throws Exception {

    // 调用处理器异常解析器解析异常，得到ModelAndView
    ModelAndView exMv = null;
    if (this.handlerExceptionResolvers != null) {
        for (HandlerExceptionResolver resolver : this.handlerExceptionResolvers) {
            exMv = resolver.resolveException(request, response, handler, ex);
            if (exMv != null) {
                break;
            }
        }
    }
    if (exMv != null) {
        //暴露异常信息到request对象中（request.setAttribute）
        WebUtils.exposeErrorRequestAttributes(request, ex, getServletName());
        return exMv;
    }

    throw ex;
}
```

HandlerExceptionResolver接口：处理器异常解析器，内部就只有一个方法，用来解析异常的，得到一个ModelAndView对象。

```java
public interface HandlerExceptionResolver {

    @Nullable
    ModelAndView resolveException(
            HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex);

}
```

这个接口有好几个实现类，我们主要关注下`ExceptionHandlerExceptionResolver`这个类，大家是否还记得注解方式处理全局异常（[即使用@ControllerAdvice和@ExceptionHandler实现全局异常处理处理](https://mp.weixin.qq.com/s/SyiIBA_Xdqk3Ybrx5psWYw)），最终这俩注解定义的异常处理会被`ExceptionHandlerExceptionResolver`这个类进行处理，这个类的源码就不细讲了，比较简单，大家可以去看看，就是一个异常类型匹配处理方法的过程。

#### 2.8.3、step2：⑦-2：渲染视图

```java
//⑦-2：渲染视图
render(mv, request, response);
```

`render`方法源码如下

```java
org.springframework.web.servlet.DispatcherServlet#render

protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {
    View view;
    String viewName = mv.getViewName();
    if (viewName != null) {
        //⑦-2-1：调用视图解析器解析视图名称得到视图View对象
        view = resolveViewName(viewName, mv.getModelInternal(), locale, request);
    } else {
        view = mv.getView();
    }

    //⑦-2-2：调用视图的render方法渲染视图，将结果输出到客户端
    view.render(mv.getModelInternal(), request, response);
}
```

此方法干了2件事

*   ⑦-2-1：调用视图解析器解析视图名称得到视图View对象
*   ⑦-2-2：调用视图的render方法渲染视图，将结果输出到客户端

下面进去细看一下

##### ⑦-2-1：调用视图解析器解析视图名称得到视图View对象

```java
//⑦-2-1：调用视图解析器解析视图名称得到视图View对象
view = resolveViewName(viewName, mv.getModelInternal(), locale, request);
```

`resolveViewName`方法源码如下，遍历视图解析器，解析视图名称，得到视图对象View

```java
protected View resolveViewName(String viewName, @Nullable Map<String, Object> model,
            Locale locale, HttpServletRequest request) throws Exception {

    if (this.viewResolvers != null) {
        for (ViewResolver viewResolver : this.viewResolvers) {
            View view = viewResolver.resolveViewName(viewName, locale);
            if (view != null) {
                return view;
            }
        }
    }
    return null;
}
```

##### ⑦-2-2：调用视图的render方法渲染视图，将结果输出到客户端

```java
//⑦-2-2：调用视图的render方法渲染视图，将结果输出到客户端
view.render(mv.getModelInternal(), request, response);
```

这里我们以InternalResourceView为例，进到其render方法中，看看里面干了什么，最终会进到其`renderMergedOutputModel`方法中，源码如下，这里代码就非常亲切了，不多解释，看注释

```java
protected void renderMergedOutputModel(
        Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {

    // 将model中的数据遍历后放在request中（request.setAttribute(name,value)）
    exposeModelAsRequestAttributes(model, request);

    // 获取跳转的页面的路径
    String dispatcherPath = prepareForRendering(request, response);

    // 调用request.getRequestDispatcher(path)得到RequestDispatcher对象
    RequestDispatcher rd = getRequestDispatcher(request, dispatcherPath);

    //实现页面跳转
    if (useInclude(request, response)) {
        rd.include(request, response);
    }else {
        rd.forward(request, response);
    }
}
```

#### 2.8.3、step3：⑦-3：调用拦截器的afterCompletion方法

```java
⑦-3：调用拦截器的afterCompletion方法
mappedHandler.triggerAfterCompletion(request, response, null);
```

`mappedHandler.triggerAfterCompletion`方法的源码如下，反向调用拦截器的`afterCompletion`方法

```java
void triggerAfterCompletion(HttpServletRequest request, HttpServletResponse response, @Nullable Exception ex) {
    for (int i = this.interceptorIndex; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        try {
            interceptor.afterCompletion(request, response, this.handler, ex);
        }
        catch (Throwable ex2) {
            logger.error("HandlerInterceptor.afterCompletion threw exception", ex2);
        }
    }
}
```

过程到这里就结束了，需要大家结合源码多看几遍，还是比较容易的。

## 3、处理流程：纯文字描述

1、用户向服务器发送请求，请求被SpringMVC 前端控制器 DispatcherServlet捕获

2、DispatcherServlet根据该URI，调用HandlerMapping获得该Handler配置的所有相关的对象（包括Handler对象以及Handler对象对应的拦截器），最后以HandlerExecutionChain执行链对象的形式返回

4、DispatcherServlet 根据获得的 Handler，选择一个合适的HandlerAdapter

5、如果成功获得HandlerAdapter，此时将开始执行拦截器的preHandler(…)方法【正向】

6、提取Request中的模型数据，填充Handler入参，开始执行Handler（Controller)方法，处理请求，在填充Handler的入参过程中，根据你的配置，Spring将帮你做一些额外的工作：

> 1.  HttpMessageConveter： 将请求消息（如Json、xml等数据）转换成一个对象，将对象转换为指定的类型信息
>     
> 2.  数据转换：对请求消息进行数据转换。如String转换成Integer、Double等
>     
> 3.  数据格式化：对请求消息进行数据格式化。 如将字符串转换成格式化数字或格式化日期等
>     
> 4.  数据验证： 验证数据的有效性（长度、格式等），验证结果存储到BindingResult或Error中
>     

7、Handler执行完成后，向DispatcherServlet 返回一个ModelAndView对象。

8、此时将开始执行拦截器的postHandle(…)方法【逆向】

9、根据返回的ModelAndView（此时会判断是否存在异常：如果存在异常，则执行HandlerExceptionResolver进行异常处理）选择一个适合的ViewResolver进行视图解析，根据Model和View，来渲染视图

10、渲染视图完毕执行拦截器的afterCompletion(…)方法【逆向】

11、将渲染结果返回给客户端

## 4、小结

本文东西比较多，建议大家抽空结合源码多看几遍，下一篇文章将通过源码介绍springmvc容器的启动过程，干货也是满满的，敬请期待。

## 5、案例代码

```html
git地址：https://gitee.com/javacode2018/springmvc-series
```

[下一篇：源码解析SpringMVC容器的启动过程](http://www.itsoku.com/course/6/154)

[上一篇：全注解的方式 & 原理解析](http://www.itsoku.com/course/6/152)
