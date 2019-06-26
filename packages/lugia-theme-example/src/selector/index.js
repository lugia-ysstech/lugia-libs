/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent, { getBorder } from '@lugia/theme-css-hoc';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';

const Block = CSSComponent({
  tag: 'span',
  className: 'selector_block',
  css: 'display: inline-block',
  normal: {
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      console.info('get', propsConfig);
      const { index } = propsConfig;

      return {
        border: getBorder({
          width: 5,
          style: 'solid',
          color: index % 2 === 0 ? 'black' : 'red',
        }),
      };
    },

    defaultTheme: {
      width: 20,
      margin: {
        right: 20,
      },
      height: 20,
      background: { color: 'red' },
    },
  },
});

const SelectorWeb = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const { index, count } = this.props;

      return (
        <Block
          themeProps={this.props.getPartOfThemeProps('BlockConfig', {
            selector: { index, count },
          })}
        >
          1
        </Block>
      );
    }
  },
  'SelectroWEb',
  { hover: true, active: true },
);

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const res = [];
      for (let i = 0; i < 10; i++) {
        let blockPart = this.props.getPartOfThemeConfig('Block');
        res.push(
          <SelectorWeb
            propsConfig={{ index: i }}
            index={i}
            count={10}
            {...this.props.createThemeHocProps('selectWeb', {
              BlockConfig: blockPart,
            })}
            themeState={this.props.themeProps.themeState}
            disabled={this.props.disabled}
          />,
        );
      }
      return <div {...addMouseEvent(this)}>{res}</div>;
    }
  },
  'Selector',
  { hover: true, active: true },
);
