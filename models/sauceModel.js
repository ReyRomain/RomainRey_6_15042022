/**
 * création d'un model de sauce* avec mongoose
 */
const mongoose = require('mongoose');

/**
 * vérification avec des plugins de validation
 */
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * création du schéma de données pour les sauces*
 */
 const sauceSchema = new mongoose.Schema({

    /**
     * l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
     */
    userId: {
        type: String,
        required: true
    },

    /**
     * nom de la sauce
     */
    name: {
        type: String,
        required: true
    },

    /**
     * fabricant de la sauce
     */
    manufacturer: {
        type: String,
        required: true
    },

    /**
     * description de la sauce
     */
    description: {
        type: String,
        required: true
    },

    /**
     * le principal ingrédient épicé de la sauce
     */
    mainPepper: {
        type: String,
        required: true
    },

    /**
     * l'URL de l'image de la sauce téléchargée par l'utilisateur
     */
    imageUrl: {
        type: String,
        required: true
    },

    /**
     * nombre entre 1 et 10 décrivant la sauce
     */
    heat: {
        type: Number,
        required: true
    },

    /**
     * nombre d'utilisateurs qui aiment la sauce
     */
    likes: {
        type: Number,
    },

    /**
     * nombre d'utilisateurs qui n'aiment pas la sauce
     */
    dislikes: {
        type: Number,
    },

    /**
     * tableau des identifiants des utilisateurs qui ont aimé (=liked) la sauce
     */
    usersLiked: {
        type: Array,
    },

    /**
     * tableau des identifiants des utilisateurs qui n'ont pas aimé (=disliked) la sauce
     */
    usersDisliked: {
        type: Array
    }
});

 /**
  * plugin pour purifier les champs du model afin de les enregistrer après dans MongoDB
  */
 sauceSchema.plugin(mongooseSanitizerPlugin);
 
 /**
  * exportation de sauceSchema afin d'utiliser Sauce
  */
 module.exports = mongoose.model('Sauce', sauceSchema);