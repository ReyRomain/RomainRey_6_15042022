/**
 * récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

/**
 * permet de récupérer le module 'file system' de Node pour télécharger et modifier les images
 */
const fs = require('fs');
const Module = require('module');

/**
 * Création d'une sauce
 *
 * @param   {Object}    req   [req description]
 * @param   {Object}    req.body
 * @param   {String}    req.body.sauce
 * @param   {Module}    req.protocol
 * @param   {Function}  req.get
 * @param   {Object}    req.file
 * @param   {File}      req.file.filename
 * 
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {Object}        [return description]
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
 * @param   {Object}    req   [req description]
 * @param   {Object}    req.file
 * @param   {Object}    req.body
 * @param   {String}    req.body.sauce
 * @param   {}          req.protocol
 * @param   {}          req.get
 * @param   {}          req.params
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {Object}        [return description]
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
 * @param   {Object}    req   [req description]
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {void}        [return description]
 */
function deleteSauce(req, res, next) {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce à été supprimée' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Récupération du tableau des sauces
 *
 * @param   {Object}     req   [req description]
 * @param   {Object}     res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {Promise}        [return description]
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
 * @param   {Object}    req   [req description]
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {Promise}        [return description]
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
 * @param   {Object}    req   [req description]
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
 *
 * @return  {Promise}        [return description]
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