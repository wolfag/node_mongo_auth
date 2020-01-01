const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

const config = require('../common/config/env.config');

const { ADMIN, PAID_USER: PAID, NORMAL_USER: FREE } = config.permissionLevels;

exports.routesConfig = (app) => {
  /**
   * body:{
   *  firstName,
   *  lastName,
   *  email,
   *  password
   * }
   */
  app.post('/users', [UsersController.insert]);

  /**
   * header:{Bearer}
   * query:{
   *  page,
   *  limit
   * }
   */
  app.get('/users', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    UsersController.list,
  ]);

  /**
   * header:{Bearer}
   */
  app.get('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById,
  ]);

  /**
   * header:{Bearer}
   */
  app.patch('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.pathById,
  ]);

  /**
   * header:{Bearer}
   */
  app.delete('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById,
  ]);
};
