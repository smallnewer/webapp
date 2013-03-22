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
