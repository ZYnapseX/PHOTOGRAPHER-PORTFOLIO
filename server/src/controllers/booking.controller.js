const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage, successPaginated } = require('../utils/responseHelpers')
const { paginate, formatPagination } = require('../utils/pagination')
const { generateBookingNumber, parseBoolean } = require('../utils/helpers')
const { ApiError } = require('../utils/ApiError')
const emailService = require('../services/email.service')

const createBooking = asyncHandler(async (req, res) => {
    const { serviceId, shootDate, ...rest } = req.body

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) throw ApiError.badRequest('Invalid service')

    const shootDateParsed = new Date(shootDate)
    shootDateParsed.setHours(0, 0, 0, 0)

    const blocked = await prisma.blockedDate.findFirst({
        where: { date: shootDateParsed }
    })
    if (blocked) throw ApiError.badRequest('This date is not available')

    const bookingNumber = generateBookingNumber()

    const booking = await prisma.booking.create({
        data: {
            bookingNumber,
            serviceId,
            shootDate: shootDateParsed,
            ...rest
        },
        include: { service: true }
    })

    emailService.sendBookingConfirmation(booking).catch(() => { })
    emailService.sendBookingNotification(booking).catch(() => { })

    created(res, {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        service: { name: service.name, price: Number(service.price) },
        shootDate: booking.shootDate,
        shootTime: booking.shootTime,
        clientEmail: booking.clientEmail
    })
})

const adminGetBookings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const { status, search, dateFrom, dateTo, sort } = req.query

    const where = {}

    if (status) where.status = status

    if (search) {
        where.OR = [
            { clientName: { contains: search, mode: 'insensitive' } },
            { clientEmail: { contains: search, mode: 'insensitive' } },
            { bookingNumber: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (dateFrom || dateTo) {
        where.shootDate = {}
        if (dateFrom) where.shootDate.gte = new Date(dateFrom)
        if (dateTo) where.shootDate.lte = new Date(dateTo)
    }

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' }
        : sort === 'shootDate' ? { shootDate: 'asc' }
            : { createdAt: 'desc' }

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            ...paginate(page, limit),
            orderBy,
            include: { service: { select: { id: true, name: true } } }
        }),
        prisma.booking.count({ where })
    ])

    successPaginated(res, bookings, formatPagination(total, page, limit))
})

const adminGetBooking = asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { service: true }
    })

    if (!booking) throw ApiError.notFound('Booking not found')

    success(res, booking)
})

const updateBooking = asyncHandler(async (req, res) => {
    const existing = await prisma.booking.findUnique({ where: { id: req.params.id } })
    if (!existing) throw ApiError.notFound('Booking not found')

    const data = { ...req.body }
    if (data.shootDate) data.shootDate = new Date(data.shootDate)

    const booking = await prisma.booking.update({
        where: { id: req.params.id },
        data,
        include: { service: true }
    })

    success(res, booking)
})

const deleteBooking = asyncHandler(async (req, res) => {
    await prisma.booking.delete({ where: { id: req.params.id } })
    successMessage(res, 'Booking deleted')
})

module.exports = {
    createBooking,
    adminGetBookings,
    adminGetBooking,
    updateBooking,
    deleteBooking
}
