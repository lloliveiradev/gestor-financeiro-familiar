const CustomError = require('../utils/customError');
const Repository = require('../repository/repository');
const JSONObjectMerge = require("json-object-merge");
const treatValues = require('../utils/treatValues');

class Transation {
    constructor(data, db, reqUser) {
        this.id = data.id || null;
        this.data = this.model(data);
        this.new = id ? false : true;
        this.db = new Repository(db, 'transactions');
        this.reqUser = reqUser || { name: 'WebService', ammount: '0097' };

        this.contract = {
            title: {
                required: true,
                type: 'string',
                error: "The attribute 'title' is required and only accepts the data type String"
            },
            ammount: {
                required: true,
                type: 'number',
                error: "The attribute 'ammount' is required and only accepts the data type Number"
            },
            date: {
                required: true,
                type: 'string',
                error: "The attribute 'date' is required and only accepts the data type String"
            },
            type: {
                required: true,
                type: 'string',
                error: "The attribute 'type' is required and only accepts the data type String"
            },
            category: {
                required: true,
                type: 'string',
                error: "The attribute 'category' is required and only accepts the data type String"
            },
        };
    };

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
            return "Transaction updated successfully!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: error?.status || 400
            });
        };
    };

    async delete(real) {
        await this.db.delete(this.id, this.reqUser, real);
        return "Transaction deleted successfully";
    };

    model(data) {
        const obj = {
            account: null, // object { id, name }
            category: null, // object { id, name }
            "creation": null, // object { date, user }
            date: null, // object - dateNow
            description: null, // string
            "deleted": false, // boolean
            "deletion": null, // object { date, user }
            title: null, // string
            type: null, // object { id, name }
            "update": null, // object { date, user }
            ammount: null, // number
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
};

module.exports = Transation;