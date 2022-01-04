import React from 'react';
import indexDB from './db';

export default class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      allLink: [],
    };
  }

  componentDidMount() {
    window.indexedDB_m = indexDB;
  }

  render() {
    console.log(indexDB);
    const { allLink } = this.state;
    return [
      <div>hello world</div>,
      <ul>
        {allLink.length
          ? allLink.map(item => <li key={item.name}>item.name</li>)
          : '暂无数据'}
      </ul>,
      <input type="text" />,
      <button
        onClick={() => {
          indexDB.save('links', { name: 'hello', port: 9090, psw: 'aaa' });
        }}
      >
        add link
      </button>,
    ];
  }
}
