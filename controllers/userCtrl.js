//l'algorithme bcrypt pour hasher password
const bcrypt = require('bcrypt');

//récupération du schéma User de mongoose
const User = require('../models/userModel.js')

//utilisation de jsonwebtoken pour donner un token à l'User au moment de la connection
const jsonwt = require('jsonwebtoken');


function login(req,res, next){

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