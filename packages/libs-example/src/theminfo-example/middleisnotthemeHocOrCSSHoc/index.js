/**
 *
 * 包含两层的配置嵌套
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Button from '../base/button';
import Simple from '../simple';

const Popup = (props: Object) => {
  return <div>{props.children} </div>;
};
const Trigger = ThemeHoc((props: Object) => {
  return (
    <div>
      {props.children}
      <Popup>{props.popup}</Popup>
    </div>
  );
}, 'Trigger');
export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <Trigger
          {...addMouseEvent(this)}
          style={{ border: '1px solid' }}
          themePass={true}
          popup={<Simple {...this.props.getPartOfThemeHocProps('Popup')} />}
        >
          two
          <Simple {...this.props.getPartOfThemeHocProps('ButtonA')} />
          <Simple {...this.props.getPartOfThemeHocProps('ButtonB')} />
        </Trigger>
      );
    }
  },
  'Two',
  { hover: true, active: true },
);
