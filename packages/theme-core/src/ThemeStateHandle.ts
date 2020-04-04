/**
 * 组件样式处理增强
 * @flow
 */
import { ThemeState } from './type';

type Props = { [key: string]: any };
export default class ThemeStateHandle {
  event: object;
  eventId: number;
  hover: boolean;
  active: boolean;
  focus: boolean;
  props: Props;
  themeState: ThemeState;

  constructor(props: Props, widgetName: string, themeState: ThemeState) {
    this.event = {};
    this.eventId = 0;
    this.props = props;
    this.themeState = themeState;
  }

  setProps(props: object): void {
    this.props = props;
  }

  getEventId(): number {
    return this.eventId++;
  }

  onMouseDown = (...rest: any[]): void => {
    this.toggleActiveState(true);
    const { onMouseDown } = this.props;
    onMouseDown && onMouseDown(...rest);
  };

  onMouseUp = (...rest: any[]): void => {
    this.toggleActiveState(false);
    const { onMouseUp } = this.props;
    onMouseUp && onMouseUp(...rest);
  };

  onFocus = (...rest: any[]): void => {
    setTimeout(() => {
      this.toggleFocusState(true);
    }, 0);
    const { onFocus } = this.props;
    onFocus && onFocus(...rest);
  };

  onBlur = (...rest: any[]): void => {
    this.toggleFocusState(false);
    const { onBlur } = this.props;
    onBlur && onBlur(...rest);
  };

  toggleFocusState = (state: boolean): void => {
    const { focus } = this;
    if (focus === state || this.props.disabled) {
      return;
    }
    this.focus = state;
    this.emit('focus', { focus: state });
  };

  onMouseEnter = (...rest: any[]): void => {
    this.toggleHoverState(true);
    const { onMouseEnter } = this.props;
    onMouseEnter && onMouseEnter(...rest);
  };

  onMouseLeave = (...rest: any[]): void => {
    this.toggleHoverState(false);
    const { onMouseLeave } = this.props;
    onMouseLeave && onMouseLeave(...rest);
  };

  toggleActiveState = (state: boolean) => {
    const { active } = this;
    if (active === state || this.props.disabled) {
      return;
    }
    this.active = state;

    this.emit('active', { active: state });
  };

  toggleHoverState = (state: boolean): void => {
    const { hover } = this;
    if (hover === state || this.props.disabled) {
      return;
    }
    this.hover = state;
    this.emit('hover', { hover: state });
  };

  on = (name: string, cb: CallableFunction): VoidFunction => {
    let { lugiaConsumers } = this.props;
    if (lugiaConsumers && !Array.isArray(lugiaConsumers)) {
      lugiaConsumers = [lugiaConsumers];
    }
    lugiaConsumers &&
      lugiaConsumers.forEach(({ __consumer }) => {
        __consumer && __consumer(name, cb);
      });

    const { fatherOn } = this.props;
    if (fatherOn) {
      const exist = fatherOn(name, cb);
      if (exist) {
        return exist;
      }
    }

    let eventHandler = this.event[name];
    if (!eventHandler) {
      eventHandler = this.event[name] = {};
    }
    const eventId = this.getEventId();
    eventHandler[eventId] = cb;

    return () => {
      delete eventHandler[eventId];
    };
  };

  emit = (name: string, data: object) => {
    const { fatherEmit, lugiaProvider } = this.props;
    fatherEmit && fatherEmit(name, data);
    lugiaProvider && lugiaProvider(name, data);
    const handler = this.event[name];
    if (!handler) {
      return;
    }
    Object.values(handler).forEach((cb: (...rest: any[]) => void) => {
      cb(data);
    });
  };

  getThemeState(): ThemeState {
    const { disabled = false, themeState: pThemeState = {} } = this.props;
    const { themeState } = this;
    return { ...themeState, ...pThemeState, disabled };
  }
}
