const mongoose = require ('mongoose');
let count = 0;

const options = {
  autoIndex: false,
  reconnectTries: 30,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
};

const connectWithRetry = () => {
  mongoose
    .connect ('mongodb://mongo:27017/node_restapi', options)
    .then (() => {
      console.log ('MongoDB is connected');
    })
    .catch (err => {
      console.log (
        'MongoDB connection unsuccessful, retry after 5 seconds.',
        ++count
      );
      setTimeout (connectWithRetry, 5000);
    });
};

connectWithRetry ();

exports.mongoose = mongoose;
