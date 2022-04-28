//ce fichier contient les différentes fonctions de routes pour les user*

/**
 * utilisation de Express
 */
const express = require('express')

/**
 * importation du controller
 */
const {login, signup} = require("../controllers/userCtrl");

/**
 * importation du middleware auth pour sécuriser les routes
 */
const auth = require("../middlewares/auth");

/**
 * on utilise le router mis à disposition par Express
 */
const router = express.Router();

/**
 * création d'un user
 */
router.post('/signup', signup);

/**
 * connecte l'user
 */
router.post('/login', login);

/**
 * exportation de router
 */
module.exports = router;