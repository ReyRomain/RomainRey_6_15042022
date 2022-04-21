//l'algorithme bcrypt pour hasher password
const bcrypt = require('bcrypt');

//récupération du schéma User de mongoose
const User = require('../models/user.js')

//utilisation de jsonwebtoken pour donner un token à l'User au moment de la connection
const jsonwt = require('jsonwebtoken');