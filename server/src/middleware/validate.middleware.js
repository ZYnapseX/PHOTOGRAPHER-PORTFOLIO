const { ApiError } = require('../utils/ApiError')

function validate(schema) {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body)

            if (!result.success) {
                const details = result.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
                return next(ApiError.validation(details))
            }

            req.body = result.data
            next()
        } catch (error) {
            next(error)
        }
    }
}

function validateQuery(schema) {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.query)

            if (!result.success) {
                const details = result.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
                return next(ApiError.validation(details))
            }

            req.query = result.data
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { validate, validateQuery }
