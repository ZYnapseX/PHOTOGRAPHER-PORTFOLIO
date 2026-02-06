const bcrypt = require('bcrypt')
const config = require('../config')
const { prisma } = require('../config/database')
const { ApiError } = require('../utils/ApiError')
const tokenService = require('./token.service')

async function login(email, password) {
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw ApiError.unauthorized('Invalid email or password')
    }

    if (!user.isActive) {
        throw ApiError.forbidden('Account is deactivated')
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
        throw ApiError.unauthorized('Invalid email or password')
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    })

    const accessToken = tokenService.generateAccessToken(user.id)
    const refreshToken = tokenService.generateRefreshToken(user.id)

    await tokenService.saveRefreshToken(user.id, refreshToken)

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar
        },
        tokens: {
            accessToken,
            refreshToken,
            expiresIn: 900
        }
    }
}

async function refresh(refreshToken) {
    const tokenData = await tokenService.findRefreshToken(refreshToken)

    if (!tokenData) {
        throw ApiError.unauthorized('Invalid refresh token')
    }

    if (new Date() > tokenData.expiresAt) {
        await tokenService.deleteRefreshToken(refreshToken)
        throw ApiError.unauthorized('Refresh token expired')
    }

    try {
        tokenService.verifyRefreshToken(refreshToken)
    } catch (e) {
        await tokenService.deleteRefreshToken(refreshToken)
        throw ApiError.unauthorized('Invalid refresh token')
    }

    const accessToken = tokenService.generateAccessToken(tokenData.userId)

    return {
        accessToken,
        expiresIn: 900
    }
}

async function logout(refreshToken) {
    await tokenService.deleteRefreshToken(refreshToken)
}

async function updateProfile(userId, data) {
    const updateData = {}

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.avatar) updateData.avatar = data.avatar

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            lastLogin: true,
            createdAt: true
        }
    })

    return user
}

async function changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!isValid) {
        throw ApiError.badRequest('Current password is incorrect')
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds)

    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
    })

    await tokenService.deleteUserRefreshTokens(userId)
}

module.exports = { login, refresh, logout, updateProfile, changePassword }
