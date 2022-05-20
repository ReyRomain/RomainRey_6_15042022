/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {Object}   userCredentials
 * @property {Object}   body            récupère le corps de la requête
 * @property {String}   body.email      récupère l'user de la base de donnée qui correspond à l'adresse mail entrée
 * @property {String}   body.password   récupère le password hasher de l'user
*/

/**
 * L'algorithme bcrypt pour hasher password
 */
const bcrypt = require('bcrypt');

/**
 * Utilisation de jsonwebtoken pour donner un token à l'utilisateur au moment de la connexion
 */
const jwt = require('jsonwebtoken');

/**
 * Récupération du schéma User de mongoose
 */
const User = require('../models/userModel.js')

/**
 * Authentifie l'utilisateur 
 *
 * @param   {IncomingMessage & userCredentials}  req     la requête complétée pour la connexion
 * @param   {ServerResponse}                     res     la réponse
 * @param   {NextFunction}                       next    passe à la fonction suivante
 *
 * @return  {void}
 */
function login(req,res, next){

    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) { 
            return res.status(401).json({ error: 'User not found !' });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) { return res.status(401).json({ error: 'Invalid password !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token:  jwt.sign(
                        { userId: user._id },
                        process.env.JWT_PASS,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
    .catch(error => res.status(500).json({ error }));
}

/**
 * Création d'un utilisateur
 *
 * @param   {IncomingMessage & userCredentials}    req      la requête complétée pour l'inscription
 * @param   {ServerResponse}                       res      la réponse
 * @param   {NextFunction}                         next     passe à la fonction suivante
 *
 * @return  {Promise.<void>}
 */
async function signup(req, res, next){
    try {
        const {email, password} = req.body;
        if (!email || !password) throw "uncomplete credentials";
        if (await User.findOne({email})) throw "email already exists";
        const newUser = new User({email,password: bcrypt.hashSync(password, 10)});
        await newUser.save();
        res.status(201).json({ message: "user created" })
        
    } catch (error) {
        res.status(400).json({error});
    }
}

module.exports = {
    login,
    signup
}