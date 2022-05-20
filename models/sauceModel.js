const mongoose = require('mongoose');
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * Création du schéma de données pour les sauces*
 */
 const sauceSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
    },
    dislikes: {
        type: Number,
    },
    usersLiked: {
        type: Array,
    },
    usersDisliked: {
        type: Array
    }
});

/**
 * Purification des champs du model pour les enregistrer dans MongoDB
 */
sauceSchema.plugin(mongooseSanitizerPlugin);
 
module.exports = mongoose.model('Sauce', sauceSchema);