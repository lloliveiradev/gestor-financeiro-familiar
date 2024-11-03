const UsuarioControl = require('../controller/usuario');

function userRoutes(req, res) {
    if (req.method == 'POST') {
        UsuarioControl.post(req, res);
    } else if (req.method == 'GET') {
        UsuarioControl.get(req, res);
    } else if (req.method == 'PUT') {
        UsuarioControl.put(req, res);
    } else if (req.method == 'DELETE') {
        UsuarioControl.delete(req, res);
    };
}

module.exports = userRoutes;