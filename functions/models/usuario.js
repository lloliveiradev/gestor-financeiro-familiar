const Repository = require('../repository/repository');
const CustomError = require('../utils/customError');

class Usuario {
    constructor({
        id,
        nome,
        email,
        senha,
        data_nasc,
        nivel_acesso,
        foto
    }) {
        this.id = id ? id : null;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.data_nasc = data_nasc;
        this.nivel_acesso = nivel_acesso;
        this.foto = foto;
        this.deletion = false;
        this.repository = new Repository();
        this.action = id ? false : true;
        this.contract = {
            nome: {
                required: true,
                type: 'string',
                error: "O atributo 'nome' é requerido e do tipo String"
            },
            email: {
                required: true,
                type: 'string',
                error: "O atributo 'email' é requerido e do tipo String"
            },
            senha: {
                required: true,
                type: 'string',
                error: "O atributo 'senha' é requerido e do tipo String"
            },
            data_nasc: {
                required: true,
                type: 'string',
                error: "O atributo 'data_nasc' é requerido e do tipo String"
            },
            nivel_acesso: {
                required: true,
                type: 'number',
                error: "O atributo 'nivel_acesso' é requerido e do tipo Number",
            },
            foto: {
                required: true,
                type: 'string',
                error: "O atributo 'foto' é requerido e do tipo String"
            }
        }
    };

    async create() {
        try {
            if (!await this.validarEmail()) {
                throw new CustomError({
                    message: 'O email informado já está sendo utilizado por outro usuário!',
                    status: 400
                });
            };
        } catch (error) {
            throw error;
        };

        try {
            await this.repository.add('usuarios', this.get());
            return 'Usuário cadastrado com sucesso!';
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        };
    };

    async read() {
        const result = await this.repository.get('usuarios', this.id);
        const usuario = result.data();
        usuario.id = result.id;
        return usuario;
    };

    async readAll() {
        const result = await this.repository.get('usuarios');
        const array = [];
        result.forEach((usuario) => {
            let obj = usuario.data();
            obj.id = usuario.id;
            array.push(obj);
        });

        return array;
    };

    async update() {
        try {
            if (!await this.validarEmail(this.id)) {
                throw new CustomError({
                    message: 'O email informado já está sendo utilizado por outro usuário!',
                    status: 400
                });
            };
        } catch (error) {
            throw error;
        };

        try {
            await this.repository.set('usuarios', this.get());
            return "Usuário alterado com sucesso!";
        } catch (error) {
            throw new CustomError({
                message: error.message,
                status: 400
            });
        }
    };

    async delete() {
        await this.repository.delete('usuarios', this.id);
        return "Usuário deletado com sucesso!";
    };

    get() {
        if (!this.action) {
            return {
                id: this.id,
                nome: this.nome,
                email: this.email,
                senha: this.senha,
                foto: this.foto,
            };
        } else {
            return {
                id: this.id,
                nome: this.nome,
                email: this.email,
                senha: this.senha,
                data_nasc: this.data_nasc,
                nivel_acesso: this.nivel_acesso,
                foto: this.foto,
                deletion: this.deletion
            };
        }
    };

    async validarEmail(id) {
        const validarEmail = await this.repository.getWhere('usuarios', 'email', '==', this.email);

        if (validarEmail.docs && validarEmail.docs.length > 0) {
            if (!id) {
                return false;
            } else {
                if (validarEmail.docs[0].id == id) {
                    return true;
                } else {
                    return false;
                };
            };
        };

        return true;
    };
};

module.exports = Usuario;