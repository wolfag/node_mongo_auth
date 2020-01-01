const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthController = require('./controllers/auth.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = (app) => {
  /**
   * body:{
   *  email,
   *  password
   * }
   */
  app.post('/auth', [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthController.login,
  ]);

  /**
   * header:{Bearer}
   * body:{
   *  refreshToken
   * }
   */
  app.post('/auth/refresh', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthValidationMiddleware.verifyRefreshBodyField,
    AuthValidationMiddleware.validRefreshNeeded,
    AuthController.login,
  ]);
};
