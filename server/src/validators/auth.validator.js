const { z } = require('zod')

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
})

const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional()
})

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

module.exports = {
    loginSchema,
    refreshSchema,
    updateProfileSchema,
    changePasswordSchema
}
