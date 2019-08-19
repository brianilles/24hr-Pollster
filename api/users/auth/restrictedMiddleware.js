const jwt = require('jsonwebtoken');

const secrets = require('../auth/secret.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        //token is invalid
        res.status(401).json({ message: 'Invalid token.' });
      } else {
        req.decodedJwt = decodedToken;

        next();
      }
    });
  } else {
    res.status(401).json({ message: 'No token provided.' });
  }
};
