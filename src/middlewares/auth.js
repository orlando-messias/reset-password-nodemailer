const jwt = require('jsonwebtoken');
const { tokenConfig } = require('../config/tokenConfig');

// create a jwt token
const createToken = (payload) => {
  const token = jwt.sign({ payload }, tokenConfig.secret, tokenConfig.expires);
  return token;
};

// middleware to validate token
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  // check if header authorization contains a string
  const verifyHeader = authHeader.split(' ');

  if (!verifyHeader.length === 2) return res.status(401).send({ error: 'Token error' });

  const [scheme, token] = verifyHeader;

  // check if first index contains string 'Bearer'
  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformed' });

  jwt.verify(token, tokenConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid Token' });
    req.userId = decoded.payload._id;
    return next();
  });
};

module.exports = {
  createToken,
  validateToken
};