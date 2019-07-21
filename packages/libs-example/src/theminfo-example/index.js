/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';

import Factory from './Factory';
import Simple from './simple';
import Two from './twolevelthocwrapcsshoc';
import ThreeLevel from './threelevelthoc';
import Middle from './middleisnotthemeHocOrCSSHoc';

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
const MiddleDemo = Factory(Middle, {}, 'middle');
const ThreeLevelDemo = Factory(
  ThreeLevel,
  {
    Root: {
      A: {
        B: {
          C: {
            C1: {
              normal: {
                background: 'c1',
              },
            },
            C2: {
              normal: {
                background: 'c2',
              },
            },
          },
        },
      },
    },
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
      <MiddleDemo />
    </div>
  );
};
