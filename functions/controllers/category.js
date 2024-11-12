const Category = require('../models/category');
const CustomError = require("../utils/customError");
const { validateContract } = require('../utils/validations');

class CategoryControl {
    async post(req, res, db) {
        try {
            const data = req.body;
            const category = new Category(data, db, req.user.info);
            validateContract(category);
            const result = await category.create();
            return res.status(200).json({ id: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async get(req, res, db) {
        try {
            const query = req.query;
            const cls = new Category(query, db, req.user.info);
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
            if (!data.id) return res.status(400).json({ message: "Inform a category id!" });
            const category = new Category(data, db, req.user.info);
            validateContract(category, true);
            const result = await category.update();
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };

    async delete(req, res, db) {
        try {
            const query = req.query;
            if (!query.id) return res.status(400).json({ message: "Inform a category id!" });
            const category = new Category(query, db, req.user.info);
            const result = await category.delete(query.id);
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(error?.status || 500).json({ message: error.message });
        };
    };
}

module.exports = new CategoryControl();