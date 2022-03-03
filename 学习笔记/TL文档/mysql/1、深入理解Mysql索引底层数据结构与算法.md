# 1、深入理解Mysql索引底层数据结构与算法

![image-20211210103101138](https://gitee.com/wowosong/pic-md/raw/master/20211210103101.png)

##  二叉搜索树

 二叉搜索树是一种特殊的[二叉树](https://so.csdn.net/so/search?from=pc_blog_highlight&q=二叉树)，它的特点是：

1. 对于任意一个节点p，存储在p的左子树的中的所有节点中的值都小于p中的值

2. 对于任意一个节点p，存储在p的右子树的中的所有节点中的值都大于p中的值

   基于[二叉搜索树](https://so.csdn.net/so/search?from=pc_blog_highlight&q=二叉搜索树)的特性，**采用中序遍历的方式可以使得遍历结果是按照从小到大的顺序排列的**。

数据结构可视化网址：https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

![image-20211210222221205](https://gitee.com/wowosong/pic-md/raw/master/20211210222221.png)

## B+Tree

mysql采用B+Tree数据结构，数据从左到右排序

查看mysql文件页大小（16K）：SHOW GLOBAL STATUS like 'Innodb_page_size’;

为什么mysql页文件默认16K？
假设我们一行数据大小为1K，那么一页就能存16条数据，也就是一个叶子节点能存16条数据；再看非叶子节点，假设主键ID为bigint类型，那么长度为8B，指针大小在Innodb源码中为6B，一共就是14B，那么一页里就可以存储16K/14=1170个(主键+指针)
那么一颗高度为2的B+树能存储的数据为：1170*16=18720条，一颗高度为3的B+树能存储的数据为：1170**1170*16=21902400（千万级条）

![image-20211210223842939](https://gitee.com/wowosong/pic-md/raw/master/20211210223843.png)

![image-20211210223907203](https://gitee.com/wowosong/pic-md/raw/master/20211210223907.png)

## hash索引

hash索引不支持范围查找，因为无法比较

![image-20211210231358763](https://gitee.com/wowosong/pic-md/raw/master/20211210231358.png)

![image-20211210231839615](https://gitee.com/wowosong/pic-md/raw/master/20211210231839.png)

![image-20211210223937092](https://gitee.com/wowosong/pic-md/raw/master/20211210223937.png)

## MyISAM引擎

MyISAM引擎中，myi文件存储索引数据，MYD存储数据，属于不同的文件。索引文件按照BTree组织索引的数据结构。

## InnoDB

InnoDB按照B+Tree存储数据，但是会包含完整的数据，将下一级节点中最小的节点 提上去作为上一级的节点（描述不准确）

![image-20211210224006859](https://gitee.com/wowosong/pic-md/raw/master/20211210224006.png)

## 索引最左前缀原理

![image-20211210224027377](https://gitee.com/wowosong/pic-md/raw/master/20211210224027.png)

![image-20211210224040308](https://gitee.com/wowosong/pic-md/raw/master/20220115184442.png)

## 联合索引

按照联合索引建立的字段顺序，自动建立BTree索引文件，联合主键，包含完整数据

如果跳过联合索引的字段顺序，就无法按照字段的顺序进行高效定位