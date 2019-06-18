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

yarn add @lugia/theme-config: 1.0.12
yarn add @lugia/theme-core: 1.0.12
yarn add @lugia/theme-css-hoc: 1.0.19
yarn add @lugia/theme-hoc: 1.0.12

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
  
  yarn add @lugia/theme-css-hoc: 1.0.20
  yarn add @lugia/theme-hoc: 1.0.15
  
  【变更内容】
  修改：   
  * ThemeHoc外部盒子改为inline-block 
  增加：
     *  CSSComponent增加displayName标识；   
     *  CSSComponent增加themeMeta的属性__themeMeta，用来获取当前生效的主题信息值。
  修正BUG：   
  *  CSSComponent进行继承的时候，子组件的selectNames无法覆盖父类的配置问题。
