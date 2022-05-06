//const pour utiliser Express
const express = require('express');

//plugin qui permet de donner accès au chemin de notre système de fichier
const path = require('path');

// const req = require('express/lib/request');
// const res = require('express/lib/response');

//const pour utiliser Mongoose
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoute");
const sauceRoute = require("./routes/sauceRoute");
const { default: helmet } = require('helmet');

const app = express();


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


//le PORT 3000 du backend et le PORT 4200 du frontend pourront communiquer entre eux afin d'éviter les erreurs CORS



//intercepte les requêtes POST
// app.post('/api/stuff', (req, res, next) => {

//   //le contenu du corps de la requête
//   console.log(req.body);
  
//   //création de ressource avec le code 201
//   res.status(201).json({
//     message: 'Objet créé !'
//   });
// });

// app.get('/api/stuff', (req, res, next) => {
//   const stuff = [
//     {
//       _id: 'oeihfzeoi',
//       title: 'Mon premier objet',
//       description: 'Les infos de mon premier objet',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       price: 4900,
//       userId: 'qsomihvqios',
//     },
//     {
//       _id: 'oeihfzeomoihi',
//       title: 'Mon deuxième objet',
//       description: 'Les infos de mon deuxième objet',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       price: 2900,
//       userId: 'qsomihvqios',
//     },
//   ];
//   res.status(200).json(stuff);
// });

/**
 * connexion à MongoDB
 */
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// app.use((req, res, next) => {
//   console.log('Requête reçue !');
//   next();
// });

// app.use((req, res, next) => {
//   res.status(201);
//   next();
// });

// app.use((req, res, next) => {
//   res.json({ message: 'Votre requête a bien été reçue !' });
//   next();
// });

// app.use((req, res, next) => {
//   console.log('Réponse envoyée avec succès !');
// });

app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);

module.exports = app;