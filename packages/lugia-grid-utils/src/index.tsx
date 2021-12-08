import { GridInfo, GridType } from '@lugia/lugia-grid-types/types';
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

const getGapItem = (id: string, size: number) => {
  return {
    id: `${id}-gap0`,
    size,
    text: '间距',
    reactive: false,
    autoHeight: false,
  };
};

const getLayout2TopAndLeftRight = (inWidth: number, gapSize: number) => {
  const leftSize = 300;
  const rightSize = inWidth - leftSize - gapSize;

  return [
    { id: 'row0', size: 200 },
    getGapItem('row0', gapSize),
    {
      id: 'row1',
      size: 600,
      children: [
        { id: 'row1-col0', size: leftSize },
        getGapItem('row1-col0', gapSize),
        { id: 'row1-col1', size: rightSize },
      ],
    },
  ];
};

const getLayout2LeftRight = (inWidth: number, gapSize: number) => {
  const leftSize = 300;
  const rightSize = inWidth - leftSize - gapSize;
  return [
    {
      id: 'row0',
      size: 800,
      children: [
        { id: 'row0-col0', size: leftSize },
        getGapItem('row0-col0', gapSize),
        { id: 'row0-col1', size: rightSize },
      ],
    },
  ];
};

const getLayout2TopAndLeftRightAndBottom = (
  inWidth: number,
  gapSize: number,
) => {
  const leftSize = 300;
  const rightSize = inWidth - leftSize - gapSize;

  return [
    { id: 'row0', size: 100 },
    getGapItem('row0', gapSize),
    {
      id: 'row1',
      size: 600,
      children: [
        { id: 'row1-col0', size: leftSize },
        getGapItem('row1-col0', gapSize),
        { id: 'row1-col1', size: rightSize },
      ],
    },
    getGapItem('row1', gapSize),
    { id: 'row2', size: 100 },
  ];
};

const getLayout2TopAndContent = (inWidth: number, gapSize: number) => {
  const percentSize = (inWidth - gapSize) / 2;
  return [
    { id: 'row0', size: 100 },
    getGapItem('row0', gapSize),
    {
      id: 'row1',
      size: 300,
      children: [
        { id: 'row1-col0', size: percentSize },
        getGapItem('row1-col0', gapSize),
        { id: 'row1-col1', size: percentSize },
      ],
    },
    getGapItem('row1', gapSize),
    {
      id: 'row2',
      size: 300,
      children: [
        { id: 'row2-col0', size: percentSize },
        getGapItem('row2-col0', gapSize),
        { id: 'row2-col1', size: percentSize },
      ],
    },
  ];
};

const getLayout2TopAndLeftContent = (inWidth: number, gapSize: number) => {
  const topSize = 100;
  const contentSize = 680;
  const leftSize = 300;
  const rightSize = inWidth - leftSize - gapSize;
  const percentSize = (contentSize - gapSize) / 2;
  const contentPercentSize = (rightSize - gapSize) / 2;
  return [
    { id: 'row0', size: topSize },
    getGapItem('row0', gapSize),
    {
      id: 'row1',
      size: contentSize,
      children: [
        { id: 'row1-col0', size: leftSize },
        getGapItem('row1-col0', gapSize),
        {
          id: 'row1-col1',
          size: rightSize,
          children: [
            {
              id: 'row1-col1-row0',
              size: percentSize,
              children: [
                { id: 'row1-col1-row0-col0', size: contentPercentSize },
                getGapItem('row1-col1-row0-col0', gapSize),
                { id: 'row1-col1-row0-col1', size: contentPercentSize },
              ],
            },
            getGapItem('row1-col1-row0', gapSize),
            {
              id: 'row1-col1-row1',
              size: percentSize,
              children: [
                { id: 'row1-col1-row1-col0', size: contentPercentSize },
                getGapItem('row1-col1-row1-col0', gapSize),
                { id: 'row1-col1-row1-col1', size: contentPercentSize },
              ],
            },
          ],
        },
      ],
    },
  ];
};
const getLayout2LeftContent = (inWidth: number, gapSize: number) => {
  const totalSize = 800;

  const leftSize = 200;
  const contentSize = inWidth - leftSize - gapSize;
  const percentSize = (totalSize - gapSize) / 2;

  const contentPercentSize = (contentSize - gapSize) / 2;

  return [
    {
      id: 'row0',
      size: totalSize,
      children: [
        { id: 'row0-col0', size: leftSize },
        getGapItem('row0-col0', gapSize),
        {
          id: 'row0-col1',
          size: contentSize,
          children: [
            {
              id: 'row0-col1-row0',
              size: percentSize,
              children: [
                { id: 'row1-col1-row0-col0', size: contentPercentSize },
                getGapItem('row1-col1-row1-col0', gapSize),
                { id: 'row1-col1-row0-col1', size: contentPercentSize },
              ],
            },
            getGapItem('row0-col1-row0', gapSize),
            {
              id: 'row0-col1-row1',
              size: percentSize,
              children: [
                { id: 'row0-col1-row1-col0', size: contentPercentSize },
                getGapItem('row0-col1-row1-col0', gapSize),
                { id: 'row0-col1-row1-col1', size: contentPercentSize },
              ],
            },
          ],
        },
      ],
    },
  ];
};

const getLayout2Content = (inWidth: number, gapSize: number) => {
  const percentSize = (inWidth - gapSize) / 2;
  return [
    {
      id: 'row0',
      size: 400,
      children: [
        {
          id: 'row0-col0',
          size: percentSize,
        },
        getGapItem('row0-col0', gapSize),
        {
          id: 'row0-col1',
          size: percentSize,
        },
      ],
    },
    getGapItem('row0', gapSize),
    {
      id: 'row1',
      size: 400,
      children: [
        {
          id: 'row1-col0',
          size: percentSize,
        },
        getGapItem('row1-col0', gapSize),
        {
          id: 'row1-col1',
          size: percentSize,
        },
      ],
    },
  ];
};

const getLayout2TopInLeftRightAndCenterAndBottom = (
  inWidth: number,
  gapSize: number,
) => {
  const leftSize = 200;
  const rightSize = inWidth - gapSize - leftSize;
  return [
    {
      id: 'row0',
      size: 250,
      children: [
        { id: 'row0-col0', size: leftSize },
        getGapItem('row0-col0', gapSize),
        { id: 'row0-col1', size: rightSize },
      ],
    },
    getGapItem('row0', gapSize),
    { id: 'row1', size: 250 },
    getGapItem('row1', gapSize),
    { id: 'row2', size: 250 },
  ];
};

export const getGridLayoutData = (
  layoutId: string,
  initWidth?: number,
  initGap?: number,
): GridInfo[] => {
  const pageWidth = initWidth || 1920;
  const gapSize = initGap || 20;

  const layoutTarget = {
    topAndLeftRight: getLayout2TopAndLeftRight(pageWidth, gapSize),
    leftRight: getLayout2LeftRight(pageWidth, gapSize),
    topAndLeftRightAndBottom: getLayout2TopAndLeftRightAndBottom(
      pageWidth,
      gapSize,
    ),
    topAndContent: getLayout2TopAndContent(pageWidth, gapSize),
    topAndLeftContent: getLayout2TopAndLeftContent(pageWidth, gapSize),
    leftContent: getLayout2LeftContent(pageWidth, gapSize),
    content: getLayout2Content(pageWidth, gapSize),
    topInLeftRightAndCenterAndBottom: getLayout2TopInLeftRightAndCenterAndBottom(
      pageWidth,
      gapSize,
    ),
  };
  return layoutTarget[layoutId] || [];
};
