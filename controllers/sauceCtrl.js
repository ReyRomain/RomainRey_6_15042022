/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

/**
 * permet de récupérer le module 'file system' de Node pour télécharger et modifier les images
 */
const fs = require('fs');


/**
 * Création d'une sauce
 *
 * @param   {Object}    req                 récupère la requête
 * @param   {Object}    req.body            récupère le corps de la requête
 * @param   {String}    req.body.sauce      récupère la sauce dans le corps de la requête
 * @param   {Function}  req.protocol        applique le protocol pour récupérer la sauce
 * @param   {Function}  req.get             récupère l'user
 * @param   {Object}    req.file            récupère le fichier de l'image
 * @param   {File}      req.file.filename   récupère le nom du fichier
 * @param   {Object}    res                 envoie la réponse
 * @param   {Function}  next                passe à la fonction suivante
 * 
 * @return  {Object}
 */
function createSauce(req, res, next) {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a bien été ajoutée.' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Modification d'une sauce
 *
 * @param   {Object}    req                 récupère la requête
 * @param   {Object}    req.params          récupère les params
 * @param   {String}    req.params.id       récupère l'id des params selectionné
 * @param   {Object}    req.file            récupère le fichier de l'image
 * @param   {File}      req.file.filename   récupère le nom du fichier
 * @param   {Object}    req.body            récupère le corps de la requête
 * @param   {String}    req.body.sauce      récupère la sauce dans le corps de la requête
 * @param   {Function}  req.protocol        applique le protocol pour récupérer la sauce
 * @param   {Function}  req.get             récupère l'user
 * @param   {Object}    res                 envoie la réponse
 * @param   {Function}  next                passe à la fonction suivante
 *
 * @return  {Object}
 */
function modifySauce(req, res, next) {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Supprime une sauce
 *
 * @param   {Object}    req             récupère la requête
 * @param   {Object}    req.params      récupère les params
 * @param   {String}    req.params.id   récupère l'id des params selectionné
 * @param   {Object}    res             envoie la réponse
 * @param   {Function}  next            passe à la fonction suivante
 *
 * @return  {void}
 */
function deleteSauce(req, res, next) {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce à été supprimée' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Récupération du tableau des sauces
 *
 * @param   {Object}     req   récupère la requête
 * @param   {Object}     res   envoie la réponse
 * @param   {Function}   next  passe à la fonction suivante
 *
 * @return  {Promise}          retourne la liste des sauces
 */
async function getAllSauces(req, res, next) {

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
 * Récupération d'une sauce précise
 *
 * @param   {Object}    req             récupère la requête
 * @param   {Object}    req.params      récupère les params
 * @param   {String}    req.params.id   récupère l'id des params selectionné
 * @param   {Object}    res             envoie la réponse
 * @param   {Function}  next            passe à la fonction suivante
 *
 * @return  {Promise}                   retourne la sauce selectionné
 */
async function getSauce (req, res, next) {

    try {
        const oneSauce = await Sauce.findOne({ _id: req.params.id });
        res.status(200).json(oneSauce);
    } catch (error) {
        console.warn(error)
        res.status(404).json({ error })
    }
}

/**
 * récupération d'une sauce précise
 */
/*
function getSauce(req, res, next) {

    //on utilise findOne pour récupérer une sauce
    Sauce.findOne({ _id: req.params.id })

        //si true on retourne l'id de la sauce
        .then(sauce => res.status(200).json(sauce))

        //sinon message d'erreur
        .catch(error => res.status(404).json({ error }));
}
*/

/**
 * Ajoute ou supprime un like et un dislike
 *
 * @param   {Object}    req             récupère la requête
 * @param   {Object}    req.body        récupère le corps de la requête
 * @param   {Object}    req.params      récupère les params
 * @param   {String}    req.params.id   récupère l'id des params selectionné
 * @param   {Object}    res             envoie la réponse
 * @param   {Function}  next            passe à la fonction suivante
 *
 * @return  {Promise}                   retourne la modification des likes à l'affichage
 */
async function updateLikes(req, res, next) {
    const { userId, like } = req.body;

    /**
     * récupération de l'id d'une sauce
     */
    const sauceId = req.params.id
    let msg, todo;
    try {
        if (like === 1) {
            todo = {
                $push: { usersLiked: userId },
                $inc: { likes: 1 }
            };
            msg = "Like ajouté";
        }
        if (like === -1) {
            todo = {
                $push: { usersDisliked: userId },
                $inc: { dislikes: 1 }
            };
            msg = "Dislike ajouté";
        }
        if (like === 0) {
            const sauce = await Sauce.findOne({ _id: sauceId })

            /**
             * annule un like
             */
            if (sauce.usersLiked.includes(userId)) {
                todo = {
                    $pull: { usersLiked: userId },
                    $inc: { likes: -1 }
                };
                msg = "Like retiré";
            }

            /**
             * annule un dislike
             */
            if (sauce.usersDisliked.includes(userId)) {
                todo = {
                    $pull: { usersDisliked: userId },
                    $inc: { dislikes: -1 }
                };
                msg = "Dislike retiré";
            }
        }
        await Sauce.updateOne(
            { _id: req.params.id },
            todo
        );
        res.status(200).json({ message: msg });
    } catch (error) {
        res.status(400).json({ error })
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