const { RES_LOCALS } = require("./middleware/constant");
const { ACCESS_ROLES } = require("../businessLogic/accessmanagement/roleConstants");
const AccessPermissionError = require("../errorHandlers/AccessPermissionError");

const appWrapper = (handler, allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!allowedRoles.includes(ACCESS_ROLES.ALL)) {
        const userInfo = res.locals[RES_LOCALS?.USER_INFO?.KEY || 'userInfo'];
        
        if (!userInfo || !userInfo.roles) {
          throw new AccessPermissionError("Authentication required");
        }

        const hasRole = userInfo.roles.some(role => 
          allowedRoles.includes(role.role_name) || allowedRoles.includes(role.name)
        );

        if (!hasRole) {
          throw new AccessPermissionError("Insufficient permissions for this action");
        }
      }

      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { appWrapper };
