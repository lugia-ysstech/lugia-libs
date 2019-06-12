# 说明
 赋予一个React组件有theme(主题配置的能力) 
# API说吗
````
import ThemeHoc from '@lugia/theme-hoc';

type ThemeHocOption = {
  enabledState: {
    hover: boolean, 
    active: boolean,
  },
};

type ProviderComponent = React.ComponentType<any>;


ThemeHoc  (
  Target: ProviderComponent,
  widgetName: string,
  opt?: ThemeHocOption = { hover: false, active: false },
): Function;

````
Target: 被包括的目标组件组件。
widgetName: 目标组件的react组件显示名，是为了更方便的定位组件以及测试用例。
opt: 配置是否自动注入状态捕获。其中,true标识开启状态，false为关闭状态。默认是不开启状态。hover鼠标移入移除组件。actived是鼠标摁住不放状态。


