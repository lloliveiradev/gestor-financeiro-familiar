const TipoTransacao = require('../models/tipos-trans');
const CustomError = require("../utils/customError");
const validateContract = require('../utils/validations');

class TipoTransacaoControl {
    async post(req, res) {
        try {
            const dados = req.body;

            const tipo = new TipoTransacao({
                nome: dados.nome
            });

            validateContract(tipo);

            const result = await tipo.create();
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

        const tipo = new TipoTransacao(query);
        var result;
        if (query.id) {
            result = await tipo.read();
        } else {
            result = await tipo.readAll();
        };

        res.status(200).send(result);
    };

    async put(req, res) {
        const dados = req.body;

        const tipo = new TipoTransacao({
            id: dados.id,
            nome: dados.nome
        });

        validateContract(tipo);

        const result = await tipo.update();

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

        const tipo = new TipoTransacao(query);
        const result = tipo.delete(query.id);

        res.status(200).send(result);
    };
};

module.exports = new TipoTransacaoControl();