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
    window.lgx = target;
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
