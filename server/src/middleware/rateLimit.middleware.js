const rateLimit = require('express-rate-limit')
const config = require('../config')

const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // Increased for development
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT',
            message: 'Too many login attempts, please try again later'
        }
    }
})

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        error: {
            code: 'UPLOAD_RATE_LIMIT',
            message: 'Upload limit exceeded, please try again later'
        }
    }
})

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        error: {
            code: 'CONTACT_RATE_LIMIT',
            message: 'Message limit exceeded, please try again later'
        }
    }
})

module.exports = { globalLimiter, authLimiter, uploadLimiter, contactLimiter }
