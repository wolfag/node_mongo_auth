const config = require('../../common/config/env.config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.login = (req, res) => {
  try {
    const refreshId = `${req.body.userId}${config.jwt_secret}`;
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto
      .createHmac('sha512', salt)
      .update(refreshId)
      .digest('base64');

    req.body.refreshKey = salt;

    const accessToken = jwt.sign(req.body, config.jwt_secret);
    const refreshToken = new Buffer.from(hash).toString('base64');

    res.status(201).send({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).send({ errors: error });
  }
};

exports.refreshToken = (req, res) => {
  try {
    req.body = req.jwt;
    const token = jwt.sign(req.body, config.jwt_secret);
    res.status(201).send({ id: token });
  } catch (error) {
    res.status(500).send({ errors: error });
  }
};
