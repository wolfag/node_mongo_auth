const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/env.config').jwt_secret;
const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      const authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(authorization[1], jwtSecret);
        return next();
      }
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(401).send({ error: 'Missing authorization' });
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  const buffer = new Buffer.from(req.body.refreshToken, 'base64');
  const refreshId = `${req.jwt.userId}${jwtSecret}`;
  const refreshToken = buffer.toString();
  const hash = crypto
    .createHmac('sha512', req.jwt.refreshKey)
    .update(refreshId)
    .digest('base64');

  if (hash === refreshToken) {
    req.body = req.jwt;
    return next();
  } else {
    return res.status(400).send({ error: 'Invalid refresh token' });
  }
};

exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body && req.body.refreshToken) {
    return next();
  } else {
    return res.status(400).send({ error: 'Need to pass refreshToken field' });
  }
};
