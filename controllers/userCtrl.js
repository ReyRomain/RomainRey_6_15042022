/**
 * l'algorithme bcrypt pour hasher password
 */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

/**
 * récupération du schéma User de mongoose
 */
const User = require('../models/userModel.js')

/**
 * utilisation de jsonwebtoken pour donner un token à l'User au moment de la connection
 */
const jsonwt = require('jsonwebtoken');

/**
 * Authentifie l'utilisateur 
 *
 * @param   {Object}    req   
 * @param   {Object}    req.body
 * @param   {String}    req.body.email      récupère l'user de la base de donné qui correspond à l'adresse mail entrée
 * @param   {String}    req.body.password   
 * @param   {Object}    res
 * @param   {Function}  next
 *
 * @return  {void}
 */
function login(req,res, next){

    User.findOne({ email: req.body.email })

    //si on ne reçoit pas de user, on envoie une erreur
    .then(user => {
        if (!user) { 
            return res.status(401).json({ error: 'User not found !' });
        }

        //on compare le password entré avec le hash qui est gardé dans la base de donnée
        bcrypt.compare(req.body.password, user.password)

            //si la comparaison n'est pas bonne, on envoie une erreur
            .then(valid => {
                if (!valid) { return res.status(401).json({ error: 'Invalid password !' });
                }
                //sinon on renvoie son userId et un token
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
 * @param   {Object}    req   
 * @param   {Object}    req.body
 * @param   {String}    req.body.email
 * @param   {String}    req.body.password
 * @param   {Object}    res
 * @param   {Function}  next
 *
 * @return  {Promise}
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