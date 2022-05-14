/**
 * Récupération de jsonwebtoken
 */
const jsonwt = require('jsonwebtoken');

/**
 * Middleware d'authentification
 *
 * @param   {Object}    req   [req description]
 * @param   {Object}    res   [res description]
 * @param   {Function}  next  [next description]
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