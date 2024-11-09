const controller = require('../controllers/account');

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

function report() {
    controller.report();
};

module.exports = {
    routes,
    report
};