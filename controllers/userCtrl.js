//l'algorithme bcrypt pour hasher password
const bcrypt = require('bcrypt');

//récupération du schéma User de mongoose
const User = require('../models/userModel.js')

//utilisation de jsonwebtoken pour donner un token à l'User au moment de la connection
const jsonwt = require('jsonwebtoken');


function login(req,res, next){

    //on récupère l'user de la base de donnée qui correspond à l'adresse mail entrée
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
                    token: 'TOKEN'
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
    .catch(error => res.status(500).json({ error }));
}

async function signup(req,res, next){
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