//const pour utiliser Express
const express = require('express');

//plugin qui permet de donner accès au chemin de notre système de fichier
const path = require('path');

//const pour utiliser Mongoose
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoute");
const sauceRoute = require("./routes/sauceRoute");
const { default: helmet } = require('helmet');

const app = express();

//le PORT 3000 du backend et le PORT 4200 du frontend pourront communiquer entre eux afin d'éviter les erreurs CORS
if (process.env.MODE === "DEV") {
  app.use((req, res, next) => {

    //ce header permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    //ce header permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    
    //ce header permet d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    //ce header permet d'autoriser le serveur à fournir des scripts pour la page
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });
}
else app.use(helmet());

//express prend toutes les requêtes et met à disposition leur body* (bodyParser)
app.use(express.json());

//middleware qui permet de charger les fichiers qui sont dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));


/**
 * connexion à MongoDB
 */
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);

module.exports = app;