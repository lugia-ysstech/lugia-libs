# 说明
本项目包括主题相关的公共模块

项目地址：http://192.168.102.73:8081/BigFrontend/Work/lugia/lugia-theme.git 
 
## @lugia/math
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

## 20190613

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


    
## 20190626
【版本更新操作】
  
  yarn add @lugia/theme-config@1.0.14
  yarn add @lugia/theme-core@1.0.14
  yarn add @lugia/theme-css-hoc@1.0.24
  yarn add @lugia/theme-hoc@1.0.19

  
【变更内容】       
1.增加对boxShadow的对象配置支持格式如下：
   
```jsx harmony
  declare export type BoxShadowType = {
    x: number,
    y: number,
    color?: string,
    type?: 'outset' | 'inset',
    blur?: number,
    spread?: number,
  };
```

2.实现theme-css-hoc里的getBoxShadow方法，支持将CSS串转为BoxShadowType的对象。

## 20190627

【版本更新操作】

 yarn add @lugia/object-utils@1.0.8
 
 yarn add @lugia/theme-config@1.0.15
 
 yarn add @lugia/theme-core@1.0.15
 
 yarn add @lugia/theme-css-hoc@1.0.26
 
 yarn add @lugia/theme-hoc@1.0.20
 
 
【变更内容】        

1.将hover active的模式由父组件通过setState重新出发render的方式，改为采用ThemeHOC抛出相关事件，而CSSHoc组件主动监听自主变化的方式。

PS：修改原因是为了提升性能。如果组件压根没配置hover active是不会触发更新的，原先无论如何都会触发更新。

2.删除&新增方法

**删除**

原先注入的两个方法toggleActiveState={this.toggleActiveState}、toggleHoverState={this.toggleHoverState} 。


**修改** 
改为通过注入 dispatchEvent (eventNames: string[], direction: 'f2c' | 'c2f'): Object;
PS：子组件与父组件指的都是ThemeHOC组件

f2c（father2children）：是用来将子的ThemeHOC组件的事件控制权收由父组件来触发。 

c2f（children2father：是将子组件ThemeHOC的事件转发给父组件处理。

**新增属性**

ThemeHOC组件增加themeState属性可以用来锁定ThemeHOC组件内部的主题状态。
# 20190627-2

##【更新操作】

  yarn add @lugia/css@1.0.13
  
  yarn add @lugia/theme-config@1.0.16
  
  yarn add @lugia/theme-core@1.0.16
  
  yarn add @lugia/theme-css-hoc@1.0.30
  
  yarn add @lugia/theme-hoc@1.0.22
  
##【更新内容】

 ### 注意： 手动合并themeProps处理时
调用ThemeHOC增加注入getInternalThemeProps方法，用来获取CSSHOC组件里themeProps需要使用内部属性放在右侧进行合并。

### margin & padding 修改
优先转换为数字，转换失败将字符串直接放入

容错处理如果有一个方向错误，不会导致错误。

支持 margin: 5 等价于  marginTop: 5, marginLeft: 5, marginBottom: 5, marginRight: 5 

PS: padding类似

### 同级的ThemeHOC事件转发方案

提供createEventChanel用于建立两个ThemeHoc组件之间的事件通道。

createEventChannel(eventNames: string[]) : {provider, consumer}
参数说明：

eventNames：要建立通道的事件名称。

返回说明：

provider: 事件生产者

consumer：事件消费者

范例代码如下：

当按钮A、按钮B触发active事件时，provider将会将active事件生产出来提供给对应的consumer进行使用。

而按钮B会消费按钮A的事件，进行相应主题的处理。如：active事件的时候进行hover主题的切换
而按钮C会消费按钮A和按钮B的事件，进行相应主题的处理。如：active事件的时候进行hover主题的切换

```jsx harmony

      let channel1 = this.props.createEventChannel(['active']);
      let channel2 = this.props.createEventChannel(['active']);
      
      <Button
        {...channel1.provider}  
        {...this.props.getPartOfThemeHocProps('Button')}
      >
        按钮A
      </Button>{' '}
      ,
      <Button
        {...channel2.provider}
        lugiaConsumers={channel2.consumer}
        {...this.props.getPartOfThemeHocProps('Button')}
      >
        按钮B
      </Button>
      ,
      <Button
        lugiaConsumers={[channel1.consumer, channel2.consumer]}
        {...this.props.getPartOfThemeHocProps('Button')}
      >
        按钮C
      </Button>
      
```

### 增加行高的主题配置

lineHeight: number | string 取值规则同宽高一致。
