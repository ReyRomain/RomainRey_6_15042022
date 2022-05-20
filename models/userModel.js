const mongoose = require('mongoose');
require('mongoose-type-email');

const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * Création du schéma de données pour user*
 */
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: [true, "Veuillez entrer votre email"],
        match: [/^[a-z0-9.]+@{1,}[a-z0-9]{2,}\.[a-z]{2,4}$/gi, "Veuillez entrer un email valide"]
    },
    password: {
        type: String,
        required: [true, "Veuillez entrer un mot de passe"]
    }
});

/**
 * L'adresse email unique
 */
userSchema.plugin(mongooseUniqueValidator);

/**
 * Purification des champs du model pour les enregistrer dans MongoDB
 */
userSchema.plugin(mongooseSanitizerPlugin);

module.exports = mongoose.model('User', userSchema);