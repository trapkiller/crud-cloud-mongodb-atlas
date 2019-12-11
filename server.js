const express = require("express");
const server = express();

const body_parser = require("body-parser");

server.use(body_parser.json());

const port = 4000;

const db = require("./db");
const dbName = "banco";
const collectionName = "colec";

db.initialize(dbName, collectionName, function (dbCollection) { // Callback deu certo
   // get de todos os itens
   dbCollection.find().toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
   });

   // CRUD
   server.post("/items", (request, response) => {
      const item = request.body;
      dbCollection.insertOne(item, (error, result) => {
         if (error) throw error;
         // return tudo atualizado
         dbCollection.find().toArray((_error, _result) => { 
            if (_error) throw _error;
            response.json(_result);
         });
      });
   });

   server.get("/items/:id", (request, response) => {
      const itemId = request.params.id;

      dbCollection.findOne({ id: itemId }, (error, result) => {
         if (error) throw error;
         // return item
         response.json(result);
      });
   });

   server.get("/items", (request, response) => {
      // return lista upada
      dbCollection.find().toArray((error, result) => {
         if (error) throw error;
         response.json(result);
      });
   });

   server.put("/items/:id", (request, response) => {
      const itemId = request.params.id;
      const item = request.body;
      console.log("Editando item: ", itemId, " | ", item);

      dbCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
         if (error) throw error;
         // envia de volta toda a lista atualizada, para garantir que os dados do frontend estejam atualizados
         dbCollection.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            response.json(_result);
         });
      });
   });

   server.delete("/items/:id", (request, response) => {
      const itemId = request.params.id;
      console.log("Deletando item com id: ", itemId);

      dbCollection.deleteOne({ id: itemId }, function (error, result) {
         if (error) throw error;
         // envia de volta toda a lista atualizada após solicitação bem-sucedida
         dbCollection.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            response.json(_result);
         });
      });
   });

}, function (err) { // falha de callback
   throw (err);
});

server.listen(port, () => {
   console.log(`Server executando na porta ${port}`);
});