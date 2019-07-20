/**
 *
 * create by ligx
 *
 * @flow
 */
import React, { useEffect, useRef, useState } from 'react';
import Selector from './';
import Theme from '@lugia/theme-config';
import { getBorder } from '@lugia/theme-utils';
import { getBorderRadius } from '@lugia/theme-utils/src';

const config = {
  Selector: {
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
          image: 'linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))',
        },
        boxShadow: 'none',
      },
      focus: {
        background: {
          color: 'blue',
        },
        border: getBorder({ color: 'red', width: 5, style: 'solid' }),
      },
      hover: {
        background: {
          color: '#ad74ff',
        },
      },
      borderRadius: getBorderRadius(50),
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
let now = true;
function useInstall() {
  const [installState, setInstallState] = useState(true);
  const [theme, changeTheme] = useState(config);
  return {
    theme,
    installState,
    install: () => setInstallState(true),
    unInstall: () => setInstallState(false),
    changeTheme: () => {
      changeTheme(now ? ButtonTheme : config);
      now = !now;
    },
  };
}

export default () => {
  console.info('render one');
  const target = useRef();
  const design = useRef();
  const { disabled, setDisabled } = useCount();
  const { installState, install, unInstall, changeTheme, theme } = useInstall();
  useEffect(() => {
    window.lgx = target.current;
    window.design = design.current;
  });
  return [
    installState ? (
      <Theme config={theme}>
        <Selector
          widgetId={'select'}
          innerRefForDesign={design}
          innerRef={current => {
            target.current = current;
          }}
          disabled={disabled}
        />
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
