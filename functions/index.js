const auth = require("./middlewares/auth");
const functions = require("firebase-functions");
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require("firebase-admin/app");

//Repository
const cred = require('../firebase/cred.js');
const db = initializeApp(cred);
db.firestore = () => { return getFirestore(db) };

//Routes
const userRoutes = require('./routes/user.js');
const transRoutes = require('./routes/transaction.js');
const categoryRoutes = require('./routes/category.js');
const { routes: accountRoutes, report: accountReport } = require('./routes/account.js');

//Endpoints
exports.accounts = functions.https.onRequest((req, res) => auth(req, res, db, accountRoutes));
exports.categories = functions.https.onRequest((req, res) => auth(req, res, db, categoryRoutes));
exports.transactions = functions.https.onRequest((req, res) => auth(req, res, db, transRoutes));
exports.users = functions.https.onRequest((req, res) => auth(req, res, db, userRoutes));

//Schedules
//exports.accountingBalance = functions.pubsub.schedule('every 2 minutes').onRun((context) => accountReport(context));