//ce fichier contient les différentes fonctions de routes pour les user*

//utilisation de Express
const express = require('express');

//on utlise le router mis à disposition par Express
const router = express.Router();

//création d'un user
router.post('/api/auth/signup');

//connecte l'user
router.post('/api/auth/login');

//exportation de router
module.exports = router;