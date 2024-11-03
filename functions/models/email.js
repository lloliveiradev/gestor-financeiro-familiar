const Repository = require('../repository/repository');

class Email {
    constructor({
        destinatario,
        assunto,
        corpo
    }) {
        this.destinatario = destinatario;
        this.assunto = assunto;
        this.corpo = corpo;
        this.repository = new Repository();
    }

    gerarEmail() {
        return {
            to: this.destinatario,
            message: {
                subject: this.assunto,
                html: this.corpo
            }
        };
    };

    async enviarEmail() {
        await this.repository.add('report_email', this.gerarEmail());
        return true;
    };
};

module.exports = Email;