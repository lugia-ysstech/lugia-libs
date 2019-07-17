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
import {
  deepMerge,
  packObject,
  diffABWhenAttrIfExist,
  isEmptyObject,
  packPathObject,
  setAttributeValue,
} from '@lugia/object-utils';

window.getBridge = getBridge;
window.getReactNodeInfo = getReactNodeInfo;
window.getReactNodeInfoByThemeId = getReactNodeInfoByThemeId;

function isCSSComponent(name: string): boolean {
  return name === CSSComponentDisplayName;
}

function isThemeComponent(name: string): boolean {
  return name.startsWith(ThemeComponentPrefix);
}

const compareLengthAsc = (a: Object, b: Object) => {
  return a.length - b.length;
};
const compareLengthDesc = (a: Object, b: Object) => {
  return b.length - a.length;
};
export default class ThemeProviderHandler {
  id: string;
  packPathObject: Function;

  constructor(id: string) {
    this.id = id;
    this.packPathObject = packPathObject;
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

      let paths: any = Object.values(themeOrCSSId2Path).sort(compareLengthAsc);
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
    const inPartNameRes = {};
    let infos = this.getThemeMetaInfo();
    console.info(infos);
    const notInPartNameRes = [];
    this.recuriseThemeMetaInfoTree(infos[0], inPartNameRes, notInPartNameRes);
    console.info('notInPartNameRes', notInPartNameRes);
    const result = this.packPathObject(inPartNameRes);

    notInPartNameRes.forEach(item => {
      const { partName, path, dispatchPaths } = item;
      const split = partName.split('.');
      let packResult = this.packNotInPartObject(path, dispatchPaths);
      const top = split[0];
      const oldValue = result[top] || {};
      if (split.length > 1) {
        packResult = packObject(split, packResult)[top];
      }
      result[top] = this.merge(oldValue, packResult);
    });
    return result;
  }

  packNotInPartObject(path: Object, dispatchPaths: string[]): Object {
    let res = {};
    if (!path) {
      return res;
    }

    const { otherKeys } = this.foundBranchNode(path);
    otherKeys.forEach(key => {
      const item = path[key];
      const targetKey = this.fixPathByDispatchPath(key, dispatchPaths);
      if (!targetKey) {
        res = this.merge(res, item);
      } else {
        res = this.merge(res, packObject(targetKey.split('.'), item));
      }
    });
    return res;
  }

  fixPathByDispatchPath(key: string, dispatchPaths: string[]): string {
    if (!dispatchPaths || dispatchPaths.length === 0) {
      return key;
    }
    let cur = '';
    for (let i = 0; i < dispatchPaths.length; i++) {
      const dispatch = dispatchPaths[i];
      if (key.startsWith(dispatch) && dispatch.length > cur.length) {
        cur = dispatch;
      }
    }
    return cur ? key.substr(cur.length + 1) : key;
  }

  foundBranchNode(
    target: Object,
  ): { branchNodeMap: Object, otherKeys: string[] } {
    const branchNodeMap: Object = {};
    const otherKeys = Object.keys(target).filter(key => {
      const isHoc = isEmptyObject(target[key]);
      if (isHoc) {
        branchNodeMap[key] = true;
      }
      return !isHoc;
    });
    return { branchNodeMap, otherKeys };
  }

  merge(res: Object, targetItem: Object): Object {
    const diffPath = diffABWhenAttrIfExist(res, targetItem);
    res = deepMerge(res, targetItem);
    diffPath.forEach(path => {
      setAttributeValue(res, path.split('.'), undefined);
    });
    return res;
  }

  recuriseThemeMetaInfoTree(node: Object, childData: Object, out: any) {
    this.tillChildDataByNode(node, childData);
    const { children } = node;
    if (!children || children.length === 0) {
      return;
    }

    children.forEach(childNode => {
      const { partName, themeMeta, isCSSCmp } = childNode;

      const { themeProps } = childNode;
      if (!partName && themeProps) {
        const { themeConfig } = themeProps;
        if (themeConfig) {
          const res = this.getOtherPath(themeConfig);
          if (res.length > 0) {
            this.recuriseTreeNode(childNode, res);
            out.push(...res);
          }
        }
      }
      if (!partName) {
        return;
      }
      this.tillChildDataByNode(childNode, childData);
      if (themeMeta && !isCSSCmp) {
        this.recuriseThemeMetaInfoTree(
          childNode,
          (childData[partName] = {}),
          out,
        );
      } else {
        this.recuriseThemeMetaInfoTree(childNode, childData, out);
      }
    });
  }

  recuriseTreeNode(node: Object, res: Object[]) {
    const { children } = node;
    children &&
      children.forEach(childNode => {
        const { partName: targetPartName, themeMeta = {}, sign } = childNode;

        targetPartName &&
          res.forEach(item => {
            const { partName, path } = item;
            const partOf = `${partName}.`;
            const idx = targetPartName.indexOf(partOf);
            if (idx === 0) {
              const targetPath = targetPartName.substr(partOf.length);
              if (path[targetPath]) {
                console.info(`存在了:${targetPath}`, path[targetPath]);
                path[targetPath] = deepMerge(path[targetPath], themeMeta);
              } else {
                path[targetPath] = themeMeta;
              }
              if (sign) {
                let dispatchPaths = item.dispatchPaths;
                if (!dispatchPaths) {
                  dispatchPaths = item.dispatchPaths = [];
                }
                dispatchPaths.push(targetPath);
                console.info('转发的路径', targetPath);
              }
            }
          });
        this.recuriseTreeNode(childNode, res);
      });
  }

  tillChildDataByNode(node: Object, childData: Object) {
    if (!node || !childData) {
      return false;
    }
    const { partName, themeMeta } = node;
    if (partName && themeMeta) {
      const oldData = childData[partName] || {};
      childData[partName] = this.merge(oldData, themeMeta);
      return true;
    }
    return false;
  }

  getOtherPath(themeConfig: Object): Object[] {
    const res = [];
    if (!themeConfig || typeof themeConfig !== 'object') {
      return res;
    }

    Object.keys(themeConfig).forEach(partName => {
      const item = themeConfig[partName];
      if (!item) {
        return;
      }
      if (partName === '__partName') {
        res.push({
          partName: item,
          path: {},
        });
      }
      res.push(...this.getOtherPath(item));
    });
    return res;
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
      const { __partName, __index, __count, __sign } = themeConfig;
      if (__partName) {
        result.partName = __partName;
      }
      if (__sign) {
        result.sign = true;
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
