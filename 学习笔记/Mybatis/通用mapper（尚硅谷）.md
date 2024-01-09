#  **1** **引入**

## 1.1作用

替我们生成常用增删改查操作的 SQL 语句。 

## 1.2代码官方发布地址

https://gitee.com/free 

https://gitee.com/free/Mapper/wikis/1.1-java?parent=1.integration 

## 1.3前置知识

MyBatis 

Spring 

# 2 快速入门

## 2.1创建测试数据

> SQL 语句

```sql
CREATE TABLE `table_emp` ( 
  `emp_id` int NOT NULL AUTO_INCREMENT ,
  `emp_name` varchar(500) NULL , 
  `emp_salary` double(15,5) NULL ,
	`emp_age` int NULL , PRIMARY KEY (`emp_id`) 
);
INSERT INTO `table_emp` (`emp_name`, `emp_salary`, `emp_age`) VALUES ('tom', '1254.37', '27'); 
INSERT INTO `table_emp` (`emp_name`, `emp_salary`, `emp_age`) VALUES ('jerry', '6635.42', '38'); 
INSERT INTO `table_emp` (`emp_name`, `emp_salary`, `emp_age`) VALUES ('bob', '5560.11', '40');
INSERT INTO `table_emp` (`emp_name`, `emp_salary`, `emp_age`) VALUES ('kate', '2209.11', '22'); 
INSERT INTO `table_emp` (`emp_name`, `emp_salary`, `emp_age`) VALUES ('justin', '4203.15', '30');
```

> Java 实体类 

考虑到基本数据类型在 Java 类中都有默认值，会导致 MyBatis 在执行相关操作时很难判断当前字段是否为 null，所以在 MyBatis 环境下使用 Java 实体类时尽量不要使用基本数据类型，都使用对应的包装类型。

```java
package com.atguigu.mapper.entities;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name="table_emp")
public class Employee {	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer empId;//emp_id
	private String empName;//emp_name
	@Column(name="emp_salary")
	private Double empSalary;//emp_salary
	private Integer empAge;//emp_age
	public Employee() {
		
	}

	public Employee(Integer empId, String empName, Double empSalary, Integer empAge) {
		super();
		this.empId = empId;
		this.empName = empName;
		this.empSalary = empSalary;
		this.empAge = empAge;
	}

	@Override
	public String toString() {
		return "Employee [empId=" + empId + ", empName=" + empName + ", empSalary=" + empSalary + ", empAge=" + empAge
				+ "]";
	}

	public Integer getEmpId() {
		return empId;
	}

	public void setEmpId(Integer empId) {
		this.empId = empId;
	}

	public String getEmpName() {
		return empName;
	}

	public void setEmpName(String empName) {
		this.empName = empName;
	}

	public Double getEmpSalary() {
		return empSalary;
	}

	public void setEmpSalary(Double empSalary) {
		this.empSalary = empSalary;
	}

	public Integer getEmpAge() {
		return empAge;
	}

	public void setEmpAge(Integer empAge) {
		this.empAge = empAge;
	}

}
```

## 2.2搭建MyBatis+Spring开发环境

## 2.3集成Mapper

> 加入 Maven 依赖信息

```xml
<dependency> 
    <groupId>tk.mybatis</groupId> 
    <artifactId>mapper</artifactId> 
    <version>4.0.0-beta3</version> 
</dependency>
```

> 修改 Spring 配置文件

```xml
<!-- 整合通用 Mapper 所需要做的配置修改： -->
<!-- 原始全类名：org.mybatis.spring.mapper.MapperScannerConfigurer --> 
<!-- 通用 Mapper 使用：tk.mybatis.spring.mapper.MapperScannerConfigurer -->
<bean class="tk.mybatis.spring.mapper.MapperScannerConfigurer"> 
	<property name="basePackage" value="com.atguigu.mapper.mappers"/>
</bean>
```

## 2.4第一个操作

```java
/*** 具 体 操 作 数 据 库 的 Mapper 接 口 ， 需 要 继 承 通 用 Mapper 提 供 的 核 心 接 口 ： Mapper<Employee>
* 泛型类型就是实体类的类型 
* @author Lenovo
**/ 
public interface EmployeeMapper extends Mapper<Employee> { 

}
```

# **3** 常用注解

## **3.1@Table** **注解** 

作用：建立实体类和数据库表之间的对应关系。 

默认规则：实体类类名首字母小写作为表名。Employee 类→employee 表。 

用法：在@Table 注解的 name 属性中指定目标数据库表的表名

```java
/**
 * employees
 * @author 
 */
@Data
@Table(name = "employees")
public class Employees implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //@GeneratedValue(generator ="JDBC" )
    @Column(name = "id")
    private Integer id;

    /**
     * 姓名
     */
    @Column(name = "name")
    private String name;

    /**
     * 年龄
     */
    @Column(name = "age")
    private Integer age;

    /**
     * 职位
     */
    @Column(name = "position")
    private String position;

    /**
     * 入职时间
     */
    @Column(name = "hire_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date hireTime;

    private static final long serialVersionUID = 1L;
}
```

## 3.2@Column注解

作用：建立实体类字段和数据库表字段之间的对应关系。 

默认规则： 

实体类字段：驼峰式命名 

数据库表字段：使用"\_"区分各个单词 

用法：在@Column 注解的 name 属性中指定目标字段的字段名

```java
/**
 * 入职时间
 */
@Column(name = "hire_time")
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private Date hireTime;
```

## 3.3@Id 注解

通用 Mapper 在执行 xxxByPrimaryKey(key)方法时，有两种情况。 

情况 1：没有使用@Id 注解明确指定主键字段 

```sql
SELECT
	emp_id,
	emp_name,
	emp_salary_apple,
	emp_age 
FROM
	tabple_emp 
WHERE
	emp_id = ? 
	AND emp_name = ? 
	AND emp_salary_apple = ? 
	AND emp_age = ?
```

之所以会生成上面这样的 WHERE 子句是因为通用 Mapper 将实体类中的所有字段都拿来放在一起作为联合主键。 

情况 2：使用@Id 主键明确标记和数据库表中主键字段对应的实体类字段。

![image-20210620103419014](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127556.png)

## 3.4@GeneratedValue注解

作用：让通用 Mapper 在执行 insert 操作之后将数据库自动生成的主键值回写到实体类对象中。 

自增主键用法： 

![image-20210620103538668](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127106.png)

序列主键用法：

![image-20210620103757861](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127715.png)

应用场景：购物车结账 

> 增加商品销量... 

> 减少商品库存... 

> 生成订单数据→封装到 Order 对象中→保存 Order 对象→数据库自动生成主键值→回写到实体类对象 Order 中 

> 生成一系列订单详情数据→List\<OrderItem>→在每一个 OrderItem 中设置 Order 对象的主键值作为外键→批量保存 List\<OrderItem> …… 

## 3.5@Transient主键

用于标记不与数据库表字段对应的实体类字段。

```java
@Transient
private String otherThings; //非数据库表中字段
```

# 4 常用方法

## 4.1selectOne方法

> 通用 Mapper 替我们自动生成的 SQL 语句情况

```sql
 Preparing: SELECT emp_id,emp_name,emp_salary,emp_age FROM table_emp WHERE emp_name = ? AND emp_salary = ?   
[DEBUG] 2021-06-20 10:13:24,072(4114) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: bob(String), 5560.11(Double) 
```

> 实体类封装查询条件生成 WHERE子句的规则

1. 使用非空的值生成 WHERE 子句 
2. 在条件表达式中使用“=”进行比较

> 要求必须返回一个实体类结果，如果有多个，则会抛出异常

```sql
org.mybatis.spring.MyBatisSystemException: nested exception is org.apache.ibatis.exceptions.TooManyResultsException: Expected one result (or null) to be returned by selectOne(), but found: 2
```

## 4.2xxxByPrimaryKey方法

**需要使用@Id 主键明确标记和数据库表主键字段对应的实体类字段，否则通用 Mapper 会将所有实体类字段作为联合主键。**

1. SelectByPrimaryKey()

   ```java
   @Test
   public void testSelectByPrimaryKey() {
   
       //1.提供id值
       Integer empId = 3;
   
       //2.执行根据主键进行的查询
       Employee employee = employeeService.getEmployeeById(empId);
   
       //3.打印结果
       System.out.println(employee);
   
   }
   Preparing: SELECT emp_id,emp_name,emp_salary,emp_age FROM table_emp WHERE emp_id = ?   
       [DEBUG] 2021-06-20 10:51:05,487(4017) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: 3(Integer)  
   ```

2. UpdateByPrimaryKey() 会更新为空的字段，导致该字段为空

   ```java
   
   @Test
   public void testUpdateByPrimaryKey() {
       Employee employee = new Employee();
       employee.setEmpAge(30);
       employee.setEmpId(6);
       employee.setEmpName("wowosong");
       int i = employeeMapper.updateByPrimaryKey(employee);
       System.out.println(i);
   }
   
   ```

   ```sql
   UPDATE table_emp SET emp_id = emp_id,emp_name = ?,emp_salary = ?,emp_age = ? WHERE emp_id = ?   
   [DEBUG] 2021-06-20 11:00:06,163(4242) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: wowosong(String), null, 30(Integer), 6(Integer)
   ```

3. DeleteByPrimaryKey()

   ```java
   @Test
   public void testDeleteByPrimaryKey() {
   
       //1.提供主键值
       Integer empId = 13;
       //2.执行删除
       employeeMapper.deleteByPrimaryKey(empId);
   }
   ```
   
   ```sql
   Preparing: DELETE FROM table_emp WHERE emp_id = ?   
   [DEBUG] 2021-06-20 11:02:43,598(4379) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: 13(Integer)
   ```
   
4. ExistsWithPrimaryKey()

   ```java
   @Test
   public void testExistsWithPrimaryKey() {	
       //1.提供主键值
       Integer empId = 33;
       //2.执行查询
       boolean exists = employeeService.isExists(empId);
       //3.打印结果
       System.out.println(exists);
   }
   ```

```sql
Preparing: SELECT CASE WHEN COUNT(emp_id) > 0 THEN 1 ELSE 0 END AS result FROM table_emp WHERE emp_id = ?   
[DEBUG] 2021-06-20 17:30:16,104(3541) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: 33(Integer)  
```

## 4.3xxxSelective方法

**非主键字段如果为 null 值，则不加入到 SQL 语句中。**

1. InsertSelective()

   ```java
   @Test
   public void testInsertSelective() {		
       //1.创建实体类对象封装要保存到数据库的数据
       Employee employee = new Employee(null, "emp04", null, 23);		
       //2.执行插入操作
       employeeMapper.insertSelective(employee);		
   }
   ```
   
   ```sql
   Preparing: INSERT INTO table_emp ( emp_id,emp_name,emp_age ) VALUES( ?,?,? )   
   [DEBUG] 2021-06-20 11:09:10,756(3843) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: null, emp04(String), 23(Integer) 
   ```
   
2. Insert()

   ```java
   @Test
   public void testInsert() {	
       //1.创建实体类对象封装要保存到数据库的数据
       Employee employee = new Employee(null, "emp03", 3000.00, 23);	
       //2.执行插入操作
       employeeService.saveEmployee(employee);	
       //3.获取employee对象的主键字段值
       Integer empId = employee.getEmpId();
       System.out.println("empId="+empId);	
   }
   ```
   
3. UpdateByPrimaryKeySelective()

   ```java
   @Test
   public void testUpdateByPrimaryKeySelective() {
       //1.创建用于测试的实体类
       Employee employee = new Employee(7, "empNewName", null, null);
       //2.执行更新
       employeeMapper.updateByPrimaryKeySelective(employee);		
   }
   ```
   
   ```sql
   UPDATE table_emp SET emp_id = emp_id,emp_name = ? WHERE emp_id = ?   
   [DEBUG] 2021-06-20 11:11:22,089(4341) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: empNewName(String), 7(Integer) 
   ```
   

# 5 QBC查询

## 5.1概念

Query By Criteria 

Criteria 是 Criterion 的复数形式。意思是：规则、标准、准则。在 SQL 语句中相当于查询条件。 

QBC 查询是将查询条件通过 Java 对象进行模块化封装。

## 5.2示例代码

```java
//目标：WHERE (emp_salary>? AND emp_age<?) OR (emp_salary<? AND emp_age>?)
//1.创建 Example 对象 
Example example = new Example(Employee.class); 
//*********************** 
//i.设置排序信息
example.orderBy("empSalary").asc().orderBy("empAge").desc(); 
//ii.设置“去重” example.setDistinct(true); 
//iii.设置 select 字段 example.selectProperties("empName","empSalary"); 
//*********************** 
//2.通过 Example 对象创建 Criteria 对象

Criteria criteria01 = example.createCriteria(); 
Criteria criteria02 = example.createCriteria(); 
//3.在两个 Criteria 对象中分别设置查询条件 
//property 参数：实体类的属性名 
//value 参数：实体类的属性值 
criteria01.andGreaterThan("empSalary", 3000) .andLessThan("empAge", 25); 
criteria02.andLessThan("empSalary", 5000) .andGreaterThan("empAge", 30); 
//4.使用 OR 关键词组装两个 Criteria 对象
example.or(criteria02); 
//5.执行查询 
List<Employee> empList = employeeService.getEmpListByExample(example); 
for (Employee employee : empList) { 
    System.out.println(employee); 
}
```

```sql

 Preparing: SELECT distinct emp_name , emp_salary , emp_age FROM table_emp WHERE ( emp_salary > ? and emp_age < ? ) or ( emp_salary < ? and emp_age > ? ) order by emp_salary ASC,emp_age DESC   
[DEBUG] 2021-06-20 18:08:07,348(3811) --> [main] org.apache.ibatis.logging.jdbc.BaseJdbcLogger.debug(BaseJdbcLogger.java:139): ==> Parameters: 3000(Integer), 25(Integer), 5000(Integer), 30(Integer)  
```

**select 列名要出现在order 或group by 中**

# **6** **逆向工程** 

## 6.1原生MyBatis逆向工程和通用Mapper逆向工程对比

![image-20210620182006101](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127483.png)

pom.xml配置信息

```xml
<properties>
    <!-- ${basedir}引用工程根目录 -->
    <!-- targetJavaProject：声明存放源码的目录位置 -->
    <targetJavaProject>${basedir}/src/main/java</targetJavaProject>

    <!-- targetMapperPackage：声明MBG生成XxxMapper接口后存放的package位置 -->
    <targetMapperPackage>com.atguigu.shop.mappers</targetMapperPackage>

    <!-- targetModelPackage：声明MBG生成实体类后存放的package位置 -->
    <targetModelPackage>com.atguigu.shop.entities</targetModelPackage>

    <!-- targetResourcesProject：声明存放资源文件和XML配置文件的目录位置 -->
    <targetResourcesProject>${basedir}/src/main/resources</targetResourcesProject>

    <!-- targetXMLPackage：声明存放具体XxxMapper.xml文件的目录位置 -->
    <targetXMLPackage>mappers</targetXMLPackage>

    <!-- 通用Mapper的版本号 -->
    <mapper.version>4.0.0-beta3</mapper.version>

    <!-- MySQL驱动版本号 -->
    <mysql.version>5.1.37</mysql.version>
</properties>
```

plugin配置

```xml
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.2</version>

    <!-- 配置generatorConfig.xml配置文件的路径 -->
    <configuration>
        <configurationFile>${basedir}/src/main/resources/generator/generatorConfig.xml</configurationFile>
        <overwrite>true</overwrite>
        <verbose>true</verbose>
    </configuration>

    <!-- MBG插件的依赖信息 -->
    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper</artifactId>
            <version>${mapper.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

generatorConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <!-- 引入外部属性文件 -->
    <properties resource="config.properties" />

    <context id="Mysql" targetRuntime="MyBatis3Simple"
             defaultModelType="flat">
        <property name="beginningDelimiter" value="`" />
        <property name="endingDelimiter" value="`" />

        <!-- 配置通用Mapper的MBG插件相关信息 -->
        <plugin type="${mapper.plugin}">
            <property name="mappers" value="${mapper.Mapper}" />
        </plugin>

        <!-- 配置连接数据库的基本信息 -->
        <jdbcConnection 
                        driverClass="${jdbc.driverClass}"
                        connectionURL="${jdbc.url}" 
                        userId="${jdbc.user}" 
                        password="${jdbc.password}">
        </jdbcConnection>

        <!-- 配置Java实体类存放位置 -->
        <javaModelGenerator 
                            targetPackage="${targetModelPackage}"
                            targetProject="${targetJavaProject}" />

        <!-- 配置XxxMapper.xml存放位置 -->
        <sqlMapGenerator 
                         targetPackage="${targetXMLPackage}"
                         targetProject="${targetResourcesProject}" />

        <!-- 配置XxxMapper.java存放位置 -->
        <javaClientGenerator 
                             targetPackage="${targetMapperPackage}"
                             targetProject="${targetJavaProject}" 
                             type="XMLMAPPER" />

        <!-- 根据数据库表生成Java文件的相关规则 -->
        <!-- tableName="%"表示数据库中所有表都参与逆向工程，此时使用默认规则 -->
        <!-- 默认规则：table_dept→TableDept -->
        <!-- 不符合默认规则时需要使用tableName和domainObjectName两个属性明确指定 -->
        <table tableName="tabple_emp" domainObjectName="Employee">
            <!-- 配置主键生成策略 -->
            <generatedKey column="emp_id" sqlStatement="Mysql" identity="true" />
        </table>
    </context>
</generatorConfiguration>
```

**运行**

在 pom.xml 这一级目录的命令行窗口执行 `mvn mybatis-generator:generate`即可（前提是配置了mvn）。

![image-20210620185823833](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127828.png)

## 6.2参考文档地址

https://github.com/abel533/Mapper/wiki/4.1.mappergenerator

# **7** 自定义Mapper\<T>接口

![image-20210620191515136](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127969.png)

## 7.1用途

让我们可以根据开发的实际需要对 Mapper\<T>接口进行定制。

## 7.2创建自定义Mapper\<T>接口

自主选择要继承的mapper

```java
public interface MyMapper extends SelectMapper<Employees> {
    Employees getById(Integer id );
}
```

```java
public interface MyMapper<T> extends SelectMapper,SelectAllMapper,SelectByExampleMapper{

}

public interface EmployeeMapper extends MyMapper<Employee>{

}
```

## 7.3配置MapperScannerConfigurer注册MyMapper\<T>

```xml
<!-- 整合通用Mapper所需要做的配置修改： -->
<!-- 原始全类名：org.mybatis.spring.mapper.MapperScannerConfigurer -->
<!-- 通用Mapper使用：tk.mybatis.spring.mapper.MapperScannerConfigurer -->
<bean class="tk.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.atguigu.mapper.mappers"/>
    <property name="properties">
        <value>
            mappers=com.atguigu.shop.mymapper.MyMapper
        </value>
    </property>
</bean>
```

# **8** **通用** **Mapper** **接口扩展** 

## 8.1说明

这里的扩展是指增加通用 Mapper 没有提供的功能。 

## 8.2举例

通用 Mapper 官方文档中使用一个批量 insert 作为扩展功能的例子： 

```java
tk.mybatis.mapper.additional.insert.InsertListMapper<T> 
tk.mybatis.mapper.additional.insert.InsertListProvider 
```

我们来仿照写一个批量 update。假设我们想生成下面这样的 SQL 语句：

```sql
UPDATE tabple_emp SET emp_name=?,emp_age=?,emp_salary=? where emp_id=? ;
UPDATE tabple_emp SET emp_name=?,emp_age=?,emp_salary=? where emp_id=? ;
UPDATE tabple_emp SET emp_name=?,emp_age=?,emp_salary=? where emp_id=? ; 
…… 
```

为了生成上面那样的 SQL 语句，我们需要使用到 MyBatis 的 foreach 标签。

```sql
<foreach collection="list" item="record" separator=";" > 
  UPDATE tabple_emp 
  SET emp_name=#{record.empName}, 
  emp_age=#{record.empAge}, 
  emp_salary=#{record.empSalary} 
  where emp_id=#{record.empId} 
</foreach>
```

## 8.3我们需要提供的接口和实现类

![image-20210621220217397](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071127395.png)

## 8.4参考代码

```java
package com.atguigu.mapper.mine_mappers;

import org.apache.ibatis.annotations.UpdateProvider;

import java.util.List;

public interface MyBatchUpdateMapper<T> {
    @UpdateProvider(type =MyBatchUpdateProvider.class ,method = "dynamicSQL")
    void batchUpdate(List<T> list);
}

```

```java
package com.atguigu.mapper.mine_mappers;

import org.apache.ibatis.mapping.MappedStatement;
import tk.mybatis.mapper.mapperhelper.MapperHelper;
import tk.mybatis.mapper.mapperhelper.MapperTemplate;

public class MyBatchUpdateProvider extends MapperTemplate {
    public MyBatchUpdateProvider(Class<?> mapperClass, MapperHelper mapperHelper) {
        super(mapperClass, mapperHelper);
    }
    public void batchUpdate(MappedStatement statement){

    }
}
```

```java
package com.atguigu.mapper.mine_mappers;

import tk.mybatis.mapper.common.base.select.SelectAllMapper;
import tk.mybatis.mapper.common.example.SelectByExampleMapper;

public interface MyMapper<T> 
    extends SelectAllMapper<T>,SelectByExampleMapper<T> ,MyBatchUpdateMapper<T>{

}

```

```java
package com.atguigu.mapper.mine_mappers;

import org.apache.ibatis.mapping.MappedStatement;
import tk.mybatis.mapper.entity.EntityColumn;
import tk.mybatis.mapper.mapperhelper.EntityHelper;
import tk.mybatis.mapper.mapperhelper.MapperHelper;
import tk.mybatis.mapper.mapperhelper.MapperTemplate;
import tk.mybatis.mapper.mapperhelper.SqlHelper;

import java.util.Set;

public class MyBatchUpdateProvider extends MapperTemplate {
    public MyBatchUpdateProvider(Class<?> mapperClass, MapperHelper mapperHelper) {
        super(mapperClass, mapperHelper);
    }
    public String batchUpdate(MappedStatement statement){
        //        <foreach collection="list" item="record" separator=";" >
        //        UPDATE tabple_emp
        //            <set>
        //        SET emp_name=#{record.empName},
        //        emp_age=#{record.empAge},
        //        emp_salary=#{record.empSalary}
        //              </set>
        //        where emp_id=#{record.empId}
        //        </foreach>
        //1.实体类对象
        Class<?> entityClass = super.getEntityClass(statement);
        //2.表名对象
        String tableName = super.tableName(entityClass);
        StringBuilder stringBuilder= new StringBuilder();
        //3.开始拼sql
        stringBuilder.append("<foreach collection=\"list\" item=\"record\" separator=\";\" >");
        //4.拼update子句
        String updateTable = SqlHelper.updateTable(entityClass, tableName);
        stringBuilder.append(updateTable);
        //5.拼set子句
        //i. 获取所有列的信息
        Set<EntityColumn> columns = EntityHelper.getColumns(entityClass);
        stringBuilder.append("<set>");
        String idColunm=null;
        String idValue=null;
        //ii.遍历所有列
        for (EntityColumn column : columns) {
            //iii.判断当前列是否为主键列
            boolean isPrimaryKey = column.isId();
            if(isPrimaryKey){
                //iv.缓存主键列的列名和值
                idColunm = column.getColumn();
                idValue = column.getColumnHolder("record");
            }else {
                //v.获取非主键列的列名
                String columnColumn = column.getColumn();
                //vi.返回格式：#{entityName.age,jdbcType=NUMERIC,typeHandler=myTypeHandler}
                String columnHolder = column.getColumnHolder("record");
                stringBuilder.append(columnColumn).append("=").append(columnHolder).append(',');
            }
        }
        stringBuilder.append("</set>");
        //vii.拼where子句

        stringBuilder.append("where ").append(idColunm).append("=").append(idValue);
        stringBuilder.append("</foreach>");
        return stringBuilder.toString();
    }
}

```

```properties
jdbc.url=jdbc:mysql://localhost:3306/mp?useUnicode=true&characterEncoding=utf8&allowMultiQueries=true
开启allowMultiQueries，进行批量提交
```

# **9** 二级缓存

## **9.1MyBatis** 配置文件开启二级缓存功能

```xml
<settings> 
	<setting name="cacheEnabled" value="true"/> 
</settings>
```

## 9.2在XxxMapper接口上使用@CacheNamespace注解 

```java
@CacheNamespace 
public interface EmployeeMapper extends MyMapper<Employee> {

}
```

# **10** 类型处理器：TypeHandler

## 10.1简单类型和复杂类型

| 基本数据类型 | byte short int long double float char boolean |
| ------------ | --------------------------------------------- |
| 引用数据类型 | 类、接口、数组、枚举……                        |
| 简单类型     | 只有一个值的类型                              |
| 复杂类型     | 有多个值的类型                                |

**※通用 Mapper 默认情况下会忽略复杂类型，对复杂类型不进行“从类到表”的映射。**

## 10.2Address处理

### 10.2.1自定义类型转换器

![image-20210621232259141](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128555.png)

### 10.2.2 TypeHandler接口

```java
public interface TypeHandler<T> { 
    //将 parameter 设置到 ps 对象中，位置是 i

    //在这个方法中将 parameter 转换为字符串 
    void setParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException; 
    //根据列名从 ResultSet 中获取数据，通常是字符串形式
    //将字符串还原为 Java 对象，以 T 类型返回 
    T getResult(ResultSet rs, String columnName) throws SQLException;
    T getResult(ResultSet rs, int columnIndex) throws SQLException; 
    T getResult(CallableStatement cs, int columnIndex) throws SQLException;
}
```

### 10.2.3继承树

![image-20210621233111017](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128100.png)

### 10.2.4 BaseTypeHandler类中的抽象方法说明

```java
//将 parameter 对象转换为字符串存入到 ps 对象的 i 位置
public abstract void setNonNullParameter( PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException;
//从结果集中获取数据库对应查询结果
//将字符串还原为原始的 T 类型对象
public abstract T getNullableResult( ResultSet rs, String columnName) throws SQLException; 
public abstract T getNullableResult( ResultSet rs, int columnIndex) throws SQLException;
public abstract T getNullableResult( CallableStatement cs, int columnIndex) throws SQLException;
```

### 10.2.5自定义类型转换器类

```java
package com.atguigu.mapper.handler;

import com.atguigu.mapper.entities.Address;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AddressTypeHandler extends BaseTypeHandler<Address> {
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Address address, JdbcType jdbcType) throws SQLException {
        //对address对象进行验证
        if(address==null){
            return;
        }
        //从对象中取出值
        String city = address.getCity();
        String province = address.getProvince();
        String street = address.getStreet();
        //拼接成字符串
        //规则：各个字符串用"，"隔开
        StringBuilder stringBuilder=new StringBuilder();
        stringBuilder.append(province).append(",").append(street).append(",").append(city);
        String string = stringBuilder.toString();
        //设置参数
        preparedStatement.setString(i,string);
    }
    @Override
    public Address getNullableResult(ResultSet resultSet, String s) throws SQLException {
        //根据字段名从resultset取值
        String string = resultSet.getString(s);
        //验证string是否有效
        if(string==null || string.length()==0 ||string.contains(",")){
            return null;
        }
        //根据"，"对string值进行拆分
        String[] strings = string.split(",");
        String province = strings[0];
        String street =strings[1];
        String city=strings[2];
        //根据具体对象组装对象
        Address address = new Address(province, street, city);
        return address;
    }
    @Override
    public Address getNullableResult(ResultSet resultSet, int i) throws SQLException {
        //根据字段名从resultset取值
        String string = resultSet.getString(i);
        //验证string是否有效
        if(string==null || string.length()==0 ||string.contains(",")){
            return null;
        }
        //根据"，"对string值进行拆分
        String[] strings = string.split(",");
        String province = strings[0];
        String street =strings[1];
        String city=strings[2];
        //根据具体对象组装对象
        Address address = new Address(province, street, city);
        return address;
    }
    @Override
    public Address getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        //根据字段名从resultset取值
        String string = callableStatement.getString(i);
        //验证string是否有效
        if(string==null || string.length()==0 ||string.contains(",")){
            return null;
        }
        //根据"，"对string值进行拆分
        String[] strings = string.split(",");
        String province = strings[0];
        String street =strings[1];
        String city=strings[2];
        //根据具体对象组装对象
        Address address = new Address(province, street, city);
        return address;
    }
}

```

### 10.2.6注册自定义类型转换器

> 方法一 字段级别：@ColumnType 注解

![image-20210621233546515](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128029.png)

> 方法二 全局级别：在 MyBatis 配置文件中配置 typeHandlers

![image-20210621233636499](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128045.png)

![image-20210621233657972](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128228.png)

## 10.3枚举类型

### 10.3.1办法一：让通用Mapper把枚举类型作为简单类型处理

> 增加一个通用 Mapper 的配置项

在 Spring 配置文件中找到 MapperScannerConfigurer

![image-20210621234136053](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128233.png)

> 本质

使用了 org.apache.ibatis.type.EnumTypeHandler\<E>

### 10.3.2办法二：为枚举类型配置对应的类型处理器

![image-20210621234412998](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128230.png)

> 类型处理器

1. 内置

   org.apache.ibatis.type.EnumTypeHandler\<E> 

   ​	在数据库中存储枚举值本身 

   org.apache.ibatis.type.EnumOrdinalTypeHandler\<E> 

   ​	在数据库中仅仅存储枚举值的索引 

2. 自定义

> 内置枚举类型处理器注册 

（1）**不能使用@ColumnType 注解**

![image-20210622001956190](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128450.png)

（2）**需要在 MyBatis 配置文件中配置专门的类型处理器并在字段上使用 @Column 注解**

![image-20210622002204142](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128231.png)

※注意：加@Column 注解的作用是让通用 Mapper 不忽略枚举类型。

