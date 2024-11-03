const Transacao = require('../models/transacao');
const CustomError = require("../utils/customError");
const validateContract = require('../utils/validations');

class TransacaoControl {
    async post(req, res) {
        try {
            const dados = req.body;

            const transacao = new Transacao({
                titulo: dados.titulo,
                descricao: dados.descricao,
                data: dados.data,
                conta: dados.conta,
                valor: dados.valor,
                categoria: dados.categoria,
                fixo: dados.fixo,
                tipo: dados.tipo,
                id_usuario: dados.id_usuario
            });

            validateContract(transacao);

            const result = await transacao.create();
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

        const transacao = new Transacao(query);
        var result;
        if (query.id) {
            result = await transacao.read();
        } else {
            result = await transacao.readAll();
        };

        res.status(200).send(result);
    };

    async put(req, res) {
        const dados = req.body;

        const transacao = new Transacao({
            id: dados.id,
            titulo: dados.titulo,
            descricao: dados.descricao,
            data: dados.data,
            conta: dados.conta,
            valor: dados.valor,
            categoria: dados.categoria,
            fixo: dados.fixo,
            tipo: dados.tipo
        });

        validateContract(transacao);

        const result = await transacao.update();

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

        const transacao = new Transacao(query);
        const result = transacao.delete(query.id);

        res.status(200).send(result);
    };
}

module.exports = new TransacaoControl();