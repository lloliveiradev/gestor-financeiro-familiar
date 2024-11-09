const Repository = require('../repository/repository');

class Email {
    constructor(data, db) {
        this.data = this.model(data);
        this.db = new Repository(db, 'email_log');
        this.reqUser = reqUser || { name: 'WebService', value: '0097' };
    };

    setConfig() {
        return {
            to: this.data.recipient,
            message: {
                subject: this.data.subject,
                html: this.data.body
            },
        };
    };

    async send() {
        await this.db.add(this.setConfig());
        return true;
    };

    model(data) {
        const obj = {
            body: null, // string - html
            creation: null, // object { date, user }
            recipient: null, // string - email
            subject: null, // string
        };
        const formatted = JSONObjectMerge.default(obj, data);
        return formatted;
    };
};

module.exports = Email;