const TipoTransacaoControl = require('../controller/tipo-trans');

function tipoTransRoutes(req, res) {
    if (req.method == 'POST') {
        TipoTransacaoControl.post(req, res);
    } else if (req.method == 'GET') {
        TipoTransacaoControl.get(req, res);
    } else if (req.method == 'PUT') {
        TipoTransacaoControl.put(req, res);
    } else if (req.method == 'DELETE') {
        TipoTransacaoControl.delete(req, res);
    };
}

module.exports = tipoTransRoutes;