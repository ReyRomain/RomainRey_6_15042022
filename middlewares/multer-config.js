//importation du package multer
const multer = require('multer');

/**
 * dictionnaire pour générer l'extension du fichier
 *
 * @type {Object}
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

/**
 * un objet de configuration pour multer
 *
 * @type  {Object}
 */
const storage = multer.diskStorage({

    /**
     * explique à multer où enregistrer les fichiers
     *
     * @param   {Request}  req       [req description]
     * @param   {File}     file      [file description]
     * 
     * @callback
     */
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    /**
     * explique à multer quel nom de fichier utiliser
     *
     * @param   {Request}  req       [req description]
     * @param   {File}     file      [file description]
     * 
     * @callback
     */
    filename: (req, file, callback) => {

        /**
         * on utilise le nom d'origine du fichier et on remplace les espaces par underscore
         */
        const name = file.originalname.split(' ').join('_');

        /**
         * création de l'extension de fichier
         */
        const extension = MIME_TYPES[file.mimetype];
        //création du fileName entier
        callback(null, name + Date.now() + '.' + extension);
    }
});

//exportation du middleware multer
module.exports = multer({storage: storage}).single('image');