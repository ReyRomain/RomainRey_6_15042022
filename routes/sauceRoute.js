//ce fichier contient les différentes fonctions de routes pour les sauces*

/**
 * utilisation de Express
 */
const express = require('express');
const { getAllSauces, getSauce } = require('../controllers/sauceCtrl');

/**
 * importation du middleware auth pour sécuriser les routes
 */
const auth = require("../middlewares/auth");

/**
 * importation du middleware multer pour la gestion des images
 */
const multer = require("../middlewares/multer-config");

/**
 * on utilise le router mis à disposition par Express
 */
const router = express.Router();

/**
 * renvoie un tableau de toutes les sauces de la base de données
 */
 router.get('/sauces', getAllSauces);

 /**
  * Renvoie la sauce avec l’_id fourni.
  */
 router.get('/sauces/:id', getSauce);




/**
 * exportation de router
 */
module.exports = router;