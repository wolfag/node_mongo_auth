const UserModal = require('../../users/models/users.model');
const crypto = require('crypto');
const lodash = require('lodash');

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModal.findByEmail(req.body.email).then((user) => {
    if (!user[0]) {
      res.status(404).send({ error: 'User not found' });
    } else {
      const passwordFields = user[0].password.split('$');
      const salt = passwordFields[0];
      const hash = crypto
        .createHmac('sha512', salt)
        .update(req.body.password)
        .digest('base64');

      if (hash === passwordFields[1]) {
        req.body = {
          userId: user[0]._id,
          email: user[0].email,
          permissionLevel: user[0].permissionLevel,
          provider: 'email',
          name: `${user[0].firstName} ${user[0].lastName}`,
        };
        return next();
      } else {
        return res.status(400).send({ errors: ['Invalid e-mail or Password'] });
      }
    }
  });
};

exports.hasAuthValidFields = (req, res, next) => {
  if (req.body) {
    const errors = [];
    const [email, password] = lodash.at(req, 'body.email', 'body.password');
    if (!email) {
      errors.push('Missing email field');
    }
    if (!password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  } else {
    return res
      .status(400)
      .send({ errors: 'Missing email and password fields' });
  }
};
