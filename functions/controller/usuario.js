const Usuario = require('../models/usuario');
const CustomError = require("../utils/customError");
const validateContract = require('../utils/validations');

class UsuarioControl {
    async post(req, res) {
        try {
            const dados = req.body;

            const usuario = new Usuario({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
                data_nasc: dados.data_nasc,
                nivel_acesso: dados.nivel_acesso,
                foto: dados.foto
            });

            validateContract(usuario);

            const result = await usuario.create();
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

        const usuario = new Usuario(query);
        var result;
        if (query.id) {
            result = await usuario.read();
        } else {
            result = await usuario.readAll();
        };

        res.status(200).send(result);
    };

    async put(req, res) {
        const dados = req.body;

        const usuario = new Usuario({
            id: dados.id,
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            foto: dados.foto
        });

        validateContract(usuario, true);

        const result = await usuario.update();

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

        const usuario = new Usuario(query);
        const result = usuario.delete(query.id);

        res.status(200).send(result);
    };
};

module.exports = new UsuarioControl();