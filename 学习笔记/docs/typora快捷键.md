
### 标题

有以下1-6级标题例如:

```markdown
# This is an H1

## This is an H2

###### This is an H6
```

在Typora中，输入‘#’再加上你的内容，然后回车就创建了一个标题

### 引用

Markdown使用电子邮件样式的>字符进行块引用。例子：

```markdown
> This is a blockquote with two paragraphs. This is first paragraph.
>
> This is second pragraph.Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> This is another blockquote with one paragraph. There is three empty line to seperate two blockquote.
```

在typora中，只需输入' > '，后面跟着引号内容，就会生成块引号。Typora会为你插入合适的>或换行符。通过添加额外的“>”级别，可以在另一个语句块中引用块引号。



### 列表

输入 `* 列表项1` 将创建无序列表, `*` 也可以替换成 `+` or `-`.

输入`1. 列表项 1` 将创建一个有序列表，markdown代码如下:

```markdown
## 无序列表
*   红
*   绿
*   蓝

## 有序列表
1.  红
2.  绿
3.  蓝
```

1. 
1.  
1. 

### 任务列表

任务列表是带有标记为[]或[x](https://www.jianshu.com/p/不完整或完整)项的列表。例如：

```markdown
- [ ] 一条任务列表项
- [ ] 任务列表的语法要求
- [ ] normal **formatting**, @mentions, #1234 refs
- [ ] incomplete
- [x] completed
```

你可以点击元素前面的复选框来更改完成和未完成状态。

### 保护的代码块

Typora只支持Github风格的Markdown。不支持markdown中的原始代码块。

使用保护代码块很简单: 输入 ``` 并且按 `回车`. 在```之后添加一个可选的语言标识符，我们将通过语法高亮显示运行它:

~~~markdown
举个栗子

```
function test() {
  console.log("notice the blank line before this function?");
}
```

ruby语法高亮:
```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```
~~~

### 表格

输入 `| 标题1 | 标题2 |` 再按 `回车` 将创建一个两列的表格.

创建表之后，将焦点放在该表上，将弹出一个表的工具栏，您可以在其中调整、对齐或删除表。您还可以使用上下文菜单来复制和添加/删除列/行。

可以跳过以下描述，因为typora自动生成表的markdown源代码。
 在markdown代码中要这么生成表格:

| title | title2 |
| :---- | ------ |
| 12313 |        |

您还可以在表格内添加内联的标记，如链接、粗体、斜体或删除线。

最后,通过包括冒号:在标题行中,您可以定义文本左对齐,右对齐,或居中对齐:

```markdown
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
```

冒号左边的一侧表示左对齐列;最右边一侧冒号表示右对齐列;双方一个冒号表示居中对齐列。而使用Typora不用这么麻烦些表格，当你在Typora创建表格之后，会自动出现工具帮助你实现以上的功能，最大限度的聚焦在你的思路上。

- 任务列表：-[空格]空格 文字

- 标题：ctrl+数字

- 表格：ctrl+t

- 生成目录：

  <span style="color:red;font-size:40px">目录</span>

  - Typora 配置说明
    - [贴图功能](https://www.bbsmax.com/A/xl56KmXxdr/#贴图功能)
    - [自定义快捷键](https://www.bbsmax.com/A/xl56KmXxdr/#自定义快捷键)
    - 快捷键使用
      - [Linux下安装typora](https://www.bbsmax.com/A/xl56KmXxdr/#linux下安装typora)

- 选中一整行：ctrl+l

- 选中单词：ctrl+d

- 选中相同格式的文字：ctrl+e

- 跳转到文章开头：ctrl+home

- 跳转到文章结尾：ctrl+end

- 搜索：ctrl+f

- 替换：ctrl+h

- 引用：输入>之后输入空格

- 代码块：ctrl+alt+f

- 加粗：ctrl+b

- 倾斜：ctrl+i

- 下划线：ctrl+u

- 删除线：alt+shift+5

- 插入图片：直接拖动到指定位置即可或者ctrl+shift+i

- 插入链接：ctrl+k

## 公式块与行内公式的添加

### 公式块

创建独立的一块公式区域。

$h_\theta(x)=\theta_0+\theta_1x$

```latex
 h_\theta(x) = \theta_0+\theta_1x
```

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020959498.jpeg)

上部分为公式输入区下部分为效果展示区

方法一：左上角点击“段落”，再点击“公式块”（也即前面说的ctrl+shift+M）
方法二：在文中输入$$，再按下回车

### 行内公式

将公式嵌入文字内
方法一：在$$的中间加入需要的公式 简便的方法一：先按 $ ，再按 “esc”（键盘左上角）

## 常用符号的代码

1. 上下标，正负无穷
2. 加减乘，分式，根号，省略号
3. 三角函数
4. 矢量，累加累乘，极限
5. 希腊字母

### 上下标，正负无穷

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020959926.png)

### 加减乘，分式，根号，省略号

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958214.png)

### 三角函数

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958263.png)

### 矢量，累加累乘，极限

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958807.png)

### 希腊字母

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958100.png)

```
 希腊字母Markdown写法
 α     \alpha
 β     \beta
 γ     \gamma
 δ     \delta
 ε     \epsilon
 ζ     \zeta
 η     \eta
 θ     \theta
 ι       \iota
 κ     \kappa
 λ     \lambda
 μ     \mu
 ν     \nu
 ξ     \xi
 ο     \omicron
 π     \pi
 ρ     \rho
 σ     \sigma
 τ     \tau
 υ     \upsilon
 φ     \phi
 χ     \chi
 ψ     \psi
 ω     \omega
 以上是常见的希腊字母的Markdown写法，你可以在Markdown中使用这些代码来插入对应的希腊字母。
```

### 关系运算符

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958199.png)

## 加帽子符号

latex中如果想在字母上加上一个帽子（尖角）符号应该怎样表达呢？

```
 如果是在正文中，例如用\^{Z}即可；
 如果是在公式中，例如用\hat{Z}即可。
```

## 加横线和波浪线

```
 加^号 输入\hat 或 \widehat
 加横线 输入 \overline
 加波浪线 输入 \widetilde
 加一个点 \dot{要加点的字母}
 加两个点\ddot{要加点的字母}
```

## 处理表格

输入 `| 表头1 | 表头2 |`并回车。即可创建一个包含2列表。快捷键 `Ctrl + T`弹出对话框。

### 左对齐

```
 |姓名|性别|年龄|
 |:-|:-|:-|
 |A|男|27|
 |B|女|27|
```

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958805.png)

### 居中

```
 |姓名|性别|年龄|
 |:-:|:-:|:-:|
 |A|男|27|
 |B|女|27|
```

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958210.png)

### 右对齐

```
 |姓名|性别|年龄|
 |-:|-:|-:|
 |A|男|27|
 |B|女|27|
```

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020958178.png)

- 不管是哪种方式，第一行为表头，第二行为分割表头和主体部分，第三行开始每一行为一个表格行
- 列与列之间用管道符号`|` 隔开
- 还可设置对齐方式(表头与内容之间)，如果不使用对齐标记，内容默认左对齐，表头居中对齐
- 左对齐 :|
- 右对齐 |:
- 中对齐 :|：
- 为了美观，可以使用空格对齐不同行的单元格，并在左右两侧都使用 | 来标记单元格边界(看自己的使用习惯)
- 为了使 Markdown 更清晰，| 和 - 两侧需要至少有一个空格（最左侧和最右侧的 | 外就不需要了）。

## 改变字体颜色

### 方式一：采用AutoHotKey软件+快捷键公式

- 安装AutoHotKey软件：https://autohotkey.com/
- 新建一个文本文档，这里取名"AutoHotKey.ahk",文本里面放的内容在下面展示
- 双击脚本运行，可以直接用快捷键改变颜色

```
 ;Typora
 ;快捷增加字体颜色
 ;SendInput {Text} 解决中文输入法问题
 
 #IfwinActive ahk exe Typora.exe
 {
    ; alt+1 红色
      !1::addFontColor("red")
 
      ; alt+2 橙色
      !2::addFontColor("orange")
 
      ; alt+3 黄色
      !3::addFontColor("#DAA520")
 
      ; alt+4 绿色
      !4::addFontColor("#008B8B")
 
      ; alt+5 靛青
      !5::addFontColor("#1661ab")
 
      ; alt+6 蓝色
      !6::addFontColor("#00BFFF")
 
      ; alt+7 魏紫
      !7::addFontColor("#7e1671")
     
      ; alt+8 灰色
      !8::addFontColor("#808080")
 }
 
 ;快捷增加字体颜色
 addFontColor(color){
    clipboard :="" ;清空剪切板
    Send {ctrl down}c{ctrl up] ; 复制
    SendInput {TEXT}<font color='%color%'>
    SendInput {ctrl down}v{ctrl up} ; 粘贴
    If(clipboard = ""){
        SendInput {TEXT}</font> ; Typora 在这不会自动补充
    }else{
    SendInput {TEXT}</ ; Typora中自动补全标签
    }
 }
```

效果展示如下：

- 这是红色
- 这是橙色
- 这是黄色
- 这是绿色
- 这是靛青
- 这是蓝色
- 这是魏紫
- 这是灰色

### 方式二：使用typora内置公式

- **语法**：只需要更改两个大括号中的内容，前一个括号中输入相应的颜色代码，后一个括号随便什么字符，是展示的文字。

  ```
   $\textcolor{GreenYellow}{这是GreenYellow}$
   $\textcolor{Yellow}{这是Yellow}$
   $\textcolor{Goldenrod}{这是Goldenrod} $
   $\textcolor{Dandelion}{这是Dandelion}$
   $\textcolor{Apricot}{这是Apricot} $
   $\textcolor{Peach}{这是Peach}$
   $\textcolor{Melon}{这是Melon} $
   $\textcolor{YellowOrange}{这是YellowOrange}$
   $\textcolor{Orange}{这是Orange} $
   $\textcolor{BurntOrange}{这是BurntOrange}$
   $\textcolor{Bittersweet}{这是Bittersweet}$
   $\textcolor{RedOrange}{这是RedOrange} $
   $\textcolor{Mahogany}{这是Mahogany}$
   $\textcolor{Maroon}{这是Maroon} $
   $\textcolor{BrickRed}{这是BrickRed}$
   $\textcolor{Red}{这是Red} $
   $\textcolor{OrangeRed}{这是OrangeRed}$
   $\textcolor{RubineRed}{这是RubineRed}$
   $\textcolor{WildStrawberry}{这是WildStrawberry}$
   $\textcolor{Salmon}{这是Salmon}$
   $\textcolor{CarnationPink}{这是CarnationPink}$
   $\textcolor{Magenta}{这是Magenta} $
   $\textcolor{VioletRed}{这是VioletRed}$
   $\textcolor{Rhodamine}{这是Rhodamine} $
   $\textcolor{Mulberry}{这是Mulberry}$
   $\textcolor{RedViolet}{这是RedViolet} $
   $\textcolor{Fuchsia}{这是Fuchsia}$
   $\textcolor{Lavender}{这是Lavender} $
   $\textcolor{Thistle}{这是Thistle}$
   $\textcolor{Orchid}{这是Orchid} $
   $\textcolor{DarkOrchid}{这是DarkOrchid}$
   $\textcolor{Purple}{这是Purple} $
   $\textcolor{Plum}{这是Plum}$
   $\textcolor{Violet}{这是Violet} $
   $\textcolor{RoyalPurple}{这是RoyalPurple}$
   $\textcolor{BlueViolet}{这是BlueViolet}$
   $\textcolor{Periwinkle}{这是Periwinkle}$
   $\textcolor{CadetBlue}{这是CadetBlue}$
   $\textcolor{CornflowerBlue}{这是CornflowerBlue}$
   $\textcolor{MidnightBlue}{这是MidnightBlue}$
   $\textcolor{NavyBlue}{这是NavyBlue} $
   $\textcolor{RoyalBlue}{这是RoyalBlue}$
   $\textcolor{Blue}{这是Blue} $
   $\textcolor{Cerulean}{这是Cerulean}$
   $\textcolor{Cyan}{这是Cyan} $
   $\textcolor{ProcessBlue}{这是ProcessBlue}$
   $\textcolor{SkyBlue}{这是SkyBlue} $
   $\textcolor{Turquoise}{这是Turquoise}$
   $\textcolor{TealBlue}{这是TealBlue} $
   $\textcolor{Aquamarine}{这是Aquamarine}$
   $\textcolor{BlueGreen}{这是BlueGreen} $
   $\textcolor{Emerald}{这是Emerald}$
   $\textcolor{JungleGreen}{这是JungleGreen}$
   $\textcolor{SeaGreen}{这是SeaGreen} $
   $\textcolor{Green}{这是Green}$
   $\textcolor{ForestGreen}{这是ForestGreen}$
   $\textcolor{PineGreen}{这是PineGreen} $
   $\textcolor{LimeGreen}{这是LimeGreen}$
   $\textcolor{YellowGreen}{这是YellowGreen}$
   $\textcolor{SpringGreen}{这是SpringGreen}$
   $\textcolor{OliveGreen}{这是OliveGreen}$
   $\textcolor{RawSienna}{这是RawSienna} $
   $\textcolor{Sepia}{这是Sepia}$
   $\textcolor{Brown}{这是Brown} $
   $\textcolor{Tan}{这是Tan}$
   $\textcolor{Gray}{这是Gray} $
   $\textcolor{Black}{这是Black}$
  ```

效果展示如下：

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312020957174.png)

## 参考资料

1. https://blog.csdn.net/mingzhuo_126/article/details/82722455
2. https://www.bilibili.com/read/cv1578688/
3. https://www.zhihu.com/answer/809450524
4. https://www.codenong.com/cs110480040/
5. https://zhuanlan.zhihu.com/p/462235348?utm_id=0(主题)
6. https://zhuanlan.zhihu.com/p/98570634
7. https://zhuanlan.zhihu.com/p/261750408
8. https://blog.csdn.net/liulei952413829/article/details/114670380
