# **IDE** **中常用的插件**

## **第** **1** **章 在** **Eclipse** **中使用** **Maven**

### **1.1** **安装** **Maven** **核心程序**

1) 下载地址：http://maven.apache.org/

2) 检查 JAVA_HOME 环境变量。Maven 是使用 Java 开发的，所以必须知道当前系统环境中 JDK 的安装目录。

```
C:\Users\韩总>echo %JAVA_HOME%
D:\Java\jdk1.8.0_111
```

3) 解压 Maven 的核心程序。

将 apache-maven-3.6.3-bin.zip 解压到一个**非中文无空格**的目录下。例如：

```
D:\apache-maven-3.6.3
```

4) 配置环境变量。 

```
MAVEN_HOME
D:\apache-maven-3.6.3
path
%MAVEN_HOME%\bin
```

5) ④查看 Maven 版本信息验证安装是否正确

```
C:\Users\韩总>mvn -v

Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)

Maven home: D:\apache-maven-3.6.3\bin\..

Java version: 1.8.0_111, vendor: Oracle Corporation, runtime: 

D:\Java\jdk1.8.0_111\jre

Default locale: zh_CN, platform encoding: GBK

OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

### **1.2** **配置本地仓库和阿里云镜像**

#### **1.2.1** **配置本地仓库**

1) Maven 的核心程序并不包含具体功能，仅负责宏观调度。具体功能由插件来完成。Maven 核心程序会到本地仓库中查找插件。如果本地仓库中没有就会从远程中央仓库下载。此时如果不能上网则无法执行 Maven 的具体功能。为了解决这个问题，我们可以将 Maven 的本地仓库指向一个在联网情况下下载好的目录。

2) Maven 默认的本地仓库：~\.m2\repository 目录。

Tips：~表示当前用户的家目录。

3) 找到 Maven 的核心配置文件 settings.xml 文件：

解压目录 D:\apache-maven-3.6.3\conf\settings.xml

4) 设置方式

```
<localRepository>本地仓库的路径</localRepository>
<localRepository>E:\LocalRepository</localRepository>
```

#### 1.2.2配置阿里云镜像

为了下载 jar 包方便，在 Maven 的核心配置文件 settings.xml 文件的<mirrors></mirrors>标签里面配置以下标签：

```
<mirror>
  <id>nexus-aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>Nexus aliyun</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

### **1.3** **在** **Eclipse** **中配置** **Maven**

**Eclipse 中默认自带 Maven 插件，但是自带的 Maven 插件不能修改本地仓库，所以通常我们不使用自带的 Maven，而是使用自己安装的，在 Eclipse 中配置 Maven 的步骤如下：**

1) 点击 Eclipse 中的 Window→Preferences

![image-20210825215005848](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300044.png)

2) 点开 Maven 前面的箭头，选择 Installations，点击 Add…

![image-20210825215158303](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300658.png)

3) 点击 Directory…选择我们安装的 Maven 核心程序的根目录，然后点击 Finish

![image-20210825215230867](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300473.png)

4) 勾上添加的 Maven 核心程序

![image-20210825215345048](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300233.png)

5) 选择 Maven 下的 User Settings，在全局设置哪儿点击 Browse…选择 Maven核心程序的配置文件 settings.xml，本地仓库会自动变为我们在 settings.xml文件中设置的路径

![image-20210825215435575](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300498.png)

###  **1.4** **在** **Eclipse** **中创建** **Maven** **项目**

#### **1.4.1** **创建** **Java** **工程**

1) 点击 File→New→Maven Project，弹出如下窗口

![image-20210825215656488](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071300810.png)

2) 点击 Next，配置坐标（GAV）及打包方式，然后点击 Finish

![image-20210825215727120](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301615.png)

3) 创建完工程之后发现默认的 JDK 的编译版本是 1.5，在 Maven 的核心配置文件 settings.xml 文件中添加以下配置将编译版本改为 1.8，重启 Eclipse 即可

```
<profile>
  <id>jdk-1.8</id>
  <activation>
    <activeByDefault>true</activeByDefault>
    <jdk>1.8</jdk>
  </activation>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
  </properties>
</profile>
```

4) 配置 Maven 的核心配置文件 pom.xml 文件

```
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
https://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion> 
<groupId>com.atguigu.maven</groupId>
<artifactId>Hello</artifactId>
<version>0.0.1-SNAPSHOT</version>
<dependencies> 
  <dependency>
    <groupId>junit</groupId> 
    <artifactId>junit</artifactId> 
    <version>4.12</version> 
    <scope>test</scope>
  </dependency>
  </dependencies>
</project>
```

5) 编写主代码

在 src/**main**/java 目录下创建包并创建 Hello.java 文件

```java
package com.atguigu.maven;
public class Hello {
public String sayHello(String name){
		return "Hello "+name+"!"; 
	} 
}
```

6) 编写测试代码

在 src/**test**/java 目录下创建包并创建 HelloTest.java 文件

```java
package com.atguigu.maven;
import org.junit.Test;
public class HelloTest {
	@Test
	public void testHello() {
    Hello hello = new Hello();
    String maven = hello.sayHello("Maven");
    System.out.println(maven);
	} 
}
```

7) 使用 Maven 的方式运行 Maven 工程

在工程名 Hello 或 pom.xml 上右键→Run As 运行 Maven 项目

![image-20210825220155842](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301873.png)

#### **1.4.2** **创建** **Web** **工程（了解）**

1) 创建简单的 Maven 工程，打包方式为 war 包

![image-20210825220311546](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301509.png)

2) 创建完成之后因缺少 web.xml 文件工程出现小红叉

![image-20210825220344465](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301549.png)

3) 在工程上右键→Build Path→Configure Build Path…

![image-20210825220419987](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301756.png)

4) 点击 Project Facets 欺骗 Eclipse 当前工程不是 Web 工程，点击应用

![image-20210825220453051](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071301364.png)

5) 再告诉 Eclipse 当前工程是一个 Web 工程，点击应用并关闭

![image-20210825220600814](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302626.png)

6) 发现 MavenWeb 工程小红叉消失，并出现了 WebContext 目录

![image-20210825220653309](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302760.png)

7) 在 WebContext 下创建 index.jsp 页面并添加 Tomcat 库

![image-20210825220733188](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302747.png)

8) 在 MavenWeb 上右键→Run As→Run on Server 部署到 Tomcat 上运行

#### **1.4.3** **创建父工程**

父工程的打包方式为 pom，父工程只需要保留 pom.xml 文件即可

1) 创建简单的 Maven 工程，打包方式选择 pom

![image-20210825221119704](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302575.png)

2) 在 pom.xml 文件中通过<dependencyManagement></dependencyManagement>标签进行依赖管理

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
https://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion> 
<groupId>com.atguigu.maven</groupId>
<artifactId>Parent</artifactId> 
<version>0.0.1-SNAPSHOT</version>
<packaging>pom</packaging>
<!-- 依赖管理 --> 
<dependencyManagement>
  <dependencies>
  <!-- 在此配置要管理的依赖 -->
  </dependencies>
  </dependencyManagement>
</project>
```

3) 在子工程中继承父工程

```xml
<!-- 继承 --> 
<parent>
<!-- 在此配置父工程的坐标 -->
</parent>
```

## **第** **2** **章 在** **Idea** **中使用** **Maven**

### **2.1** **在** **Idea** **中配置** **Maven**

Idea 中也自带 Maven 插件，而且我们也可以给自带的 Maven 插件进行配置，所以我们可以使用自带的 Maven，也可以使用我们安装的 Maven 核心程序

#### **2.1.1** **配置自带的** **Maven** **插件**

1) Idea 自带的 Maven 在 Idea 的安装目录的 plugins 目录中

![image-20210825221914767](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302490.png)

2) 在自带的 Maven 里配置了本地仓库之后打开 Idea 之后会发现本地仓库自动变成了我们设置的仓库

![image-20210825222251966](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302554.png)

3) 设置 Maven 自动导包

![image-20210825222326603](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071302445.png)

#### **2.1.2** **配置我们自己安装的** **Maven**

1) 点击工具栏中的 Settings

![image-20210825222420276](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303843.png)

2) 点击 OK 保存即可

### **2.2** **在** **Idea** **中创建** **Maven** **项目**

#### **2.2.1** **创建** **Java** **工程**

1) 点击 File→New→Module…（如果之前没有 Project 选 Project）→Maven

![image-20210825222537219](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303887.png)

2) 点击 Next，配置要继承的模块（如果直接创建的是 Project 不存在这一项）、坐标（GAV）、路径。不同的 Idea 版本可能有所差别，我使用的是 2019.3.3的版本

![image-20210825222822055](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303574.png)

3) 点击 Finish 即可创建成功

4) 配置 Maven 的核心配置文件 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atguigu.maven</groupId>
  <artifactId>Hello</artifactId>
  <version>1.0-SNAPSHOT</version> 
  <dependencies> 
    <dependency> 
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version> 
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

5) 编写主代码

在 src/**main**/java 目录下创建包并创建 Hello.java 文件

```java
package com.atguigu.maven;
public class Hello {
  public String sayHello(String name){
  return "Hello "+name+"!"; 
  } 
}
```

6) 编写测试代码

在/src/**test**/java 目录下创建包并创建 HelloTest.java 文件

```java
package com.atguigu.maven;
import org.junit.Test;
public class HelloTest {
  @Test
	public void testHello(){
    Hello hello = new Hello();
    String maven = hello.sayHello("Maven");
    System.out.println(maven);
  }
}
```

7) 使用 Maven 的方式运行 Maven 工程

![image-20210825223208479](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303213.png)

#### **2.2.2** **创建** **Web** **工程（了解）**

1) 创建简单的 Maven 工程，打包方式为 war 包 

```
<groupId>com.atguigu.maven</groupId>
<artifactId>MavenWeb</artifactId> 
<packaging>war</packaging> 
<version>1.0-SNAPSHOT</version>
```

2) 点击 Project Structure

![image-20210825223356823](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303253.png)

3) 选择对应的 Module，设置 Web 目录

![image-20210825223426168](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303964.png)

4) 弹出提示框，选择版本后点击 OK

![image-20210825223511229](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071303502.png)

5) 生成 web.xml 文件

![image-20210825223548581](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304517.png)

6) 设置存放 web 页面文件的目录后点击 OK

<img src="https://gitee.com/wowosong/pic-md/raw/master/202303311413524.png" alt="image-20210825223744080" style="zoom:50%;" />

7) 点击 OK

![image-20210825223812864](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304308.png)

8) 发现项目中多了一个 web 目录，而且目录上有一个蓝点

![image-20210825223839783](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304971.png)

9) 在 web 目录下创建 index.jsp 页面

![image-20210825223938584](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304779.png)

10) 部署到 Tomcat 上运行

# **第** **3** **章 在** **Eclipse** **中使用** **Git**

## **3.1** **全局配置**

### **3.1.1** **配置用户名和邮箱**

1) 点击 Window→Preferences→Team→Git→Configuration

![image-20210825224302690](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304008.png)

2) 点击 Add Entry…设置全局用户名和邮箱

![image-20210825224340400](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304109.png)

![image-20210825224405689](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304914.png)

![image-20210825224428868](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071304660.png)

3) 点击 Apply and Close 之后在 Windows 的用户目录下会生成.gitconfig 配置文件

![image-20210825224459550](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071305111.png)

### **3.1.2** **配置忽略的文件**

1) 在用户目录（其他目录也可以）创建 Java.gitignore 文件，添加以下内容

```
*.class
# Log file
*.log
# BlueJ files
*.ctxt
# Mobile Tools for Java (J2ME)
.mtj.tmp/
# Package Files #
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
# virtual machine crash logs, see 
http://www.java.com/en/download/help/error_hotspot.xml
hs_err_pid*
.classpath
.project
.settings
target
```

2) 在全局的配置文件.gitconfig 文件中添加如下内容

```
[core]
excludesfile = C:/Users/韩总/Java.gitignore
```

3) 文件所在位置图

![image-20210825224729881](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071305585.png)

4) 重启 Eclipse 忽略文件 Java.gitignore 即生效

![image-20210825225356237](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071305348.png)

**Tips：方式二只需要修改.git/info 目录下的 exclude 文件即可，不需要创建新的文件，所以建议大家选择这种方式。**

```
.idea

*.iml
```

