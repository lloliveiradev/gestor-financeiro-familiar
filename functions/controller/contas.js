const Conta = require('../models/contas');
const Email = require('../models/email');
const CustomError = require("../utils/customError");
const validateContract = require('../utils/validations');

class ContaControl {
    async post(req, res) {
        try {
            const dados = req.body;

            const conta = new Conta({
                nome: dados.nome,
                cor: dados.cor
            });

            validateContract(conta);

            const result = await conta.create();
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

        const conta = new Conta(query);
        var result;
        if (query.id) {
            result = await conta.read();
        } else {
            result = await conta.readAll();
        };

        res.status(200).send(result);
    };

    async put(req, res) {
        const dados = req.body;

        const conta = new Conta({
            id: dados.id,
            nome: dados.nome
        });

        validateContract(conta);

        const result = await conta.update();

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

        const conta = new Conta(query);
        const result = conta.delete(query.id);

        res.status(200).send(result);
    };

    async report() {
        const conta = new Conta({
            id: 1
        });
        const balanco = await conta.report();
        const email = new Email({
            destinatario: 'eyvindess@gmail.com',
            assunto: 'Teste Firebase',
            corpo: `
                <h4><b>Relatório Diário</b></h4>
                <b>Balanço</b>: ${String(balanco)}
                <b>Saldo</b>: ${balanco >= 0 ? 'Positivo' : 'Negativo'}
            `
        });

        await email.enviarEmail();
    }
}

module.exports = new ContaControl();