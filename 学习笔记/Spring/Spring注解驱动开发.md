![Spring注解驱动开发](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061724723.png)

# Spring注解驱动开发

## AnnotationConfigApplicationContext

### 配置类

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context
                           http://www.springframework.org/schema/context/spring-context.xsd">
    <!--    包扫描、只要标注了@Controller @Service @Respository @Component-->
    <!--    use-default-filters="false"关闭默认的扫描规则-->
    <!--    <context:component-scan base-package="config" use-default-filters="false"></context:component-scan>-->
    <bean  id="person" class="beans.Person">
        <property name="id" value="123"></property>
        <property name="name" value="wowosong"></property>
        <property name="age" value="12"></property>
    </bean>
</beans>
```

### 包扫描

```java
import beans.Person;
import config.MainConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Maintest {
    public static void main(String[] args) {
        //ClassPathXmlApplicationContext ctx =new ClassPathXmlApplicationContext("beans.xml");
        //Person person = (Person)ctx.getBean("person");
        //System.out.println(person);
        ApplicationContext ctx=new AnnotationConfigApplicationContext(MainConfig.class);
        Person bean = ctx.getBean(Person.class);
        //String[] beanNamesForType = ctx.getBeanNamesForType(Person.class);
        String[] beanNamesForType1 = ctx.getBeanDefinitionNames();
        for (String s : beanNamesForType1) {
            System.out.println(s);
        }
        System.out.println(bean);
    }
}
```

## 组件添加

### @Configuration

```java
//配置类==配置文件
@Configuration
//告诉spring这是一个配置类
```

### @Bean

```java
@Bean(name = "Person"),
//指定bean名字
//给容器中注册Bean,类型为返回值类型,id默认为方法名作为id
public Person person(){
    return  new Person("1","123",34);
}
```

### @ComponentScan

```java
@ComponentScans(
    value = {
        @ComponentScan(value="com.atguigu",includeFilters = {
            /*@Filter(type=FilterType.ANNOTATION,classes={Controller.class}),
						@Filter(type=FilterType.ASSIGNABLE_TYPE,classes={BookService.class}),*/
            @Filter(type=FilterType.CUSTOM,classes={MyTypeFilter.class})
        },useDefaultFilters = false)	
    }
)
//@ComponentScan  value:指定要扫描的包
//excludeFilters = Filter[] ：指定扫描的时候按照什么规则排除那些组件
//includeFilters = Filter[] ：指定扫描的时候需要只包含哪些组件
//FilterType.ANNOTATION：按照注解
//FilterType.ASSIGNABLE_TYPE：按照给定的类型;
//FilterType.ASPECTJ：使用ASPECTJ表达式
//FilterType.REGEX：使用正则指定
//FilterType.CUSTOM：使用自定义规则
```

```java
public class MyFilter implements TypeFilter {
    //metadataReader获取到当前扫描类的信息
    //metadataReaderFactory获取到其他任何类的信息
    public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {
        //获取当前类的注解信息
        AnnotationMetadata annotationMetadata = metadataReader.getAnnotationMetadata();
        //获取正在扫描类的信息
        ClassMetadata classMetadata = metadataReader.getClassMetadata();
        //获取当前类的资源信息（类的路径）
        Resource resource = metadataReader.getResource();
        String className = classMetadata.getClassName();
        if(className.contains("Service")){
            return true;
        }
        System.out.println("----->"+className);
        return false;
    }
}
```

### @Component

```java
@Component(value = "MainConfig")
//标记组件名称
public class MainConfig {
    @Bean(name = "Person")
    //给容器中注册Bean,类型为返回值类型,id默认为方法名作为id
    public Person person(){
        return  new Person("1","123",34);
    }
}
//泛指组件,当组件不好归类的时候,我们可以使用这个注解进行标注;
```

### @Controller

```java
@Controller 
//注册成一个控制层的组件,用于标注是控制层组件,需要返回页面时请用@Controller而不是@RestController;
```

### @Service

```java
@Service //用于标注业务层组件;
```

### @Repository

```java
@Repository //用于标注数据访问组件,即DAO组件;
```

### @Scope

```java
/**ConfigurableBeanFactory#SCOPE_PROTOTYPE
 * @see ConfigurableBeanFactory#SCOPE_SINGLETON
 * @see org.springframework.web.context.WebApplicationContext#SCOPE_REQUEST
 * @see org.springframework.web.context.WebApplicationContext#SCOPE_SESSION
    默认为单实例
    SCOPE_PROTOTYPE 多实例 ioc容器启动时不会调用方法创建对象放到ioc容器中,以后每次获取才调用方法去创建对象
    SCOPE_SINGLETON 单实例 ioc容器启动时会调用方法创建对象放到ioc容器中,以后每次获取都是直接从map.get()容器中拿
    SCOPE_REQUEST  同一次请求创建一个实例
    SCOPE_SESSION 同一个session创建一个实例
*/
@Scope("prototype") //等同于在beans.xml时使用scope="PROTOTYPE|SINGLETON|REQUEST|SESSION"
```

### @Lazy

```java
//懒加载,针对单实例bean,默认在容器启动的时候创建对象
//懒加载 在容器启动时不创建对象,第一次获取bean创建对象,并进行初始化
@Scope("singleton")
@Lazy
@Bean("person2")
public Person person(){
  System.out.println("给容器添加person...");
  return new Person("1","lisi",34);
};
AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(MainConfig2.class);
String[] names = applicationContext.getBeanDefinitionNames();
System.out.println("容器创建完成。。。");
Person person = (Person)applicationContext.getBean("person2");
```

### @Conditional

```java
public class LinuxCondition implements Condition {
    //ConditionContext 判断条件能使用的上下文环境
    //AnnotatedTypeMetadata 注释信息
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        ClassLoader classLoader = context.getClassLoader();
        Environment environment = context.getEnvironment();
        BeanDefinitionRegistry registry = context.getRegistry();
        String property = environment.getProperty("os.name");
        if(property.contains("Linux")){
            return true;
        }
        return false;
    }
}
```

```java
//放在方法上
@Conditional(value = WindowsCondition.class)
@Bean("person1")
public Person person1(){
    System.out.println("给容器添加person1...");
    return new Person("1","Bill Gates",54);
};
```

```java
@Conditional({WindowsCondition.class})
//满足当前条件,这个类下配置的所有bean才会生效
```

### @Import

```java
/**
* 给容器中注册组件
* 1）包扫描+组件标注注解（@Component/@Controller/@Service/@Repository）
* 2)@Bean   导入第三方包里的组件
* 3）@Import 快速给容器中导入一个组件
*   1)@Import(要导入容器中的组件),容器就会自动注册这个组件,id默认为全类名
*   2)@ImportSelector:返回要导入容器中组件的全类名数组
*   3)@ImportBeanDefinitionRegistrar:手动注册bean到容器中
*   4)使用spring提供的FactoryBean
*       1) 默认获取到的是工厂bean调用getObject创建的对象
*       2）要获取到工厂bean本身,需要在id前加一个&
*        &myFactoryBean
*/

@Import({Colors.class, MyImportSelector.class, MyImporBeanDefinitionRegister.class}})
```

```java
//自定义逻辑：返回需要导入的组件
public class MyImportSelector  implements ImportSelector {
    //返回值：就是要导入到容器中的组件的全类名
    //AnnotationMetadata: 当前标注@Import注解的类的所有注解信息
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        String[] interfaceNames = importingClassMetadata.getInterfaceNames();
        return new String[]{"beans.Red","beans.Yellow"};
    }
}
```

```java
public class MyImporBeanDefinitionRegister implements ImportBeanDefinitionRegistrar {
    /**
     *
     * @param importingClassMetadata 当前类的注释信息
     * @param registry ：BeanDefinition注册类
     * 把所有要注册的bean通过BeanDefinitionRegistry手动注册到容器中
     */
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

        boolean red = registry.containsBeanDefinition("beans.Red");
        boolean blue = registry.containsBeanDefinition("beans.Yellow");
        if(red && blue){
            RootBeanDefinition beanDefinition = new RootBeanDefinition(black.class);
            //指定bean名
            registry.registerBeanDefinition("black",beanDefinition);
        }
    }
}
```

```java
@Bean
public myFactoryBean myFactoryBean() throws Exception {
    return new myFactoryBean();
}
```

```java
package condition;

import beans.Colors;
import beans.RedBiow;
import org.springframework.beans.factory.FactoryBean;

import java.awt.*;

/**
* @author wowosong
 * @date 2021/10/14 0014
 * @apiNote
 **/
public class myFactoryBean implements FactoryBean<RedBiow> {
    public RedBiow getObject() throws Exception {
        System.out.println("myFactoryBean....");
        return new RedBiow();
    }

    public Class<?> getObjectType() {
        return RedBiow.class;
    }

    /**
   * 判断是否单例
   * true 这个bean是单例,在容器中存在一份
   * false 多实例,每次获取都会创建新的bean实例
   * @return
   */
    public boolean isSingleton() {
        return false;
    }
}

```

## 生命周期

### 指定初始化和销毁方法

```java
/**
 * bean的生命周期：创建--->初始化--->销毁的过程
 * 容器管理bean的生命周期
 * 我们可以自定义初始化和销毁方法,容器在bean进行到当前生命周期来调用自定义初始化和销毁方法
 * 1.构造（创建对象）
 * 		单实例：在容器启动时创建对象
 * 		多实例：在每次获取创建对象
 * BeanPostProcessor.postProcessBeforeInitialization
 * 2.初始化：
 *      对象创建完成,并赋值好,调用初始化方法
 * BeanPostProcessor.postProcessAfterInitialization
 * 3.销毁：
 *      单实例：容器关闭时
 *      多实例：容器不会管理这个bean,不会调用销毁方法

     从registerBeanPostProcessors进入
     String[] postProcessorNames = beanFactory.getBeanNamesForType(BeanPostProcessor.class, true, false);
 *   遍历得到容器中所有的beanPostProcessor,挨个执行postProcessBeforeInitialization
 *   一旦返回null,跳出for循环,不会执行后面的beanProcessor.postProcessBeforeInitialization

 *   BeanPostProcessor原理

     finishBeanFactoryInitialization(beanFactory);
 		 beanFactory.preInstantiateSingletons();
 *       populateBean(beanName, mbd, instanceWrapper);给bean赋值
 *   	 initializeBean{
 *         applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
 *         invokeInitMethods(beanName, wrappedBean, mbd);执行自定义初始化
 *         applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
 *       }

 * 1）指定初始方法和销毁方法
 *  1.指定 init-method=""和destroy-method=""
 * 2）通过让bean实现InitializingBean(定义初始化逻辑)和DisposableBean(定义销毁逻辑)
 * 3）可以使用JSR250
 *    @PostConstruct：在bean创建完成并完成属性赋值后,来执行初始化方法
 *    @PreDestroy：在容器销毁bean之前通知我们进行清理工作
 * 4）BeanPostProcessor：bean的后置处理器
 *   在bean初始化前后进行一些处理工作
 *   postProcessBeforeInitialization：在初始化前工作
 *   postProcessAfterInitialization：在初始化后工作

 *   Spring 底层对BeanPostProcessor的使用
 *   bean赋值 注入其他组件 @AutoWired 生命周期注解 @Async等 都是使用BeanPostProcessor
 **/
@Configuration
public class MainConfigOfLifeCyle {
    @Scope("prototype")
    @Bean(initMethod = "init",destroyMethod = "destory")
    public Car getCar(){
        return new Car();
    }
}
```

```java
public class Car {
    public  Car(){
        System.out.println("car constructor....");
    }
    public void init(){
        System.out.println("car init  ...");
    }
    public void destory(){
        System.out.println("car destory ....");
    }
}
```

### InitializingBean和DisposableBean

```java
/**
 * 通过让bean实现InitializingBean(定义初始化逻辑)和DisposableBean(定义销毁逻辑)
 * @apiNote
 **/
@Component(value = "Cat")
public class Cat implements InitializingBean, DisposableBean {
    public Cat(){
        System.out.println("cat constructor....");
    }
    public void destroy() throws Exception {
        System.out.println("cat destory...");
    }

    public void afterPropertiesSet() throws Exception {
        System.out.println("cat afterPropertiesSet...");
    }
}
```

### @PostConstruct&@PreDestroy

```java
/**
 * @PostConstruct：在bean创建完成并完成属性赋值后,来执行初始化方法
 * @PreDestroy：在容器销毁bean之前通知我们进行清理工作
 **/
@Component
public class Dog implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    public Dog(){
        System.out.println("Dog constructor...");
    }
    @PostConstruct
    public void init(){
        System.out.println("Dog init...");
    }
    @PreDestroy
    public void destory(){
        System.out.println("Dog destory...");
    }
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext=applicationContext;
    }
}
```

### BeanPostProcessor（以及原理）

```java
/**
 * 后置处理器：初始化前后进行处理工作
 * 将后置处理器加入到容器中
 **/
@Component
public class myBeanPostProcessor implements BeanPostProcessor {
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization--->"+beanName+":"+bean);
        return bean;
    }

    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization--->"+beanName+":"+bean);
        return bean;
    }
}
```

## 属性赋值

### @Value

```java
//使用@Value()赋值
//1.基本数据
//2.可以写spEL表达式,#{}
//3.使用${},获取配置文件中的值

@Value("wowosong")
private String name;
//@Value("${person.id}")
@Value("${person.lastname}")
private  String id;
@Value("#{20*2}")
private Integer age;
```

### @PropertySource

```java
@Configuration
//使用PropertySource读取外部配置中的k/v保存到运行的环境变量中,加载完配置文件以后使用${}取值
@PropertySource(value = {"classpath:/person.properties"})
public class MainConfigOfPropertyValue {
    @Bean
    public Person person(){
        return new Person();
    }
}
```

## 自动装配

### @Autowired

```java
/**
 * 自动装配;
 * 		Spring利用依赖注入（DI）,完成对IOC容器中中各个组件的依赖关系赋值;
 * 
 * 1）@Autowired：自动注入：
 * 		1）默认优先按照类型去容器中找对应的组件:applicationContext.getBean(BookDao.class);找到就赋值
 * 		2）如果找到多个相同类型的组件,再将属性的名称作为组件的id去容器中查找
 * 			applicationContext.getBean("bookDao")
 * 		3）@Qualifier("bookDao")：
 			使用@Qualifier指定需要装配的组件的id,而不是使用属性名,需要结合@Autowired进行自动注入
 * 		4）自动装配默认一定要将属性赋值好,没有就会报错;
 * 			可以使用@Autowired(required=false);
 * 		5）@Primary：让Spring进行自动装配的时候,默认使用首选的bean;
 				也可以继续使用@Qualifier指定需要装配的bean的名字
 * 		BookService{
 * 			@Autowired
 * 			BookDao  bookDao;
 * 		}
 * 
 * 2）Spring还支持使用@Resource(JSR250)和@Inject(JSR330)[java规范的注解]
 * 		@Resource:
 * 			可以和@Autowired一样实现自动装配功能;默认是按照组件名称进行装配的;
 * 			没有能支持@Primary功能,没有支持@Autowired（reqiured=false）;
 * 		@Inject:
 * 			需要导入javax.inject的包,和Autowired的功能一样。没有required=false的功能;
 *  	@Autowired是Spring定义的;
 *  	@Resource、@Inject都是java规范
 * 	
 * 		AutowiredAnnotationBeanPostProcessor:解析完成自动装配功能;		
 * 
 * 3）@Autowired:构造器,参数,方法,属性;都是从容器中获取参数组件的值
 * 		1）[标注在方法位置]：@Bean+方法参数;参数从容器中获取;默认不写@Autowired效果是一样的;都能自动装配
 * 		2）[标在构造器上]：如果组件只有一个有参构造器,这个有参构造器的@Autowired可以省略,参数位置的组件还是可以自动从容器中获取
 * 		3）放在参数位置：默认不写也可以自动装配
 * 
 * 4）自定义组件想要使用Spring容器底层的一些组件（ApplicationContext,BeanFactory,xxx）;
 * 		自定义组件实现xxxAware;在创建对象的时候,会调用接口规定的方法注入相关组件;Aware;
 * 		把Spring底层一些组件注入到自定义的Bean中;
 * 		xxxAware：功能使用xxxProcessor;
 * 		ApplicationContextAware==》ApplicationContextAwareProcessor;
 */

public class MainConifgOfAutowired {

    @Primary
    @Bean("helloMapper2")
    public HelloMapper helloMapper(){
        HelloMapper helloMapper = new HelloMapper();
        helloMapper.setLable("2");
        return helloMapper;
    }

    /**
	 * @Bean标注的方法创建对象的时候,方法参数的值从容器中获取
	 * 标注在方法位置]：@Bean + 方法参数;参数从容器中获取;默认不写@Autowired效果是一样的;都能自动装配
	 * @param car
	 * @return
	 */
    @Bean
    public Color color(@Autowired Car car){
        Color color = new Color();
        color.setCar(car);
        return color;
    }
}
```

### @Qualifier

### @Primary

### @Resource

### @Inject

### 方法、构造器位置的自动装配

```java
/** @Autowired:构造器,参数,方法,属性;都是从容器中获取参数组件的值
 * 	1）[标注在方法位置]：@Bean + 方法参数;参数从容器中获取;默认不写@Autowired效果是一样的;都能自动装配
 * 	2）[标在构造器上]：如果组件只有一个有参构造器,这个有参构造器的@Autowired可以省略,参数位置的组件还是可以自动从容器中获取
 * 	3）放在参数位置：
		默认加在ioc容器中的组件,容器启动会调用无参构造器创建对象,再进行初始化赋值等操作;如果有参构造器,则通过有参构造器进行赋值;
 */
@Component
public class Boss {

    private Car car;
    public Boss(){
        
    }
    @AutoWired
    //构造器要用的组件,都是从容器中获取
    public Boss(Car car){
        this.car = car;
        System.out.println("Boss...有参构造器");
    }
    public Car getCar() {
        return car;
    }

    //@Autowired 
    //标注在方法,Spring容器创建当前对象,就会调用方法,完成赋值;
    //方法使用的参数,自定义类型的值从ioc容器中获取
    public void setCar(@Autowired Car car) {
        this.car = car;
    }

    @Override
    public String toString() {
        return "Boss [car=" + car + "]";
    }
}
```

### Aware注入Spring底层组件&原理

```java
/*   4）自定义组件想要使用Spring容器底层的一些组件（ApplicationContext,BeanFactory,xxx）;
 * 		自定义组件实现xxxAware;在创建对象的时候,会调用接口规定的方法注入相关组件;Aware;
 * 		把Spring底层一些组件注入到自定义的Bean中;
 * 		xxxAware：功能使用xxxProcessor;
 * 		ApplicationContextAware==》ApplicationContextAwareProcessor
 */
@Component
public class Red implements ApplicationContextAware, BeanNameAware, EmbeddedValueResolverAware {
    private ApplicationContext applicationContext;
    public Red(){
        
    }
    public void setBeanName(String name) {
        System.out.println("当前bean name:"+name);
    }

    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("传入的IOC容器:"+applicationContext);
        this.applicationContext= applicationContext;
    }

    public void setEmbeddedValueResolver(StringValueResolver resolver) {
        String s = resolver.resolveStringValue("解析字符串： 你好,${os.name},值：#{20*2}");
        System.out.println(s);
    }
}
```

### @Profile环境搭建

```java
/**
 * Profile：
 * 		Spring为我们提供的可以根据当前环境,动态的激活和切换一系列组件的功能;
 * 
 * 开发环境、测试环境、生产环境;
 * 数据源：(/A)(/B)(/C);
 * 
 * 
 * @Profile：指定组件在哪个环境的情况下才能被注册到容器中,不指定,任何环境下都能注册这个组件
 * 
 * 1）加了环境标识的bean,只有这个环境被激活的时候才能注册到容器中。默认是default环境
 * 2）写在配置类上,只有是指定的环境的时候,整个配置类里面的所有配置才能开始生效
 * 3）没有标注环境标识的bean在,任何环境下都是加载的;
 */

@PropertySource("classpath:dbconfig.properties")
@Configuration
public class MainConfigOfProfile implements EmbeddedValueResolverAware{

    @Value("${db.user}")
    private String user;	
    private StringValueResolver valueResolver;
    private String  driverClass;
    @Bean
    public Yellow yellow(){
        return new Yellow();
    }

    @Profile("test")
    @Bean("testDataSource")
    public DataSource dataSourceTest(@Value("${db.password}")String pwd) throws Exception{
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(pwd);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }


    @Profile("dev")
    @Bean("devDataSource")
    public DataSource dataSourceDev(@Value("${db.password}")String pwd) throws Exception{
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(pwd);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/ssm_crud");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }

    @Profile("prod")
    @Bean("prodDataSource")
    public DataSource dataSourceProd(@Value("${db.password}")String pwd) throws Exception{
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(pwd);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/scw_0515");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }

    @Override
    public void setEmbeddedValueResolver(StringValueResolver resolver) {
        // TODO Auto-generated method stub
        this.valueResolver = resolver;
        driverClass = valueResolver.resolveStringValue("${db.driverClass}");
    }
}
```

### @Profile根据环境注册bean

**需要指定虚拟机启动参数指定启动环境**

```java
//1、使用命令行动态参数: 在虚拟机参数位置加载 -Dspring.profiles.active=test
//2、代码的方式激活某种环境;
@Test
public void test01(){
    AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext();
    //1、创建一个applicationContext
    //2、设置需要激活的环境
    applicationContext.getEnvironment().setActiveProfiles("dev");
    //3、注册主配置类
    applicationContext.register(MainConfigOfProfile.class);
    //4、启动刷新容器
    applicationContext.refresh();

    String[] namesForType = applicationContext.getBeanNamesForType(DataSource.class);
    for (String string : namesForType) {
        System.out.println(string);
    }

    Yellow bean = applicationContext.getBean(Yellow.class);
    System.out.println(bean);
    applicationContext.close();
}
```

## IOC-小结

## AOP

```java
/**
 * AOP：【动态代理】
 * 		指在程序运行期间动态的将某段代码切入到指定方法指定位置进行运行的编程方式;
 * 
 * 1、导入aop模块;Spring AOP：(spring-aspects)
 * 2、定义一个业务逻辑类（MathCalculator）;在业务逻辑运行的时候将日志进行打印（方法之前、方法运行结束、方法出现异常,xxx）
 * 3、定义一个日志切面类（LogAspects）：切面类里面的方法需要动态感知MathCalculator.div运行到哪里然后执行;
 * 		通知方法：
 * 			前置通知(@Before)：logStart：在目标方法(div)运行之前运行
 * 			后置通知(@After)：logEnd：在目标方法(div)运行结束之后运行（无论方法正常结束还是异常结束）
 * 			返回通知(@AfterReturning)：logReturn：在目标方法(div)正常返回之后运行
 * 			异常通知(@AfterThrowing)：logException：在目标方法(div)出现异常以后运行
 * 			环绕通知(@Around)：动态代理,手动推进目标方法运行（joinPoint.procced()）
 * 4、给切面类的目标方法标注何时何地运行（通知注解）;
 * 5、将切面类和业务逻辑类（目标方法所在类）都加入到容器中;
 * 6、必须告诉Spring哪个类是切面类(给切面类上加一个注解：@Aspect)
 * 7、给配置类中加 @EnableAspectJAutoProxy 【开启基于注解的aop模式】
 * 		在Spring中很多的@EnableXXX;
 * 
 * 三步：
 * 	1）、将业务逻辑组件和切面类都加入到容器中;告诉Spring哪个是切面类（@Aspect）
 * 	2）、在切面类上的每一个通知方法上标注通知注解,告诉Spring何时何地运行（切入点表达式）
 *  3）、开启基于注解的aop模式;@EnableAspectJAutoProxy
 *  
 * AOP原理：【看给容器中注册了什么组件,这个组件什么时候工作,这个组件的功能是什么？】
 * @EnableAspectJAutoProxy;
 * 1、@EnableAspectJAutoProxy是什么？
 * 		@Import(AspectJAutoProxyRegistrar.class)：给容器中导入AspectJAutoProxyRegistrar
 * 			利用AspectJAutoProxyRegistrar自定义给容器中注册bean;BeanDefinetion
 * 			internalAutoProxyCreator=>>>>AnnotationAwareAspectJAutoProxyCreator
 * 
 * 		给容器中注册一个AnnotationAwareAspectJAutoProxyCreator;
 * 
 * 2、 AnnotationAwareAspectJAutoProxyCreator：
 * 		AnnotationAwareAspectJAutoProxyCreator
 * 			->AspectJAwareAdvisorAutoProxyCreator
 * 				->AbstractAdvisorAutoProxyCreator
 * 					->AbstractAutoProxyCreator
 * 							implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware
 * 						关注后置处理器（在bean初始化完成前后做事情）、自动装配BeanFactory
 * 
 * AbstractAutoProxyCreator.setBeanFactory()--->父类的setBeanFactory
 * AbstractAutoProxyCreator.有后置处理器的逻辑;
 * 
 * AbstractAdvisorAutoProxyCreator.setBeanFactory()-》initBeanFactory()
 * 
 * AnnotationAwareAspectJAutoProxyCreator.initBeanFactory()
 *
 *
 * 流程：
 * （1）传入配置类,创建ioc容器
 * （2）注册配置类,调用refresh()刷新容器;
 * （3）registerBeanPostProcessors(beanFactory);注册bean的后置处理器来方便拦截bean的创建;
 * 		1）先获取ioc容器已经定义了的需要创建对象的所有BeanPostProcessor
 * 		2）给容器中加别的BeanPostProcessor
 * 		3）优先注册实现了PriorityOrdered接口的BeanPostProcessor;
 * 		4）再给容器中注册实现了Ordered接口的BeanPostProcessor;
 * 		5）注册没实现优先级接口的BeanPostProcessor;
 * 		6）注册BeanPostProcessor,实际上就是创建BeanPostProcessor对象,保存在容器中;
 * 				创建internalAutoProxyCreator的BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】
 * 				①创建Bean的实例
 * 				②populateBean;给bean的各种属性赋值
 * 				③initializeBean：初始化bean;
 * 					1.invokeAwareMethods()：处理Aware接口的方法回调
 * 					2.applyBeanPostProcessorsBeforeInitialization()：应用后置处理器的postProcessBeforeInitialization（）
 * 					3.invokeInitMethods();执行自定义的初始化方法
 * 					4.applyBeanPostProcessorsAfterInitialization();执行后置处理器的postProcessAfterInitialization（）;
 * 				④BeanPostProcessor(AnnotationAwareAspectJAutoProxyCreator)创建成功;--》aspectJAdvisorsBuilder
 * 		7）把BeanPostProcessor注册到BeanFactory中;
 * 				beanFactory.addBeanPostProcessor(postProcessor);
 * =======以上是创建和注册AnnotationAwareAspectJAutoProxyCreator的过程========
 * 
 * 			AnnotationAwareAspectJAutoProxyCreator => InstantiationAwareBeanPostProcessor
 * （4）finishBeanFactoryInitialization(beanFactory);完成BeanFactory初始化工作;创建剩下的单实例bean
 * 		1）遍历获取容器中所有的Bean,依次创建对象getBean(beanName);
 * 				getBean->doGetBean()->getSingleton()->
 * 		2）创建bean
 * 				【AnnotationAwareAspectJAutoProxyCreator在所有bean创建之前会有一个拦截,InstantiationAwareBeanPostProcessor,会调用postProcessBeforeInstantiation()】
 * 			1）先从缓存中获取当前bean,如果能获取到,说明bean是之前被创建过的,直接使用,否则再创建;
 * 					只要创建好的Bean都会被缓存起来
 * 			2）createBean（）;创建bean;
 * 					AnnotationAwareAspectJAutoProxyCreator 会在任何bean创建之前先尝试返回bean的实例
 * 					【BeanPostProcessor是在Bean对象创建完成初始化前后调用的】
 * 					【InstantiationAwareBeanPostProcessor是在创建Bean实例之前先尝试用后置处理器返回对象的】
 * 					1）resolveBeforeInstantiation(beanName, mbdToUse);解析BeforeInstantiation
 * 					希望后置处理器在此能返回一个代理对象;如果能返回代理对象就使用,如果不能就继续
 * 					1）后置处理器先尝试返回对象;
 * 						bean = applyBeanPostProcessorsBeforeInstantiation（）：
 * 						拿到所有后置处理器,如果是InstantiationAwareBeanPostProcessor;
 * 						就执行postProcessBeforeInstantiation
 * 						if (bean != null) {
								bean = applyBeanPostProcessorsAfterInitialization(bean,beanName);
							}
 * 
 * 					2）doCreateBean(beanName, mbdToUse, args);真正的去创建一个bean实例;和3.6流程一样;
 * 					3）
 * 			
 * 		
 * AnnotationAwareAspectJAutoProxyCreator【InstantiationAwareBeanPostProcessor】	的作用：
 * （1）每一个bean创建之前,调用postProcessBeforeInstantiation();
 * 		关心MathCalculator和LogAspect的创建
 * 		1）、判断当前bean是否在advisedBeans中（保存了所有需要增强bean）
 * 		2）、判断当前bean是否是基础类型的Advice、Pointcut、Advisor、AopInfrastructureBean,
 * 			或者是否是切面（@Aspect）
 * 		3）、是否需要跳过
 * 			①获取候选的增强器（切面里面的通知方法）【List<Advisor> candidateAdvisors】
 * 				每一个封装的通知方法的增强器是 InstantiationModelAwarePointcutAdvisor;
 * 				判断每一个增强器是否是 AspectJPointcutAdvisor 类型的;返回true
 * 			②永远返回false
 * 
 * （2）创建对象
 * postProcessAfterInitialization;
 * 		return wrapIfNecessary(bean, beanName, cacheKey);//包装如果需要的情况下
 * 		1）、获取当前bean的所有增强器（通知方法）  Object[]  specificInterceptors
 * 			1、找到候选的所有的增强器（找哪些通知方法是需要切入当前bean方法的）
 * 			2、获取到能在bean使用的增强器。
 * 			3、给增强器排序
 * 		2）、保存当前bean在advisedBeans中;
 * 		3）、如果当前bean需要增强,创建当前bean的代理对象;
 * 			1）、获取所有增强器（通知方法）
 * 			2）、保存到proxyFactory
 * 			3）、创建代理对象：Spring自动决定
 * 				JdkDynamicAopProxy(config);jdk动态代理;
 * 				ObjenesisCglibAopProxy(config);cglib的动态代理;
 * 		4）、给容器中返回当前组件使用cglib增强了的代理对象;
 * 		5）、以后容器中获取到的就是这个组件的代理对象,执行目标方法的时候,代理对象就会执行通知方法的流程;
 *
 * 	
 * （3）目标方法执行
 * 		容器中保存了组件的代理对象（cglib增强后的对象）,这个对象里面保存了详细信息（比如增强器,目标对象,xxx）;
 * 		1）、CglibAopProxy.intercept();拦截目标方法的执行
 * 		2）、根据ProxyFactory对象获取将要执行的目标方法拦截器链;
 * List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
 * 			1）、List<Object> interceptorList保存所有拦截器 5
 * 				一个默认的ExposeInvocationInterceptor 和 4个增强器;
 * 			2）、遍历所有的增强器,将其转为Interceptor;
 * 				registry.getInterceptors(advisor);
 * 			3）、将增强器转为List<MethodInterceptor>;
 * 				如果是MethodInterceptor,直接加入到集合中
 * 				如果不是,使用AdvisorAdapter将增强器转为MethodInterceptor;
 * 				转换完成返回MethodInterceptor数组;
 * 
 * 		3）、如果没有拦截器链,直接执行目标方法;
 * 			拦截器链（每一个通知方法又被包装为方法拦截器,利用MethodInterceptor机制）
 * 		4）、如果有拦截器链,把需要执行的目标对象,目标方法,
 * 			拦截器链等信息传入创建一个 CglibMethodInvocation 对象,
 * 			并调用 Object retVal =  mi.proceed();
 * 		5）、拦截器链的触发过程;
 * 			1)如果没有拦截器执行执行目标方法,或者拦截器的索引和拦截器数组-1大小一样（指定到了最后一个拦截器）执行目标方法;
 * 			2)链式获取每一个拦截器,拦截器执行invoke方法,每一个拦截器等待下一个拦截器执行完成返回以后再来执行;
 * 			拦截器链的机制,保证通知方法与目标方法的执行顺序;
 * 		
 * 	总结：
 * 		(1）@EnableAspectJAutoProxy开启AOP功能
 * 		(2）@EnableAspectJAutoProxy会给容器中注册一个组件 AnnotationAwareAspectJAutoProxyCreator
 * 		(3）AnnotationAwareAspectJAutoProxyCreator是一个后置处理器;
 * 		(4）容器的创建流程：
 * 			1）registerBeanPostProcessors()注册后置处理器;创建AnnotationAwareAspectJAutoProxyCreator对象
 * 			2）finishBeanFactoryInitialization（）初始化剩下的单实例bean
 * 				①创建业务逻辑组件和切面组件
 * 				②AnnotationAwareAspectJAutoProxyCreator拦截组件的创建过程
 * 				③组件创建完之后,判断组件是否需要增强
 * 					是：切面的通知方法,包装成增强器（Advisor）;给业务逻辑组件创建一个代理对象（cglib）;
 * 		(5）执行目标方法：
 * 			1）代理对象执行目标方法
 * 			2）CglibAopProxy.intercept();
 * 				①得到目标方法的拦截器链（增强器包装成拦截器MethodInterceptor）
 * 				②利用拦截器的链式机制,依次进入每一个拦截器进行执行;
 * 				③效果：
 * 					正常执行：前置通知-》目标方法-》后置通知-》返回通知
 * 					出现异常：前置通知-》目标方法-》后置通知-》异常通知
 */
@EnableAspectJAutoProxy
@Configuration
public class MainConfigOfAOP {

    //业务逻辑类加入容器中
    @Bean
    public MathCalculator calculator(){
        return new MathCalculator();
    }

    //切面类加入到容器中
    @Bean
    public LogAspects logAspects(){
        return new LogAspects();
    }
}
```

### @EnableAspectJAutoProxy

```
 /** AOP原理：【看给容器中注册了什么组件,这个组件什么时候工作,这个组件的功能是什么？】
 * @EnableAspectJAutoProxy;
 * 1、@EnableAspectJAutoProxy是什么？
 * 		@Import(AspectJAutoProxyRegistrar.class)：给容器中导入AspectJAutoProxyRegistrar
 * 			利用AspectJAutoProxyRegistrar自定义给容器中注册bean;BeanDefinition
 * 			internalAutoProxyCreator类型是AnnotationAwareAspectJAutoProxyCreator
 * 
 * 		给容器中注册一个AnnotationAwareAspectJAutoProxyCreator;
 * 
 * 2、 AnnotationAwareAspectJAutoProxyCreator：
 * 		AnnotationAwareAspectJAutoProxyCreator
 * 			->AspectJAwareAdvisorAutoProxyCreator
 * 				->AbstractAdvisorAutoProxyCreator
 * 					->AbstractAutoProxyCreator
 * 							implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware
 * 						关注后置处理器（在bean初始化完成前后做事情）、自动装配BeanFactory
 * /
```

### AnnotationAwareAspectJAutoProxyCreator分析

```
/** AbstractAutoProxyCreator.setBeanFactory()
* 	AbstractAutoProxyCreator.有后置处理器的逻辑;
* 
*	AbstractAdvisorAutoProxyCreator.setBeanFactory()重写setBeanFactory-》并调用initBeanFactory()
* 
* 	AnnotationAwareAspectJAutoProxyCreator.initBeanFactory()重写
/
```

### 注册AnnotationAwareAspectJAutoProxyCreator

```
/** 流程：
 * 	1）、传入配置类,创建ioc容器
 * 	2）、注册配置类,调用refresh（）刷新容器;
 * 	3）、registerBeanPostProcessors(beanFactory);注册bean的后置处理器来方便拦截bean的创建;
 * 		1）、先获取ioc容器已经定义了的需要创建对象的所有BeanPostProcessor
 * 		2）、给容器中加入别的BeanPostProcessor
 * 		3）、优先注册实现了PriorityOrdered接口的BeanPostProcessor;
 * 		4）、再给容器中注册实现了Ordered接口的BeanPostProcessor;
 * 		5）、注册没实现优先级接口的BeanPostProcessor;
 * 		6）、注册BeanPostProcessor,实际上就是创建BeanPostProcessor对象,保存在容器中;
 *			创建internalAutoProxyCreator的BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】
 * 			1）、创建Bean的实例
 * 			2）、populateBean;给bean的各种属性赋值
 * 			3）、initializeBean：初始化bean;
 * 				1）、invokeAwareMethods()：处理Aware接口的方法回调
 * 				2）、applyBeanPostProcessorsBeforeInitialization()：
 					应用后置处理器的postProcessBeforeInitialization（）
 * 				3）、invokeInitMethods();执行自定义的初始化方法
 * 				4）、applyBeanPostProcessorsAfterInitialization();
 					执行后置处理器的postProcessAfterInitialization（）;
 * 			4）、BeanPostProcessor(AnnotationAwareAspectJAutoProxyCreator)创建成功;
 				--》aspectJAdvisorsBuilder
 * 		7）、把BeanPostProcessor注册到BeanFactory中;
 * 			beanFactory.addBeanPostProcessor(postProcessor);
 * =======以上是创建和注册AnnotationAwareAspectJAutoProxyCreator的过程========
```

### AnnotationAwareAspectJAutoProxyCreator执行时机

```
 /** 	AnnotationAwareAspectJAutoProxyCreator => InstantiationAwareBeanPostProcessor
 * 	4）、finishBeanFactoryInitialization(beanFactory);完成BeanFactory初始化工作;创建剩下的单实例bean
 * 		1）、遍历获取容器中所有的Bean,依次创建对象getBean(beanName);
 * 			getBean->doGetBean()->getSingleton()->
 * 		2）、创建bean
 * 			【AnnotationAwareAspectJAutoProxyCreator在所有bean创建之前会有一个拦截,InstantiationAwareBeanPostProcessor,会调用postProcessBeforeInstantiation()】
 * 		1）、先从缓存中获取当前bean,如果能获取到,说明bean是之前被创建过的,直接使用,否则再创建;
 * 			只要创建好的Bean都会被缓存起来 getSingleton()
 * 		2）、createBean（）;创建bean;
 * 			AnnotationAwareAspectJAutoProxyCreator 会在任何bean创建之前先尝试返回bean的实例
 * 			【BeanPostProcessor是在Bean对象创建完成初始化前后调用的】
 * 			【InstantiationAwareBeanPostProcessor是在创建Bean实例之前先尝试用后置处理器返回对象的】
 * 			1）、resolveBeforeInstantiation(beanName, mbdToUse);解析BeforeInstantiation
 * 				希望后置处理器在此能返回一个代理对象;如果能返回代理对象就使用,如果不能就继续
 * 				1）、后置处理器先尝试返回对象;
 * 				bean = applyBeanPostProcessorsBeforeInstantiation（）：
 * 				拿到所有后置处理器,如果是InstantiationAwareBeanPostProcessor;
 * 				就执行postProcessBeforeInstantiation
 * 				if (bean != null) {
					    bean = applyBeanPostProcessorsAfterInitialization(bean,beanName);
				  }
 * 			2）、doCreateBean(beanName, mbdToUse, args);真正的去创建一个bean实例;和3.6流程一样;
```

### 创建AOP代理

```
/** AnnotationAwareAspectJAutoProxyCreator【InstantiationAwareBeanPostProcessor】	的作用：
 * 1）、每一个bean创建之前,调用postProcessBeforeInstantiation();
        从resolveBeforeInstantiation方法进入
 * 		关心MathCalculator和LogAspect的创建
 * 		1）、判断当前bean是否在advisedBeans中（保存了所有需要增强bean）
 * 		2）、判断当前bean是否是基础类型的Advice、Pointcut、Advisor、AopInfrastructureBean,
 * 			或者是否是切面（@Aspect）
 * 		3）、是否需要跳过
 * 			1）、获取候选的增强器（切面里面的通知方法）【List<Advisor> candidateAdvisors】
 * 				每一个封装的通知方法的增强器是 InstantiationModelAwarePointcutAdvisor;
 * 				判断每一个增强器是否是 AspectJPointcutAdvisor 类型的;返回true
 * 			2）、永远返回false
 * 
 * 2）、创建对象
 * postProcessAfterInitialization;
 * 		return wrapIfNecessary(bean, beanName, cacheKey);//包装如果需要的情况下
 * 		1）、获取当前bean的所有增强器（通知方法）  Object[]  specificInterceptors
 * 			1、找到候选的所有的增强器（找哪些通知方法是需要切入当前bean方法的）findCandidateAdvisors
 * 			2、获取到能在bean使用的增强器。findAdvisorsThatCanApply
 * 			3、给增强器排序 sortAdvisors
 * 		2）、保存当前bean在advisedBeans中; 	this.advisedBeans.put(cacheKey, Boolean.TRUE);
 * 		3）、如果当前bean需要增强,创建当前bean的代理对象;createProxy
 * 			1）、获取所有增强器（通知方法）
 * 			2）、保存到proxyFactory 
        Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);
		proxyFactory.addAdvisors(advisors);
 * 			3）、创建代理对象：Spring自动决定
 * 				JdkDynamicAopProxy(config);jdk动态代理;
 * 				ObjenesisCglibAopProxy(config);cglib的动态代理;
 * 		4）、给容器中返回当前组件使用cglib增强了的代理对象;
 * 		5）、以后容器中获取到的就是这个组件的代理对象,执行目标方法的时候,代理对象就会执行通知方法的流程;

```

### 获取拦截器链-MethodInterceptor

```
/*	3）、目标方法执行
 * 		容器中保存了组件的代理对象（cglib增强后的对象）,这个对象里面保存了详细信息（比如增强器,目标对象,xxx）;
 * 		1）、CglibAopProxy.intercept();拦截目标方法的执行
 * 		2）、根据ProxyFactory对象获取将要执行的目标方法拦截器链;
 * List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
 * 			1）、List<Object> interceptorList保存所有拦截器 5
 * 				一个默认的ExposeInvocationInterceptor 和 4个增强器;
 * 			2）、遍历所有的增强器,将其转为Interceptor;
 * 				registry.getInterceptors(advisor);
 * 			3）、将增强器转为List<MethodInterceptor>;
 * 				如果是MethodInterceptor,直接加入到集合中
 * 				如果不是,使用AdvisorAdapter将增强器转为MethodInterceptor;
     			if (adapter.supportsAdvice(advice)) {
                    interceptors.add(adapter.getInterceptor(advisor));
                }
 * 				转换完成返回MethodInterceptor数组;
 * 		3）、如果没有拦截器链,直接执行目标方法;
 * 			拦截器链（每一个通知方法又被包装为方法拦截器,利用MethodInterceptor机制）
 * 		4）、如果有拦截器链,把需要执行的目标对象,目标方法,
 * 			拦截器链等信息传入创建一个 CglibMethodInvocation 对象,
 			并调用Object retVal =  new CglibMethodInvocation(proxy, target, method, args, targetClass, chain, methodProxy).proceed();
 * /
```

### 链式调用通知方法

```
/* 5）、拦截器链的触发过程;
      retVal = new CglibMethodInvocation(proxy, target, method, args, targetClass, chain, methodProxy).proceed();
 * 	 1)、如果没有拦截器执行执行目标方法,或者拦截器的索引和拦截器数组-1大小一样（指定到了最后一个拦截器）执行目标方法;
	//	We start with an index of -1 and increment early.
    if(this.currentInterceptorIndex ==this.interceptorsAndDynamicMethodMatchers.size() - 1) 		{
         return invokeJoinpoint();
    }
 *  2)、链式获取每一个拦截器,拦截器执行invoke方法,每一个拦截器等待下一个拦截器执行完成返回以后再来执行;
     @Override
      public Object invoke(MethodInvocation mi) throws Throwable {
        MethodInvocation oldInvocation = invocation.get();
        invocation.set(mi);
        try {
          return mi.proceed();
        }
        finally {
          invocation.set(oldInvocation);
        }
      }
 * 			拦截器链的机制,保证通知方法与目标方法的执行顺序;
 */
```

### 原理总结

```
/** 总结：
 * 1）、 @EnableAspectJAutoProxy 开启AOP功能
 * 2）、 @EnableAspectJAutoProxy 会给容器中注册一个组件 AnnotationAwareAspectJAutoProxyCreator
 * 3）、AnnotationAwareAspectJAutoProxyCreator是一个后置处理器;
 * 4）、容器的创建流程：
 * 	1）registerBeanPostProcessors()注册后置处理器;创建AnnotationAwareAspectJAutoProxyCreator对象
 * 	2）finishBeanFactoryInitialization（）初始化剩下的单实例bean
 * 		1）、创建业务逻辑组件和切面组件
 * 		2）、AnnotationAwareAspectJAutoProxyCreator拦截组件的创建过程
 * 		3）、组件创建完之后,判断组件是否需要增强
 * 			是：切面的通知方法,包装成增强器（Advisor）;给业务逻辑组件创建一个代理对象（cglib）;
 * 5）、执行目标方法：
 * 	1）、代理对象执行目标方法
 * 	2）、CglibAopProxy.intercept();
 * 		1）、得到目标方法的拦截器链（增强器包装成拦截器MethodInterceptor）
 * 		2）、利用拦截器的链式机制,依次进入每一个拦截器进行执行;
 * 		3）、效果：
 * 			正常执行：前置通知-》目标方法-》后置通知-》返回通知
 * 			出现异常：前置通知-》目标方法-》后置通知-》异常通知
```

## 声明式事务

### 环境搭建

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>4.3.12.RELEASE</version>
</dependency>
```

```java
@Configuration
@ComponentScan(value = "tx")
public class MainConfigOfTx   {

    @Bean
    public DataSource dataSource() throws Exception {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser("root");
        dataSource.setPassword("password");
        dataSource.setJdbcUrl("jdbc:mysql://127.0.0.1:3306/test?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&verifyServerCertificate=false");
        dataSource.setDriverClass("com.mysql.jdbc.Driver");
        return dataSource;
    }
    @Bean
    public JdbcTemplate jdbcTemplate() throws Exception {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource());
        return jdbcTemplate;
    }
}
```

```java
@Repository
public class UserDao  {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    public void insertUser(){
        jdbcTemplate.update("insert into tbl_user(id,lastName,email)  values (?,?,?)",10,101,"123@qq.com");
    }
}
```

### 测试成功事务

```java
/**
 * @date 2021/10/14 0014
 * 1.导入相关依赖：
 *   数据源 数据库驱动 spring-jdbc
 * 2.配置数据源、jdbcTemplate (Spring提供的简化数据库操作的工具)操作数据
 * 3.给方法上标注@Transactional标识,表示当前方法是一个事务方法;
 * 4.@EnableTransactionManagement 开启基于注解的事务管理功能
 **/
@Configuration
@EnableTransactionManagement
@ComponentScan(value = "tx")
public class MainConfigOfTx   {

    @Bean
    public DataSource dataSource() throws Exception {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser("root");
        dataSource.setPassword("password");
        dataSource.setJdbcUrl("jdbc:mysql://127.0.0.1:3306/test?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&verifyServerCertificate=false");
        dataSource.setDriverClass("com.mysql.jdbc.Driver");
        return dataSource;
    }
    @Bean
    public JdbcTemplate jdbcTemplate() throws Exception {
        // Spring会对Configuration类做特殊处理，在容器中找组件的方法都是从容器中获取组件
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource());
        return jdbcTemplate;
    }
    @Bean
    public PlatformTransactionManager platformTransactionManager() throws Exception {
        PlatformTransactionManager platformTransactionManager = new DataSourceTransactionManager(dataSource());
        return platformTransactionManager;
    }
}
```

### 源码分析

```java
/** 原理：
 * 1）、@EnableTransactionManagement
 * 			利用TransactionManagementConfigurationSelector给容器中会导入组件
 * 			导入两个组件
 * 			AutoProxyRegistrar
 * 			ProxyTransactionManagementConfiguration
 * 2）、AutoProxyRegistrar：
 * 			给容器中注册一个 InfrastructureAdvisorAutoProxyCreator 组件;
 * 			InfrastructureAdvisorAutoProxyCreator：？
 * 			利用后置处理器机制在对象创建以后,包装对象,返回一个代理对象（增强器）,代理对象执行方法利用拦截器链进行调用;
 * 
 * 3）、ProxyTransactionManagementConfiguration 做了什么？
 * 	1、给容器中注册事务增强器;
 * 		1）、事务增强器要用事务注解的信息,AnnotationTransactionAttributeSource解析事务注解
 * 		2）、事务拦截器：
 * 			TransactionInterceptor;保存了事务属性信息,事务管理器;
 * 			他是一个 MethodInterceptor;
 * 			在目标方法执行的时候;
 * 				执行拦截器链;
 * 				事务拦截器：
 * 					1）、先获取事务相关的属性
 * 					2）、再获取PlatformTransactionManager,如果事先没有添加指定任何transactionmanger
 * 					最终会从容器中按照类型获取一个PlatformTransactionManager;
 * 					3）、执行目标方法
 * 						如果异常,获取到事务管理器,利用事务管理回滚操作;
 * 						如果正常,利用事务管理器,提交事务
 * 			
```

## 扩展原理

### BeanFactoryPostProcessor

```java
/**
 * 扩展原理：
 * BeanPostProcessor：bean后置处理器,bean创建对象初始化前后进行拦截工作的
 * 
 * 1、BeanFactoryPostProcessor：beanFactory的后置处理器;
 * 		在BeanFactory标准初始化之后调用,来定制和修改BeanFactory的内容;
 * 		所有的bean定义已经保存加载到beanFactory,但是bean的实例还未创建
 * 
 * 
 * BeanFactoryPostProcessor原理:
 * 1)、ioc容器创建对象
 * 2)、invokeBeanFactoryPostProcessors(beanFactory);
 * 		如何找到所有的BeanFactoryPostProcessor并执行他们的方法;
 * 			1）、直接在BeanFactory中找到所有类型是BeanFactoryPostProcessor的组件,并执行他们的方法
 * 			2）、在初始化创建其他组件前面执行
 */
@Configuration
@ComponentScan("ext")
public class extConfig {
    @Bean
    public Car car(){
        return new Car();
    }
}
```

### BeanDefinitionRegistryPostProcessor

```java
/**  2、BeanDefinitionRegistryPostProcessor extends BeanFactoryPostProcessor
 * 		postProcessBeanDefinitionRegistry();
 * 		在所有bean定义信息将要被加载,bean实例还未创建的;
 * 
 * 		优先于BeanFactoryPostProcessor执行;
 * 		利用BeanDefinitionRegistryPostProcessor给容器中再额外添加一些组件;  
 * 	原理：
 * 		1）、ioc创建对象
 * 		2）、refresh()-》invokeBeanFactoryPostProcessors(beanFactory);
 * 		3）、从容器中获取到所有的BeanDefinitionRegistryPostProcessor组件。
 * 			1、依次触发所有的postProcessBeanDefinitionRegistry()方法
 * 			2、再来触发postProcessBeanFactory()方法BeanFactoryPostProcessor;
 * 
 * 		4）、再来从容器中找到BeanFactoryPostProcessor组件;然后依次触发postProcessBeanFactory()方法
 */
@Component
public class MyBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor{

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // TODO Auto-generated method stub
        System.out.println("MyBeanDefinitionRegistryPostProcessor...bean的数量："
                           +beanFactory.getBeanDefinitionCount());
    }

    //BeanDefinitionRegistry Bean定义信息的保存中心,以后BeanFactory就是按照BeanDefinitionRegistry里面保存的每一个bean定义信息创建bean实例;
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        // TODO Auto-generated method stub
        System.out.println("postProcessBeanDefinitionRegistry...bean的数量："
                           +registry.getBeanDefinitionCount());
        //RootBeanDefinition beanDefinition = new RootBeanDefinition(Blue.class);
        AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder.rootBeanDefinition(Blue.class).getBeanDefinition();
        registry.registerBeanDefinition("hello", beanDefinition);
    }
}
```

### ApplicationListener

```java
/** 3、ApplicationListener：监听容器中发布的事件。事件驱动模型开发;
 * 	  public interface ApplicationListener<E extends ApplicationEvent>
 * 		监听 ApplicationEvent 及其下面的子事件;
 * 
 * 	 步骤：
 * 		1）、写一个监听器（ApplicationListener实现类）来监听某个事件（ApplicationEvent及其子类）
 * 			@EventListener;
 * 			原理：使用EventListenerMethodProcessor处理器来解析方法上的@EventListener;
 * 
 * 		2）、把监听器加入到容器;
 * 		3）、只要容器中有相关事件的发布,我们就能监听到这个事件;
 * 				ContextRefreshedEvent：容器刷新完成（所有bean都完全创建）会发布这个事件;
 * 				ContextClosedEvent：关闭容器会发布这个事件;
 * 		4）、发布一个事件：
 * 				applicationContext.publishEvent();
```

```java
@Component
public class myApplicationListener  implements ApplicationListener<ApplicationEvent> {
    //当容器中发布此事件以后,方法触发
    public void onApplicationEvent(ApplicationEvent event) {
        // TODO Auto-generated method stub
        System.out.println("收到事件："+event);
    }
}
```

```java
public void test_ext(){
    AnnotationConfigApplicationContext applicationContext =
        new AnnotationConfigApplicationContext(extConfig.class);
    applicationContext.publishEvent(new ApplicationEvent("我发布的事件") {
    });
    applicationContext.close();
}
```

### ApplicationListener原理

```java
 /** 原理：
 *  	ContextRefreshedEvent、IOCTest_Ext$1[source=我发布的时间]、ContextClosedEvent;
 *  1）、ContextRefreshedEvent事件：
 *  	1）、容器创建对象：refresh();
 *  	2）、finishRefresh();容器刷新完成会发布ContextRefreshedEvent事件
 *  2）、自己发布事件;
 *  3）、容器关闭会发布ContextClosedEvent;
 *  
 *  【事件发布流程】：
 *  	3）、publishEvent(new ContextRefreshedEvent(this));
 *  			1）、获取事件的多播器（派发器）：getApplicationEventMulticaster()
 *  			2）、multicastEvent派发事件：
 *  			3）、获取到所有的ApplicationListener;
 *  				for (final ApplicationListener<?> listener:getApplicationListeners(event, type)){
 *  				1）、如果有Executor,可以支持使用Executor进行异步派发;
 *  					Executor executor = getTaskExecutor();
 *  				2）、否则,同步的方式直接执行listener方法;invokeListener(listener, event);
 *  				 拿到listener回调onApplicationEvent方法;
 *  
 *  【事件多播器（派发器）】
 *  1）、容器创建对象：refresh();
 *  2）、initApplicationEventMulticaster();初始化ApplicationEventMulticaster;
 *  	1）、先去容器中找有没有id=“applicationEventMulticaster”的组件;
 *  	2）、如果没有this.applicationEventMulticaster=new SimpleApplicationEventMulticaster(beanFactory);
beanFactory.registerSingleton(APPLICATION_EVENT_MULTICASTER_BEAN_NAME,this.applicationEventMulticaster);
 *  	并且加入到容器中,我们就可以在其他组件要派发事件,自动注入这个applicationEventMulticaster;
 *  
 *  【容器中有哪些监听器】
 *  	1）、容器创建对象：refresh();
 *  	2）、registerListeners();
 *  		从容器中拿到所有的监听器,把他们注册到applicationEventMulticaster中;
 *  		String[] listenerBeanNames = getBeanNamesForType(ApplicationListener.class, true, false);
 *  		//将listener注册到ApplicationEventMulticaster中
 *  		getApplicationEventMulticaster().addApplicationListenerBean(listenerBeanName);
 */	
```

### @EventListener与SmartInitializingSingleton

```java
/** @EventListener;
 *原理：使用EventListenerMethodProcessor处理器来解析方法上的@EventListener;
 
  SmartInitializingSingleton 原理：->afterSingletonsInstantiated();
 *  1）、ioc容器创建对象并refresh();
 *  2）、finishBeanFactoryInitialization(beanFactory);初始化剩下的单实例bean;
 *   	1）、先创建所有的单实例bean;getBean();
 *   	2）、获取所有创建好的单实例bean,判断是否是SmartInitializingSingleton类型的;
 *   		如果是就调用afterSingletonsInstantiated();
```

## Spring容器创建

### BeanFactory预准备

```java
Spring容器的refresh()[创建 刷新]
  1.prepareRefresh()刷新前的预处理;
    1)initPropertySources()初始化一些属性设置;子类自定义个性化的属性设置方法;
       // Initialize any placeholder property sources in the context environment
		initPropertySources();
    2)getEnvironment().validateRequiredProperties();检验属性的合法等
        // Validate that all properties marked as required are resolvable
		// see ConfigurablePropertyResolver#setRequiredProperties
		getEnvironment().validateRequiredProperties();
    3)this.earlyApplicationEvents 保存容器中的一些早期的事件 
        // Allow for the collection of early ApplicationEvents,
		// to be published once the multicaster is available...
		this.earlyApplicationEvents = new LinkedHashSet<ApplicationEvent>();
  2. obtainFreshBeanFactory()获取beanFactory;
	1)refreshBeanFactory();刷新【创建】beanFactory;
        创建了一个this.beanFactory = new DefaultListableBeanFactory();并设置序列化id;
    2）getBeanFactory();返回GenericApplicationContext创建的beanFactory对象;
    3）将创建的beanFactory【DefaultListableBeanFactory】返回
  3.prepareBeanFactory(beanFactory);beanFactory的预准备工作（beanFactory进行一些设置）
    1)设置BeanFactory的类加载器、支持表达式解析器...
    2)添加BeanPostProcessor【ApplicationContextAwareProcessor】
    3）忽略自动装配的的接口EnvironmentWare
    	beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
		beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
		beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
		beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
		beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
		beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
		beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);
    4）注册可以解析的自动装配,我们能直接在组件中自动注入BeanFactory、ResourceLoader、ApplicationEventPublisher、ApplicationContext
    	// BeanFactory interface not registered as resolvable type in a plain factory.
		// MessageSource registered (and found for autowiring) as a bean.
		beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
		beanFactory.registerResolvableDependency(ResourceLoader.class, this);
		beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
		beanFactory.registerResolvableDependency(ApplicationContext.class, this);
     5）添加BeanPostProcessor【ApplicationListenerDetector】
       // Register early post-processor for detecting inner beans as ApplicationListeners.
		beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));
	 6）添加编译的AspectJ
     7）给BeanFactory注册一些可用的组件
           environment【ConfigurableEnvironment】
           Map<String, Object> getSystemProperties()
           Map<String, Object> getSystemEnvironment();
   4.postProcessBeanFactory beanFactory准备工作完成后的后置处理工作
    	// Allows post-processing of the bean factory in context subclasses.
		postProcessBeanFactory(beanFactory);
		1）子类通过重写该方法来在beanFactory准备工作完成后进行进一步的设置工作
           ==================以上是BeanFactory的创建以及预准备工作======================
```

### 执行BeanFactoryPostProcessor

```java
// Invoke factory processors registered as beans in the context.
5.invokeBeanFactoryPostProcessors(beanFactory);执行invokeBeanFactoryPostProcessors
    BeanFactoryPostProcessor：BeanFactory的后置处理器：在BeanFactory标准初始化后执行的
    两个接口：BeanFactoryPostProcessor 、BeanDefinitionRegistryPostProcessor
    1）执行BeanFactoryPostProcessor方法：
       1）获取所有的BeanDefinitionRegistryPostProcessor;
       2）先执行实现了PriorityOrdered优先接口的BeanDefinitionRegistryPostProcessor,
         postProcessor.postProcessBeanDefinitionRegistry(registry);
       3）再执行实现了Order接口的BeanDefinitionRegistryPostProcessor
         postProcessor.postProcessBeanDefinitionRegistry(registry);
       4）最后执行没有实现优先接口或Order接口的BeanDefinitionRegistryPostProcessor
         postProcessor.postProcessBeanDefinitionRegistry(registry);
```

### 注册BeanPostProcessors

```java
6.registerBeanPostProcessors(beanFactory);注册BeanPostProcessors【后置处理器】,拦截bean的创建
	// Register bean processors that intercept bean creation.
	registerBeanPostProcessors(beanFactory);
    不同类型的BeanPostProcessor接口在bean创建前后的执行时机是不一样的
	BeanPostProcessors、
    DestructionAwareBeanPostProcessor、
    InstantiationAwareBeanPostProcessor、
    SmartInstantiationAwareBeanPostProcessor、
    MergedBeanDefinitionPostProcessor
    
  1)获取所有的BeanPostProcessor,后置处理器可以通过PriorityOrdered、Ordered接口来执行优先级
  2）先注册实现PriorityOrdered优先级接口的BeanPostProcessors;
       把每个BeanPostProcessor添加到BeanFactory中;
       beanFactory.addBeanPostProcessor(postProcessor);
  3)再注册实现Ordered接口的BeanPostProcessor;
  4)最后注册没有实现任何优先级的BeanPostProcessor;
  5)最终注册MergedBeanDefinitionPostProcessor;
  6）注册一个ApplicationListenerDetector,来在bean创建完成后检查是否是ApplicationListenerDetector,如果是
     this.applicationContext.addApplicationListener((ApplicationListener<?>) bean);
```

### 初始化MessageSource

```java
7.initMessageSource();初始化MessageSource组件（做国际化、消息绑定、消息解析）
	// Initialize message source for this context.
 	initMessageSource();
	1）获取BeanFactory;getBeanFactory();
	2）看容器中是否有id为的messSource组件
        如果有赋值给：
            this.messageSource=beanFactory.getBean(MESSAGE_SOURCE_BEAN_NAME,MessageSource.class);
        如果没有就自己创建：
            DelegatingMessageSource dms = new DelegatingMessageSource();
            MessageSource取出国际化配置文件的某个key的值,能按照区域信息获取;
  	3）把创建好的MessageSource注册到容器中,以后获取国际化配置的值的时候,自动注入MessageSource
        beanFactory.registerSingleton(MESSAGE_SOURCE_BEAN_NAME, this.messageSource);
        MessageSource.getMessage(String code, Object[] args, String defaultMessage, Locale locale);
```

### 初始化事件派发器、监听器等

```java
8.initApplicationEventMulticaster初始化事件派发器
	// Initialize event multicaster for this context.
	initApplicationEventMulticaster();
	1)获取beanFactory; 
		ConfigurableListableBeanFactory beanFactory = getBeanFactory();
	2)从BeanFactory中获取applicationEventMulticaster的ApplicationEventMulticaster组件;
  	3）判断是否有applicationEventMulticaster,如果没有就创建SimpleApplicationEventMulticaster;
    	this.applicationEventMulticaster =new SimpleApplicationEventMulticaster(beanFactory);
	4）将创建的applicationEventMulticaster添加到BeanFactory中,以后其他组件使用时自动注入;
    beanFactory.registerSingleton(APPLICATION_EVENT_MULTICASTER_BEAN_NAME,this.applicationEventMulticaster);
9.onRefresh();留给子容器（子类）重写;
    1)子类重写该方法;在容器刷新时自定义逻辑;
10.registerListeners();将容器中所有的ApplicationListenter都注册进来
    1)从容器中拿到所有的ApplicationListener
    2）将监听器添加到派发器
      getApplicationEventMulticaster().addApplicationListener(listener);
	3）派发之前步骤产生的事件
```

### 创建Bean准备与创建完成

```
11.	finishBeanFactoryInitialization(beanFactory);初始化剩下的所有单实例bean;
    // Instantiate all remaining (non-lazy-init) singletons.
	 finishBeanFactoryInitialization(beanFactory);
	1.beanFactory.preInstantiateSingletons();初始化剩下的所有单实例bean;
    // Instantiate all remaining (non-lazy-init) singletons.
		beanFactory.preInstantiateSingletons();
		1）获取容器的所有的bean,依次进行初始化和创建
        2）获取bean的定义信息RootBeanDefinitinon
        3)bean不是抽象的,但是单实例的,懒加载的;
            !bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()
            1）判断是否是FactoryBean,是否是实现FactoryBean接口的bean
                isFactoryBean(beanName)
            2）如果不是工厂bean;则利用getBean（beanName）,创建对象;
                0. getBean(beanName)--->ioc.getBean(beanName)
                1. doGetBean(name, null, null, false);
	2.先获取缓存中的单实例bean,如果能获取到则说明这个bean之前创建过,（所有创建过的bean都会被缓存起来）
    	// Eagerly check singleton cache for manually registered singletons.
        Object sharedInstance = getSingleton(beanName);
        /** Cache of singleton objects: bean name --> bean instance */
        private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(256);
    3.缓存中获取不到,则开始创建流程
    4.标记当前bean是否已创建
      if (!typeCheckOnly) {
        markBeanAsCreated(beanName);
      }
	5.获取bean的定义信息
      final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
	6.获取当前bean依赖的其他bean,如果有则按照getBean()把依赖的bean创建出来
        // Guarantee initialization of beans that the current bean depends on.
		String[] dependsOn = mbd.getDependsOn();
	7.启动单实例bean的创建流程：
         1.createBean(beanName, mbd, args)
		 2.// Give BeanPostProcessors a chance to
           return a proxy instead of the target bean instance.
			Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
		   让BeanPostProcessor先拦截返回代理对象
           InstantiationAwareBeanPostProcessor：提前执行
           先触发ibp.postProcessBeforeInstantiation(beanClass, beanName);
		   如果有返回值,再触发postProcessAfterInitialization(result, beanName);
		 3.前面的InstantiationAwareBeanPostProcessor没有返回代理对象,则进行创建流程4
         4.Object beanInstance = doCreateBean(beanName, mbdToUse, args);创建bean;
                1.【创建bean实例】 createBeanInstance(beanName, mbd, args);
					利用工厂方法或对象的构造器创建出bean实例
                2.applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
					调用postProcessMergedBeanDefinition方法：
                	bdp.postProcessMergedBeanDefinition(mbd, beanType, beanName);
			 	3.【bean赋值】populateBean(beanName, mbd, instanceWrapper);
				   赋值之前：
                  1）拿到InstantiationAwareBeanPostProcessor后置处理器;
                       调用postProcessAfterInstantiation
                  2）拿到InstantiationAwareBeanPostProcessor后置处理器;
                       调用postProcessPropertyValues
                            ======赋值之前======
                  3.应用bean属性的值：为属性利用setter等方法进行赋值
                         applyPropertyValues(beanName, mbd, bw, pvs);
				  4.【bean初始化】initializeBean(beanName, exposedObject, mbd);
						1）invokeAwareMethods(beanName, bean);执行xxxware接口的方法;
                     BeanClassLoaderAware、BeanNameAware、BeanFactoryAware
            			2）【执行后置处理器执行之前】
                     applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
							beanProcessor.postProcessBeforeInitialization(result, beanName);
						3）【执行初始化方法】invokeInitMethods(beanName, wrappedBean, mbd);
								1）是否为InitializingBean接口的实现;执行接口指定的初始化方法;
             					2）是否自定义初始化方法;
            			4）【执行后置处理器初始化之后】
               				applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
			    			beanProcessor.postProcessAfterInitialization(result, beanName);
					5.注册销毁方法
                       registerDisposableBeanIfNecessary(beanName, bean, mbd);
		  5.将创建的bean添加到singletonObjects
               addSingleton(beanName, singletonObject);
Ioc容器就是这些map,很多map保存了单实例bean,环境信息等。。。
```

### 容器创建完成

```java
所有bean利用getBean创建完成后,检查所有的bean是否实现SmartInitializingSingleton,如果是,就执行
smartSingleton.afterSingletonsInstantiated();
```

```
12.finshRefresh();完成BeanFactory的初始化创建工作,IOC容器创建完成。

1. initLifecycleProcessor();初始化生命周期有关的后置处理器 LifecycleProcessor
  - 默认从容器中找lifecycleProcessor【LifecycleProcessor】

2. 如果没有则;
  DefaultLifecycleProcessor defaultProcessor = new DefaultLifecycleProcessor();、
      加入到容器中
      // Initialize lifecycle processor for this context.
      initLifecycleProcessor();
  写一个LifecycleProcessor的实现类型（id必须为lifecycleProcessor）,可以在BeanFactory
      void onRefresh() 
      void onClose()
3. getLifecycleProcessor().onRefresh();
  拿到前面定义的生命周期处理器（BeanFactory）,回调onRefresh()
4. publishEvent	 发布容器刷新事件
      // Publish the final event.
      publishEvent(new ContextRefreshedEvent(this));
5. LiveBeansView.registerApplicationContext(this);
```

## Spring源码总结

```
总结
1）spring在容器启动时,先会保存所有注册进来的bean定义信息

    1. xml注册bean <bean>

    2. 注解注册bean @Service @Component @Bean

2)Spring容器会在合适的时机创建这些bean

    1. 用到这个bean时利用getBean创建bean,创建好保存在容器中
    2. 统一创建剩下所有的bean时,finishBeanFactoryInitialization

3)后置处理器：
   1.每个bean创建完成,都会使用各种后置处理器进行处理,来增强bean的功能。
      AutowiredAnnotationBeanPostProcessor：处理自动注入
      AnnotationAwareAspectJAutoProxyCreator：来做AOP代理对象
4)事件驱动模型：
    ApplicationListener;事件监听
    ApplicationEventMulticaster;事件派发
```



## servlet3.0（在javaweb中学习,此处不学）

### -简介&测试

servlet3.0-与SpringMVC整合分析

使用servletContext注册web组件（Filter，Servlet，Listenter）