//récupération de jsonwebtoken
const jsonwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (! req.body.userId) throw 'Missing authentification';
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwt.verify(token, 'RANDOM_TOKEN_SECRET');
        if (req.body.userId !== decodedToken.userId) throw 'Invalid user ID';
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error,
        });
    }
};