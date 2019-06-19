/**
 *
 * create by ligx
 *
 * @flow
 */
import React, { useEffect, useRef, useState } from 'react';
import Selector from './';

const config = {
  Selector: {
    Block: {
      disabled: {
        background: {
          color: 'black',
        },
      },
      normal: {
        background: {
          color: 'green',
        },
        last: {
          background: {
            color: 'pink',
          },
        },
        first: {
          background: {
            color: 'blue',
          },
        },
        nth3: {
          background: {
            color: 'blue',
          },
        },
        nth8: {
          background: {
            color: 'yellow',
          },
        },
      },
    },
  },
};

function useCount() {
  const [disabled, setDisabled] = useState(false);
  return { disabled, setDisabled };
}

export default () => {
  const target = useRef();
  const { disabled, setDisabled } = useCount();
  useEffect(() => {
    window.lgx = target;
  });
  return [
    <Selector theme={config} ref={target} disabled={disabled} />,
    <button onClick={() => setDisabled(!disabled)}>禁用</button>,
  ];
};
