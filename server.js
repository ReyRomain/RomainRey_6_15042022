require("dotenv").config();
const http = require('http');
const app = require('./app');

/**
 * renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
 *
 * @returns {Boolean | Number | String}
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/**
 * ajout PORT de connection pour déclarer l'environnement, sinon on écoutera le PORT 3000
 *
 * @var {Number}
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * en cas d'erreur arrete le serveur
 *
 * @throw {Error}
 */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * création d'un serveur avec Express en utilisant app pour les requêtes et réponses
 */
const server = http.createServer(app);

/**
 * lance le serveur qui affichera sur quel port se connecter ou s'occupe des erreurs
 */
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le serveur écoute le port qui est définit dans la const port*
server.listen(port);