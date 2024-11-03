const firestore = require('firebase-admin/firestore');
const db = new firestore.Firestore();

class Repository {
    add(collection, obj) {
        return db.collection(collection).add(obj);
    };

    set(collection, obj) {
        return db.collection(collection).doc(String(obj.id)).set(obj, {
            merge: true
        });
    };

    get(collection, id) {
        if (id) {
            return db.collection(collection).doc(String(id)).get();
        } else {
            return db.collection(collection).get();
        };
    };

    getWhere(collection, parametro, operador, valor) {
        return db.collection(collection).where(parametro, operador, valor).get();
    };

    delete(collection, id) {
        return db.collection(collection).doc(String(id)).delete();
    };
}

module.exports = Repository;