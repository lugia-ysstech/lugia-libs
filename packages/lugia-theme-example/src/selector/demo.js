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
    Button: {
      active: {
        background: {
          color: 'pink',
        },
        boxShadow: {
          type: 'outset',
          x: 5,
          y: 5,
          spread: 5,
          blur: 5,
          color: 'rgb(0,0,5,0.9)',
        },
      },
      disabled: {
        background: {
          color: 'black',
        },
      },
    },
    SelectWeb: {
      Block: {
        normal: {
          background: {
            color: 'orange',
          },
        },
        active: {
          background: {
            color: 'yellow',
          },
        },
      },
    },
    Block: {
      active: {
        background: {
          color: 'blue',
        },
      },
      disabled: {
        background: {
          color: 'black',
        },
      },
      normal: {
        lineHeight: 50,
        fontSize: 22,
        margin: {
          left: 15,
          right: 'a',
        },
        padding: 5,
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

      disabled: {
        background: {
          color: 'black',
        },
      },
    },
  },
};

function useCount() {
  const [disabled, setDisabled] = useState(false);
  return { disabled, setDisabled };
}

function useInstall() {
  const [installState, setInstallState] = useState(true);
  return {
    installState,
    install: () => setInstallState(true),
    unInstall: () => setInstallState(false),
  };
}

export default () => {
  const target = useRef();
  const { disabled, setDisabled } = useCount();
  const { installState, install, unInstall } = useInstall();
  useEffect(() => {
    window.lgx = target.current;
  });
  return [
    installState ? (
      <Selector theme={config} ref={target} disabled={disabled} />
    ) : null,
    <button onClick={() => setDisabled(!disabled)}>
      {!disabled ? '禁用' : '启用'}
    </button>,
    <button onClick={unInstall}>卸载</button>,
    <button onClick={install}>装载</button>,
  ];
};
