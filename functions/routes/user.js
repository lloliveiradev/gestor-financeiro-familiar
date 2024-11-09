const controller = require('../controllers/user');

function routes(req, res, db) {
    if (req.method == 'POST') {
        controller.post(req, res, db);
    } else if (req.method == 'GET') {
        controller.get(req, res, db);
    } else if (req.method == 'PUT') {
        controller.put(req, res, db);
    } else if (req.method == 'DELETE') {
        controller.delete(req, res, db);
    };
};

module.exports = routes;