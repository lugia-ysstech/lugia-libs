/**
 * 组件样式处理增强
 * @flow
 */

export default class ThemeStateHandle {
  event: Object;
  eventId: number;
  hover: boolean;
  active: boolean;
  focus: boolean;
  props: Object;
  themeState: Object;

  constructor(props: Object, widgetName: string, themeState: Object) {
    this.event = {};
    this.eventId = 0;
    this.props = props;
    this.themeState = themeState;
  }

  setProps(props: Object) {
    this.props = props;
  }

  getEventId() {
    return this.eventId++;
  }

  onMouseDown = (...rest: any[]) => {
    this.toggleActiveState(true);
    const { onMouseDown } = this.props;
    onMouseDown && onMouseDown(...rest);
  };

  onMouseUp = (...rest: any[]) => {
    this.toggleActiveState(false);
    const { onMouseUp } = this.props;
    onMouseUp && onMouseUp(...rest);
  };

  onFocus = (...rest: any[]) => {
    setTimeout(() => {
      this.toggleFocusState(true);
    }, 0);
    const { onFocus } = this.props;
    onFocus && onFocus(...rest);
  };

  onBlur = (...rest: any[]) => {
    this.toggleFocusState(false);
    const { onBlur } = this.props;
    onBlur && onBlur(...rest);
  };

  toggleFocusState = (state: boolean) => {
    const { focus } = this;
    if (focus === state || this.props.disabled) {
      return;
    }
    this.focus = state;
    this.emit('focus', { focus: state });
  };

  onMouseEnter = (...rest: any[]) => {
    this.toggleHoverState(true);
    const { onMouseEnter } = this.props;
    onMouseEnter && onMouseEnter(...rest);
  };

  onMouseLeave = (...rest: any[]) => {
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

  toggleHoverState = (state: boolean) => {
    const { hover } = this;
    if (hover === state || this.props.disabled) {
      return;
    }
    this.hover = state;
    this.emit('hover', { hover: state });
  };

  on = (name: string, cb: Function) => {
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
    let eventId = this.getEventId();
    eventHandler[eventId] = cb;

    return () => {
      delete eventHandler[eventId];
    };
  };

  emit = (name: string, data: any) => {
    const { fatherEmit, lugiaProvider } = this.props;
    fatherEmit && fatherEmit(name, data);
    lugiaProvider && lugiaProvider(name, data);
    const handler = this.event[name];
    if (!handler) {
      return;
    }
    Object.values(handler).forEach((cb: Function) => {
      cb(data);
    });
  };

  getThemeState() {
    const { disabled = false, themeState: pThemeState = {} } = this.props;
    const { themeState } = this;
    return { ...themeState, ...pThemeState, disabled };
  }
}
