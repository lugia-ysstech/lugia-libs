import IndexDB from '@lugia/indexDB';

let indexedDb;
if (window) {
  indexedDb = new IndexDB(window.indexedDB, {
    dataBaseName: 'link',
    tableNames: ['links'],
    indexOption: { links: [{ field: 'name', option: { unique: false } }] },
  });
}

export default indexedDb;
