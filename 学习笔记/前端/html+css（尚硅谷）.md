# HTML

• HTML（Hypertext Markup Language）超文本标记语言。 

• 它负责网页的三个要素之中的结构。 

• HTML使用标签的的形式来标识网页中的不同组成部分。

• 所谓超文本指的是超链接，使用超链接可以让我们从一个页面跳转到另一个页面。

# 块元素和行内元素

```
<!--
  在html中，元素可以被分为块元素和行内元素

  - 块元素（block）
    - 块元素会独占页面的一行自上向下垂直排列
    - 块元素用来对网页进行布局，将一个页面分成一块一块的
    - 最常用的块元素：div

  - 行内元素（inline）
    - 行内元素只会占自身的大小，自左向右水平排列
    - 行内元素一般用来放置文字
    - 最常用的行内元素：span

  - 替换元素
    - img iframe

  - 元素的嵌套规则：
    - 块元素中可以放置块元素，也可以放置行内元素
    - 行内元素中尽量不要放置块元素
    - a元素中可以放置除它自身外的任何元素
    - p元素中不能放置块元素
-->
```



# 选择器

## 基本选择器

```
/*
  基本选择器：
    元素选择器
      - 根据标签名选中多个元素
      - 语法：标签名{}
      - 例子：
          p{}  div{}  h1{}

    id选择器
      - 根据元素的id属性选中一个元素
      - 语法：#id {}
      - 例子：
          #p1{} #box{} #head{}

    类选择器（最常用的选择器）
      - 根据元素的class属性选中元素
      - 语法：.class{}
      - 例子：.p1{} .box{} .head{}

    通配选择器
      - 选择页面中的所有元素
      - 语法： *{}
 */
 
<!--
	class属性和id类似，每一个元素都可以指定，用来为元素进行分类,
    和id不同，可以为多个元素指定相同的class，拥有同一个class的元素可以说它们是同一类元素
    也可以同时为一个元素指定多个class
-->
```

## 属性选择器

```
 /*
属性选择器
    - 用来根据元素的属性来选中元素
    - 语法：
        [属性名] 选中具有该属性的元素
        [属性名=属性值] 选中指定属性值的元素
        [属性名^=属性值] 选中属性值以指定内容开头的元素
        [属性名$=属性值] 选中属性值以指定内容结尾的元素
        [属性名*=属性值] 选中属性值包含指定内容的元素

        */
        /*[title]{
            color:orange;
        }*/
        /*[title=hello]{
            color: red;
        }*/
        /*[title^=he]{
            color: red;
        }*/
        /*[title$=lo]{
            color: red;
        }*/
        /*[title*=a]{
            color: red;
        }*/
        /*
    选中title属性等于hello的div

    div{}
    [title=hello]{}

    可以将多个选择器连着一起写，这样则要求元素必须同时满足多个选择器

    交集选择器
        - 作用：选中同时符合多个选择器元素
        - 语法：选择器1选择器2选择器3{}
        - 例子：
            div[title=hello]{}
            div.box{}
            div#box1{}
*/
```

## 分组选择器

```
/*
  分组选择器：
    - 作用：同时选中多个选择器对应的元素
    - 语法：选择器1,选择器2,选择器3,...选择器n{}
 */
/*#p1, .p2, div{
    color: red;
}
*/
```

## 关系选择器

```
- 根据元素之间的关系来选中元素
    - 元素之间有哪些关系：
        父子、祖先后代、兄弟

    - 子元素选择器
        作用：选中指定元素的子元素
        语法：父元素 > 子元素{}

    - 后代元素选择器
        作用：选中指定元素的后代元素
        语法：祖先 后代{}

    - 兄弟元素选择器
        作用：选中指定的兄弟元素
        语法：
            兄 + 弟 {}
                - 选中紧随其后的一个兄弟
            兄 ~ 弟 {}
                - 选中后边的所有兄弟元素
```

# 选择器的权重

```
/*
样式的冲突
- 当我们使用不同的选择器，选中同一个元素并设置相同的样式时，就发生了样式的冲突
- 当样式冲突发生时，哪个样式生效由选择器的优先级（权重）决定：
  继承的样式：没有优先级
  通配选择器: 0,0,0,0
  元素选择器：0,0,0,1
  类和伪类选择器：0,0,1,0
  id选择器：0,1,0,0
  内联样式：1,0,0,0

- 比较优先级时，需要将多个选择器的优先级一起计算
    优先级高的优先显示，优先级的累加无法跨域数量级,
    如果优先级一样，则优先显示靠下的样式
    如果为样式添加 !important，则该样式会获得最高的优先级，优先于其他样式显示，慎用！

    注意：分组选择器优先级都是单独计算的！
```

# 伪类

```
<!--
  伪类是一个特殊的类，用来表示元素的状态，伪类使用:开头
  - 像超链接，一个链接有没有被访问过就是一种特殊的状态
    在CSS中，可以使用:visited来表示访问过的超链接
  - a的伪类：
        :link
            - 表示正常的超链接（未访问过的超链接）
        :visited
            - 访问过的链接
        :hover
            - 鼠标移入的元素
        :active
            - 鼠标点击的元素
-->
/*
    visited用来表示访问过的链接，
    它是根据用户的历史记录进行判断
    由于隐私的原因，通过visited只能改变文字的颜色
*/
```

## 结构伪类：

    :root
        - 根元素
    :empty
        - 空元素
    :first-child
        - 第一个子元素
    :first-of-type
        - 同类型中的第一个子元素
    :last-child
        - 最后一个子元素
    :last-of-type
        - 同类型中的最后一个子元素
    :nth-child
        - 第n个子元素
    :nth-of-type
        - 同类型中第n个子元素
    :nth-last-child
        - 倒数第n个元素
    :nth-last-of-type
        - 同类型中倒数第n个元素
    :only-child
        - 唯一的子元素
    :only-of-type
        - 同类型中唯一的子元素
    /*
    :not
    - 否定伪类，除了某些元素
    */
    */

```
/*
  通过before、after可以选中元素开始或结束的位置，从而为其添加内容。
    注意：这里的内容是通过CSS添加的！不算是网页中的正式内容。
        1.通过它可以为元素添加一些统一的符号
        2.也可以在特殊场景下通过它们来调整一下页面的样式
 */
```

```
<!--
伪元素
  - 伪元素表示的是页面中特殊的位置
  - 伪元素使用::开头
  ::before
    - 元素的开始位置（开始标签之后）
  ::after
    - 元素的结束位置（结束标签之前）
  ::first-letter
    - 首字母
  ::first-line
    - 第一行
  ::selection
    - 选中的文字的样式
-->
```

# 单位

```
<!--
单位：长度单位和颜色单位
    长度单位：
        像素（px）：
            显示器的图形实际上是由一个一个的小点点构成的，
                每一个小点就是一个像素
            每一台设备的像素大小是不同的，越清晰的设备像素就越小
            当我们面向移动端开发时，会面临一个问题，同样是12px，在pc端里可能正合适
                但是在手机中浏览时，就会变得特别的小

        百分比（%）：
            设置后元素的属性会根据父元素指定属性的百分比计算

        em：
            1em = 1font-size（当前元素的）

        rem（root em）：
            1rem = 1根元素的font-size（html根元素）

-->
```



# 颜色单位

```
/*
颜色单位：
  1.颜色名
    - 可以直接使用颜色名来设置颜色
    - 比如：red、blue、green、yellow、orange ...
  2.rgb值
    - rgb值指通过三种不同的颜色的组合，来调配出不同的颜色
    - red green blue
    - 语法：RGB(红色, 绿色, 蓝色)
    - 取值范围：0-255
    - 光的三原色

/*
    rgba()
      - r 红色
      - g 绿色
      - b 蓝色
      - a 不透明度，需要一个0-1之间的值
    background-color: rgba(104, 151, 187, .1); 
*/
/*
    hsl() 也是设置颜色的方式
      - h 色相 0 - 360
      - s 饱和度 0% - 100%
      - l 亮度  0% - 100%

    hsla()
*/
```

# 盒子模型（box model）

- 网页的布局指就是将元素摆放到网页的不同的位置
	- 布局就得先确定元素的大小
	- 在网页中每一个元素都是一个矩形，或者可以直接将其想象为是一个盒子，每一个盒子，都由以下几个部分组成：
		- 内容区（content）
		    1.  内容区在元素最内部，用来容纳子元素
		    2.  内容区的大小由width和height设置
		- 内边距（padding）
		    1. 内容区和边框之间的距离称为内边距
		- 边框（border）
		    1. 边框是盒子边界，离开边框就属于盒子的外部了
		    2.  边框会影响到盒子可见框的大小
		- 外边距（margin）
		    1. 盒子与盒子之间的距离称为外边距
		    2. 外边距不会影响盒子的大小，但是它会影响盒子的位置（实际大小）

一个元素的可见框的大小由： 内容区、内边距和边框共同决定

    /*
        盒子的可见框指可见的部分，大小由内容区、内边距、边框共同决定
        box-sizing 用来指定盒子可见框的计算方式
        可选值：
            content-box 默认值，width和height用来设置内容区的大小
            border-box 设置该值后，width和height用来设置盒子可见框的大小
    */

 外边距同样有四个方向
                margin-top 上外边距，值越大元素越靠下
                margin-bottom
                margin-left 左外边距，值越大元素越靠右
                margin-right

      - 由于我们的浏览器默认是按照自左向右，自上向下的顺序来排列元素的，
        所以当我们设置上和左外边距时，是改变元素自身的位置
        但是设置下和右时，会改变其他元素的位置

## 外边距的折叠

```
/*
	外边距的折叠
    - 垂直方向的相邻外边距会发生外边距折叠的现象
        兄弟元素间外边距会取较大值（这样设计是为了避免两个元素之间的距离）
        父子元素间子元素外边距会传递给父元素，这样会导致布局出问题，需要避免该问题
*/
```

行内元素的盒模型

```
/*
    内容区
        width height
        - 行内元素的大小被内容撑开，
            无法通过width和height来设置行内元素宽度高度
    内边距
        padding
        - 行内元素可以设置内边距，但是垂直方向的内边距不会影响布局
    边框
        border
        - 行内元素可以设置边框，但是垂直方向的边框不会影响页面的布局
    外边距
        margin
        - 行内元素可以设置水平方向的外边距
*/
```

# 文本的样式

```
/*
    text-align 文本的水平对齐方式
        可选值：
            left 默认值 左对齐
            center 居中对齐
            right 右对齐
            justify 两端对齐

    网页中，图片 行内块 都可以使用文本对齐的方式

    text-indent 首行缩进
        - 可以设置负值
            - 正值文字向右移动
            - 负值文字向左移动
                可以利用负值隐藏网页中的一些文字

    text-decoration 文本修饰
        - 可选值：
            none 默认值 没有修饰
            underline 下划线
            overline 上划线
  	white-space: nowrap  
         禁止文字的自动换行    white-space: nowrap;
 	overflow: hidden;
         禁止文字的溢出 
           
	text-overflow: ellipsis;
    溢出文字显示为省略号
    line-height 用来设置元素的行高
        行就是用来放文字的，行高就是文字所在行的高度
        文字默认是在行高中进行垂直居中

        行间距 = 行高 - 字体大小

        行高可以设置一个数字，那么行高将会是字体大小对应的倍数
      在网页中，每个文字被显示时都会有一个文本框与之对应
                当我们设置元素的font-size时，实际上就是在设置文本框的大小
                在文本框存在一个位置叫做基线（baseline）

            文字的垂直对齐：
                默认每个文字和父元素在垂直方向都是沿着基线对齐的
	font-size 字体的大小
    font-weight 字重
        - 可选值：
            normal 默认值 正常的粗细
            bold 加粗
            lighter 细的
    font-style 字体的样式
        - 可选值
            normal 默认值 正常的
            italic 斜体
    font-family 字体族，指定使用什么字体
         - 字体的分类
            serif 衬线字体
            sans-serif 非衬线字体
            monospace 等宽字体
            ...
            - 当我们将字体设置为上述类型时，
                浏览器会自动选择相应的字体来显示

    font
        - 简写属性
        - 可以同时设置字体相关的所有样式
        - 语法：
            font: 任意 font-size/line-height font-family


    vertical-align
        - 设置元素垂直对齐的方式
        - 可选值：
            baseline 默认值 子元素和父元素的基线对齐
            top 子元素文本框的顶部和父元素文本框的顶部对齐
            bottom 子元素文本框的底部和父元素文本框的底部对齐
            middle 将元素的中线和父元素基线高度+x高度一半的位置对齐
         - 开发中经常通过vertical-align来消除图片下边的空白
*/
```

# 浮动

```
 float: left;
  /*
    float
        - 设置元素浮动
        - 可选值：
            none，默认值 元素不浮动
            left，向左浮动
            right，向右浮动
        - 浮动的特点：
            1. 设置浮动后，元素或脱离文档流，其后的元素会自动上移
            2. 设置浮动后，元素会向其包含块的左侧或右侧移动
            3. 如果一行之内无法容纳所有的浮动元素，则后边的元素会自动换到下一行
            4. 浮动元素不会超过它上边浮动的兄弟元素，最多一边齐
            5. 浮动元素不会盖住文字，文字会环绕在浮动元素的周围
*/
/*
            浮动后，之前的布局等式就失效了

            元素脱离文档流后的特点：
                块元素：
                    1.块元素不再独占一行，而是水平排列
                    2.宽度和高度都被内容撑开
                行内元素：
                    设置浮动行内元素可以设置宽度和高度

                总结：脱离文档流后，块元素不再独占一行，宽高被内容撑开，行内元素变成块元素

                脱离文档流后，就不再需要区分行内和块


*/
```

# clearfix 小技巧 

先向包含浮动内容及其本身的盒子后方插入一些生成的内容，并将生成的内容清除浮动。

```css
.wrapper::after {
  content: "";
  clear: both;
  display: block;
}
```

## 使用 overflow

一个替代的方案是将包裹元素的 [`overflow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow) 属性设置为除 `visible` 外的其他值。

```css
.wrapper {
  background-color: rgb(79, 185, 227);
  padding: 10px;
  color: #fff;
  overflow: auto;
}
```

# 高度塌陷

```
 /*
    在文档流中的元素，可以将其他元素的高度撑开！
        当元素浮动，它会脱离文档流，脱离文档流后，
            无法撑开父元素的高度，导致父元素高度塌陷
        父元素高度塌陷，其后的元素会自动上移，导致布局变得混乱

    高度塌陷是我们使用浮动布局时必须要解决的问题！

    如何解决该问题？
        1. 可以直接将父元素的高度写死
            - 这样一来父元素高度写死，无法根据子元素高度的变化而变化
    解决方案：

*/
```

#  BFC（Block Formatting Context）

就是创建一个块，防止浮动导致的高度塌陷问题，

格式化上下文影响布局，通常，我们会为定位和清除浮动创建新的 BFC，而不是更改布局，因为它将：

- 包含内部浮动。
- 排除外部浮动。
- 阻止[外边距重叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)。

```
  - 块级格式化环境
    - https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
    - 可以将BFC理解为一个隐藏的属性，当开启BFC后元素会具备如下的特征：
        1. 开启BFC后，子元素的垂直外边距不会传递给父元素
        2. 开启BFC后，元素不会被浮动元素所覆盖
        3. 开启BFC后，元素可以包含浮动的子元素

    - 如何开启BFC：
        - 需要用一些其他的样式来间接的开启BFC
        - 由于BFC是通过一些样式间接开启的，所以都会有一些副作用，
            而我们要做的是找到一种可以开启，同时副作用又比较小的
        - 例如：
            1. 浮动会开启元素的BFC
            2. 将overflow设置为一个非visible的值
            3. display: flow-root
            
     clear
        - 清除浮动元素对当前元素所产生的影响
        - 可选值：
            left 清除左侧浮动元素对当前元素的影响
            right 清除右侧浮动元素对当前元素的影响
            both 清除最大一侧浮动元素对当前元素的影响
```

# 定位

**定位和z-index结合一起使用**

如果所有的父元素都没有显式地定义 position 属性，那么所有的父元素默认情况下 position 属性都是 static。结果，绝对定位元素会被包含在**初始块容器**中。这个初始块容器有着和浏览器视口一样的尺寸，并且\<html>元素也被包含在这个容器里面。简单来说，绝对定位元素会被放在\<html>元素的外面，并且根据浏览器视口来定位。

绝对定位元素在 HTML 源代码中，是被放在\<body>中的，但是在最终的布局里面，它离页面 (而不是\<body>) 的左边界、上边界有 30px 的距离。我们可以改变**定位上下文** —— 绝对定位的元素的相对位置元素。通过设置其中一个父元素的定位属性 —— 也就是包含绝对定位元素的那个元素（如果要设置绝对定位元素的相对元素，那么这个元素一定要包含绝对定位元素）

```
/*
    position
        - 用来设置元素的定位方式
        - 可选值：
            static，默认值，元素没有开启定位
            relative，开启元素的相对定位
            absolute，开启元素的绝对定位
            fixed，开启元素的固定定位
            sticky，开启粘滞定位

    相对定位：
        - 将元素的position属性设置为relative则开启了元素的相对定位
        - 相对定位定位的特点：
            1. 开启相对定位而不设置元素的偏移量，此时元素不会发生任何变化
            2. 开启相对定位不会使得元素脱离文档流，不会改变元素的性质
            3. 相对定位元素是参照于其原来的位置进行定位的
            4. 相对定位会提升元素的层级


    偏移量
        - 开启了定位的元素可以通过偏移量来设置元素的位置
        - 偏移量一共有四个：
            top
                - 元素上边距离定位位置上边的距离
            bottom
                - 元素下边距离定位位置下边的距离
            left
                - 元素左边距离定位置左边的距离
            right
                - 元素右边距离定位置右边的距离
            - 偏移量通常只使用两个即可定位一个元素的位置

*/

<!--
    布局手段：
        1. 盒子模型（纵向）
        2. 浮动（横向）
        3. 定位

    定位（position）
        - 通过定位可以将一个元素摆放到页面中的任意位置
        - CSS中共有四种定位方式：
            1.相对定位
            2.绝对定位
            3.固定定位
            4.粘滞定位

-->
```

```
 /*
    绝对定位
        - 将元素的position设置为absolute，则开启了元素的绝对定位
        - 特点：
            1. 开启绝对定位后，如果不设置偏移量，元素的位置不会发生变化
            2. 开启绝对定位后，元素会脱离文档流，同时元素性质发生变化
            3. 绝对定位元素是参照于离它最近的开启了定位的祖先元素进行定位,
                如果所有的祖先元素都没有开启定位，则相对于浏览器窗口进行定位
                所以在开发中，经常在为一个元素开启绝对定位后，同时也给它的父元素开启相对定位
            4. 绝对定位会提升元素的层级
            3. 绝对定位是参照于它的包含块进行定位的！

            绝对定位元素的包含块是谁？
                - 绝对定位元素的包含块是离它最近的开启定位的祖先元素
                - 如果所有的祖先都没有开启定位，则它的包含块是初始包含块
                - 初始包含块的大小和视口是相同
*/
```

```
/*
	盒子模型的等式
    	margin-left + 可见框宽度 + margin-right = 包含块的内容区宽度
	当元素开启了绝对定位后，两个新的等式诞生了！
        left + margin-left + 可见框宽度 + margin-right + right = 包含块的内容区宽度
        top + margin-top + 可见框高度 + margin-bottom + bottom = 包含块的内容区高度

        auto + auto + 200 + auto + auto = 800
        0 + auto + 200 + auto + 0 = 800
*/
```

```
 /*
    开启了定位后，可以通过z-index来设置元素的层级
    z-index的值越大，元素的层级就越高，层级越高越优先显示
    如果层级一样，则优先显示下边的元素
    z-index可以设置为负值，设置负值后定位元素将会被文档流中的元素覆盖！

    注意：
        祖先元素的层级再高，也无法盖住后代元素
*/
```

```
固定定位
/*
    将position设置为fixed则开启了元素的固定定位，
        固定定位也是一种绝对定位，它的大部分的特点和绝对定位是相同的
        不同点在于固定定位总是参照于浏览器的窗口进行定位
            一旦定位，不会随窗口进行滚动
*/
```

```
粘滞定位
/*
    将元素的position设置sticky则开启了元素的粘滞定位，
        粘滞定位的特点和相对定位类似
    定位参照物：
        粘滞定位相对于离它最近的拥有滚动条祖先元素来定位的
*/
```

# 布局

```
<!--
    传统的布局手段
        1. 盒子模型（box model）
            - 盒子模型主要用来确定元素的大小和间距的
            - 主要用来处理元素的纵向排列

        2. 浮动（float）
            - 浮动本来是用来处理文本环绕图片这种类似效果的
                后来被用到了元素的水平排列上
            - 因为它不是被设计用来布局的，所以使用浮动时会存在一些问题（高度塌陷问题）
            - 主要用来处理元素的横向排列

            - 注意：
                盒子模型和浮动主要用来进行宏观的布局

        3. 定位（position）
            - 通过定位可以将一个元素摆放到网页的任意位置
            - 主要用来处理网页中的小东西
-->
```

# 弹性盒模型

当元素表现为 flex 框时，它们沿着两个轴来布局：

在从左到右的语言中，三个 flex 项并排放置在 flex 容器中。主轴——弹性容器布置 flex 方向上的轴——是水平的。主轴的两端是开始端和结束端，分别位于左侧和右侧。交叉轴是垂直的；垂直于主轴。交叉轴的开始端和结束端分别位于顶部和底部。flex 项沿着主轴排列，在这种情况下，宽度称为主轴尺寸，flex 项沿交叉轴排列，在这种情况下，高度称为交叉尺寸。

  ![在从左到右的语言中，三个 flex 项并排放置在 flex 容器中。主轴——弹性容器布置 flex 方向上的轴——是水平的。主轴的两端是开始端和结束端，分别位于左侧和右侧。交叉轴是垂直的；垂直于主轴。交叉轴的开始端和结束端分别位于顶部和底部。flex 项沿着主轴排列，在这种情况下，宽度称为主轴尺寸，flex 项沿交叉轴排列，在这种情况下，高度称为交叉尺寸。](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311241509407.png)

- **主轴**（main axis）是沿着 flex 元素放置的方向延伸的轴（比如页面上的横向的行、纵向的列）。该轴的开始和结束被称为 **main start** 和 **main end**。
- **交叉轴**（cross axis）是垂直于 flex 元素放置方向的轴。该轴的开始和结束被称为 **cross start** 和 **cross end**。
- 设置了 `display: flex` 的父元素（在本例中是 [`section`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section)）被称之为 **flex 容器（flex container）。**
- 在 flex 容器中表现为弹性的盒子的元素被称之为 **flex 项**（**flex item**）（本例中是 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 元素。

```
/*
    弹性容器
        - 要使用弹性盒必须先将元素设置为弹性容器
            display:flex 块级弹性容器
            display:inline-flex 行内弹性容器
    弹性子元素（弹性项）
        - 弹性容器的子元素都会自动变成弹性子元素
        - 弹性子元素都会沿着弹性容器的主轴排列
    主轴
        - 主轴就是弹性子元素排列方向
    侧轴（辅轴）
        - 侧轴是与主轴垂直方向的轴

*/
 
    弹性盒是CSS3中新添加的布局方式，通过它可以更加方便完成我们对网页的布局
        通过弹性盒模型，可以便捷完成网页中的各种布局

```

```
/*
    主轴
        - 主轴就是弹性子元素排列方向
        - 如何设置主轴方向：
            flex-direction
                可选值：
                    row 主轴是自左向右水平排列
                    column 主轴是自上向下垂直排列
                    row-reverse 主轴是自右向左水平排列
                    column-reverse 主轴是自下向上垂直排列
         - 设置元素是否换行
            flex-wrap
                可选值：
                    nowrap 元素不会自动换行
                    wrap 自动换行
                    wrap-reverse 反向换行

            flex-flow：
                flex-direction 和 flex-wrap的简写属性
                    可以同时设置两个样式并且没有顺序和数量的要求
			justify-content 设置元素在主轴上的对齐方式
                    可选值：
                        start 默认值，元素靠主轴起始位置对齐
                        end 元素靠主轴的结束位置对齐
                        center 沿主轴方向居中对齐
                        space-between 将主轴方向空白位置分配到两个元素之间
                        space-around 将主轴方向空白位置分配到元素周围
                        space-evenly 将主轴方向的空白分配到元素的一侧
            align-items 设置元素在侧轴上的对齐方式
                   stretch 拉伸，元素会自动拉伸将侧轴撑满
                   start 元素靠侧轴的起始位置对齐
                   end 元素靠侧轴的结束位置对齐
                   center 元素在侧轴上居中对齐
            align-content 设置元素在侧轴上空白空间的分配
                    space-between 将侧轴方向空白位置分配到两个元素之间
                    space-around 将侧轴方向空白位置分配到元素周围
                    space-evenly 将侧轴方向的空白分配到元素的一侧
                    
                    
   		弹性子元素的样式（弹性项的样式）
            flex-basis
                - 弹性子元素的基础大小，会根据主轴的方向自动设置width或height
                    主轴水平，设置宽度
                    主轴垂直，设置高度
                - 可选值：
                    auto 默认值 以元素width或height为准
            flex-shrink
                - 弹性子元素的收缩系数
                    当父元素容纳不下所有子元素时，如何自动缩小元素大小
                - 元素的收缩是根据flex-basis和flex-shrink综合计算的
                    收缩系数越大，元素基础大小越大，元素就缩的越多
                - 默认值为1，可以根据需要设置，如果设置为则表示不收缩
            flex-grow
                - 弹性子元素的生长系数
                - 当容器中有富余空间时，如果分配到子元素
                - 默认值0，元素默认不会变大

            flex
                - 上述三个属性的简写属性
                - 属性顺序：
                    grow shrink basis
                - 可选值：
                    initial 默认值 0 1 auto
                    auto 相当于 1 1 auto
                    none 相当于 0 0 auto
   			align-self
                - 弹性子元素的样式
                - 用来单独设置某个弹性子元素的对齐方式

            order
                - 用来指定弹性子元素的位置
    侧轴（辅轴）
        - 侧轴是与主轴垂直方向的轴
        
                元素居中的方式：
                    1. 利用margin:0 auto来实现水平居中
                    2. 利用定位来实现水平和垂直居中
                    3. 利用弹性盒来实现水平和垂直居中
```

# 居中

```html
<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="UTF-8">
        <title>总结居中</title>
        <style>
            .box1 {
                width: 400px;
                height: 400px;
                border: 10px red solid;
                /* position: relative; */

                display: flex;
                justify-content: center;
                align-items: center;

                /* margin: 0 auto; */


            }

            .box2 {
                background-color: #bfa;
                width: 200px;
                height: 200px;
                position: fixed;
                /*position: absolute;*/

                /*left: 50%;
                margin-left: -100px;

                top:50%;
                margin-top: -100px;*/

                /*top: 0;*/
                /*bottom: 0;*/
                /*left: 0;*/
                /*right: 0;*/
                /*margin: auto;*/
                /*
                1. 使用盒子模型
                直接通过盒子模型 margin: 0 auto; 来实现居中
                - 原理：利用了盒子模型在水平布局时的等式
                左右外边距 + 可见框宽度 = 包含块宽度
                - 缺点：
                1. 不能处理垂直居中问题
                2. 居中的元素必须指定宽度

                2. 使用定位
                通过如下代码来实现：
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;

                - 原理：利用定位后新的等式来实现居中
                左右偏移量 + 左右外边距 + 可见框的宽度 = 包含块的宽度
                上下偏移量 + 上下外边距 + 可见框的高度 = 包含块的高度

                - 缺点：
                1. 设置的样式稍微多一些
                2. 必须指定元素的大小

                3. 通过表格来居中
                - 将父元素的display设置table-cell，然后通过vertical-align:middle来实现垂直居中
                然后再通过子元素的 margin:0 auto; 来实现居中
                - 也可以将子元素转换为inline-block，然后通过text-align:center来实现水平居中
                - 缺点：
                父元素设置为单元格后，默认宽度被内容撑开

                4. 通过弹性盒来居中
                - 代码：
                display: flex;
                justify-content: center;
                align-items: center;
                - 缺点：
                几乎没有
                */
            }
            /**
            * 盒子模型
            */
            /* .box3{
            width: 200px;
            height: 200px;
            background-color: beige;
            border-color: red;
            border-width: 10px;
            border-style: double;

            }
            .box4{
            width: 40px;
            height: 40px;
            background-color: aqua;
            margin: 0 auto;

            } */

            /**
            * 定位实现
            */

            /* .box3{
            width: 200px;
            height: 200px;
            background-color: beige;
            border-color: red;
            border-width: 10px;
            border-style: double;
            position: relative;

            }
            .box4{
            width: 40px;
            height: 40px;
            background-color: aqua;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            } */
            /* 弹性盒子实现 */
            /* .box3{
            width: 200px;
            height: 200px;
            background-color: beige;
            border-color: red;
            border-width: 10px;
            border-style: double;
            display: flex;
            align-items: center;
            justify-content: center;
            }
            .box4{
            width: 40px;
            height: 40px;
            background-color: aqua;
            flex-wrap: wrap;
            } */

            /* 表格居中*/
            .box3{
                width: 200px;
                height: 200px;
                background-color: beige;
                border-color: red;
                border-width: 10px;
                border-style: double;
                display: table-cell;
                vertical-align: middle;
            }
            .box4{
                width: 40px;
                height: 40px;
                background-color: aqua;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="box1">
            <div class="box2">
            </div>
        </div>


        <table >
            <div class="box3">
                <div class="box4">123444144</div>
            </div>
        </table>

    </body>
</html>
```



# 背景

```
/*
    background-color 背景颜色
    background-image 背景图片
    background-repeat 背景的重复方式
        - 可选值：
            repeat 默认值，背景图片会沿元素的水平垂直双方向重复
            repeat-x 水平方向重复
            repeat-y 垂直方向重复
            no-repeat 不重复
            space 背景图片充满元素，无法完整充满使用空白隔开
            round 背景图片自动缩放以充满元素
    background-position 设置背景图片的位置
        - 可选值：
            top bottom left right center
                - 可以从上述关键字中任选两个来设置一个背景图片的位置
                - 如果只传了一个关键字，则第二个默认就是center

        background-position: 水平偏移量 垂直偏移量
            水平偏移量 值越大，背景图片越右移，可以设置负值
            垂直偏移量 值越大，背景图片越下移，可以设置负值
			/*
                background-size 用来设置背景图片的尺寸
            */
            /*background-size: 200px auto;*/
            /*background-size: auto 200px;*/
            /*background-size: 200px 200px;*/
            /*background-size: 100% auto;*/
            /*background-size: auto 100% ;*/

            /*contain 缩放图片使得图片可以在元素中完整显示，元素有的地方可能会不显示背景*/
            /*background-size: contain;*/

            /*cover 缩放图片使得图片可以在将元素撑满，图片可能显示不全*/
            /*background-size: cover;*/
 		background-clip
                - 设置背景图片显示的区域
                - 可选值：
                    border-box 默认值，背景会延伸到边框的下边
                    padding-box 背景会延伸到内边距下
                    content-box 背景只会在内容区中显示

                background-origin
                - 设置背景图片定位的原点
                - 可选值：
                    padding-box 默认值，背景相对于padding定位
                    border-box 背景相对于边框定位
                    content-box 背景相对于内容区定位
*/
```

# 表格

```
<!--
    表格（table）
        - 和日常生活中使用的表格一样，在网页中也以创建表格
        - 可以通过表格来表示一些格式化的数据

    使用table来创建一个表格
-->
<!--caption表示表格的标题-->
    <caption>学生列表</caption>
    <!--表格的头部-->
    <thead>
    <!--tr表示一行-->
    <tr>
	<!--th用来表示表头中的单元格的-->
        <th>学号</th>
        <th>姓名</th>
        <th>性别</th>
        <th>年龄</th>
        <th>住址</th>
    </tr>
    </thead>

    <!--表格主体-->
    <tbody>
    <tr>
        <!--td表示一个单元格-->
<!--rowspan纵向的合并单元格-->
<!--colspan 横向的合并单元格-->
<!--
    如果在table没有写tbody，则浏览器会自动创建tbody，
        并将所有的tr都放入到tbody
-->
/*    文字在td中会自动垂直居中*/

```

# 表单

```
	<!--
		表单（form）
			- 在网页中，通过表单来将信息提交给服务器

			使用form标签来创建一个表单
		-->

		<!--action用来指定表单要提交到哪-->
		<form action="target.html">
			<!--表单项-->
			<!--文本框
			- input type属性为text
			- 如果希望表单中的数据真的被提交给服务器，
				必须为表单项指定name属性
			-->
			<input type="text" name="username">

		<!--
			提交按钮
			- input type属性为submit
			- 可以通过value属性来修改按钮上的文字
		-->
```

# 变形

```
/*
    通过变形可以对元素的位置，大小、角度等进行修改
*/
/*
    transform用来设置变形
        需要通过不同的变形函数来实现元素的变形
            translateX() x轴平移
            translateY() y轴平移
                - 设置平移时，如果使用百分比单位，百分比是相对于元素自身大小计算

        当我们对元素进行变形时，只会影响到元素自身，不会影响其他元素的位置
*/
```

# 平移

```
/*
    translateZ 用来设置z轴平移
        - z轴平移视觉上会感觉到元素大小的变化
*/
```

# 旋转

```
/*
    transform-origin 指定变形的原点
 
    rotateX 沿x轴旋转
    rotateY 沿y轴旋转
    rotateZ 沿z轴旋转

    单位：
        deg 度
        turn 圈
*/
```

# 缩放

```
 /*
    scaleX x轴缩放
    scaleY y轴缩放
    scale x y缩放

    scaleZ z轴缩放（需要3d下才能看出效果）
*/
```

# 过渡

```
<!--
    过渡（transition）
        - 通过过渡可以使得元素在样式发生变化时，一点一点的改变
-->
 /*
    transition-property
        - 应用过渡效果的属性
        - all 表示所有样式

   transition-duration
    - 过渡效果所花费的时间
    - 单位：
        s 秒
        ms 毫秒

   transition-delay
    - 过渡效果的延时

   transition-timing-function
    - 指定过渡的时间的曲线
    - 可选值：
        ease， 默认值 先加速然后减速
        linear 匀速运动
        ease-in 加速运动
        ease-out 减速运动
        贝塞尔曲线 自定义运动方式
            https://cubic-bezier.com/
        steps() 分步执行动画


  transition
    - 过渡的简写属性，可以同时设置过渡的所有样式

*/
```

# 动画

```
/*
    animation-name
        - 指定动画的名字
    animation-duration
        - 一次动画执行的时间
    animation-iteration-count
        - 动画执行的次数
        - infinite 一直执行
*/
/* animation-name: change-color; */

/*
    animation-delay 动画的延时
*/
animation-delay: 5s;

/*
    animation-timing-function 时间函数
*/
/*animation-timing-function: cubic-bezier(.42,1.56,1,-1.37);*/
/*animation-timing-function: steps(3);*/


/*
    animation-direction
        动画的方向
        - 可选值：
            normal 默认值
            reverse 动画反向执行
            alternate 动画正向反向交替执行
            alternate-reverse 和alternate相反
*/
animation-direction: alternate-reverse;

/*
    animation-fill-mode
        - 动画的填充模式
        - 可选值：
            none 默认值 延迟时元素保持不变，动画执行结束恢复原状
            forwards 延迟时元素保持不变，动画执行结束保持to的状态
            backwards 延迟时元素变为from状态，动画执行结束恢复原状
            both 延迟时元素变成from状态，动画执行结束保持to的状态

*/
animation-fill-mode: both;


/*
animation-play-state
    - 动画的播放状态
    - 可选值：
        paused 暂停
*/
/* animation-play-state: running; */

/*
animation 简写属性可以同时设置所有动画相关的样式
*/
/*
    通过keyframes来定义关键帧
*/
@keyframes move {
    /*
        from 表示动画的开始位置
    */
    0%{
        margin-left: 0;
    }

    10%{
        margin-top: 100px;
        margin-left: 300px;
    }

    20%{
        margin-top: 200px;
        margin-left: 100px;
    }

    30%{
        background-color: #bfa;
    }

    40%{
        margin-left: 0;
    }

    /*
        to 表示动画的结束位置
    */
    100%{
        margin-left: 500px;
    }
}
```

# 网页的布局

```
<!--
    原始的布局的方式（table）

    网格布局（grid）
        - 网格布局的方式和table类似
        - 在网格布局，将网页分为了一行一行和一列一列的
            通过对这些行和列的设置帮助我们完成布局
        - 网格布局比较适用于复杂的布局
        - 相较于弹性盒，无需设置多余的结构
        - 结构简单，样式复杂

    弹性盒（flex）
        - 弹性盒善于单行单列
        - 多行多列布局时，需要使用不同的结构组合使用
        - 结构复杂，样式简单
-->
```

# 网格布局

```
 /*
    网格容器
        - 要使用网格布局必须先设置网格容器
        - 使用 display:grid 或 display:inline-grid
        - 默认情况下，我们开启的是一个单列的网格布局

        grid-template-columns
            - 用来设置网格布局的列数
        grid-template-rows
            - 用来设置网格布局的行数

    网格项
        - 网格容器的子元素都会自动变为网格项
*/
```

```
/*
    可以通过z-index来调整网格项的层级

     grid-column 同时设置列开始和结束
        grid-column:开始/结束
     grid-row 同时设置行开始和结束
        grid-row:开始/结束
     grid-area 同时设置行列的开始和结束
        grid-area: 行开始/列开始/行结束/列结束
     grid-column-gap 列间距
     grid-row-gap 行间距

     grid-gap 同时指定行间距和列间距
        grid-gap 行间距 列间距

*/
```

```
/*
    justify-items
        - 设置网格中元素水平方向的对齐方式
    align-items
        - 设置网格中元素垂直方向的对齐方式
*/
```

```
/*
    justify-items / align-items 网格项在轨道中的对齐方式
*/
/*justify-items: center;*/
/*align-items: center;*/

/*
    justify-content
    align-content
        设置网格项的整体对齐
*/
```

```
 /*
    justify-self
    align-self
        - 单独设置某一个网格项在轨道中的对齐方式
*/
/* justify-self: start; */

/*align-self: start;*/
```

```
/*
    grid-auto-flow 网格项的排列方式
        - 可选值：
            row 默认值，优先填充行，行满了会自动创建新行
            column 优先填充列，列满了会自动换到下一列，此时会自动生成行
            dense 紧凑的， 容器中有位置，后边的元素就会自动的补位
    grid-auto-rows
        - 指定自动行的大小
*/
```

```
/*
    minmax(最小值, 最大值)
        - 用来设置行和列的大小
        - 可选值：
            像素、auto、min-content、max-content

    repeat()
        - 自动重复设置行和列
        - 第一个值：
            auto-fill 自动计算列，尽可能多的生成列
            auto-fit 自动计算列，尽量让列可以容纳下所有元素
*/
```

# 媒体查询

```
@media 设备类型{}
        all 任意类型的设备
        screen 带有屏幕的设备
        print 打印设备
        speech 屏幕阅读器
```

```css
@media screen and (width: 600px) {
  body {
    color: red;
  }
}
/*
    min-width 指定最小视口，大于等于指定值时，样式生效
    max-width 指定最大视口，小于等于指定值时，样式生效
*/
```

