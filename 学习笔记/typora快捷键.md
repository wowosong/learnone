

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

~~~gfm
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

