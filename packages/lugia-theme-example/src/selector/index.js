/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-hoc';
import { getBorder } from '@lugia/theme-utils';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';

const BaseButton = CSSComponent({
  tag: 'button',
  className: 'button',
});
const Button = ThemeHoc(
  CSSComponent({
    className: 'button',
    tag: 'button',
    focus: {
      defaultTheme: {
        background: {
          color: 'blue',
        },
      },
    },
  }),
  'btn',
  { hover: true, active: true, focus: true },
);

const Block = CSSComponent({
  tag: 'span',
  className: 'selector_block',
  css: 'display: inline-block',
  normal: {
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
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
      background: { color: 'yellow' },
    },
  },
});

const SelectorWeb = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const { index, count } = this.props;

      let partOfThemeProps = this.props.getPartOfThemeProps('Block', {
        selector: { index, count },
      });
      console.info('partOfThemeProps', partOfThemeProps);
      return (
        <Block {...addMouseEvent(this)} themeProps={partOfThemeProps}>
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

      let blockPart = this.props.getPartOfThemeConfig('Block');
      for (let i = 0; i < 1; i++) {
        let partOfThemeHocProps = this.props.getPartOfThemeHocProps(
          'SelectWeb',
        );
        console.info(partOfThemeHocProps);
        res.push(
          <SelectorWeb
            propsConfig={{ index: i }}
            {...this.props.dispatchEvent(['hover', 'active'], 'f2c')}
            index={i}
            count={10}
            {...partOfThemeHocProps}
            disabled={this.props.disabled}
          />,
        );
      }
      let server1 = this.props.createEventChannel(['active']);
      let server2 = this.props.createEventChannel(['active']);
      const object = this.props.createThemeHocProps('selectWeb', {
        BlockConfig: blockPart,
      });
      return (
        <div {...addMouseEvent(this)}>
          <SelectorWeb {...object} />
          {res}
          <Button
            {...server1.provider}
            {...this.props.getPartOfThemeHocProps('Button')}
          >
            A
          </Button>{' '}
          ,
          <Button
            {...server2.provider}
            lugiaConsumers={server2.consumer}
            {...this.props.getPartOfThemeHocProps('Button')}
          >
            B
          </Button>
          ,
          <Button
            disabled
            lugiaConsumers={[server1.consumer, server2.consumer]}
            {...this.props.getPartOfThemeHocProps('Button')}
          >
            C
          </Button>
          ,
          <BaseButton
            themeProps={this.props.getPartOfThemeProps('Block', {
              state: { active: true },
            })}
          >
            aaa
          </BaseButton>
        </div>
      );
    }
  },
  'Selector',
  { hover: true, active: true },
);
