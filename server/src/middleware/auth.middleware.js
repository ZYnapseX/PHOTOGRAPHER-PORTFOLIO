const jwt = require('jsonwebtoken')
const config = require('../config')
const { ApiError } = require('../utils/ApiError')
const { prisma } = require('../config/database')

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token required')
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, config.jwt.accessSecret)

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                isActive: true
            }
        })

        if (!user) {
            throw ApiError.unauthorized('User not found')
        }

        if (!user.isActive) {
            throw ApiError.forbidden('Account is deactivated')
        }

        req.user = user
        next()
    } catch (error) {
        if (error.isOperational) {
            next(error)
        } else {
            next(ApiError.unauthorized('Invalid token'))
        }
    }
}

module.exports = { authMiddleware }
