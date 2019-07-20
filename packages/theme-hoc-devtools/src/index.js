/**
 *
 * create by ligx
 *
 * @flow
 */
import { installBridge, installGlobalHook } from '@lugia/react-devtools-core';

const id2All = {};
const stateId2ReactNodeInfo = {};
const id2StateId = {};
const store = {};

const widgetId2DesignHandle = {};

export function updateDesignHandle(widgetId: string, handle: Object) {
  widgetId2DesignHandle[widgetId] = handle;
}

export function deleteDesignHandle(widgetId: string) {
  delete widgetId2DesignHandle[widgetId];
}

export function getDesignHandle(widgetId: string): Object {
  return widgetId2DesignHandle[widgetId];
}

export function getReactNodeInfo(id: string) {
  return id2All[id];
}

export function getBridge() {
  return store.lugiaBridge;
}

export function getReactNodeInfoByThemeId(id: string) {
  return stateId2ReactNodeInfo[id];
}

export function inject(window: Object) {
  window.addEventListener('message', event => {
    const { data } = event;
    if (!data) {
      return;
    }
    if (data.source === 'lugia-theme-bridge') {
      const { payload } = data;
      let { events } = payload;
      if (!events) {
        return;
      }
      events.forEach(item => {
        const { data, evt } = item;
        const { id, props } = data;
        const isUnMount = evt === 'unmount';
        if (isUnMount) {
          delete id2All[data];
          const stateId = id2StateId[data];
          delete id2StateId[data];
          delete stateId2ReactNodeInfo[stateId];
        } else if (evt === 'mount') {
          id2All[id] = data;
          const { name } = data;
          if (name && name.startsWith('lugia_t_hoc')) {
            const {
              state: { baseState: stateId },
            } = data;
            stateId2ReactNodeInfo[stateId] = data;
            id2StateId[id] = stateId;
          }
        }
      });
    }
  });
  installGlobalHook(window);
  installBridge(store);
}

export default {
  inject,
  updateDesignHandle,
  deleteDesignHandle,
  getDesignHandle,
  getReactNodeInfo,
  getBridge,
  getReactNodeInfoByThemeId,
};
