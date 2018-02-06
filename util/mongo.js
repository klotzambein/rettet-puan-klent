const mongodb = require('mongodb');
const { Db } = mongodb;

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
}

/** @type {Db} */
var db = null;

/** @returns {Promise.<Db>} */
const initDb = function () {
    return new Promise(resolve => {
        if (mongoURL == null) throw "url null";
        if (mongodb == null) throw "mongodb not loaded";

        console.log("Connecting to mongodb...")
        mongodb.connect(mongoURL)
            .then((newDb) => {
                console.log('Connected to MongoDB at: %s', mongoURL);
                db = newDb
                resolve(db);
            }).catch((err) => {
                console.log('Error connected to MongoDB at: %s, Error: %s', mongoURL, err);
                throw err;
            });
    });
};

const getDb = function () {
    if (db)
        return db;

    initDb().catch(function (err) { throw err; });

    return null;
}

const test = function () {
    if (!db) return Promise.resolve(true);
    return db.collection('emails').count({});
}

exports = module.exports = {
    initDb: initDb,
    getDb: getDb
};