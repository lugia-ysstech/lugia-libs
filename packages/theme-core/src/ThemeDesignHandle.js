/**
 * 组件样式处理增强
 * @flow
 */

import React from 'react';
import {
  getBridge,
  getReactNodeInfo,
  getReactNodeInfoByThemeId,
} from '@lugia/theme-hoc-devtools';
import { CSSComponentDisplayName, ThemeComponentPrefix } from './utils';
import { unPackDisplayName } from './ThemeHandle';
import { deepMerge } from '@lugia/object-utils';

window.getBridge = getBridge;
window.getReactNodeInfo = getReactNodeInfo;
window.getReactNodeInfoByThemeId = getReactNodeInfoByThemeId;

function isCSSComponent(name: string): boolean {
  return name === CSSComponentDisplayName;
}

function isThemeComponent(name: string): boolean {
  return name.startsWith(ThemeComponentPrefix);
}

export default class ThemeProviderHandler {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  getThemeMetaInfo = (fields: string[] = ['themeMeta']) => {
    let id2Path = {};
    let node = getReactNodeInfoByThemeId(this.id);
    if (node) {
      id2Path['root'] = '';
      this.getChildren(node, 'root', id2Path);
      const filterOnlyThemeOrCSS = id => {
        let reactNodeInfo = getReactNodeInfo(id);
        if (reactNodeInfo) {
          let name = reactNodeInfo.name;
          return name && (isThemeComponent(name) || isCSSComponent(name));
        }
        return false;
      };

      let themeOrCSSId2Path = Object.keys(id2Path)
        .filter(filterOnlyThemeOrCSS)
        .reduce((res, id) => {
          res[id] = id2Path[id];
          return res;
        }, {});

      Object.keys(themeOrCSSId2Path).forEach(id => {
        const path = themeOrCSSId2Path[id];
        themeOrCSSId2Path[id] = path.split('/').filter(filterOnlyThemeOrCSS);
      });

      let paths: any = Object.values(themeOrCSSId2Path).sort(
        (a: Object, b: Object) => {
          return a.length - b.length;
        },
      );
      // for (let i = 0; i < paths.length; i++) {
      //   const path = paths[ i ];
      //   if (path && path.length === 0) {
      //     continue;
      //   }
      //   const result = [ path[ 0 ] ];
      //   for (let j = 1; j < path.length; j++) {
      //     const id = path[ j ];
      //     let reactNodeInfo = getReactNodeInfo(id);
      //     if (reactNodeInfo) {
      //       let name = reactNodeInfo.name;
      //       if (isCSSComponent(name)) {
      //         result.push(id);
      //       }
      //     }
      //   }
      //   paths[i] = result;
      // }

      const id2Node = {};
      const nodes = [];
      paths.forEach((path: any) => {
        let level = path.length - 1;
        const nodeId = path[level];
        if (id2Node[nodeId]) {
          return;
        }
        id2Node[nodeId] = {
          ...this.getNodeInfo(nodeId, fields),
        };
        id2Node[nodeId].path = path;
        let father = nodes;
        if (level > 0) {
          father = id2Node[path[level - 1]].children;
        }
        father.push(id2Node[nodeId]);
      });
      return nodes;
    }
    return {};
  };

  getThemeData() {
    const result = {};
    let infos = this.getThemeMetaInfo();
    console.info(infos);
    this.recuriseThemeMetaInfoTree(infos[0], result);
    return result;
  }

  recuriseThemeMetaInfoTree(node: Object, childData: Object) {
    const { children } = node;
    if (!children || children.length === 0) {
      return;
    }
    children.forEach(childNode => {
      const { partName, themeMeta } = childNode;
      if (partName && themeMeta) {
        childData[partName] = deepMerge(childData[partName], themeMeta);
      } else {
        if (partName && !childData[partName] && themeMeta) {
          childData[partName] = {};
          this.recuriseThemeMetaInfoTree(childNode, childData[partName]);
        } else {
          this.recuriseThemeMetaInfoTree(childNode, childData);
        }
      }
    });
  }

  getNodeInfo(id: string, fields: string[]) {
    const reactNodeInfo = getReactNodeInfo(id);
    const { name } = reactNodeInfo;
    const isCSSCmp = isCSSComponent(name);
    const isThemeCmp = isThemeComponent(name);
    const lugiaBridge = getBridge();
    let themeMeta;
    let widgetName;
    let themeProps;
    let props;
    let fatherPartName;
    if (lugiaBridge) {
      const { _inspectables } = lugiaBridge;
      const inspectVal = _inspectables.get(id);
      if (inspectVal) {
        props = inspectVal.props;
        if (props) {
          themeMeta = props.__themeMeta;
          widgetName = isCSSCmp ? props.__cssName : unPackDisplayName(name);
          themeProps = props.themeProps;
        }
      } else {
        console.error(`not found ${id} props info`);
      }
      if (isThemeCmp) {
        const { children } = reactNodeInfo;
        if (children && children.length === 1) {
          const inspectVal = _inspectables.get(children[0]);
          const { props = {} } = inspectVal;
          themeProps = props.themeProps;
          fatherPartName = props.__fatherPartName;
        }
      }
    }

    const result = {};
    if (~fields.indexOf('id')) {
      result.id = id;
    }

    if (fatherPartName) {
      result.fatherPartName = fatherPartName;
    }
    result.widgetName = widgetName;

    if (isCSSCmp) {
      result.themeMeta = themeMeta;
    }
    result.isCSSCmp = isCSSCmp;
    if (themeProps) {
      result.themeProps = themeProps;
      const { themeConfig = {} } = themeProps;
      const { __partName, __index, __count } = themeConfig;
      if (__partName) {
        result.partName = __partName;
      }
      if (__index !== undefined) {
        result.index = __index;
      }
      if (__count) {
        result.count = __count;
      }
    }

    if (~fields.indexOf('name')) {
      result.name = name;
    }
    if (~fields.indexOf('props')) {
      result.props = props;
    }
    result.children = [];
    return result;
  }

  getChildren(root: Object, father: string, id2Path: Object) {
    const { children, id: fatherId } = root;
    const result = {};
    result.id = fatherId;
    result.path = `${id2Path[father]}/${fatherId}`;
    id2Path[fatherId] = result.path;
    if (Array.isArray(children)) {
      children.forEach(id => {
        this.getChildren(getReactNodeInfo(id), fatherId, id2Path);
      });
    }
  }
}
