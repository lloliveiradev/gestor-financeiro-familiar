const ContaControl = require('../controller/contas');

function accountRoutes(req, res) {
    if (req.method == 'POST') {
        ContaControl.post(req, res);
    } else if (req.method == 'GET') {
        ContaControl.get(req, res);
    } else if (req.method == 'PUT') {
        ContaControl.put(req, res);
    } else if (req.method == 'DELETE') {
        ContaControl.delete(req, res);
    };
};

function report() {
    ContaControl.report();
};

module.exports = {
    accountRoutes,
    report
};