import IndexDB from '@lugia/indexDB';

let indexedDb;
if (window) {
  indexedDb = new IndexDB(window.indexedDB, {
    dataBaseName: 'link',
    dynamicDb: true,
    tableNames: ['links'],
    indexOption: { links: [{ field: 'name', option: { unique: false } }] },
  });
  indexedDb.on('onblocked', param => console.info(param));
  indexedDb.on('onupgradeneeded', param => console.info(param));
}

export default indexedDb;
