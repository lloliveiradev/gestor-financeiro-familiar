function auth(req, res, db, next) {
    if (req.headers.auth != 'TOKEN') {
        return res.status(403).send({
            "message": "Você não está autorizado a executar esta ação!"
        });
    }
    next(req, res, db);
};

module.exports = auth;