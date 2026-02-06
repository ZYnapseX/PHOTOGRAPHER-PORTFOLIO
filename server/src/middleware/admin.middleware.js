const { ApiError } = require('../utils/ApiError')

function adminMiddleware(req, res, next) {
    if (!req.user) {
        return next(ApiError.unauthorized())
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
        return next(ApiError.forbidden('Admin access required'))
    }

    next()
}

function superAdminMiddleware(req, res, next) {
    if (!req.user) {
        return next(ApiError.unauthorized())
    }

    if (req.user.role !== 'SUPER_ADMIN') {
        return next(ApiError.forbidden('Super admin access required'))
    }

    next()
}

module.exports = { adminMiddleware, superAdminMiddleware }
