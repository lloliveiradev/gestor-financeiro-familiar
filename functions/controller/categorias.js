const Categoria = require('../models/categorias');
const CustomError = require("../utils/customError");
const validateContract = require('../utils/validations');

class CategoriaControl {
    async post(req, res) {
        try {
            const dados = req.body;

            const categoria = new Categoria({
                nome: dados.nome,
                cor: dados.cor,
                tipo: dados.tipo
            });

            validateContract(categoria);

            const result = await categoria.create();
            res.status(200).send({
                message: result
            });
        } catch (error) {
            if (error.status && error.message) {
                return res.status(error.status).send({
                    message: error.message
                });
            }
            return res.status(500).send({
                message: error.message
            });
        };
    };

    async get(req, res) {
        const query = req.query;

        const categoria = new Categoria(query);
        var result;
        if (query.id) {
            result = await categoria.read();
        } else {
            result = await categoria.readAll();
        };

        res.status(200).send(result);
    };

    async put(req, res) {
        const dados = req.body;

        const categoria = new Categoria({
            id: dados.id,
            nome: dados.nome,
            cor: dados.cor,
            tipo: dados.tipo
        });

        validateContract(categoria);

        const result = await categoria.update();

        res.status(200).send({
            message: result
        });
    };

    async delete(req, res) {
        const query = req.query;

        if (!query.id) {
            return res.status(400).send({
                message: "ID não informado!"
            });
        };

        const categoria = new Categoria(query);
        const result = categoria.delete(query.id);

        res.status(200).send(result);
    };
}

module.exports = new CategoriaControl();