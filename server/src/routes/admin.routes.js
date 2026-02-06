const router = require('express').Router()
const { authMiddleware } = require('../middleware/auth.middleware')
const { adminMiddleware } = require('../middleware/admin.middleware')
const { uploadPhotos } = require('../middleware/upload.middleware')
const { validate } = require('../middleware/validate.middleware')
const { uploadLimiter } = require('../middleware/rateLimit.middleware')

const dashboardController = require('../controllers/dashboard.controller')
const photoController = require('../controllers/photo.controller')
const albumController = require('../controllers/album.controller')
const categoryController = require('../controllers/category.controller')
const serviceController = require('../controllers/service.controller')
const bookingController = require('../controllers/booking.controller')
const testimonialController = require('../controllers/testimonial.controller')
const contactController = require('../controllers/contact.controller')
const calendarController = require('../controllers/calendar.controller')
const settingsController = require('../controllers/settings.controller')

const { updatePhotoSchema, reorderPhotosSchema, movePhotosSchema, bulkDeleteSchema } = require('../validators/photo.validator')
const { createAlbumSchema, updateAlbumSchema } = require('../validators/album.validator')
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator')
const { createServiceSchema, updateServiceSchema } = require('../validators/service.validator')
const { updateBookingSchema } = require('../validators/booking.validator')
const { createTestimonialSchema, updateTestimonialSchema } = require('../validators/testimonial.validator')

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/dashboard/stats', dashboardController.getDashboardStats)

router.get('/photos', photoController.adminGetPhotos)
router.post('/photos', uploadLimiter, uploadPhotos.array('photos', 20), photoController.uploadPhotos)
router.put('/photos/:id', validate(updatePhotoSchema), photoController.updatePhoto)
router.delete('/photos/:id', photoController.deletePhoto)
router.post('/photos/bulk-delete', validate(bulkDeleteSchema), photoController.bulkDeletePhotos)
router.put('/photos/reorder', validate(reorderPhotosSchema), photoController.reorderPhotos)
router.post('/photos/move', validate(movePhotosSchema), photoController.movePhotos)

router.get('/albums', albumController.adminGetAlbums)
router.get('/albums/:id', albumController.adminGetAlbum)
router.post('/albums', validate(createAlbumSchema), albumController.createAlbum)
router.put('/albums/:id', validate(updateAlbumSchema), albumController.updateAlbum)
router.delete('/albums/:id', albumController.deleteAlbum)

router.get('/categories', categoryController.adminGetCategories)
router.post('/categories', validate(createCategorySchema), categoryController.createCategory)
router.put('/categories/:id', validate(updateCategorySchema), categoryController.updateCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/services', serviceController.adminGetServices)
router.post('/services', validate(createServiceSchema), serviceController.createService)
router.put('/services/:id', validate(updateServiceSchema), serviceController.updateService)
router.delete('/services/:id', serviceController.deleteService)

router.get('/bookings', bookingController.adminGetBookings)
router.get('/bookings/:id', bookingController.adminGetBooking)
router.put('/bookings/:id', validate(updateBookingSchema), bookingController.updateBooking)
router.delete('/bookings/:id', bookingController.deleteBooking)

router.get('/testimonials', testimonialController.adminGetTestimonials)
router.post('/testimonials', validate(createTestimonialSchema), testimonialController.createTestimonial)
router.put('/testimonials/:id', validate(updateTestimonialSchema), testimonialController.updateTestimonial)
router.delete('/testimonials/:id', testimonialController.deleteTestimonial)

router.get('/messages', contactController.adminGetMessages)
router.get('/messages/:id', contactController.adminGetMessage)
router.put('/messages/:id', contactController.updateMessage)
router.delete('/messages/:id', contactController.deleteMessage)

router.get('/calendar', calendarController.adminGetCalendar)
router.post('/calendar/block', calendarController.blockDate)
router.delete('/calendar/block/:id', calendarController.unblockDate)

router.get('/settings', settingsController.getAllSettings)
router.put('/settings', settingsController.updateSettings)

module.exports = router
