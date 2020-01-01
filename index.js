const config = require('./common/config/env.config');

const express = require('express');
const bodyParser = require('body-parser');

const AuthRouter = require('./auth/auth.routes');
const UserRouter = require('./users/routes.config');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  );
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());
AuthRouter.routesConfig(app);
UserRouter.routesConfig(app);

app.listen(config.port, () => {
  console.log('App listening at port %s', config.port);
});
