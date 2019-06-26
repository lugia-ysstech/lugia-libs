# 说明
本项目包括主题相关的公共模块

项目地址：http://192.168.102.73:8081/BigFrontend/Work/lugia/lugia-theme.git 
 
##@lugia/math
 数学相关处理功能  
## @lugia/object-utils 
  对象处理模块
## @lugia/css
  样式处理模块 
## theme-config
 主题配置模块（<Theme></Theme>）
# theme-core
 theme支撑公共模块
# theme-css-provider
 CSSComponent支撑模块，用来将ThemeConfig转换为CSS
# theme-hoc
 赋予一个React组件有theme(主题配置的能力) 
# 更新记录
##20190613
【版本更新操作】

yarn add @lugia/theme-config@1.0.12
yarn add @lugia/theme-core@1.0.12
yarn add @lugia/theme-css-hoc@1.0.19
yarn add @lugia/theme-hoc@1.0.12

【变更内容】
修改：
  * ThemeHoc.props.getPartOfThemeProps opt 里增加一个 selector的 { index: number, count: number } ，分别代表组件在序列里的位置(index),以及这个序列里的总数量。
  下标从0开始， count是真实的个数。
增加：
  * ThemeHoc.props.createThemeHocProps方法用来方便创建ThemeHoc组件的配置。 createThemeHocProps = (viewClass: string, targetTheme: Object)
  * 新增first（第一个） last（最后一个） odd（奇数） even（偶数） nthXX（第xx个）
    配置生效的优先级为   nthXX > last > first > even | odd
    
  ## 20190618
  【版本更新操作】
  
  yarn add @lugia/theme-css-hoc@1.0.20
  yarn add @lugia/theme-hoc@1.0.15
  
  【变更内容】
  修改：   
  * ThemeHoc外部盒子改为inline-block 
  增加：
     *  CSSComponent增加displayName标识；   
     *  CSSComponent增加themeMeta的属性__themeMeta，用来获取当前生效的主题信息值。
  修正BUG：   
  *  CSSComponent进行继承的时候，子组件的selectNames无法覆盖父类的配置问题。
  
  ## 20190619
  【版本更新操作】
  
  yarn add @lugia/theme-css-hoc@1.0.21
  yarn add @lugia/theme-hoc-devtools@1.0.1
  yarn add @lugia/theme-hoc@1.0.16
  
  【变更内容】
  增加：
     *  主题提取功能
  ### 使用方法说明
```javascript
 import '@lugia/theme-hoc-devtools';
 
 target.getThemeMetaInfo() // target 使用ref拿到的ThemeHOC组件的引用

```
     
 ## 20190619
  【版本更新操作】
  
  yarn add @lugia/css@1.0.10
  
  【变更内容】
  增加：
     *  支持web常用色 
     
## 20190620
  【版本更新操作】
  
  yarn add @lugia/css@1.0.11
  
  yarn add @lugia/theme-css-hoc@1.0.22
  
  yarn add @lugia/theme-hoc@1.0.17
  
  
  【变更内容】
  修改： 
     * colorUtils的常用色进行忽略大小写处理；
     * 删除ThemeHOC的外部span容器，mouse事件由Target提供。
  增加：  
     * addMouseEvent函数方便进行组件的鼠标事件添加。 
```flow js
declare export type AddMouseEventOPtionAfterConfig = {
    enter?: boolean, // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
    leave?: boolean, // 鼠标离开 同上
    down?: boolean, // 鼠标点击 同上
    up?: boolean, // 鼠标松开 同上
  };

  declare export type AddMouseEventOption = {
    enter?: Function,  // 自定义的鼠标进入事件
    leave?: ?Function, // 同上
    up?: Function, // 同上
    down?: Function, // 同上
    after?: AddMouseEventOPtionAfterConfig, // 是否配置事件触发顺序滞后
  };

  declare export type MouseEventComponent = {
    props: Object,
  }

  declare export function addMouseEvent(
    self: MouseEventComponent, // 组件的this引用
    opt?: AddMouseEventOption,
  ): Object;
```

    
## 20190626
  【版本更新操作】
  
  yarn add @lugia/css@1.0.12
  yarn add @lugia/theme-config@1.0.13
  yarn add @lugia/theme-core@1.0.13
  yarn add @lugia/theme-css-hoc@1.0.23
  yarn add @lugia/theme-hoc-devtools@1.0.2
  yarn add @lugia/theme-hoc@1.0.18

  
【变更内容】       
1.获取的主题信息未考虑默认的主题信息 [fixedBUg]  

2.提取的主题信息加入partName的信息作为提取组件主题配置树的路标；

3.增加对propsConfig的直接配置功能，无需再使用多一层高阶组件的冗余来实现。

```jsx harmony
  const Tab = CSSComponent({}, '');
  const BaseTab = ThemeHoc(Tab);

  <BaseTab propsConfig={{tabType: 'xxx'}} /> 通过这样的写法CSSComponent的Tab就可以拿到指定的propsConfig值。   
```
4.ThemeHOC修改增加往目标组件注入
```ecmascript 6
           toggleHoverState(state);     //用来将切换宿主的hover状态为state
           toggleActiveState(state);    //用来将切换宿主的active状态为state

```
      
5.ThemeHOC增加自动根据hover和active的状态切换触发传入的toggleHoverState方法和toggleActiveState

6.修正BUG： {font: fontSize: {}} 中的fontSize未转换为rem；

7.修改：  theme的主题配置的字体配置
```jsx harmony
 font: {
        fontSize,
        fontWeight
      }
      改为
      font:{
          size,
          weight
      }
      去除fontXXX的前缀
```

8.增加新的全局获取方法 getThemeMeta
CSSConfig中的normal配置中增加getThemeMeta方法，用来返回自定义的ThemeMeta信息。改后的优先级如下

9.状态的获取顺序如下：
  

getCSS < defaultTheme < getStyle <getThemeMeta < 用户指定的theme
  normal active disabled的defaultTheme采用CSS方式生成
  而hover状态的defaultTheme采用内联样式放入。 

10.阴影获取方法
   function getBoxShadow(boxShadow: string): Object;
```jsx harmony
  {
     normal: {
       boxShadow: getBoxShadow('5px 5px rgb(0,0,0,.5')
     }
  }
```
