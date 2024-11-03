const Repository = require('../repository/repository');
const CustomError = require('../utils/customError');

class Transacao {
    constructor({
        id,
        titulo,
        descricao,
        data,
        conta,
        valor,
        categoria,
        fixo,
        tipo,
        id_usuario
    }) {
        this.id = id ? id : null;
        this.titulo = titulo;
        this.descricao = descricao;
        this.data = data;
        this.conta = conta;
        this.valor = valor;
        this.categoria = categoria;
        this.fixo = fixo ? true : false;
        this.tipo = tipo;
        this.id_usuario = id_usuario;
        this.deletion = false;
        this.repository = new Repository();
        this.action = id ? false : true;
        this.contract = {
            titulo: {
                required: true,
                type: 'string',
                error: "O atributo 'titulo' é requerido e do tipo String"
            },
            valor: {
                required: true,
                type: 'number',
                error: "O atributo 'valor' é requerido e do tipo Number"
            },
            data: {
                required: true,
                type: 'string',
                error: "O atributo 'data' é requerido e do tipo String"
            },
            tipo: {
                required: true,
                type: 'string',
                error: "O atributo 'tipo' é requerido e do tipo String"
            },
            id_usuario: {
                required: true,
                type: 'string',
                error: "O atributo 'id_usuario' é requerido e do tipo String"
            },
            conta: {
                required: true,
                type: 'string',
                error: "O atributo 'conta' é requerido e do tipo String"
            }
        }
    };

    async create() {
        try {
            await this.repository.add('transacoes', this.get());
            return 'Transação cadastrada com sucesso!';
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        const result = await this.repository.get('transacoes', this.id);
        const transacao = result.data();
        transacao.id = result.id;
        return transacao;
    };

    async readAll() {
        const result = await this.repository.get('transacoes');
        const array = [];
        result.forEach(transacao => {
            let obj = transacao.data();
            obj.id = transacao.id;
            array.push(obj);
        });

        return array;
    };

    async update() {
        try {
            await this.repository.set('transacoes', this.get());
            return "Transação alterada com sucesso!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        }
    };

    async delete() {
        await this.repository.delete('transacoes', this.id);
        return "Transação deletada com sucesso";
    };

    get() {
        if (!this.action) {
            return {
                id: this.id,
                titulo: this.titulo,
                descricao: this.descricao,
                data: this.data,
                conta: this.conta,
                valor: this.valor,
                categoria: this.categoria,
                fixo: this.fixo,
                tipo: this.tipo,
                id_usuario: this.id_usuario
            }
        } else {
            return {
                id: this.id,
                titulo: this.titulo,
                descricao: this.descricao,
                data: this.data,
                conta: this.conta,
                valor: this.valor,
                categoria: this.categoria,
                fixo: this.fixo,
                tipo: this.tipo,
                id_usuario: this.id_usuario,
                deletion: this.deletion
            };
        }
    };

    async report() {
        const result = await this.repository.getWhere('transacoes', 'conta', '==', this.conta);
        return result;
    }
};

module.exports = Transacao;