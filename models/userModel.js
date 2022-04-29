//création d'un model d'user* avec mongoose
const mongoose = require('mongoose');
require('mongoose-type-email');

//vérification avec des plugins de validation
const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * création du schéma de données pour user*
 */
const userSchema = new mongoose.Schema({

    /**
     * l'adresse email unique
     */
    email: {
        type: String,
        unique: true,
        required: [true, "Veuillez entrer votre email"],
        match: [/^[a-z0-9.]+@{1,}[a-z0-9]{2,}\.[a-z]{2,4}$/gi, "Veuillez entrer un email valide"]
    },
    
    /**
     * l'enregistrement de password par l'utilisateur
     */
    password: {
        type: String,
        required: [true, "Veuillez entrer un mot de passe"]
    }
});

/**
 * plugin pour garantir une adresse email unique
 */
userSchema.plugin(mongooseUniqueValidator);

/**
 * plugin pour purifier les champs du model afin de les enregistrer après dans MongoDB
 */
userSchema.plugin(mongooseSanitizerPlugin);

/**
 * exportation de userSchema afin d'utiliser User
 */
module.exports = mongoose.model('User', userSchema);