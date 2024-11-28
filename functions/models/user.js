const CustomError = require('../utils/customError');
const Repository = require('../repository/repository');
const JSONObjectMerge = require("json-object-merge");

class User {
    constructor(data, db, reqUser) {
        this.id = data.id || null;
        this.data = this.model(data);
        this.new = id ? false : true;
        this.db = new Repository(db, 'USERS');
        this.reqUser = reqUser || { name: 'WebService', value: '0097' };

        this.contract = {
            name: {
                required: true,
                type: 'string',
                error: "The attribute 'name' is required and only accepts the data type String"
            },
            email: {
                required: true,
                type: 'string',
                error: "The attribute 'email' is required and only accepts the data type String"
            },
            birth_date: {
                required: true,
                type: 'string',
                error: "The attribute 'birth_date' is required and only accepts the data type String"
            },
            access_level: {
                required: true,
                type: 'number',
                error: "The attribute 'access_level' is required and only accepts the data type Number",
            },
            profile_photo: {
                required: true,
                type: 'string',
                error: "The attribute 'profile_photo' is required and only accepts the data type String"
            }
        };
    };

    async create() {
        try {
            if (!await this.validateEmail()) {
                throw new CustomError({
                    message: 'The email informed is already being used by another user!',
                    status: 400
                });
            };
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
            if (!await this.validateEmail()) {
                throw new CustomError({
                    message: 'The email informed is already being used by another user!',
                    status: error?.status || 400
                });
            };
            await this.db.set(this.id, this.data, this.reqUser);
            return "User updated successfully!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: error?.status || 400
            });
        };
    };

    async delete(real) {
        await this.db.delete(this.id, this.reqUser, real);
        return "User deleted successfully!";
    };

    async validateEmail() {
        const query = await this.db.getWhere({
            params: [{ key: 'email', op: '==', val: this.data.email }]
        });
        if (query?.length) {
            if (!this.data.id) {
                return true;
            } else {
                if (query.filter(el => el.id == id)?.length) {
                    return false;
                } else {
                    return true;
                };
            };
        };
        return false;
    };

    model(data) {
        const obj = {
            access_level: null, // number - 0 adm, 1 master, 2 editor, 3 viewer
            birth_date: null, // object - dateNow
            "creation": null, // object { date, user }
            email: null, // string
            "deleted": false, // boolean
            "deletion": null, // object { date, user }
            name: null, // string - upperCase
            profile_photo: null, // string - url
            uid: null, // string - firebase doc hash
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
};

module.exports = User;