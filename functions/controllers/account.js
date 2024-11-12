const Account = require('../models/account');
const CustomError = require("../utils/customError");
const Email = require('../models/email');
const { validateContract } = require('../utils/validations');

class AccountControl {
    async post(req, res, db) {
        try {
            const data = req.body;
            const account = new Account(data, db, req.user.info);
            validateContract(account);
            const result = await account.create();
            return res.status(200).json({ id: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async get(req, res, db) {
        try {
            const query = req.query;
            const cls = new Account(query, db, req.user.info);
            let result;
            if (query.id) result = await cls.read();
            else {
                const options = {};
                let { keys, ops, vals } = query;
                if (keys) keys = decodeURIComponent(keys), options.keys = keys;
                if (ops) ops = decodeURIComponent(ops), options.ops = ops;
                if (vals) vals = decodeURIComponent(vals), options.vals = vals;
                result = await cls.readAll(options);
            };
            return res.status(200).json(result);
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async put(req, res, db) {
        try {
            const data = req.body;
            if (!data.id) return res.status(400).json({ message: "Inform an account id!" });
            const account = new Account(data, db, req.user.info);
            validateContract(account, true);
            const result = await account.update();
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async delete(req, res, db) {
        try {
            const query = req.query;
            if (!data.id) return res.status(400).json({ message: "Inform an account id!" });
            const account = new Account(query, db, req.user.info);
            const result = await account.delete(query.id);
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async report(db) {
        const account = new Account({
            id: 1
        }, db, null);
        const balance = await account.report();
        const email = new Email({
            body: `
                <h4><b>Daily Report</b></h4>
                <b>Balance</b>: ${String(balance)} - ${balance >= 0 ? 'Positive' : 'Negative'}
            `,
            recipient: 'leonardo@apoiotech.com.br',
            subject: 'Account Balance',
        });
        await email.send();
    };
};

module.exports = new AccountControl();