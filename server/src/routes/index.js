const router = require('express').Router()
const authRoutes = require('./auth.routes')
const publicRoutes = require('./public.routes')
const adminRoutes = require('./admin.routes')

router.use('/auth', authRoutes)
router.use('/public', publicRoutes)
router.use('/admin', adminRoutes)

module.exports = router
