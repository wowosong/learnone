目录

*   [1\. 概述](#1-%E6%A6%82%E8%BF%B0)
*   [2\. 加载与存储指令](#2-%E5%8A%A0%E8%BD%BD%E4%B8%8E%E5%AD%98%E5%82%A8%E6%8C%87%E4%BB%A4)
    *   [2.1. 局部变量压栈指令](#21-%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E5%8E%8B%E6%A0%88%E6%8C%87%E4%BB%A4)
    *   [局部变量压栈常用指令集](#%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E5%8E%8B%E6%A0%88%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4%E9%9B%86)
    *   [局部变量压栈指令剖析](#%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E5%8E%8B%E6%A0%88%E6%8C%87%E4%BB%A4%E5%89%96%E6%9E%90)
    *   [2.2. 常量入栈指令](#22-%E5%B8%B8%E9%87%8F%E5%85%A5%E6%A0%88%E6%8C%87%E4%BB%A4)
    *   [常量入栈常用指令集](#%E5%B8%B8%E9%87%8F%E5%85%A5%E6%A0%88%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4%E9%9B%86)
    *   [常量入栈指令剖析](#%E5%B8%B8%E9%87%8F%E5%85%A5%E6%A0%88%E6%8C%87%E4%BB%A4%E5%89%96%E6%9E%90)
    *   [2.3. 出栈装入局部变量表指令](#23-%E5%87%BA%E6%A0%88%E8%A3%85%E5%85%A5%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E8%A1%A8%E6%8C%87%E4%BB%A4)
    *   [出栈装入局部变量表常用指令集](#%E5%87%BA%E6%A0%88%E8%A3%85%E5%85%A5%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E8%A1%A8%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4%E9%9B%86)
    *   [出栈装入局部变量表指令剖析](#%E5%87%BA%E6%A0%88%E8%A3%85%E5%85%A5%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E8%A1%A8%E6%8C%87%E4%BB%A4%E5%89%96%E6%9E%90)
*   [3\. 算术指令](#3-%E7%AE%97%E6%9C%AF%E6%8C%87%E4%BB%A4)
    *   [整数运算](#%E6%95%B4%E6%95%B0%E8%BF%90%E7%AE%97)
    *   [逻辑运算](#%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97)
        *   [移位操作](#%E7%A7%BB%E4%BD%8D%E6%93%8D%E4%BD%9C)
        *   [按位布尔运算](#%E6%8C%89%E4%BD%8D%E5%B8%83%E5%B0%94%E8%BF%90%E7%AE%97)
        *   [浮点运算](#%E6%B5%AE%E7%82%B9%E8%BF%90%E7%AE%97)
    *   [算术指令集](#%E7%AE%97%E6%9C%AF%E6%8C%87%E4%BB%A4%E9%9B%86)
    *   [算术指令举例](#%E7%AE%97%E6%9C%AF%E6%8C%87%E4%BB%A4%E4%B8%BE%E4%BE%8B)
        *   [举例1](#%E4%B8%BE%E4%BE%8B1)
        *   [举例2](#%E4%B8%BE%E4%BE%8B2)
        *   [举例3](#%E4%B8%BE%E4%BE%8B3)
*   [4\. 类型转换指令](#4-%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E6%8C%87%E4%BB%A4)
    *   [宽化类型转换](#%E5%AE%BD%E5%8C%96%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
    *   [窄化类型转换](#%E7%AA%84%E5%8C%96%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
    *   [4.1. 宽化类型转换剖析](#41-%E5%AE%BD%E5%8C%96%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%89%96%E6%9E%90)
    *   [4.2. 窄化类型转换剖析](#42-%E7%AA%84%E5%8C%96%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%89%96%E6%9E%90)
*   [5\. 对象的创建与访问指令](#5-%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%88%9B%E5%BB%BA%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8C%87%E4%BB%A4)
    *   [对象操作指令](#%E5%AF%B9%E8%B1%A1%E6%93%8D%E4%BD%9C%E6%8C%87%E4%BB%A4)
    *   [数组操作指令](#%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C%E6%8C%87%E4%BB%A4)
    *   [5.1. 创建指令](#51-%E5%88%9B%E5%BB%BA%E6%8C%87%E4%BB%A4)
    *   [5.2. 字段访问指令](#52-%E5%AD%97%E6%AE%B5%E8%AE%BF%E9%97%AE%E6%8C%87%E4%BB%A4)
    *   [5.3. 数组操作指令](#53-%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C%E6%8C%87%E4%BB%A4)
    *   [5.4. 类型检查指令](#54-%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E6%8C%87%E4%BB%A4)
*   [6\. 方法调用与返回指令](#6-%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E4%B8%8E%E8%BF%94%E5%9B%9E%E6%8C%87%E4%BB%A4)
    *   [方法调用指令](#%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E6%8C%87%E4%BB%A4)
    *   [方法返回指令](#%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E%E6%8C%87%E4%BB%A4)
    *   [6.1. 方法调用指令](#61-%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E6%8C%87%E4%BB%A4)
    *   [6.2. 方法返回指令](#62-%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E%E6%8C%87%E4%BB%A4)
*   [7\. 操作数栈管理指令](#7-%E6%93%8D%E4%BD%9C%E6%95%B0%E6%A0%88%E7%AE%A1%E7%90%86%E6%8C%87%E4%BB%A4)
    *   [通用(无类型）栈操作](#%E9%80%9A%E7%94%A8%E6%97%A0%E7%B1%BB%E5%9E%8B%E6%A0%88%E6%93%8D%E4%BD%9C)
*   [8\. 控制转移指令](#8-%E6%8E%A7%E5%88%B6%E8%BD%AC%E7%A7%BB%E6%8C%87%E4%BB%A4)
    *   [比较指令](#%E6%AF%94%E8%BE%83%E6%8C%87%E4%BB%A4)
    *   [条件分支指令](#%E6%9D%A1%E4%BB%B6%E5%88%86%E6%94%AF%E6%8C%87%E4%BB%A4)
    *   [比较条件分支指令](#%E6%AF%94%E8%BE%83%E6%9D%A1%E4%BB%B6%E5%88%86%E6%94%AF%E6%8C%87%E4%BB%A4)
    *   [多条件分支跳转指令](#%E5%A4%9A%E6%9D%A1%E4%BB%B6%E5%88%86%E6%94%AF%E8%B7%B3%E8%BD%AC%E6%8C%87%E4%BB%A4)
    *   [无条件跳转指令](#%E6%97%A0%E6%9D%A1%E4%BB%B6%E8%B7%B3%E8%BD%AC%E6%8C%87%E4%BB%A4)
    *   [8.1. 比较指令](#81-%E6%AF%94%E8%BE%83%E6%8C%87%E4%BB%A4)
    *   [8.2. 条件跳转指令](#82-%E6%9D%A1%E4%BB%B6%E8%B7%B3%E8%BD%AC%E6%8C%87%E4%BB%A4)
    *   [8.3. 比较条件跳转指令](#83-%E6%AF%94%E8%BE%83%E6%9D%A1%E4%BB%B6%E8%B7%B3%E8%BD%AC%E6%8C%87%E4%BB%A4)
    *   [8.4. 多条件分支跳转](#84-%E5%A4%9A%E6%9D%A1%E4%BB%B6%E5%88%86%E6%94%AF%E8%B7%B3%E8%BD%AC)
    *   [8.5. 无条件跳转](#85-%E6%97%A0%E6%9D%A1%E4%BB%B6%E8%B7%B3%E8%BD%AC)
*   [9\. 异常处理指令](#9-%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E6%8C%87%E4%BB%A4)
    *   [异常处理指令](#%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E6%8C%87%E4%BB%A4)
*   [10\. 同步控制指令](#10-%E5%90%8C%E6%AD%A5%E6%8E%A7%E5%88%B6%E6%8C%87%E4%BB%A4)
    *   *   [线程同步](#%E7%BA%BF%E7%A8%8B%E5%90%8C%E6%AD%A5)
    *   [10.1. 方法级的同步](#101-%E6%96%B9%E6%B3%95%E7%BA%A7%E7%9A%84%E5%90%8C%E6%AD%A5)
    *   [10.2. 方法内指令指令序列的同步](#102-%E6%96%B9%E6%B3%95%E5%86%85%E6%8C%87%E4%BB%A4%E6%8C%87%E4%BB%A4%E5%BA%8F%E5%88%97%E7%9A%84%E5%90%8C%E6%AD%A5)

# 1\. 概述

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051527520.png)![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051527877.png)![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051527657.png)

# 2\. 加载与存储指令

![0ca8044c-f78d-4787-aeac-c986a35f9cdf](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051527106.png)

![08e01fd0-a33e-47e4-8fd2-34c2935db71d](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051529996.png)

* * *

## 2.1. 局部变量压栈指令

> iload 从局部变量中装载int类型值
> 
> lload 从局部变量中装载long类型值
> 
> fload 从局部变量中装载float类型值
> 
> dload 从局部变量中装载double类型值
> 
> aload 从局部变量中装载引用类型值（refernce）
> 
> iload\_0 从局部变量0中装载int类型值
> 
> iload\_1 从局部变量1中装载int类型值
> 
> iload\_2 从局部变量2中装载int类型值
> 
> iload\_3 从局部变量3中装载int类型值
> 
> lload\_0 从局部变量0中装载long类型值
> 
> lload\_1 从局部变量1中装载long类型值
> 
> lload\_2 从局部变量2中装载long类型值
> 
> lload\_3 从局部变量3中装载long类型值
> 
> fload\_0 从局部变量0中装载float类型值
> 
> fload\_1 从局部变量1中装载float类型值
> 
> fload\_2 从局部变量2中装载float类型值
> 
> fload\_3 从局部变量3中装载float类型值
> 
> dload\_0 从局部变量0中装载double类型值
> 
> dload\_1 从局部变量1中装载double类型值
> 
> dload\_2 从局部变量2中装载double类型值
> 
> dload\_3 从局部变量3中装载double类型值
> 
> aload\_0 从局部变量0中装载引用类型值
> 
> aload\_1 从局部变量1中装载引用类型值
> 
> aload\_2 从局部变量2中装载引用类型值
> 
> aload\_3 从局部变量3中装载引用类型值
> 
> iaload 从数组中装载int类型值
> 
> laload 从数组中装载long类型值
> 
> faload 从数组中装载float类型值
> 
> daload 从数组中装载double类型值
> 
> aaload 从数组中装载引用类型值
> 
> baload 从数组中装载byte类型或boolean类型值
> 
> caload 从数组中装载char类型值
> 
> saload 从数组中装载short类型值

## 局部变量压栈常用指令集

| xload\_n | xload\_0 | xload\_1 | xload\_2 | xload\_3 |
| --- | --- | --- | --- | --- |
| **iload\_n** | iload\_0 | iload\_1 | iload\_2 | iload\_3 |
| **lload\_n** | lload\_0 | lload\_1 | lload\_2 | lload\_3 |
| **fload\_n** | fload\_0 | fload\_1 | fload\_2 | fload\_3 |
| **dload\_n** | dload\_0 | dload\_1 | dload\_2 | dload\_3 |
| **aload\_n** | aload\_0 | aload\_1 | aload\_2 | aload\_3 |

## 局部变量压栈指令剖析

![1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051529990.png)

```java
public void load(int num, Object obj, long count, boolean flag, short[] arr) {
	System.out.println(num);
    System.out.println(obj);
    System.out.println(count);
    System.out.println(flag);
    System.out.println(arr);
}
```

![3](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530949.png)

* * *

## 2.2. 常量入栈指令

> aconst\_null 将null对象引用压入栈
> 
> iconst\_m1 将int类型常量-1压入栈
> 
> iconst\_0 将int类型常量0压入栈
> 
> iconst\_1 将int类型常量1压入栈
> 
> iconst\_2 将int类型常量2压入栈
> 
> iconst\_3 将int类型常量3压入栈
> 
> iconst\_4 将int类型常量4压入栈
> 
> iconst\_5 将int类型常量5压入栈
> 
> lconst\_0 将long类型常量0压入栈
> 
> lconst\_1 将long类型常量1压入栈
> 
> fconst\_0 将float类型常量0压入栈
> 
> fconst\_1 将float类型常量1压入栈
> 
> dconst\_0 将double类型常量0压入栈
> 
> dconst\_1 将double类型常量1压入栈
> 
> bipush 将一个8位带符号整数压入栈
> 
> sipush 将16位带符号整数压入栈
> 
> ldc 把常量池中的项压入栈
> 
> ldc\_w 把常量池中的项压入栈（使用宽索引）
> 
> ldc2\_w 把常量池中long类型或者double类型的项压入栈（使用宽索引）

## 常量入栈常用指令集

| xconst\_n | 范围 | xconst\_null | xconst\_m1 | xconst\_0 | xconst\_1 | xconst\_2 | xconst\_3 | xconst\_4 | xconst\_5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **iconst\_n** | \[-1, 5\] |  | iconst\_m1 | iconst\_0 | iconst\_1 | iconst\_2 | iconst\_3 | iconst\_4 | iconst\_5 |
| **lconst\_n** | 0, 1 |  |  | lconst\_0 | lconst\_1 |  |  |  |  |
| **fconst\_n** | 0, 1, 2 |  |  | fconst\_0 | fconst\_1 | fconst\_2 |  |  |  |
| **dconst\_n** | 0, 1 |  |  | dconst\_0 | dconst\_1 |  |  |  |  |
| **aconst\_n** | null, String literal, Class literal | aconst\_null |  |  |  |  |  |  |  |
| **bipush** | 一个字节，28，\[-27, 27 - 1\]，即\[-128, 127\] |  |  |  |  |  |  |  |  |
| **sipush** | 两个字节，216，\[-215, 215 - 1\]，即\[-32768, 32767\] |  |  |  |  |  |  |  |  |
| **ldc** | 四个字节，232，\[-231, 231 - 1\] |  |  |  |  |  |  |  |  |
| **ldc\_w** | 宽索引 |  |  |  |  |  |  |  |  |
| **ldc2\_w** | 宽索引，long或double |  |  |  |  |  |  |  |  |

## 常量入栈指令剖析

![437a717e-98e2-4847-b52e-e6632d0745a4](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530639.png)![ffd7246e-2e46-41e0-9fd6-1e65ace5dbd1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530709.png)

| 类型 | 常数指令 | 范围 |
| --- | --- | --- |
| int(boolean,byte,char,short) | iconst | \[-1, 5\] |
| bipush | \[-128, 127\] |
| sipush | \[-32768, 32767\] |
| ldc | any int value |
| long | lconst | 0, 1 |
| ldc | any long value |
| float | fconst | 0, 1, 2 |
| ldc | any float value |
| double | dconst | 0, 1 |
| ldc | any double value |
| reference | aconst | null |
| ldc | String literal, Class literal |

![566b9397-5afe-4a3f-9e17-9ebf504dfc80](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530870.png)![b59702d2-4c93-44df-87f1-01a5dfe53b61](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530663.png)

* * *

## 2.3. 出栈装入局部变量表指令

> istore 将int类型值存入局部变量
> 
> lstore 将long类型值存入局部变量
> 
> fstore 将float类型值存入局部变量
> 
> dstore 将double类型值存入局部变量
> 
> astore 将将引用类型或returnAddress类型值存入局部变量
> 
> istore\_0 将int类型值存入局部变量0
> 
> istore\_1 将int类型值存入局部变量1
> 
> istore\_2 将int类型值存入局部变量2
> 
> istore\_3 将int类型值存入局部变量3
> 
> lstore\_0 将long类型值存入局部变量0
> 
> lstore\_1 将long类型值存入局部变量1
> 
> lstore\_2 将long类型值存入局部变量2
> 
> lstore\_3 将long类型值存入局部变量3
> 
> fstore\_0 将float类型值存入局部变量0
> 
> fstore\_1 将float类型值存入局部变量1
> 
> fstore\_2 将float类型值存入局部变量2
> 
> fstore\_3 将float类型值存入局部变量3
> 
> dstore\_0 将double类型值存入局部变量0
> 
> dstore\_1 将double类型值存入局部变量1
> 
> dstore\_2 将double类型值存入局部变量2
> 
> dstore\_3 将double类型值存入局部变量3
> 
> astore\_0 将引用类型或returnAddress类型值存入局部变量0
> 
> astore\_1 将引用类型或returnAddress类型值存入局部变量1
> 
> astore\_2 将引用类型或returnAddress类型值存入局部变量2
> 
> astore\_3 将引用类型或returnAddress类型值存入局部变量3
> 
> iastore 将int类型值存入数组中
> 
> lastore 将long类型值存入数组中
> 
> fastore 将float类型值存入数组中
> 
> dastore 将double类型值存入数组中
> 
> aastore 将引用类型值存入数组中
> 
> bastore 将byte类型或者boolean类型值存入数组中
> 
> castore 将char类型值存入数组中
> 
> sastore 将short类型值存入数组中
> 
> wide指令
> 
> wide 使用附加字节扩展局部变量索引

## 出栈装入局部变量表常用指令集

| xstore\_n | xstore\_0 | xstore\_1 | xstore\_2 | xstore\_3 |
| --- | --- | --- | --- | --- |
| **istore\_n** | istore\_0 | istore\_1 | istore\_2 | istore\_3 |
| **lstore\_n** | lstore\_0 | lstore\_1 | lstore\_2 | lstore\_3 |
| **fstore\_n** | fstore\_0 | fstore\_1 | fstore\_2 | fstore\_3 |
| **dstore\_n** | dstore\_0 | dstore\_1 | dstore\_2 | dstore\_3 |
| **astore\_n** | astore\_0 | astore\_1 | astore\_2 | astore\_3 |

## 出栈装入局部变量表指令剖析

![1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530893.png)![2](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530295.png)
![3](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530129.png)

* * *

# 3\. 算术指令

> ## 整数运算
> 
> iadd 执行int类型的加法
> 
> ladd 执行long类型的加法
> 
> isub 执行int类型的减法
> 
> lsub 执行long类型的减法
> 
> imul 执行int类型的乘法
> 
> lmul 执行long类型的乘法
> 
> idiv 执行int类型的除法
> 
> ldiv 执行long类型的除法
> 
> irem 计算int类型除法的余数
> 
> lrem 计算long类型除法的余数
> 
> ineg 对一个int类型值进行取反操作
> 
> lneg 对一个long类型值进行取反操作
> 
> iinc 把一个常量值加到一个int类型的局部变量上
> 
> ## 逻辑运算
> 
> ### 移位操作
> 
> ishl 执行int类型的向左移位操作
> 
> lshl 执行long类型的向左移位操作
> 
> ishr 执行int类型的向右移位操作
> 
> lshr 执行long类型的向右移位操作
> 
> iushr 执行int类型的向右逻辑移位操作
> 
> lushr 执行long类型的向右逻辑移位操作
> 
> ### 按位布尔运算
> 
> iand 对int类型值进行“逻辑与”操作
> 
> land 对long类型值进行“逻辑与”操作
> 
> ior 对int类型值进行“逻辑或”操作
> 
> lor 对long类型值进行“逻辑或”操作
> 
> ixor 对int类型值进行“逻辑异或”操作
> 
> lxor 对long类型值进行“逻辑异或”操作
> 
> ### 浮点运算
> 
> fadd 执行float类型的加法
> 
> dadd 执行double类型的加法
> 
> fsub 执行float类型的减法
> 
> dsub 执行double类型的减法
> 
> fmul 执行float类型的乘法
> 
> dmul 执行double类型的乘法
> 
> fdiv 执行float类型的除法
> 
> ddiv 执行double类型的除法
> 
> frem 计算float类型除法的余数
> 
> drem 计算double类型除法的余数
> 
> fneg 将一个float类型的数值取反
> 
> dneg 将一个double类型的数值取反

## 算术指令集

| 算数指令 | int(boolean,byte,char,short) | long | float | double |
| --- | --- | --- | --- | --- |
| 加法指令 | iadd | ladd | fadd | dadd |
| 减法指令 | isub | lsub | fsub | dsub |
| 乘法指令 | imul | lmul | fmul | dmul |
| 除法指令 | idiv | ldiv | fdiv | ddiv |
| 求余指令 | irem | lrem | frem | drem |
| 取反指令 | ineg | lneg | fneg | dneg |
| 自增指令 | iinc |  |  |  |
| 位运算指令 | 按位或指令 | ior | lor |  |  |
| 按位或指令 | ior | lor |  |  |
| 按位与指令 | iand | land |  |  |
| 按位异或指令 | ixor | lxor |  |  |
| 比较指令 |  | lcmp | fcmpg / fcmpl | dcmpg / dcmpl |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530088.png)

> 注意：NaN(Not a Number)表示不是一个数字

## 算术指令举例

### 举例1

```java
public static int bar(int i) {
	return ((i + 1) - 2) * 3 / 4;
}
```

![a54c2ac8-dd36-49f4-a49d-9afd725e8365](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530072.png)

### 举例2

```java
public void add() {
	byte i = 15;
	int j = 8;
	int k = i + j;
}
```

![image-20210424210710750](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530148.png)![2](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051530744.png)
![3](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531866.png)

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531566.gif)

### 举例3

```java
public static void main(String[] args) {
	int x = 500;
	int y = 100;
	int a = x / y;
	int b = 50;
	System.out.println(a + b);
}
```

![c43c0407-020f-4ec4-bd27-e4c109640b39](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531154.png)![04282df1-4e52-4c3d-a47b-84023159b624](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531889.png)

* * *

# 4\. 类型转换指令

> ## 宽化类型转换
> 
> i2l 把int类型的数据转化为long类型
> 
> i2f 把int类型的数据转化为float类型
> 
> i2d 把int类型的数据转化为double类型
> 
> l2f 把long类型的数据转化为float类型
> 
> l2d 把long类型的数据转化为double类型
> 
> f2d 把float类型的数据转化为double类型
> 
> ## 窄化类型转换
> 
> i2b 把int类型的数据转化为byte类型
> 
> i2c 把int类型的数据转化为char类型
> 
> i2s 把int类型的数据转化为short类型
> 
> l2i 把long类型的数据转化为int类型
> 
> f2i 把float类型的数据转化为int类型
> 
> f2l 把float类型的数据转化为long类型
> 
> d2i 把double类型的数据转化为int类型
> 
> d2l 把double类型的数据转化为long类型
> 
> d2f 把double类型的数据转化为float类型

|  | **byte** | **char** | **short** | **int** | **long** | **float** | **double** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **int** | i2b | i2c | i2s | ○ | i2l | i2f | i2d |
| **long** | l2i i2b | l2i i2c | l2i i2s | l2i | ○ | l2f | l2d |
| **float** | f2i i2b | f2i i2c | f2i i2s | f2i | f2l | ○ | f2d |
| **double** | d2i i2b | d2i i2c | d2i i2s | d2i | d2l | d2f | ○ |

类型转换指令可以将两种不同的数值类型进行相互转换。这些转换操作一般用于实现用户代码中的显式类型转換操作，或者用来处理字节码指令集中数据类型相关指令无法与数据类型一一对应的问题。

## 4.1. 宽化类型转换剖析

> 宽化类型转换( Widening Numeric Conversions)
> 
> 1.  转换规则
> 
> Java虚拟机直接支持以下数值的宽化类型转换（ widening numeric conversion,小范围类型向大范围类型的安全转换）。也就是说，并不需要指令执行，包括
> 
> > 从int类型到long、float或者 double类型。对应的指令为：i21、i2f、i2d
> > 
> > 从long类型到float、 double类型。对应的指令为：i2f、i2d
> > 
> > 从float类型到double类型。对应的指令为：f2d
> 
> 简化为：int-->long-->float-> double
> 
> 2.  精度损失问题
> 
> > 2.1. 宽化类型转换是不会因为超过目标类型最大值而丢失信息的，例如，从int转换到long,或者从int转换到double,都不会丢失任何信息，转换前后的值是精确相等的。
> > 
> > 2.2. 从int、long类型数值转换到float,或者long类型数值转换到double时，将可能发生精度丢失一一可能丢失掉几个最低有效位上的值，转换后的浮点数值是根据IEEE754最接近含入模式所得到的正确整数值。
> 
> 尽管宽化类型转换实际上是可能发生精度丢失的，但是这种转换永远不会导致Java虚拟机抛出运行时异常
> 
> 3.  补充说明
> 
> 从byte、char和 short类型到int类型的宽化类型转换实际上是不存在的。对于byte类型转为int,拟机并没有做实质性的转化处理，只是简单地通过操作数栈交換了两个数据。而将byte转为long时，使用的是i2l,可以看到在内部，byte在这里已经等同于int类型处理，类似的还有 short类型，这种处理方式有两个特点：
> 
> 一方面可以减少实际的数据类型，如果为 short和byte都准备一套指令，那么指令的数量就会大増，而虚拟机目前的设计上，只愿意使用一个字节表示指令，因此指令总数不能超过256个，为了节省指令资源，将 short和byte当做int处理也在情理之中。
> 
> 另一方面，由于局部变量表中的槽位固定为32位，无论是byte或者 short存入局部变量表，都会占用32位空间。从这个角度说，也没有必要特意区分这几种数据类型。

## 4.2. 窄化类型转换剖析

> 窄化类型转换( Narrowing Numeric Conversion)
> 
> 1.  转换规则
> 
> Java虚拟机也直接支持以下窄化类型转换：
> 
> > 从主int类型至byte、 short或者char类型。对应的指令有：i2b、i2c、i2s
> > 
> > 从long类型到int类型。对应的指令有：l2i
> > 
> > 从float类型到int或者long类型。对应的指令有：f2i、f2l
> > 
> > 从double类型到int、long或者float类型。对应的指令有：d2i、d2l、d2f
> 
> 2.  精度损失问题
> 
> 窄化类型转换可能会导致转换结果具备不同的正负号、不同的数量级，因此，转换过程很可能会导致数值丢失精度。
> 
> 尽管数据类型窄化转换可能会发生上限溢出、下限溢出和精度丢失等情况，但是Java虚拟机规范中明确规定数值类型的窄化转换指令永远不可能导致虚拟机抛出运行时异常
> 
> 3.  补充说明
> 
> > 3.1. 当将一个浮点值窄化转换为整数类型T(T限于int或long类型之一)的时候，将遵循以下转换规则：
> > 
> > > 如果浮点值是NaN,那转换结果就是int或long类型的0.
> > > 
> > > 如果浮点值不是无穷大的话，浮点值使用IEEE754的向零含入模式取整，获得整数值Vv如果v在目标类型T(int或long)的表示范围之内，那转换结果就是v。否则，将根据v的符号，转换为T所能表示的最大或者最小正数
> > 
> > 3.2. 当将一个double类型窄化转换为float类型时，将遵循以下转换规则
> > 
> > > 通过向最接近数舍入模式舍入一个可以使用float类型表示的数字。最后结果根据下面这3条规则判断
> > > 
> > > 如果转换结果的绝对值太小而无法使用float来表示，将返回float类型的正负零
> > > 
> > > 如果转换结果的绝对值太大而无法使用float来表示，将返回float类型的正负无穷大。
> > > 
> > > 对于double类型的NaN值将按规定转換为float类型的NaN值。

* * *

# 5\. 对象的创建与访问指令

> ## 对象操作指令
> 
> new 创建一个新对象
> 
> getfield 从对象中获取字段
> 
> putfield 设置对象中字段的值
> 
> getstatic 从类中获取静态字段
> 
> putstatic 设置类中静态字段的值
> 
> checkcast 确定对象为所给定的类型。后跟目标类，判断栈顶元素是否为目标类 / 接口的实例。如果不是便抛出异常
> 
> instanceof 判断对象是否为给定的类型。后跟目标类，判断栈顶元素是否为目标类 / 接口的实例。是则压入 1，否则压入 0
> 
> ## 数组操作指令
> 
> newarray 分配数据成员类型为基本上数据类型的新数组
> 
> anewarray 分配数据成员类型为引用类型的新数组
> 
> arraylength 获取数组长度
> 
> multianewarray 分配新的多维数组

Java是面向对象的程序设计语言，虚拟机平台从字节码层面就对面向对象做了深层次的支持。有一系列指令专门用于对象操作，可进一步细分为创建指令、字段访问指令、数组操作指令、类型检查指令。

## 5.1. 创建指令

| 创建指令 | 含义 |
| --- | --- |
| new | 创建类实例 |
| newarray | 创建基本类型数组 |
| anewarray | 创建引用类型数组 |
| multilanewarra | 创建多维数组 |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531139.png)

## 5.2. 字段访问指令

| 字段访问指令 | 含义 |
| --- | --- |
| getstatic、putstatic | 访问类字段（static字段，或者称为类变量）的指令 |
| getfield、 putfield | 访问类实例字段（非static字段，或者称为实例变量）的指令 |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531037.png)![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531546.png)

## 5.3. 数组操作指令

| 数组指令 | byte(boolean) | char | short | long | long | float | double | reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **xaload** | baload | caload | saload | iaload | laload | faload | daload | aaload |
| **xastore** | bastore | castore | sastore | iastore | lastore | fastore | dastore | aastore |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531236.png)![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531501.png)

## 5.4. 类型检查指令

| 类型检查指令 | 含义 |
| --- | --- |
| instanceof | 检查类型强制转换是否可以进行 |
| checkcast | 判断给定对象是否是某一个类的实例 |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531964.png)

* * *

# 6\. 方法调用与返回指令

> ## 方法调用指令
> 
> invokcvirtual 运行时按照对象的类来调用实例方法
> 
> invokespecial 根据编译时类型来调用实例方法
> 
> invokestatic 调用类（静态）方法
> 
> invokcinterface 调用接口方法
> 
> ## 方法返回指令
> 
> ireturn 从方法中返回int类型的数据
> 
> lreturn 从方法中返回long类型的数据
> 
> freturn 从方法中返回float类型的数据
> 
> dreturn 从方法中返回double类型的数据
> 
> areturn 从方法中返回引用类型的数据
> 
> return 从方法中返回，返回值为void

## 6.1. 方法调用指令

| 方法调用指令 | 含义 |
| --- | --- |
| invokevirtual | 调用对象的实例方法 |
| invokeinterface | 调用接口方法 |
| invokespecial | 调用一些需要特殊处理的实例方法，包括实例初始化方法（构造器）、私有方法和父类方法 |
| invokestatic | 调用命名类中的类方法（static方法） |
| invokedynamic | 调用动态绑定的方法 |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531682.png)

## 6.2. 方法返回指令

| 方法返回指令 | void | int | long | float | double | reference |
| --- | --- | --- | --- | --- | --- | --- |
| **xreturn** | return | ireturn | lreturn | freutrn | dreturn | areturn |

![image-20210425222017858](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531437.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531034.png)

```java
public int methodReturn() {
    int i = 500;
    int j = 200;
    int k = 50;
    
    return (i + j) / k;
}
```

![image-20210425222245665](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051531638.png)

* * *

# 7\. 操作数栈管理指令

> ## 通用(无类型）栈操作
> 
> nop 不做任何操作
> 
> pop 弹出栈顶端一个字长的内容
> 
> pop2 弹出栈顶端两个字长的内容
> 
> dup 复制栈顶部一个字长内容
> 
> dup\_x1 复制栈顶部一个字长的内容，然后将复制内容及原来弹出的两个字长的内容压入栈
> 
> dup\_x2 复制栈顶部一个字长的内容，然后将复制内容及原来弹出的三个字长的内容压入栈
> 
> dup2 复制栈顶部两个字长内容
> 
> dup2\_x1 复制栈顶部两个字长的内容，然后将复制内容及原来弹出的三个字长的内容压入栈
> 
> dup2\_x2 复制栈顶部两个字长的内容，然后将复制内容及原来弹出的四个字长的内容压入栈
> 
> swap 交换栈顶部两个字长内容

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532877.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532758.png)

* * *

# 8\. 控制转移指令

> ## 比较指令
> 
> lcmp 比较long类型值
> 
> fcmpl 比较float类型值（当遇到NaN时，返回-1）
> 
> fcmpg 比较float类型值（当遇到NaN时，返回1）
> 
> dcmpl 比较double类型值（当遇到NaN时，返回-1）
> 
> dcmpg 比较double类型值（当遇到NaN时，返回1）
> 
> ## 条件分支指令
> 
> ifeq 如果等于0，则跳转
> 
> ifne 如果不等于0，则跳转
> 
> iflt 如果小于0，则跳转
> 
> ifge 如果大于等于0，则跳转
> 
> ifgt 如果大于0，则跳转
> 
> ifle 如果小于等于0，则跳转
> 
> ## 比较条件分支指令
> 
> if\_icmpeq 如果两个int值相等，则跳转
> 
> if\_icmpne 如果两个int类型值不相等，则跳转
> 
> if\_icmplt 如果一个int类型值小于另外一个int类型值，则跳转
> 
> if\_icmpge 如果一个int类型值大于或者等于另外一个int类型值，则跳转
> 
> if\_icmpgt 如果一个int类型值大于另外一个int类型值，则跳转
> 
> if\_icmple 如果一个int类型值小于或者等于另外一个int类型值，则跳转
> 
> ifnull 如果等于null，则跳转
> 
> ifnonnull 如果不等于null，则跳转
> 
> if\_acmpeq 如果两个对象引用相等，则跳转
> 
> if\_acmpne 如果两个对象引用不相等，则跳转
> 
> ## 多条件分支跳转指令
> 
> tableswitch 通过索引访问跳转表，并跳转
> 
> lookupswitch 通过键值匹配访问跳转表，并执行跳转操作
> 
> ## 无条件跳转指令
> 
> goto 无条件跳转
> 
> goto\_w 无条件跳转（宽索引）

## 8.1. 比较指令

> 比较指令的作用是比较占栈顶两个元素的大小，并将比较结果入栽。
> 
> 比较指令有： dcmpg,dcmpl、 fcmpg、fcmpl、lcmp
> 
> 与前面讲解的指令类似，首字符d表示double类型，f表示float,l表示long.
> 
> 对于double和float类型的数字，由于NaN的存在，各有两个版本的比较指令。以float为例，有fcmpg和fcmpl两个指令，它们的区别在于在数字比较时，若遇到NaN值，处理结果不同。
> 
> 指令dcmpl和 dcmpg也是类似的，根据其命名可以推测其含义，在此不再赘述。
> 
> 举例
> 
> 指令 fcmp和fcmpl都从中弹出两个操作数，并将它们做比较，设栈顶的元素为v2,顶顺位第2位的元素为v1,若v1=v2,则压入0:若v1>v2则压入1:若v1<v2则压入-1.
> 
> 两个指令的不同之处在于，如果遇到NaN值， fcmpg会压入1,而fcmpl会压入-1

## 8.2. 条件跳转指令

| < | <= | \== | != | \>= | \> | null | not null |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iflt | ifle | ifeq | ifng | ifge | ifgt | ifnull | ifnonnull |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532138.png)![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532776.png)

## 8.3. 比较条件跳转指令

| < | <= | \== | != | \>= | \> |
| --- | --- | --- | --- | --- | --- |
| if\_icmplt | if\_icmple | if\_icmpeq、if\_acmpeq | if\_icmpne、if\_acmpne | if\_icmpge | if\_icmpgt |

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532248.png)

## 8.4. 多条件分支跳转

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532827.png)  
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532036.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532578.png)

## 8.5. 无条件跳转

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532514.png)

* * *

# 9\. 异常处理指令

> ## 异常处理指令
> 
> athrow 抛出异常或错误。将栈顶异常抛出
> 
> jsr 跳转到子例程
> 
> jsr\_w 跳转到子例程（宽索引）
> 
> rct 从子例程返回

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532781.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532281.png)  
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532487.png) 
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532667.png)

* * *

# 10\. 同步控制指令

> ### 线程同步
> 
> montiorenter 进入并获取对象监视器。即：为栈顶对象加锁
> 
> monitorexit 释放并退出对象监视器。即：为栈顶对象解锁

Java虚拟机支持两种同步结构：方法级的同步和方法内部一段指令序列的同步，这两种同步都是使用monitor来支持的

## 10.1. 方法级的同步

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051532345.png)

```java
private int i = 0;
public synchronized void add() {
	i++;
}
```

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533809.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533141.png)

## 10.2. 方法内指令指令序列的同步

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533279.png)  
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533443.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533318.png)
![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401051533267.png)
