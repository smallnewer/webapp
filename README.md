#iTools

iTools是一款类似jQuery的类库，它模仿成熟好用的jQuery API，在移动端期望提供比jQuery
甚至zepto更佳的开发体验。
它基于现代浏览器特性（HTML5、CSS3、ECMAScript5），不会比jQuery更强大，但会比它更轻量，
在现在浏览器中表现会更加依赖原生支持而非JS模拟。

以上只是愿景，目前iTools还是试验品~期待完善。

更新文档：

2013/3/28：

* 增加transition方法
* 增加队列方法queue
* 增加unbind()无传参的使用模式
* 修复核心库中lib的一些bug
* 修复unbind无法真正清除handle的bug

2013/3/25：

* 增加css3prefix，实现对常用css3的设置和获取。区别较大的如flexbox、渐变等尚未兼容。
* 增加event，包括：bind、unbind、$.Event
* 增加$.proxy

2013/3/24：

* 增加data方法
* $现在支持nodeList类型的传入


## API

##### $
`$(cssselector) => self`

`$(node) => self`

`$(nodeList) => self`

`$(new$) ==> new$`

类似jQuery，目前只支持输入选择器、原生dom节点、原始节点列表、$实例出来的对象。最经典的例子：

`$('div').css('width',"200px");`

想要获取原生DOM节点，也和jQuery中一样目前只能使用下标获取：

    var div = $('div')[0];//获取第一个div的DOM对象
    div.style.width = "200px";

##### $.extend()

`$.extend(clone) => $`

`$.extend(clone,deep) => $`

`$.extend(target,clone,deep) => target`

$.extend提能实现对一个对象的复制，将clone参数的属性和方法复制到$或target参数上

deep参数可以指定是否深度复制。

##### $.isArr()

`$.isArr(data) ==> Boolean`

判断指定参数是否为数组

##### $.isFn()

`$.isFn(data) ==> Boolean`

判断指定参数是否Function

##### $.isObj()

`$.isObj(data) ==> Boolean`

判断指定参数是否为Object

##### $.isUndefined()

`$.isUndefined(data) ==> Boolean`

判断指定参数是否为Undefined

##### $.isBoolean()

`$.isBoolean(data) ==> Boolean`

判断指定参数是否为Boolean


##### $.each()

`$.each(array, stepFn) ==> $`

类似数组原生方法forEach，遍历array，遍历每一项都回执行一次stepFn，传入参数
（index, item, array）。

     var arr = ["a", "b", "c"];
     $.each(arr, function(ind, item){
        console.log(ind, item);
     });
     
     //输出如下：
     1.  0 "a"
     2.  1 "b"
     3.  2 "c"

##### addClass()

`$("div").addClass("cls1") ==> self`

为选中的每一个标签添加指定的class名

##### removeClass()

`$("div").removeClass("cls1") ==> self`

为选中的每一个标签删除指定的class名

##### hasClass()

`$("div").hasClass("cls1") ==> Boolean`

获取第一个标签是否拥有指定的class名

##### css()

`$("div").css("width") ==> self`

`$("div").css("width","200px") ==> self`

`$("div").css({key:value}) ==> self`

获取或设置选中标签的指定css属性值。

    var w = $("div").css("width");//"100px"  获取第一个标签的宽度值
    
    //要设置所有选中标签的css：
    $("div").css("width","200px");
    //要设置多个css：
    $("div").css("width","200px").css("width","200px");
    //也可以换行写：
    $("div").css("width","200px")
            .css("width","200px");
    //也可以这么写：
    $("div").css({
        "width" : "100px",
        "height": "50px"
    });
    
##### eq()

`$('div').eq(ind) ==> 新的$实例`

获取回选中标签中，指定下标的标签。返回的是$包裹的一个新的实例对象。

    $('div').eq(0).css("width","100px");
    //将第一个div的宽度设置成100px

##### attr()

`$('div').attr(key) ==> value`

`$('div').attr(key, value) ==> self`

设置或获取选中标签的属性。该属性获取的是HTML标签上书写的节点，而非JS中定义的对象属性。

    <div id="test1"></div>
    <div id="test2"></div>
    
    //获取第一个div的id
    $('div').attr("id"); // "test1"
    
    //设置所有div的data-src节点为###
    $('div').attr("data-src", "###");
    //<div id="test1" data-src="###"></div>
    //<div id="test2" data-src="###"></div>
    
##### data()

`$('div').data(name) ==> value`

`$('div').data(name, value) ==> self`

设置或获取选中标签的自定义数据。该方法可以为标签绑定任何数据，也可以查找标签上以data-
开头的自定义节点。

    <div id="test1" data-url="url"></div>
    //为所有标签绑定name为"src"的数据
    $('div').data("src", "###); // 和attr不同，标签上的src并不会被改变。
    
    //获取第一个标签上的"src"属性
    var src = $('div').data("src"); //"###"
    
    //当没有为标签绑定name的数据，则会尝试返回标签上data-name对应的值
    var url = $('div').data("url"); //"url"









在ios6 webapp开发中的一些积累。包括bug记录，最优布局，js工具库，iPhone UI组件。

### JS工具库 lib
目前JS工具库刚刚起步，还在不断完善中，开始以ios6为主，后期兼容Android 4+。语法类jQuery，上手快速。
####API：
1. $(selector) ==> 选择器        
    参数：selector => 可以为 css3-选择器:string、原生dom节点:node、原始dom节点列表:nodeList.        
    返回：$实例对象        
#####静态方法
1. $.extend(target, clone, deep) ==> 为$扩展静态方法和属性        
        参数：        
        target => Object.可选。要被复制到的对象。默认为$。        
        clone => Object.必填。要被复制的对象。        
        deep => Boolean.可选。是否深度复制，默认为false。        
2. $.isArr(data) ==> 判断是否是数组。        
    参数：data => 被检测的数据。        
    返回：Boolean。        
3. $.isFn(data) ==> 判断是否是函数。        
    参数：data => 被检测的数据。        
    返回：Boolean。        
4. $.each(arr, stepFn) ==> 类似原生数组的forEach方法，遍历一个数组或$实例对象        
    参数：        
        arr => Array || $实例。必填。要被遍历的对象。        
        stepFn => Function。必填。数组中的每一项都会被传入到stepFn中执行一次。        
              stepFn包含三个参数，依次为：index,item,arr;        

#####原型方法
原型方法是由$实例直接调用，譬如：        
 `$("body").each();`         

1. each(arr, stepFn) ==> 类似原生数组的forEach方法，遍历一个数组或$实例对象        
    参数：        
        arr => Array || $实例。可选。要被遍历的对象。默认为$实例中的所有标签。                
        stepFn => Function。必填。数组中的每一项都会被传入到stepFn中执行一次。        
              stepFn包含三个参数，依次为：index,item,arr;        

### UI组件        
以lib工具库为基础架构，由于pad的页面展示更加靠近pc，因此以手机为主。前期主iPhone，后期兼容Android手机。        
目前组件包括：        
1. iscroll ==> 基于开源框架iScroll。API一样，用法见demo。        
2. pulltofresh ==> 同样基于iScroll。API说明待补充。。。        
3. swipeview ==> 基于开源框架swipeview。API一样，用法见demo。更适用于大量图片的滑动展示，不适合做大图滚动组件。        
