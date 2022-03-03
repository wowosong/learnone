| Linux编辑器vi/vim | vim主要模式介绍vim命令模式、vim插入模式、vim命令行模式、vim可视化模式设置vim开发环境 | 第5天 | 自定义vim开发环境![img](file:///C:\Users\ADMINI~1\AppData\Local\Temp\ksohtml15300\wps1.jpg) |
| ----------------- | ------------------------------------------------------------ | ----- | ------------------------------------------------------------ |
|                   |                                                              |       |                                                              |

# vim 安装

[root@localhost ~]# rpm -ivh /mnt/Packages/vim-minimal-7.2.411-1.6.el6.x86_64.rpm 

warning: /mnt/Packages/vim-minimal-7.2.411-1.6.el6.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID fd431d51: NOKEY

Preparing...         ########################################### [100%]

​    package vim-minimal-2:7.2.411-1.6.el6.x86_64 is already installed

[root@localhost ~]# rpm -ivh /mnt/Packages/vim-enhanced-7.2.411-1.6.el6.x86_64.rpm 

warning: /mnt/Packages/vim-enhanced-7.2.411-1.6.el6.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID fd431d51: NOKEY

Preparing...         ########################################### [100%]

​    package vim-enhanced-2:7.2.411-1.6.el6.x86_64 is already installed

# vim 编辑器

​	模式切换:命令模式 、命令行模式、编辑模式

命令模式：

   字符操作

​	i 当前插入

​	I 行首插入

​	a 当前字符之后插入

​	A 行尾插入

​	o 下一行插入

​	O 上一行插入

​	x 向后删除一个字符

​	X 向前删除一个字符

​	u 撤销一步  两下u 撤销所有

​	Ctrl+r 恢复上一步

 

   行操作

​	home键或^ 行首 $行尾

​	end键或dd 删除一行 Ndd

​	yy 复制一行 Nyy 复制N行

​	p  将复制行粘贴 P上粘

​	

   词操作

​	dw 删除一个词，删除时要将光标移动到这个词的行首。 另外，如果光标不在行首，则删除光标之后的字母。

​	yw 复制一个词

 

   块操作

​	大D 或d+$删至行尾 d+^ 删至行首

​	y+$ 复制至尾 y+^ 复制至首

 

​	v 模式

​		进入v模式 移动光标选择区域、

编程的时候需要进行多行注释和删除多行注释，方法如下：
 1、注释：ctrl+v 进入列编辑模式,向下或向上移动光标,把需要注释的行的开头标记起来,然后按大写的I,再插入注释符,比如"#",再按Esc,就会全部注释了。
2、删除：再按ctrl+v 进入列编辑模式,向下或向上移动光>标,选中注释部分,然后按d, 就会删除注释符号。

 

 

   VIM命令行操作

​	:%s/old/new/g

:1,5 s/old/new/g

 

​	:set nu/nonu

​	/ 正向查找

​	去消高亮显示：  noh  或 随便查找一组没有的字符

​	? 反向查找

​	: !ls 调用系统命令

 

vim 的练习作业

​	vimtutor  vim工具使用方法手册

​	在windows中编辑好的文本文档，到Linux下打开乱码。解决方法：用gedit打开 另存为UTF-8。

 

 

编辑器：gedit  vim

vim:

\#vim filename

\#vim filename +N   #打开后，直接定位到对应的行

 

gg/G

\#vim -O file1 file2  ctrl+ww 在两个文件间切换。

\#vim file1 file2 file3 (:next 下一个 :prev 前一下 :last 最后一个 :first 或crtl+^ 第一个 ) 

注：切换时，要保存后在切换。

 

自定义vim

\#vim /etc/vimrc   

\#vim ~/.vimrc

输入：

set nu

set history=1000

syntax on

 

对应的含意：

\#显示行号

set nu

\#记录历史的行数

set history=1000

\#语法高亮度显示

syntax on

实战：

windows和linux处理回车不同。在windos中或linux中编写的脚本拷到对方法的系统中会乱行。 处理方法：

\#dos2unix autoim.sh

或：

\#unix2dos autoim.sh

 