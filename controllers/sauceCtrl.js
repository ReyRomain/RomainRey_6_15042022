/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');



/**
 * création d'une sauce
 */
function createSauce (req, res, next) {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'La sauce a bien été ajoutée.'}))
      .catch(error => res.status(400).json({ error }));
}

/**
 * modification d'une sauce
 */
function modifySauce (req, res, next) {
    Sauce.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
}

/**
 * récupération du tableau des sauces
 */
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

/**
 * récupération d'une sauce précise
 */
function getSauce (req, res, next) {

    //on utilise findOne pour récupérer une sauce
    Sauce.findOne({_id: req.params.id})
    
    //si true on retourne l'id de la sauce
    .then(sauce => res.status(200).json(sauce))

    //sinon message d'erreur
    .catch(error => res.status(404).json({ error }));
}


module.exports = {
    createSauce,
    modifySauce,
    getAllSauces,
    getSauce
}