const CategoriaControl = require('../controller/categorias');

function categoryRoutes(req, res) {
    if (req.method == 'POST') {
        CategoriaControl.post(req, res);
    } else if (req.method == 'GET') {
        CategoriaControl.get(req, res);
    } else if (req.method == 'PUT') {
        CategoriaControl.put(req, res);
    } else if (req.method == 'DELETE') {
        CategoriaControl.delete(req, res);
    };
}

module.exports = categoryRoutes;