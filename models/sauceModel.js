//création d'un model d'user* avec mongoose
const mongoose = require('mongoose');

//vérification avec des plugins de validation
const mongooseSanitizerPlugin = require('mongoose-sanitizer-plugin');

/**
 * création du schéma de données pour les sauces*
 */
 const sauceSchema = mongoose.Schema({

});

 /**
  * plugin pour purifier les champs du model afin de les enregistrer après dans MongoDB
  */
 sauceSchema.plugin(mongooseSanitizerPlugin);
 
 /**
  * exportation de sauceSchema afin d'utiliser Sauce
  */
 module.exports = mongoose.model('Sauce', sauceSchema);