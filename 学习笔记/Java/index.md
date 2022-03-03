

# IntelliJ IDEA 学习笔记

[IDEA教学视频](https://www.bilibili.com/video/BV1PW411X75p)

### 文章目录

*   *   [1.IntelliJ IDEA的介绍和优势](#1IntelliJ_IDEA_4)
    *   *   [IDEA 的主要优势](#IDEA__16)
    *   [2.版本介绍与安装前的准备](#2_29)
    *   [3.IDEA的卸载](#3IDEA_33)
    *   [4.IDEA的安装](#4IDEA_37)
    *   [5.安装目录和设置目录结构的说明](#5_41)
    *   *   [安装目录](#_43)
        *   [设置目录](#_92)
    *   [6.启动IDEA并执行HelloWorld](#6IDEAHelloWorld_112)
    *   [7.Module的使用](#7Module_120)
    *   [8.IDEA的常用设置](#8IDEA_142)
    *   [9.快捷键的设置](#9_190)
    *   [10.常用的快捷键的使用1](#101_202)
    *   [11.常用的快捷键的使用2](#112_206)
    *   [12.模板及常用模板的演示](#12_210)
    *   [13.修改及自定义模板](#13_240)
    *   [14.IDEA中添加Tomcat镜像并部署web工程](#14IDEATomcatweb_250)
    *   [15.关联数据库](#15_256)
    *   [16.版本控制在IDEA中的配置和使用](#16IDEA_266)
    *   [17.IDEA中的断点调试](#17IDEA_276)
    *   [18.IDEA中Maven的配置与使用](#18IDEAMaven_291)
    *   [19.生成javadoc、清理缓存和索引、插件的下载等](#19javadoc_311)

## 1.IntelliJ IDEA的介绍和优势

Eclipse是IBM公司研发的。

[IDEA](https://www.jetbrains.com/idea/)是 JetBrains 公司的产品，公司旗下还有其它产品，比如：

*   WebStorm： 用于开发 JavaScript、 HTML5、 CSS3 等前端技术；
*   PyCharm：用于开发 python
*   Android Studio： 用于开发 android(google 基于 IDEA 社区版进行迭代)
*   …

IDEA，全称 IntelliJ IDEA，是 Java 语言的集成开发环境， IDEA 在业界被公认为是最好的 Java 开发工具之一，尤其在智能代码助手、代码自动提示、重构、 J2EE支持、 Ant、 JUnit、 CVS 整合、代码审查、创新的 GUI 设计等方面的功能可以说是超常的。

### IDEA 的主要优势

相较于 Eclipse 而言

*   强大的整合能力。比如： Git、 Maven、 Spring 等
*   提示功能的快速、 便捷
*   提示功能的范围广
*   好用的快捷键和代码模板
*   精准搜索

[IDEA 的下载地址：(官网)](https://www.jetbrains.com/idea/download/#section=windows)

## 2.版本介绍与安装前的准备

可不用系统JDK，IDEA自带JDK

## 3.IDEA的卸载

在控制面板下删除

## 4.IDEA的安装

从官网下载安装文件后，随着安装文件的安装向导安装即可

## 5.安装目录和设置目录结构的说明

### 安装目录

IntelliJ IDEA安装目录内容：

```
$ ls -X
bin/ #容器，执行文件和启动参数等
jre64/ #64 位java 运行环境
lib/ #idea 依赖的类库
license/ #各个插件许可
plugins/ #插件
redist/
product-info.json
build.txt
LICENSE.txt
NOTICE.txt
```

* * *

bin目录下重要文件

```
$ ls ./bin | grep 'idea'
idea.exe #32位IDEA启动文件
idea.exe.vmoptions #32位IDEA的VM配置文件
idea.properties #IDEA属性配置文件
idea64.exe #64位IDEA启动文件
idea64.exe.vmoptions #64位IDEA的VM配置文件
```

* * *

根据项目大小及开发机器的性能适度调整**IDEA的VM配置参数**，或多或少能提高IDEA的性能，从而提升开发效率。

idea64.exe.vmoptions内容一窥

```
-Xms128m #最小内存数
-Xmx750m #最大内存数
-XX:ReservedCodeCacheSize=240m #保留代码占用的内存容量
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
```

### 设置目录

**查看设置目录结构**

目录路径为`C:\Users\Administrator.USER-20180302VA\.IdeaIC2018.3`

```
Administrator@USER-20180302VA MINGW64 ~/.IdeaIC2018.3
$ ls
config/  system/
```

这个设置目录有一个特性，就是你删除掉整个目录之后，重新启动 IDEA 会再自动帮你生成一个全新的默认配置，所以很多时候如果你把IDEA 配置改坏了，删掉该目录，IDEA都会还原到默认。

**config**目录是 IntelliJ IDEA 个性化化配置目录，或者说是整个 IDE 设置目录。

这个目录主要记录了： IDE 主要配置功能、自定义的代码模板、自定义的文件模板、自定义的快捷键、 Project 的 tasks 记录等等个性化的设置。

**system目录**是 IntelliJ IDEA 系统文件目录，是 IntelliJ IDEA 与开发项目一个桥梁目录，里面主要有：缓存、索引、容器文件输出等等

## 6.启动IDEA并执行HelloWorld

**IntelliJ IDEA 没有类似 Eclipse 的工作空间的概念（ Workspaces），最大单元就是Project。 这里可以把 Project 理解为 Eclipse 中的 Workspace**。

JDK可使用系统上安装的或IDEA自带的。

创建File->New->Project创建一个普通Java项目。接下来按类似Eclipse套路容易创建一个HelloWorld类。

## 7.[Module](https://so.csdn.net/so/search?q=Module&spm=1001.2101.3001.7020)的使用

1.  Eclipse 中 workspace 相当于 IDEA 中的 Project
2.  Eclipse 中 Project 相当于 IDEA 中的 Module

从 Eclipse 转过来的人总是下意识地要在同一个窗口管理 n 个项目，这在IntelliJ IDEA 是无法做到的。 IntelliJ IDEA 提供的解决方案是打开多个项目实例，即打开多个项目窗口。 即： 一个 Project 打开一个 Window 窗口。

在 IntelliJ IDEA 中 Project 是最顶级的级别，次级别是 Module。 一个 Project可以有多个 Module。目前主流的大型项目都是分布式部署的， 结构都是类似这种多 Module 结构。

\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-NoQyBw0y-1594692052204)(image/01.png)\]

这类项目一般是这样划分的，比如： core Module、 web Module、 plugin Module、solr Module 等等，模块之间彼此可以相互依赖。通过这些 Module 的命名也可以看出，他们之间都是处于同一个项目业务下的模块，彼此之间是有不可分割的业务关系的。

相比较于多 Module 项目，小项目就无需搞得这么复杂。只有一个 Module 的结构 IntelliJ IDEA 也是支持的，并且 IntelliJ IDEA 创建项目的时候，默认就是单Module 的结构的。

创建Module：File->New->Module

Module要经过两次Delete才能在硬盘上真正的抹去

查看项目配置：File->Project Structure

## 8.IDEA的常用设置

File->Settings

0.  Appearance & Behavior：设置样式（暗黑模式）
1.  Editor，General：**Change font size** (Zoom) with Ctrl+Mouse Wheel.
2.  Editor，General：**Show quick documentation** on mouse move. Delay(ms): 500
3.  Editor，General，**Auto Import**：
    *   Add unambiguous imports on the fly
    *   Optimize imports on the fly
4.  Editor，General，Appearance：
    *   Show line numbers
    *   Show method separators 类的每个方法之间放条分割线
5.  Editor，General，Code Completion：
    *   Case sensitive completion：IDEA 的代码提示和补充功能区分大小写，例如StringBu则会提示，而stringbu则不会提示（2018社区版没有这选项）
6.  Editor，General，Editor Tabs：
    *   Show tabs in one row 在打开很多文件的时候， IntelliJ IDEA 默认是把所有打开的文件名 Tab 单行显示的。但是我个人现在的习惯是使用多行，多行效率比单行高，因为单行会隐藏超过界面部分 Tab，这样找文件不方便。
7.  Editor，Font 设置默认的字体、字体大小、字体行间距
8.  Editor，Color Scheme，Color Scheme Font 修改当前主题的字体、字体大小、字体行间距
9.  Editor，Color Scheme，Console Font 修改当前主题的控制台输出的字体及字体大小
10.  Editor，Color Scheme，Language Defaults 修改代码中注释的字体颜色
    *   Doc Comment： 修改文档注释的字体颜色
    *   Block comment： 修改多行注释的字体颜色
    *   Line comment： 修改当行注释的字体颜色
11.  Editor，Code Style，Java，imports：设置超过指定 import 个数，改为\*
12.  Editor，File and Code Templates，Includes：修改类头的文档注释信息
13.  Editor，File Encodings 设置项目文件编码（其实IDEA主窗口的右下部分可以设置当前源文件编码格式）
14.  Build，Execution，Deployment ，Compiler 设置**自动编译**（Eclipse默认自动编译的，而IDEA不是）
    *   Build project automatically
    *   Compile independent modules in parallel

* * *

File->Power Save Mode 省电模式

开启这种模式之后 IDEA 会关掉代码检查和代码提示等功能。所以一般也可认为这是一种阅读模式，如果你在开发过程中遇到突然代码文件不能进行检查和提示，可以来看看这里是否有开启该功能。

* * *

在代码展现区，右键点击源码文件标题tab

*   Split Vertically
*   Split Horizontally

设置代码水平或垂直显示。

这个没有Eclipse功能方便

## 9.快捷键的设置

File->Settings->Keymap

可以设置Eclipse风格的快捷键，但始终有些快捷键没有目标效果。

也可以对快捷键进行细粒度的修改

* * *

查看IDEA默认的Key Map : Help->Keymap Reference

## 10.常用的快捷键的使用1

略

## 11.常用的快捷键的使用2

略

## 12.模板及常用模板的演示

File->Settings

*   Editor – Live Templates 内容能改
*   Editor – General – Postfix Completion 内容不能改

例如：

1.  psvm : 可生成 main 方法
2.  sout : System.out.println() 快捷输出。类似的：
    *   soutp=System.out.println("方法形参名 = " + 形参名);
    *   soutv=System.out.println("变量名 = " + 变量);
    *   soutm=System.out.println(“当前类名.当前方法”);
    *   “abc”.sout => System.out.println(“abc”);
3.  fori : 可生成 for 循环
    *   iter：可生成增强 for 循环
    *   itar：可生成普通 for 循环
4.  list.for : 可生成集合 list 的 for 循环List list = new ArrayList();输入: list.for 即可输出for(String s:list){}，又如：
    *   list.fori 正序遍历
    *   list.forr 倒序遍历
5.  ifn：可生成 if(xxx = null)，类似的：
    *   inn：可生成 if(xxx != null)
    *   xxx.nn
    *   xxx.null
6.  prsf：可生成 private static final
    *   psf：可生成 public static final
    *   psfi：可生成 public static final int
    *   psfs：可生成 public static final String

## 13.修改及自定义模板

File->Settings

*   Editor – Live Templates 内容能改

1.  Abbreviation:模板的缩略名称
2.  Description:模板的描述
3.  Template text:模板的代码片段

## 14.IDEA中添加Tomcat镜像并部署web工程

**IDEA旗舰版自带该功能**

社区版的，可使用maven的Tomcat插件，[IntelliJ IDEA社区版通过Maven创建J2EE项目](https://blog.csdn.net/ghosind/article/details/79561989)

## 15.关联数据库

**IDEA旗舰版自带该Database功能**，

社区版的，可下载插件[Database Navigator](https://plugins.jetbrains.com/plugin/1800-database-navigator)实现类似功能

**注意**，IDEA 2018.3 应下载 Database Navigator 3.2.0589.0。**下载较新版本插件安装后重启，不能正常使用**。

IDEA 的 Database 最大特性就是对于 Java Web 项目来讲，常使用的 ORM 框架，如 Hibernate、 Mybatis有很好的支持，比如配置好了 Database 之后，IDEA 会自动识别 domain对象与数据表的关系，也可以通过 Database 的数据表直接生成 domain 对象等等。

## 16.版本控制在IDEA中的配置和使用

File->Setting配置安装到系统的git的主目录，配置Github的账号密码。

菜单栏的VCS (version control system)包含版本控制相关功能：如checkout git/github(个人) 的项目

引入git/github项目：File->New->Project from Version Constrol

查看本地历史，无需git：右键点击目标文件、项目->Local History->Show History

## 17.IDEA中的断点调试

File->Settings搜寻Debugger（Build，Execution，Deployment）设置 Debug 连接方式，默认是 Socket。 Shared memory 是 Windows 特有的一个属性，一般在 Windows 系统下建议使用此设置， 内存占用相对较少。

常用断点调试快捷键跟Eclipse类似：

*   step over 进入下一步，如果当前行断点是一个方法，则不进入当前方法体内
*   step into 进入下一步，如果当前行断点是一个方法，则进入当前方法体内
*   force step into 进入下一步，如果当前行断点是一个方法，则进入当前方法体内
*   step out 跳出
*   resume program 恢复程序运行，但如果该断点下面代码还有断点则停在下一个断点上
*   stop 停止
*   mute breakpoints 点中，使得所有的断点失效
*   view breakpoints 查看所有断点

## 18.IDEA中Maven的配置与使用

Maven 是 Apache 提供的一款自动化构建工具，用于自动化构建和依赖管理。开发团队基本不用花多少时间就能自动完成工程的基础构建配置，因为 \*\*Maven 使用了一个标准的目录结构和一个默认的构建生命周期。\*\*在如下环节中， Maven可减轻开发者工作量。

*   清理：表示在编译代码前将之前生成的内容删除
*   编译：将源代码编译为字节码
*   测试：运行单元测试用例程序
*   报告：测试程序的结果
*   打包：将 java 项目打成 jar 包；将 Web 项目打成 war 包
*   安装：将 jar 或 war 生成到 Maven 仓库中
*   部署：将 jar 或 war 从 Maven 仓库中部署到 Web 服务器上运行

File->Settings搜索Maven，配置安装到系统的Maven

File->Settings搜索Maven->Importing进行配置

*   Import Maven projects automatically：表示 IntelliJ IDEA 会实时监控项目的 pom.xml 文件，进行项目变动设置。
*   Automatically download：在 Maven 导入依赖包的时候是否自动下载源码和文档。默认是  
    没有勾选的， 也**不建议勾选**。
*   VM options for importer：可以设置导入的 VM 参数。

## 19.生成javadoc、清理缓存和索引、插件的下载等

*   生成javadoc\_清理缓存：Tools->Generate JavaDoc
*   清理缓存或重启：File->Invalidate Caches / Restart
*   取消更新：File->Settings搜寻Updates，取消自动Update
*   管理插件：File->Settings搜寻Plugins，可CRUD插件。Marketplace再失效，可登陆[IDEA官方插件网](https://plugins.jetbrains.com/)，下载插件到本地进行安装。
