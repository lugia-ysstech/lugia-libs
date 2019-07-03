/**
 *
 * create by ligx
 *
 * @flow
 */
import React, { useEffect, useRef, useState } from 'react';
import Selector from './';
import Theme from '@lugia/theme-config';
import { getBorder } from '@lugia/theme-css-hoc/src';

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
      disabled: {},
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
    Button: {
      normal: {
        background: {
          color: '#6f9bfa',
        },
      },
      focus: {
        background: {
          color: 'blue',
        },
        border: getBorder({ color: 'red', width: 5, style: 'solid' }),
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

const ButtonTheme = {
  Selector: {
    Button: {
      normal: {
        background: {
          color: 'red',
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
  const [theme, changeTheme] = useState(config);
  return {
    theme,
    installState,
    install: () => setInstallState(true),
    unInstall: () => setInstallState(false),
    changeTheme: () => {
      console.info('变更主题', ButtonTheme);
      changeTheme(ButtonTheme);
    },
  };
}

export default () => {
  console.info('render one');
  const target = useRef();
  const { disabled, setDisabled } = useCount();
  const { installState, install, unInstall, changeTheme, theme } = useInstall();
  useEffect(() => {
    window.lgx = target.current;
  });
  return [
    installState ? (
      <Theme config={theme}>
        <Selector ref={target} disabled={disabled} />
      </Theme>
    ) : null,
    <button onClick={() => setDisabled(!disabled)}>
      {!disabled ? '禁用' : '启用'}
    </button>,
    <button onClick={unInstall}>卸载</button>,
    <button onClick={install}>装载</button>,
    <button onClick={changeTheme}>变更主题</button>,
  ];
};
