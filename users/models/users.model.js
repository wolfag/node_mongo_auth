const mongoose = require ('../../common/services/mongoose.service').mongoose;

const {Schema} = mongoose;

const userSchema = new Schema ({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  permissionLevel: Number,
});

userSchema.virtual ('id').get (() => this._id.toHexString ());
userSchema.set ('toJSON', {virtuals: true});

userSchema.findById = cb => {
  return this.model ('Users').find ({id: this.id}, cb);
};

const User = mongoose.model ('Users', userSchema);

exports.createUser = data => {
  const user = new User (data);
  return user.save ();
};

exports.findById = id => {
  return User.findById (id).then (result => {
    result = result.toJSON ();
    delete result._id;
    delete result.__v;
    return result;
  });
};

exports.findByEmail = email => User.find ({email: email});

exports.list = (perPage, page) => {
  return new Promise ((resolve, reject) => {
    User.find ().limit (perPage).skip (perPage * page).exec ((err, users) => {
      if (err) {
        reject (err);
      } else {
        resolve (users);
      }
    });
  });
};

exports.pathUser = (id, data) => {
  return new Promise ((resolve, reject) => {
    User.findById (id, (err, user) => {
      if (err) {
        reject (err);
      } else {
        for (let i in data) {
          user[i] = data[i];
        }
        user.save ((errSave, resultSave) => {
          if (errSave) {
            return reject (errSave);
          } else {
            resolve (resultSave);
          }
        });
      }
    });
  });
};

exports.removeById = id => {
  return new Promise ((resolve, reject) => {
    User.remove ({_id: id}, err => {
      if (err) {
        reject (err);
      } else {
        resolve (err);
      }
    });
  });
};
