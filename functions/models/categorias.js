const Repository = require('../repository/repository');
const CustomError = require('../utils/customError');

class Categoria {
    constructor({
        id,
        nome,
        cor,
        tipo
    }) {
        this.id = id ? id : null;
        this.nome = nome;
        this.cor = cor;
        this.tipo = tipo;
        this.deletion = false;
        this.repository = new Repository();
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
            },
            tipo: {
                required: true,
                type: 'string',
                error: "O atributo 'tipo' é requerido e do tipo String"
            }
        }
    }

    async create() {
        try {
            this.repository.add('categorias', this.get());
            return 'Categoria cadastrada com sucesso!';
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        const result = await this.repository.get('categorias', this.id);
        const categoria = result.data();
        categoria.id = result.id;
        return categoria;
    };

    async readAll() {
        const result = await this.repository.get('categorias');
        const array = [];
        result.forEach(categoria => {
            let obj = categoria.data();
            obj.id = categoria.id;
            array.push(obj);
        });

        return array;
    };

    async update() {
        try {
            await this.repository.set('categorias', this.get());
            return "Categoria alterada com sucesso!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        }
    };

    async delete() {
        await this.repository.delete('categorias', this.id);
        return "Categoria deletada com sucesso";
    };

    get() {
        if (!this.action) {
            return {
                id: this.id,
                nome: this.nome,
                cor: this.cor,
                tipo: this.tipo
            }
        } else {
            return {
                id: this.id,
                nome: this.nome,
                cor: this.cor,
                tipo: this.tipo,
                deletion: this.deletion
            };
        }
    };
};

module.exports = Categoria;