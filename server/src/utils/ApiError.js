class ApiError extends Error {
    constructor(statusCode, code, message, details = null) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message, details = null) {
        return new ApiError(400, 'BAD_REQUEST', message, details)
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, 'UNAUTHORIZED', message)
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(403, 'FORBIDDEN', message)
    }

    static notFound(message = 'Not found') {
        return new ApiError(404, 'NOT_FOUND', message)
    }

    static conflict(message) {
        return new ApiError(409, 'CONFLICT', message)
    }

    static validation(details) {
        return new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details)
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, 'INTERNAL_ERROR', message)
    }
}

module.exports = { ApiError }
