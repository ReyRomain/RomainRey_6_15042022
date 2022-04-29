//importation du package multer
const multer = require('multer');
const maxSize = 1 * 1000 * 1000; //1Mo

/**
 * dictionnaire pour générer l'extension du fichier
 *
 * @type {Object}
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
* explique à multer où enregistrer les fichiers
*
* @param   {Request}  req       [req description]
* @param   {File}     file      [file description]
* 
* @callback
*/
const destination = (req, file, callback) => {
   callback(null, 'images');
}

 /**
     * explique à multer quel nom de fichier utiliser
     *
     * @param   {Request}  req       [req description]
     * @param   {File}     file      [file description]
     * 
     * @callback
     */
const  filename = (req, file, callback) => {

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
};

//exportation du middleware multer
module.exports = multer({
    storage: multer.diskStorage({ destination, filename }),  
    limits: { fileSize: maxSize }
}).single('image');