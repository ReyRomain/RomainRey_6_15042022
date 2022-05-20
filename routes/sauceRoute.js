const express = require('express');
const sauceCtrl =  require('../controllers/sauceCtrl');

/**
 * Middleware auth pour sécuriser les routes
 */
const auth = require("../middlewares/auth");

/**
 * Middleware multer pour la gestion des images
 */
const multer = require("../middlewares/multer-config");

const router = express.Router();

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.updateLikes)

module.exports = router;