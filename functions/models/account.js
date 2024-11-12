const CustomError = require('../utils/customError');
const Repository = require('../repository/repository');
const Transaction = require('./transaction');

class Account {
    constructor(data, db, reqUser) {
        this.id = data.id || null;
        this.data = this.model(data);
        this.new = id ? false : true;
        this.db = new Repository(db, 'accounts');
        this.transaction = new Transaction({ account: this.id }, db, reqUser);
        this.reqUser = reqUser || { name: 'WebService', value: '0097' };

        this.contract = {
            name: {
                required: true,
                type: 'string',
                error: "The attribute 'name' is required and only accepts the data type String"
            },
            color: {
                required: true,
                type: 'string',
                error: "The attribute 'color' is required and only accepts the data type String"
            },
            type: {
                required: true,
                type: 'string',
                error: "The attribute 'type' is required and only accepts the data type String"
            }
        }
    }

    async create() {
        try {
            return await this.db.add(this.data, this.reqUser);
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        try {
            const result = await this.db.get(this.id);
            const data = result.data();
            data.id = result.id;
            return data;
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: error?.status || 400
            });
        };
    };

    async readAll(options) {
        try {
            let { keys, ops, params, vals } = options;
            if (!params || !Array.isArray(params)) params = [];
            params.push({ key: 'deleted', op: '==', });
            if (keys && ops && vals) {
                keys = keys.split(';');
                ops = ops.split(';');
                vals = vals.split(';');
                keys.forEach((key, ix) => {
                    params.push({
                        key,
                        op: ops[ix] === "array" ? "array-contains" : ops[ix],
                        val: treatValues(vals[ix], key),
                    });
                });
            };
            if (params.length == 1) throw new CustomError('Inform valid params for the record query!', 400);
            const result = await this.db.getWhere({ params });
            const records = [];
            result.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                records.push(data);
            });
            return records;
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: error?.status || 400
            });
        };
    };

    async update() {
        try {
            await this.db.set(this.id, this.data, this.reqUser);
            return "Account updated successfully!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: error?.status || 400
            });
        };
    };

    async delete(real) {
        await this.repository.delete(this.id, this.reqUser, real);
        return "Account deleted successfully";
    };

    model(data) {
        const obj = {
            color: null, // string
            "creation": null, // object { date, user }
            "deleted": false, // boolean
            "deletion": null, // object { date, user }
            name: null, // string
            type: null, // object { id, name }
            "update": null, // object { date, user }
        };
        const formatted = JSONObjectMerge.default(obj, data);
        if (!this.new) {
            for (const key in formatted) {
                if (Object.prototype.hasOwnProperty.call(formatted, key)) {
                    const el = formatted[key];
                    if (!el) delete formatted[key]
                };
            };
        };
        return formatted;
    };

    async report() {
        const result = await this.transaction.getWhere({
            params: [{ key: 'account.id', op: '==', val: this.data.id }]
        });
        let balance = 0;
        result.forEach(trans => {
            const type = trans.type.id;
            const value = trans.value;
            balance = type == '1' ? balance + value : type == '2' ? balance - value : balance;
        });
        return balance;
    };
};

module.exports = Account;