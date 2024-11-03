const Repository = require('../repository/repository');
const CustomError = require('../utils/customError');
const Transacao = require('./transacao');

class Contas {
    constructor({
        id,
        nome,
        cor
    }) {
        this.id = id ? id : null;
        this.nome = nome;
        this.cor = cor;
        this.deletion = false;
        this.repository = new Repository();
        this.transacao = new Transacao({
            conta: this.id
        });
        this.action = id ? false : true;
        this.contract = {
            nome: {
                required: true,
                type: 'string',
                error: "O atributo 'nome' é requerido e do tipo String"
            },
            cor: {
                required: true,
                type: 'string',
                error: "O atributo 'cor' é requerido e do tipo String"
            }
        };
    }

    async create() {
        try {
            await this.repository.add('contas', this.get());
            return 'Conta cadastrada com sucesso!';
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        const result = await this.repository.get('contas', this.id);
        const conta = result.data();
        conta.id = result.id;
        return conta;
    };

    async readAll() {
        const result = await this.repository.get('contas');
        const array = [];
        result.forEach(conta => {
            let obj = conta.data();
            obj.id = conta.id;
            array.push(obj);
        });

        return array;
    };

    async update() {
        try {
            await this.repository.set('contas', this.get());
            return "Conta alterada com sucesso!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        }
    };

    async delete() {
        await this.repository.delete('contas', this.id);
        return "Conta deletada com sucesso";
    };

    get() {
        if (!this.action) {
            return {
                id: this.id,
                nome: this.nome,
                cor: this.cor
            }
        } else {
            return {
                id: this.id,
                nome: this.nome,
                cor: this.cor,
                deletion: this.deletion
            };
        }
    };

    async report() {
        const result = await this.transacao.report();
        let balancoTotal = 0;

        result.forEach(transacao => {
            let tipo = transacao.data().tipo;
            let valor = transacao.data().valor;

            balancoTotal = tipo == '1' ? balancoTotal + valor : tipo == '2' ? balancoTotal - valor : balancoTotal;
        });

        return balancoTotal;
    }
};

module.exports = Contas;