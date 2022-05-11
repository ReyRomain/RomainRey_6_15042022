/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

/**
 * permet de récupérer le module 'file system' de Node pour télécharger et modifier les images
 */
const fs = require('fs');


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
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
}

/**
 * supprime une sauce
 */
function deleteSauce (req, res, next) {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce à été supprimée'}))
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

function updateLikes(req, res, next){
    // { userId: String,
        // like: Number }

    const { userId,  like } = req.body;

    /**
     * récupération de l'id d'une sauce
     */
    const sauceId = req.params.id

    if (like === 1) {
        Sauce.updateOne(
            {_id: req.params.id},
            {
               $push: { usersLiked: userId },
               $inc:  { likes: like }
            }
        )
        .then(() => res.status(200).json({ message: "Like ajouté"}))
        .catch((error) => res.status(400).json({ error }));
    }

    if (like === -1) {
        Sauce.updateOne(
            {_id: req.params.id},
            {
                $push: { usersDisliked: userId },
                $inc:  { dislikes: like }
            }
        )
        .then(() => res.status(200).json({ message: "Dislike ajouté"}))
        .catch((error) => res.status(400).json({ error }));
    }

    /**
     * annuler un like ou un dislike
     */
    if (like === 0) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                /**
                 * annule un like
                 */
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $pull: { usersLiked: userId },
                            $inc:  { likes: -1 }
                        }
                    )
                    .then(() => res.status(200).json({ message: "Like retiré"}))
                    .catch((error) => res.status(400).json({ error }));
                }
                /**
                 * annule un dislike
                 */
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $pull: { usersDisliked: userId },
                            $inc:  { dislikes: -1 }
                        }
                    )
                    .then(() => res.status(200).json({ message: "Dislike retiré"}))
                    .catch((error) => res.status(400).json({ error }));
                }

            })
            .catch((error) => res.status(404).json({ error }))
    }
}


module.exports = {
    createSauce,
    deleteSauce,
    getAllSauces,
    getSauce,
    modifySauce,
    updateLikes
}