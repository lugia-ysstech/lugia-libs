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
const ThreeLevelDemo = Factory(ThreeLevel, {}, 'three');
export default () => {
  return (
    <div>
      <SimpleDemo />
      <TwoLevelDemo />
      <ThreeLevelDemo />
    </div>
  );
};
