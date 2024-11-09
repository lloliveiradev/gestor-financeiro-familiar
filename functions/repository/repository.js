const { Filter, Query } = require("firebase-admin/firestore");
const CustomError = require("../utils/customError");
const dateNow = require("../utils/dateNow");

class Repository {
    constructor(db, collection, sub) {
        this.db = sub ? db : db.firestore();
        this.collection = collection;
    };

    /**
     * Creates a new record and returns its id
     * @param {Object} data 
     * @param {Object} user 
     * @returns {Promise<String>}
     */
    async add(data, user) {
        try {
            data.creation = {
                user: user,
                date: dateNow()
            };

            const { id } = await this.db.collection(this.collection).add(data);
            this.db.collection(this.collection).doc(id).set({ id }, { merge });
            return id;
        } catch (error) {
            throw error;
        };
    };

    /**
     * Updates a record
     * 
     * @param {String} id 
     * @param {Object} data 
     * @param {Object} user 
     * @param {Boolean} merge 
     */
    async set(id, data, user, merge = true) {
        try {
            data.update = {
                user: user,
                date: dateNow()
            };
            await this.db.collection(this.collection).doc(String(id)).set(data, { merge });
        } catch (error) {
            throw error;
        };
    };

    /**
     * Queries an especific record and returns the data
     * 
     * @param {String} id 
     * @returns {Promise<>}
     */
    async get(id) {
        try {
            const result = await this.db.collection(this.collection).doc(String(id)).get();
            if (result.exists) {
                const obj = result.data();
                obj.id = result.id;
                return obj;
            } else {
                throw new CustomError({ message: 'Record not found', status: 204 });
            };
        } catch (error) {
            throw error;
        };
    };

    /**
     * Queries the database using the options and returns a recordset
     * 
     * @param {Any<{limit: Number, offset: Number, orderBy: Array, params: Array, startAfter: String | Array, startAt: String | Array}>} options 
     * @returns {Promise<Array>}
     */
    async getWhere(options = {}) {
        const { limit, offset, orderBy, params, startAfter, startAt } = options;
        try {
            let query = this.db.collection(this.collection);
            if (params?.length) {
                for (const param of params) {
                    if (param.or) {
                        param.key = typeof param.key == 'string' ? param.key.split(',') : (Array.isArray(param.key) ? param.key : null);
                        param.op = typeof param.op == 'string' ? param.op.split(',') : (Array.isArray(param.op) ? param.op : null);
                        param.val = typeof param.val == 'string' ? param.val.split(',') : (Array.isArray(param.val) ? param.val : null);

                        if (
                            !param.key || !param.op || !param.val ||
                            param.key.length != param.op.length ||
                            param.key.length != param.val.length
                        ) throw new Error('Invalid query.');

                        const queries = [];
                        await Promise.all(param.key.map((key, i) => {
                            queries.push(Filter.where(key, param.op[i], param.val[i]))
                        }));
                        param = param.where(Filter.or(...queries));
                    } else {
                        param = param.where(param.key, param.op, param.val);
                    };
                };
            };

            if (orderBy) {
                orderBy.forEach(e => {
                    if (typeof e == 'string') {
                        query = query.orderBy(e);
                    } else if (Array.isArray(e)) {
                        query = query.orderBy(e[0], e[1]);
                    };
                });
            };

            if (startAt) {
                if (typeof startAt == 'string') {
                    query = query.startAt(startAt);
                } else if (startAt?.length) {
                    startAt.forEach((e) => {
                        if (e) query = query.startAt(e);
                    });
                };
            };

            if (startAfter) {
                if (typeof startAfter == 'string') {
                    query = query.startAfter(startAfter);
                } else if (startAfter?.length) {
                    startAfter.forEach((e) => {
                        if (e) query = query.startAfter(e);
                    });
                };
            };

            if (limit) query = query.limit(limit);

            if (offset) query = query.offset(offset);

            const result = await query.get();
            if (result.docs.length > 0) {
                const array = [];
                for (let item of result.docs) {
                    const obj = item.data();
                    obj.id = item.id;
                    array.push(obj);
                };
                return array;
            } else {
                return [];
            };
        } catch (error) {
            throw error;
        };
    };

    /**
     * Removes a record from the database or logically deletes it
     * 
     * @param {String} id 
     * @param {Any<{id: String, name: String}>} user 
     * @param {Boolean} real 
     */
    async delete(id, user, real = false) {
        try {
            if (real) {
                await this.db.collection(this.collection).doc(String(id)).delete();
            } else {
                const obj = {
                    deleted: true,
                    deletion: {
                        user,
                        date: dateNow()
                    }
                };
                await this.db.collection(this.collection).doc(String(id)).set(obj, { merge: true });
            };
        } catch (error) {
            throw error;
        };
    };

    /**
     * Count the records according with the where params
     * 
     * @param {Array<{key: String, op: String, val: String}>} params
     * @returns {Promise<Number>}
     */
    async count(params) {
        try {
            if (!Array.isArray(params)) throw new CustomError({ message: 'Params most be an objects array', status: 400 });
            let query = this.db.collection(this.collection);
            if (params?.length) {
                for await (const param of params) {
                    if (param.or) {
                        param.key = typeof param.key == 'string' ? param.key.split(',') : (Array.isArray(param.key) ? param.key : null);
                        param.operation = typeof param.operation == 'string' ? param.operation.split(',') : (Array.isArray(param.operation) ? param.operation : null);
                        param.value = typeof param.value == 'string' ? param.value.split(',') : (Array.isArray(param.value) ? param.value : null);

                        if (
                            !param.key || !param.op || !param.val ||
                            param.key.length != param.op.length ||
                            param.key.length != param.val.length
                        ) throw new Error('Invalid query.');

                        const queries = [];
                        await Promise.all(param.key.map((key, i) => {
                            queries.push(Filter.where(key, param.operation[i], param.value[i]));
                        }));
                        param = param.where(Filter.or(...queries));
                    } else {
                        param = param.where(param.key, param.operation, param.value);
                    };
                };
            };
            return ((await query.count().get()).data()).count || 0;
        } catch (error) {
            throw error;
        };
    };

    /**
     * Creates e returns a document reference
     * 
     * @param {String} id 
     * @returns {Promise<>}
     */
    async ref(id) {
        try {
            return await this.db.collection(this.collection).doc(id);
        } catch (error) {
            console.error(error);
            return null;
        };
    };
};

module.exports = Repository;