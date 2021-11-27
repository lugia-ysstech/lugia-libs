import { GridInfo, GridType } from '@lugia/ide-grid-types/types';
import { isNumber } from '@lugia/math';
import { isNotEmptyArray } from '@lugia/array-utils';

export function cloneTarget(data: object) {
  return JSON.parse(JSON.stringify(data));
}

export function isString(str: any) {
  return typeof str === 'string';
}

export function typeIsRow(inType: GridType) {
  return inType === 'row';
}

export function getTargetOrDefault(
  condition: boolean,
  target: any,
  defaultTarget: any,
) {
  return condition ? target : defaultTarget;
}

export function getNumberProp(prop: number, defaultValue: number) {
  return getTargetOrDefault(isNumber(prop), prop, defaultValue);
}

export const existId = (id: string) => {
  return id && isString(id);
};

export const addNextSiblingId = (
  inData: GridInfo[],
  index: number,
  siblingId: string,
  siblingSize: number,
  siblingReactive: boolean,
) => {
  const preItem = inData[index];
  const { id: itemId } = preItem;

  if (existId(itemId)) {
    preItem.nextSiblingId = siblingId;
    preItem.nextSiblingSize = siblingSize;
    preItem.nextSiblingReactive = siblingReactive;
  } else {
    const preIndex = index - 1;
    if (preIndex >= 0) {
      addNextSiblingId(
        inData,
        preIndex,
        siblingId,
        siblingSize,
        siblingReactive,
      );
    }
  }
};

export const createCompleteGridData = (
  inData: GridInfo[],
  inType: GridType,
  fatherId: string,
  fatherOffset: number,
  fatherAutoHeight: boolean,
): GridInfo[] => {
  const completeData: GridInfo[] = [];

  inData.forEach((inItem: GridInfo, index: number) => {
    const newItem = cloneTarget(inItem);
    const {
      id: itemId = '',
      reactive = true,
      text = '',
      size = 0,
      autoHeight = false,
      minWidth: colMinWidth = 0,
      background: boxBackground = 'transparent',
      children = [],
    } = newItem;
    if (existId(itemId)) {
      const numberSize = getNumberProp(size, 0);
      const numberMinWidth = getNumberProp(colMinWidth, 0);

      newItem.type = inType;
      newItem.size = numberSize;
      newItem.minWidth = numberMinWidth;
      newItem.background = boxBackground;
      newItem.text = text || itemId;
      newItem.fatherId = fatherId;
      newItem.fatherSize = fatherOffset;
      newItem.fatherAutoHeight = fatherAutoHeight;

      if (isNotEmptyArray(children)) {
        const isRow = typeIsRow(inType);
        newItem.children = createCompleteGridData(
          children,
          isRow ? 'col' : 'row',
          itemId,
          numberSize,
          isRow && autoHeight,
        );
      }

      if (index > 0) {
        addNextSiblingId(completeData, index - 1, itemId, numberSize, reactive);
      }
      completeData.push(newItem);
    }
  });

  return completeData;
};

export const getCompleteGridData = (
  inData: GridInfo[],
  initWidth: number,
): GridInfo[] => {
  const containerWidth: number = isNumber(initWidth) ? initWidth : 1920;
  if (!isNotEmptyArray(inData)) {
    return [];
  }
  return createCompleteGridData(
    inData,
    'row',
    '_table_design_',
    containerWidth,
    false,
  );
};

export interface AllItemInfoType {
  [id: string]: GridInfo;
}

export const createAllItemInfo = (
  inData: GridInfo[],
  allItemInfo: AllItemInfoType,
) => {
  inData.forEach((inItem: GridInfo) => {
    const { id: itemId = '', children = [] } = inItem;
    allItemInfo[itemId] = inItem;
    if (isNotEmptyArray(children)) {
      createAllItemInfo(children, allItemInfo);
    }
  });
};

export const getAllItemInfo = (inData: GridInfo[]): AllItemInfoType => {
  const allItemInfo: AllItemInfoType = {};
  createAllItemInfo(inData, allItemInfo);
  return allItemInfo;
};
