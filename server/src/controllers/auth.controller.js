const authService = require('../services/auth.service')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, successMessage } = require('../utils/responseHelpers')

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    success(res, result)
})

const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    const result = await authService.refresh(refreshToken)
    success(res, result)
})

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    await authService.logout(refreshToken)
    successMessage(res, 'Logged out successfully')
})

const getMe = asyncHandler(async (req, res) => {
    success(res, req.user)
})

const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body)
    success(res, user)
})

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    await authService.changePassword(req.user.id, currentPassword, newPassword)
    successMessage(res, 'Password changed successfully')
})

module.exports = { login, refresh, logout, getMe, updateProfile, changePassword }
