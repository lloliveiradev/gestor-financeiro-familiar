const Repository = require('../repository/repository');
const CustomError = require('../utils/customError');

class TipoTransacao {
    constructor({
        id,
        nome
    }) {
        this.id = id ? id : null;
        this.nome = nome;
        this.deletion = false;
        this.repository = new Repository();
        this.action = id ? false : true;
        this.contract = {
            nome: {
                required: true,
                type: 'string',
                error: "O atributo 'nome' é requerido e do tipo String"
            }
        };
    };

    async create() {
        try {
            await this.repository.add('tipos_transacoes', this.get());
            return 'Tipo cadastrado com sucesso!';
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        const result = await this.repository.get('tipos_transacoes', this.id);
        const tipo = result.data();
        tipo.id = result.id;
        return tipo;
    };

    async readAll() {
        const result = await this.repository.get('tipos_transacoes');
        const array = [];
        result.forEach(tipo => {
            let obj = tipo.data();
            obj.id = tipo.id;
            array.push(obj);
        });

        return array;
    };

    async update() {
        try {
            await this.repository.set('tipos_transacoes', this.get());
            return "Tipo alterado com sucesso!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        }
    };

    async delete() {
        await this.repository.delete('tipos_transacoes', this.id);
        return "Tipo deletado com sucesso";
    };

    get() {
        if (!this.action) {
            return {
                id: this.id,
                nome: this.nome
            }
        } else {
            return {
                id: this.id,
                nome: this.nome,
                deletion: this.deletion
            };
        }
    };
};

module.exports = TipoTransacao;