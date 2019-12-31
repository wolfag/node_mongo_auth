const jwtSecret = require ('../../common/config/env.config').jwt_secret;
const jwt = require ('jsonwebtoken');
const crypto = require ('crypto');
const uuid = require ('node-uuid');

exports.login = (req, res) => {
  try {
  } catch (err) {
    res.status (500).send ({errors: err});
  }
};
