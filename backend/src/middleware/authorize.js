const { rolePermissions } = require('../config/permissions');

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authorized, no role defined' });
    }

    const userPermissions = rolePermissions[req.user.role];
    
    if (!userPermissions || !userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = authorize;
