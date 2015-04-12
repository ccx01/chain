#chain
链式问答是一种以“强上下文”关系对一个问题进行“核爆式”展开

**暂定标签**

* 游戏攻略

* 功能导图

* 平行世界

* 问答

**功能列表**

循环链

>基础结构完成

~~trace灰亮~~

~~trace记录 --->>> height priority~~

~~用户记录 --- done
-- priority 1~~

~~删除操作 --->>> require trace~~

~~trace-url~~

~~more --->>> low priority~~

*share point*

>获取当前场景，并可进行回溯及继续功能

**动画效果**

function toggle
--->>> unnecessary

scene弹出
 add popup --- done

~~trace收入，高亮
--->>> require trace~~

~~添加动作缩放~~

添加场景与添加行为区分开

视觉导图

**优化**

*界面*

*逻辑*

*代码*

**TIPS**

手机上的tap交互响应可以用`:hover`及`:active`来完成，虽然各个手机浏览器的表现会有些微区别，但总体效果还比较理想

强迫症属性`-webkit-tap-highlight-color`

**MODIFY**

调整数据结构，以每一个scene为节点，同时scene-action为独立体，之后action-scene以link方式进行连接

trace待修改

**心情记录**

20150407

>又到了想推倒重来的坎，瓶颈一号。

20150411

>写markdown的时候总是会想这种格式到底方便了什么？

>话说这readme到底是啥- -

20150412

>纯css动画果然还是有很大的局限性,暂时先这样吧

**尚待解决**

已存在场景(回链)可多次添加，导致重复

dom内data数据存储混乱

界面使用上依然让人难以理解

删除功能不可存在，因此需要一个排序方式，另外加上额外加载