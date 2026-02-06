const router = require('express').Router()
const categoryController = require('../controllers/category.controller')
const albumController = require('../controllers/album.controller')
const photoController = require('../controllers/photo.controller')
const serviceController = require('../controllers/service.controller')
const bookingController = require('../controllers/booking.controller')
const testimonialController = require('../controllers/testimonial.controller')
const contactController = require('../controllers/contact.controller')
const calendarController = require('../controllers/calendar.controller')
const settingsController = require('../controllers/settings.controller')
const { validate } = require('../middleware/validate.middleware')
const { contactLimiter } = require('../middleware/rateLimit.middleware')
const { createBookingSchema } = require('../validators/booking.validator')
const { contactSchema } = require('../validators/contact.validator')

router.get('/categories', categoryController.getCategories)
router.get('/categories/:slug', categoryController.getCategoryBySlug)

router.get('/albums', albumController.getAlbums)
router.get('/albums/featured', albumController.getFeaturedAlbums)
router.get('/albums/:slug', albumController.getAlbumBySlug)

router.get('/photos', photoController.getPhotos)
router.get('/photos/featured', photoController.getFeaturedPhotos)
router.get('/photos/:id', photoController.getPhotoById)

router.get('/services', serviceController.getServices)
router.get('/services/:slug', serviceController.getServiceBySlug)

router.post('/bookings', validate(createBookingSchema), bookingController.createBooking)

router.get('/testimonials', testimonialController.getTestimonials)

router.post('/contact', contactLimiter, validate(contactSchema), contactController.sendContactMessage)

router.get('/calendar/blocked-dates', calendarController.getBlockedDates)

router.get('/settings/public', settingsController.getPublicSettings)

module.exports = router
