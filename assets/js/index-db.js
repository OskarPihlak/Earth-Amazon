import {idb} from 'idb';
alert('hello');
let db_promise = idb.open('test-db', 1, (upgrade_db)=>{
    let key_val_store = upgrade_db.createObjectStore('keyval');
    key_val_store.put('world','hello');
});

db_promise.then((db)=>{
 let tx = db.transaction('keyval');
 let key_val_store = tx.objectStore('keyval');
 return key_val_store.get('hello');
}).then((val)=>{
    console.log('The value of hello is', val);
});

db_promise.then((db)=>{
    let tx = db.transaction('keyval');
    let key_val_store = tx.objectStore('keyval');
    key_val_store.put('bar','foo');
    return tx.complete
}).then(()=>{
    console.log('Added foo:bar to keyval');
});