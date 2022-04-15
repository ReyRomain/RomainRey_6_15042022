//const pour utiliser Express
const express = require('express');

//const pour utiliser Mongoose
const mongoose = require('mongoose');

const app = express();

/**
 * connexion à MongoDB
 */
mongoose.connect('mongodb+srv://RomainRey:Romain95340@clusterpiiquante.wqzfo.mongodb.net/piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/*
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});
*/

module.exports = app;



