纵观 ECharts 的 [option](https://echarts.apache.org/option.html#) 中，很多地方可以设置 [itemStyle](https://echarts.apache.org/option.html#series-bar.itemStyle)、[lineStyle](https://echarts.apache.org/option.html#series-line.lineStyle)、[areaStyle](https://echarts.apache.org/option.html#series-line.areaStyle)、[label](https://echarts.apache.org/option.html#series-bar.label) 等等。这些的地方可以直接设置图形元素的颜色、线宽、点的大小、标签的文字、标签的样式等等。

# 柱状图

## 通用配置

通用配置指的就是任何图表都能使用的配置

- 标题 ：title
- 提示： tooltip
- 工具按钮：toolbox
- 图例：legend

### 通用配置title--标题组件，包含主标题和副标题

- 文字样式 

  textStyle

- 标题边框

  borderWidth /borderColor /borderRadius

- 标题位置

  left / top /right /bottom
  
- 副标题

  subtextStyle

### 通用配置tooltip--提示框组件

tooltip:提示框组件，用于配置鼠标滑过或点击图标时的显示框

- 触发类型：trigger:  item/axis
- 触发时机：triggerOn: mouseover/click
- 格式化：formatter：字符串模板 回调函数

提示框组件可以设置在多种地方：

- 可以设置在全局，即 [tooltip](https://echarts.apache.org/zh/option.html#tooltip)
- 可以设置在坐标系中，即 [grid.tooltip](https://echarts.apache.org/zh/option.html#grid.tooltip)、[polar.tooltip](https://echarts.apache.org/zh/option.html#polar.tooltip)、[single.tooltip](https://echarts.apache.org/zh/option.html#single.tooltip)
- 可以设置在系列中，即 [series.tooltip](https://echarts.apache.org/zh/option.html#series.tooltip)
- 可以设置在系列的每个数据项中，即 [series.data.tooltip](https://echarts.apache.org/zh/option.html#series.data.tooltip)

### 通用配置toolbox--工具栏

内置有[导出图片](https://echarts.apache.org/zh/option.html#toolbox.feature.saveAsImage)，[数据视图](https://echarts.apache.org/zh/option.html#toolbox.feature.dataView)，[动态类型切换](https://echarts.apache.org/zh/option.html#toolbox.feature.magicType)，[数据区域缩放](https://echarts.apache.org/zh/option.html#toolbox.feature.dataZoom)，[重置](https://echarts.apache.org/zh/option.html#toolbox.feature.reset)五个工具。

toolbox:Echarts提供的工具栏

- 内置有导出图片、数据视图、动态类型切换、数据区域缩放、重置五个工具
- 显示工具栏按钮feature
  - saveAsIamage/dataView/restore/dataZoom/magicType

### 通用配置legend--图例组件

legend：图例，用于筛选系列，需要和series配合使用

- legend中的data是一个数组

- legend中data的值需要和series数组中的某组数据的name值一致

# grid

直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。可以在网格上绘制[折线图](https://echarts.apache.org/zh/option.html#series-line)，[柱状图](https://echarts.apache.org/zh/option.html#series-bar)，[散点图（气泡图）](https://echarts.apache.org/zh/option.html#series-scatter)。

# xAxis

直角坐标系 grid 中的 x 轴，一般情况下单个 grid 组件最多只能放上下两个 x 轴，多于两个 x 轴需要通过配置 [offset](https://echarts.apache.org/zh/option.html#xAxis.offset) 属性防止同个位置多个 x 轴的重叠。

# yAxis

直角坐标系 grid 中的 y 轴，一般情况下单个 grid 组件最多只能放左右两个 y 轴，多于两个 y 轴需要通过配置 [offset](https://echarts.apache.org/zh/option.html#yAxis.offset) 属性防止同个位置多个 Y 轴的重叠。

# axisPointer

这是坐标轴指示器（axisPointer）的全局公用设置。

------

坐标轴指示器是指示坐标轴当前刻度的工具。

如下例，鼠标悬浮到图上，可以出现标线和刻度文本。

# dataZoom

`dataZoom` 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响。

# visualMap

# graphic

# series

如果数据设置在 `系列（series）` 中，适于对一些特殊的数据结构（如“树”、“图”、超大数据）进行一定的数据类型定制。 但是缺点是，常需要用户先处理数据，把数据分割设置到各个系列（和类目轴）中。此外，不利于多个系列共享一份数据，也不利于基于原始数据进行图表类型、系列的映射安排。

# 数据集dataset

`数据集（dataset）`是专门用来管理数据的组件。虽然每个系列都可以在 `series.data` 中设置数据，但是从 ECharts4 支持数据集开始，更推荐使用数据集来管理数据。

数据设置在 `数据集（dataset）` 中，会有这些好处：

- 能够贴近数据可视化常见思维方式：（I）提供数据，（II）指定数据到视觉的映射，从而形成图表。

- 数据和其他配置可以被分离开来。数据常变，其他配置常不变。分开易于分别管理。

- 数据可以被多个系列或者组件复用，对于大数据量的场景，不必为每个系列创建一份数据。

- 支持更多的数据的常用格式，例如二维数组、对象数组等，一定程度上避免使用者为了数据格式而进行转换。

可以进行这些映射的设定：

- 指定 数据集 的列（column）还是行（row）映射为 系列（series）。这件事可以使用 series.seriesLayoutBy 属性来配置。默认是按照列（column）来映射。

- 指定维度映射的规则：如何从 dataset 的维度（一个“维度”的意思是一行/列）映射到坐标轴（如 X、Y 轴）、提示框（tooltip）、标签（label）、图形元素大小颜色等（visualMap）。这件事可以使用 series.encode 属性，以及 visualMap 组件来配置（如果有需要映射颜色大小等视觉维度的话）。上面的例子中，没有给出这种映射配置，那么 ECharts 就按最常见的理解进行默认映射：X 坐标轴声明为类目轴，默认情况下会自动对应到 dataset.source 中的第一列；三个柱图系列，一一对应到 dataset.source 中后面每一列。

## dimensions

```
// 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
// 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
// 如果不指定 dimensions，也可以通过指定 series.encode
// 完成映射，参见后文。
// 提供一份数据。
// 注意：如果使用了 dataset，那么可以在 dataset.dimensions 中定义 dimension ，
// 或者在 dataset.source 的第一行/列中给出 dimension 名称。于是就不用在这里指定 dimension。但如果在这里指定了 dimensions，那么优先使用这里的。
```

## source

原始数据。一般来说，原始数据表达的是二维表。可以用如下这些格式表达二维表：

# 数据转换-transform 

Apache EChartsTM 5 开始支持了“数据转换”（ data transform ）功能。在 echarts 中，“数据转换” 这个词指的是，给定一个已有的“数据集”（[dataset](https://echarts.apache.org/option.html##dataset)）和一个“转换方法”（[transform](https://echarts.apache.org/option.html##dataset.transform)），echarts 能生成一个新的“数据集”，然后可以使用这个新的“数据集”绘制图表。这些工作都可以声明式地完成。

抽象地来说，数据转换是这样一种公式：`outData = f(inputData)`。`f` 是转换方法，例如：`filter`、`sort`、`regression`、`boxplot`、`cluster`、`aggregate`(todo) 等等。有了数据转换能力后，我们就至少可以做到这些事情：

- 把数据分成多份用不同的饼图展现。
- 进行一些数据统计运算，并展示结果。
- 用某些数据可视化算法处理数据，并展示结果。
- 数据排序。
- 去除或直选择数据项。

## 使用外部的数据转换器 

除了上述的内置的数据转换器外，我们也可以使用外部的数据转换器。外部数据转换器能提供或自己定制更丰富的功能。下面的例子中，我们使用第三方库 [ecStat](https://github.com/ecomfe/echarts-stat) 提供的数据转换器。

# 坐标轴

直角坐标系中的 x/y 轴。

x 轴和 y 轴都由轴线、刻度、刻度标签、轴标题四个部分组成。部分图表中还会有网格线来帮助查看和计算数据

![charts_axis_img02](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310301612625.jpg)

# 视觉映射

数据可视化是数据到视觉元素的映射过程（这个过程也可称为视觉编码，视觉元素也可称为视觉通道）。

ECharts 的每种图表本身就内置了这种映射过程，比如折线图把数据映射到“线”，柱状图把数据映射到“长度”。一些更复杂的图表，如关系图、事件河流图、树图也都会做出各自内置的映射。

# 图例

图例是图表中对内容区元素的注释、用不同形状、颜色、文字等来标示不同数据列，通过点击对应数据列的标记，可以显示或隐藏该数据列。图例虽然不是图表中的主要信息、却是了解图表信息的钥匙。

## 布局

图例一般放在图表的右上角、也可以放在图表的底部、同一页面中的所有图例位置保持一致，可以横排对齐也可以纵排对齐。还要综合考虑整体的图表空间是适合哪种摆放方式。当图表纵向空间紧张或者内容区量过大的时候、建议摆放在图表的下方。下面是几种图例的摆放方式：

## 事件与行为

在 Apache ECharts 的图表中用户的操作将会触发相应的事件。开发者可以监听这些事件，然后通过回调函数做相应的处理，比如跳转到一个地址，或者弹出对话框，或者做数据下钻等等。ECharts 中的事件名称对应 DOM 事件名称，均为小写的字符串；

在 ECharts 中事件分为两种类型，

- 一种是用户鼠标操作点击，或者 hover 图表的图形时触发的事件，

- 还有一种是用户在使用可以交互的组件后触发的行为事件，例如在切换图例开关时触发的 ['legendselectchanged'](https://echarts.apache.org/api.html#events.legendselectchanged) 事件（这里需要注意切换图例开关是不会触发 `'legendselected'` 事件的），数据区域缩放时触发的 ['datazoom'](https://echarts.apache.org/api.html#events.legendselectchanged) 事件等等。

### 鼠标事件的处理

ECharts 支持常规的鼠标事件类型，包括 'click'、 'dblclick'、 'mousedown'、 'mousemove'、 'mouseup'、 'mouseover'、 'mouseout'、 'globalout'、 'contextmenu' 事件。下面先来看一个简单的点击柱状图后打开相应的百度搜索页面的示例。

### 组件交互的行为事件

在 ECharts 中基本上所有的组件交互行为都会触发相应的事件，常用的事件和事件对应参数在 [events](https://echarts.apache.org//api.html#events) 文档中有列出。

### 代码触发 ECharts 中组件的行为

在 ECharts 通过调用 `myChart.dispatchAction({ type: '' })` 触发图表行为，统一管理了所有动作，也可以方便地根据需要去记录用户的行为路径。

### 监听“空白处”的事件

有时候，开发者需要监听画布的“空白处”所触发的事件。比如，当需要在用户点击“空白处”的时候重置图表时。

在讨论这个功能之前，我们需要先明确两种事件。zrender 事件和 echarts 事件。

```js
myChart.getZr().on('click', function(event) {
  // 该监听器正在监听一个`zrender 事件`。
});
myChart.on('click', function(event) {
  // 该监听器正在监听一个`echarts 事件`。
});
```

# 折线图

![image-20231026132211927](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261322808.png)

![image-20231026135451503](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261354862.png)

![image-20231026135653244](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062222452.png)

# 散点图

![image-20231026140012417](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261400867.png)

![image-20231026141741633](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261417030.png)

![image-20231026142149392](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261421637.png)

![image-20231026142412955](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261424249.png)

![image-20231026143308579](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261433843.png)

# 饼图

![image-20231026150936098](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261509764.png)

![image-20231026152112602](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261521493.png)

# 地图

![image-20231026152252375](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261522926.png)

![image-20231026160157513](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261602321.png)

![image-20231026162252719](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261622251.png)

# 雷达图





# 仪表盘

![image-20231026163506689](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062223243.png)

![image-20231026164038153](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261640027.png)

![image-20231026164303535](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261643876.png)

# 颜色主题（Theme）

最简单的更改全局样式的方式，是直接采用颜色主题（theme）。例如，在 [示例集合](https://echarts.apache.org/examples) 中，可以通过切换深色模式，直接看到采用主题的效果。

ECharts5 除了一贯的默认主题外，还内置了`'dark'`主题。可以像这样切换成深色模式;

```
var chart = echarts.init(dom, 'dark');
```

# 调色盘

调色盘，可以在 option 中设置。

- 它给定了一组颜色，图形、系列会自动从其中选择颜色。 

- 可以设置全局的调色盘，也可以设置系列自己专属的调色盘。

  **颜色渐变**
  
  - 线性渐变
  
    ```html
    itemStyle:{
    color: {
          type: 'linear',
          x: 0.4,
          y: 0.3,
          r: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(251, 118, 123)'
            },
            {
              offset: 1,
              color: 'rgb(204, 46, 72)'
            }
          ]
        }
    }
    ```
  
  - 径向渐变
  
    ```
    itemStyle:{
    	color: {
              type: 'radial',
              x: 0.4,
              y: 0.3,
              r: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                },
                {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }
              ]
            }
    }
    ```

# 样式

## 直接样式

**itemStyle、textStyle、lineStyle、areaStyle、label**

## 高亮的样式：emphasis

在emphasis中包裹itemStyle、textStyle、lineStyle、areaStyle、label等，优先级高，会覆盖主题中和调色盘的效果。

# 自适应

![image-20231026173658137](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261736833.png)

![image-20231026173937104](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261739877.png)



# 加载动画

![image-20231026174206629](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310261742249.png)

![image-20231027094213005](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270942164.png)

# 全局对象

![image-20231027094603614](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270946990.png)

![image-20231027094713026](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270947516.png)

![image-20231027094950260](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270949111.png)![image-20231027095746174](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270957825.png)

![image-20231027095810750](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310270958756.png)

![image-20231027100112501](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310271001550.png)

![image-20231027100146778](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310271001408.png)

![image-20231027103552812](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310271035627.png)

![image-20231027103630920](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310271036339.png)

![image-20231027104039033](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310271040532.png)