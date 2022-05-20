/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} sauceRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.sauce      récupère la sauce dans le corps de la requête
 * 
 * @typedef  {Object} likeHandler
 * @property {Object} body            récupère le corps de la requête
 * @property {Number} body.userId     récupère l'userId
 * @property {Number} body.like       récupère le nombre de like
 * @property {Object} params          récupère les params
 * @property {Number} params.id       récupère l'id des params selectionné
*/

/**
 * Récupération du schéma Sauce de mongoose
 */
const Sauce = require('../models/sauceModel.js');

/**
 * Permet de récupérer 'file system' pour télécharger et modifier les images
 */
const fs = require('fs');

/**
 * Création d'une sauce
 *
 * @param   {IncomingMessage & multerImage & sauceRequest}  req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 * 
 * @return  {void}                             
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
 * @param   {IncomingMessage & multerImage & sauceRequest}  req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 *
 * @return  {void}                                                 envoie une réponse
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
 * @param   {IncomingMessage}   req    la requête complétée
 * @param   {ServerResponse}    res    la réponse
 * @param   {NextFunction}      next   passe à la fonction suivante
 *
 * @return  {void}                     envoie une réponse
 */
function deleteSauce(req, res, next) {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce à été supprimée' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Récupération du tableau des sauces
 *
 * @param   {IncomingMessage}   req   la requête complétée
 * @param   {ServerResponse}    res   la réponse
 * @param   {NextFunction}      next  passe à la fonction suivante
 *
 * @return  {Promise}                 retourne la liste des sauces & envoie une réponse
 */
async function getAllSauces(req, res, next) {

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
 * @param   {IncomingMessage}   req    la requête complétée
 * @param   {ServerResponse}    res    la réponse
 * @param   {NextFunction}      next   passe à la fonction suivante
 *
 * @return  {Promise}                  retourne la sauce selectionnée & envoie une réponse
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
 * Ajoute ou supprime un like et un dislike
 *
 * @param   {IncomingMessage & likeHandler}   req     la requête complétée
 * @param   {ServerResponse}                  res     la réponse
 * @param   {NextFunction}                    next    passe à la fonction suivante
 *
 * @return  {Promise}                                 retourne la modification des likes à l'affichage & envoie une réponse
 */
async function updateLikes(req, res, next) {
    const { userId, like } = req.body;
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
            if (sauce.usersLiked.includes(userId)) {
                todo = {
                    $pull: { usersLiked: userId },
                    $inc: { likes: -1 }
                };
                msg = "Like retiré";
            }
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