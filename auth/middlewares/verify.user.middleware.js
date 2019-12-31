const UserModal = require ('../../users/models/users.model');
const crypto = require ('crypto');

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModal.findById (req.body.email).then (user => {
    if (!user[0]) {
      res.status (404).send ({});
    } else {
      const passwordFields = user[0].password.split ('$');
      const salt = passwordFields[0];
      const hash = crypto
        .createHmac ('sha512', salt)
        .update (req.body.password)
        .digest ('base64');

      if (hash === passwordFields[1]) {
        req.body = {
          userId: user[0]._id,
          email: user[0].email,
          permissionLevel: user[0].permissionLevel,
          provider: 'email',
          name: `${user[0].firstName} ${user[0].lastName}`,
        };
        return next ();
      } else {
        return res.status (400).send ({errors: ['Invalid e-mail or Password']});
      }
    }
  });
};
