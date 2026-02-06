const { ApiError } = require('../utils/ApiError')
const { logger } = require('../config/logger')

function errorHandler(err, req, res, next) {
    let statusCode = 500
    let errorResponse = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error'
        }
    }

    if (err.isOperational) {
        statusCode = err.statusCode
        errorResponse.error = {
            code: err.code,
            message: err.message
        }
        if (err.details) {
            errorResponse.error.details = err.details
        }
    } else if (err.name === 'ZodError') {
        statusCode = 400
        errorResponse.error = {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        }
    } else if (err.code === 'P2002') {
        statusCode = 409
        const field = err.meta?.target?.[0] || 'field'
        errorResponse.error = {
            code: 'DUPLICATE_VALUE',
            message: `This ${field} already exists`
        }
    } else if (err.code === 'P2025') {
        statusCode = 404
        errorResponse.error = {
            code: 'NOT_FOUND',
            message: 'Record not found'
        }
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        errorResponse.error = {
            code: 'INVALID_TOKEN',
            message: 'Invalid token'
        }
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401
        errorResponse.error = {
            code: 'TOKEN_EXPIRED',
            message: 'Token expired'
        }
    }

    if (statusCode >= 500) {
        logger.error('Unhandled error:', err)
    }

    res.status(statusCode).json(errorResponse)
}

module.exports = { errorHandler }
