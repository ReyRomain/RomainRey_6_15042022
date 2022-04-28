/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

function getAllSauces (req, res, next) {

   //on utilise find pour récupérer le tableau des sauces dans la base de données
   Sauce.find()

    //si true on retourne le tableau
    .then(sauces => res.status(200).json())

    //sinon message d'erreur
    .catch(error => res.status(400).json({ error }));
}

module.exports = {
   getAllSauces
}