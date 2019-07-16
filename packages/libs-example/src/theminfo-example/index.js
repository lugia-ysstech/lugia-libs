/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';

import Factory from './Factory';
import Simple from './simple';
import Two from './twolevelthoc';
import ThreeLevel from './threelevelthoc';

const SimpleDemo = Factory(
  Simple,
  {
    PartA: {
      normal: {
        background: {
          color: 'red',
        },
      },
    },
  },
  'one',
);
const TwoLevelDemo = Factory(Two, {}, 'two');
const ThreeLevelDemo = Factory(
  ThreeLevel,
  {
    FBButtonA: {
      PartA: {
        normal: {
          background: {
            color: 'black',
          },
        },
      },
    },
    FBButtonBPartA: {
      normal: {
        color: 'red',
      },
    },
    FTwo: {
      ButtonA: {
        PartA: {
          normal: {
            color: 'green',
          },
        },
      },
    },
    BButtonA: {
      PartA: {
        normal: {
          background: {
            color: 'yellow',
          },
        },
      },
      PartB: {
        normal: {
          background: {
            color: 'blue',
          },
        },
      },
    },
    BButtonBPartA: {
      normal: {
        background: {
          color: 'black',
        },
      },
    },
  },
  'three',
);
export default () => {
  return (
    <div>
      <ThreeLevelDemo />
    </div>
  );
};
