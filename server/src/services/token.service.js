const jwt = require('jsonwebtoken')
const config = require('../config')
const { prisma } = require('../config/database')

function generateAccessToken(userId) {
    return jwt.sign(
        { userId, type: 'access' },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiresIn }
    )
}

function generateRefreshToken(userId) {
    return jwt.sign(
        { userId, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    )
}

function verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret)
}

function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret)
}

async function saveRefreshToken(userId, token) {
    const decoded = jwt.decode(token)
    const expiresAt = new Date(decoded.exp * 1000)

    await prisma.refreshToken.create({
        data: {
            userId,
            token,
            expiresAt
        }
    })
}

async function findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true }
    })
}

async function deleteRefreshToken(token) {
    try {
        await prisma.refreshToken.delete({
            where: { token }
        })
    } catch (e) { }
}

async function deleteUserRefreshTokens(userId) {
    await prisma.refreshToken.deleteMany({
        where: { userId }
    })
}

async function cleanupExpiredTokens() {
    await prisma.refreshToken.deleteMany({
        where: {
            expiresAt: { lt: new Date() }
        }
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteUserRefreshTokens,
    cleanupExpiredTokens
}
