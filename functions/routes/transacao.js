const TransacaoControl = require('../controller/transacao');

function transactRoutes(req, res) {
    if (req.method == 'POST') {
        TransacaoControl.post(req, res);
    } else if (req.method == 'GET') {
        TransacaoControl.get(req, res);
    } else if (req.method == 'PUT') {
        TransacaoControl.put(req, res);
    } else if (req.method == 'DELETE') {
        TransacaoControl.delete(req, res);
    };
}

module.exports = transactRoutes;