const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dbConnectionUrl = "mongodb+srv://teste:senha@dbteste-rbbec.mongodb.net/test?retryWrites=true&w=majority";

function initialize(dbName, dbCollectionName, successCallback, failureCallback) {
    MongoClient.connect(dbConnectionUrl,{ useUnifiedTopology: true }, function (err, dbInstance) {
        if (err) {
            console.log("Conexão com o MongoDB: ERRO: ${err}");
            failureCallback(err);        // isso deve ser "capturado" pela função de chamada
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);

            console.log("Conexão com o MongoDB: OK");
            successCallback(dbCollection);
        }
    });
}

module.exports = { initialize };