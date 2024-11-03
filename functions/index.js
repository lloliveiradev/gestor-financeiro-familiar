const functions = require("firebase-functions");
const auth = require("./middleware/auth");

const userRoutes = require('./routes/usuario');
const transactRoutes = require('./routes/transacao');
const transTypeRoutes = require('./routes/tipo-trans');
const categoryRoutes = require('./routes/categorias');
const {
    accountRoutes,
    report
} = require('./routes/contas');

exports.usuarios = functions.https.onRequest((req, res) => auth(req, res, userRoutes));

exports.transacoes = functions.https.onRequest((req, res) => auth(req, res, transactRoutes));

exports.tiposTransacoes = functions.https.onRequest((req, res) => auth(req, res, transTypeRoutes));

exports.categorias = functions.https.onRequest((req, res) => auth(req, res, categoryRoutes));

exports.contas = functions.https.onRequest((req, res) => auth(req, res, accountRoutes));

exports.balanco = functions.pubsub.schedule('every 2 minutes').onRun((context) => report(context));