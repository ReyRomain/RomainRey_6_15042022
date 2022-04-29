/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

async function getAllSauces (req, res, next) {

    //on utilise find pour récupérer le tableau des sauces dans la base de données
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        console.warn(error)
        res.status(400).json({ error })
    }
}

function getSauce (req, res, next) {

    //on utilise findOne pour récupérer une sauce
    Sauce.findOne({_id: req.params.id})
    
    //si true on retourne l'id de la sauce
    .then(sauce => res.status(200).json(sauce))

    //sinon message d'erreur
    .catch(error => res.status(404).json({ error }));
}


module.exports = {
   getAllSauces,
   getSauce
}