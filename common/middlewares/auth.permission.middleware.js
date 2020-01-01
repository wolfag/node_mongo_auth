const lodash = require('lodash');

const ADMIN_PERMISSION = 4096;

exports.minimumPermissionLevelRequired = (requiredPermissionLevel) => {
  return (req, res, next) => {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel);
    if (userPermissionLevel & requiredPermissionLevel) {
      return next();
    } else {
      return res.status(403).send({ error: 'You have no permission1' });
    }
  };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
  const userPermissionLevel = parseInt(req.jwt.permissionLevel);
  console.log({ userPermissionLevel });
  const userId = req.jwt.userId;
  if (userId === lodash.get(req, 'params.userId')) {
    return next();
  } else {
    if (userPermissionLevel & ADMIN_PERMISSION) {
      return next();
    } else {
      return res.status(403).send({ error: 'You have no permission2' });
    }
  }
};

exports.sameUserCanDoThisAction = (req, res, next) => {
  if (req.jwt.userId !== req.params.userId) {
    return next();
  } else {
    return res.status(400).send({ error: 'You have no permission3' });
  }
};
