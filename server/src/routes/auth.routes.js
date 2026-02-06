const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { authMiddleware } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { authLimiter } = require('../middleware/rateLimit.middleware')
const { loginSchema, refreshSchema, updateProfileSchema, changePasswordSchema } = require('../validators/auth.validator')

router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/refresh', validate(refreshSchema), authController.refresh)
router.post('/logout', authMiddleware, authController.logout)
router.get('/me', authMiddleware, authController.getMe)
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile)
router.put('/password', authMiddleware, validate(changePasswordSchema), authController.changePassword)

module.exports = router
