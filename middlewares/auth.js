const jsonwt = require('jsonwebtoken');

/**
 * Middleware d'authentification
 *
 * @param   {Object}    req   récupère la requête d'authentification
 * @param   {Object}    res   la réponse
 * @param   {Function}  next  passe à la fonction suivante
 *
 * @return  {void}
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwt.verify(token, process.env.JWT_PASS);
        // @ts-ignore
        if (req.body.userId && req.body.userId !== decodedToken.userId) throw 'Invalid user ID';
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error
        });
    }
};