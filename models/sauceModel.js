//création d'un model d'user* avec mongoose
const mongoose = require('mongoose');

//vérification avec des plugins de validation
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * création du schéma de données pour les sauces*
 */
 const sauceSchema = mongoose.Schema({

    /**
     * l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
     */
    userId: {
        type: String,
        require: true
    },

    /**
     * nom de la sauce
     */
    name: {

    },

    /**
     * fabricant de la sauce
     */
    manufacturer: {

    },

    /**
     * description de la sauce
     */
    description: {

    },

    /**
     * le principal ingrédient épicé de la sauce
     */
    mainPepper: {

    },

    /**
     * l'URL de l'image de la sauce téléchargée par l'utilisateur
     */
    imageUrl: {

    },

    /**
     * nombre entre 1 et 10 décrivant la sauce
     */
    heat: {

    },

    /**
     * nombre d'utilisateurs qui aiment la sauce
     */
    likes: {

    },

    /**
     * nombre d'utilisateurs qui n'aiment pas la sauce
     */
    dislikes: {

    },

    /**
     * tableau des identifiants des utilisateurs qui ont aimé la sauce
     */
    usersLiked: {

    }

    /**
     * tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
     */
    usersDisliked: {

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