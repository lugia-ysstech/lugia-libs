/**
 *
 * create by ligx
 *
 * @flow
 */
import { installBridge, installGlobalHook } from '@lugia/react-devtools-core';

const id2All = {};
const id2Theme = {};
const store = {};

export function getReactNodeInfo(id: string) {
  return id2All[id];
}

export function getBridge() {
  return store.lugiaBridge;
}

export function getThemeReactNodeInfo(id: string) {
  return id2Theme[id];
}

export function inject(window: Object) {
  window.addEventListener('message', event => {
    const { data } = event;
    if (!data) {
      return;
    }
    if (data.source === 'lugia-theme-bridge') {
      const { payload } = data;
      const events = payload.events;
      if (!events) {
        return;
      }
      events.forEach(item => {
        const { data } = item;
        id2All[data.id] = data;
      });
      events
        .filter(e => {
          let name = e.data.name;
          return name && name.startsWith('lugia_t_hoc');
        })
        .forEach(item => {
          const { data } = item;
          id2Theme[data.state.id] = data;
        });
    }
  });
  installGlobalHook(window);
  installBridge(store);
}

inject(window);
