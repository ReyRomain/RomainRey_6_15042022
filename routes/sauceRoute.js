//ce fichier contient les différentes fonctions de routes pour les sauces*

/**
 * utilisation de Express
 */
const express = require('express')

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
 * exportation de router
 */
module.exports = router;