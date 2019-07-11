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
    indexDB.save('links', { name: 'hello', port: 9090, psw: 'aaa' });
    window.indexedDB_m = indexDB;
    setTimeout(() => {
      console.log(indexDB.getIndex('links', 'name'));
      console.log('indexOption', indexDB.indexOption);
      console.log('tableName2Field2Index', indexDB.tableName2Field2Index);
      // console.log('name', indexDB.tableName2Field2Index.links.name);
    }, 3000);
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
      <button>add link</button>,
    ];
  }
}
