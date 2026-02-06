const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage } = require('../utils/responseHelpers')

const getBlockedDates = asyncHandler(async (req, res) => {
    const { month, year } = req.query

    let startDate, endDate

    if (month && year) {
        startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
        endDate = new Date(parseInt(year), parseInt(month), 0)
    } else {
        startDate = new Date()
        startDate.setDate(1)
        endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 3)
    }

    const [blockedDates, bookings] = await Promise.all([
        prisma.blockedDate.findMany({
            where: {
                date: { gte: startDate, lte: endDate }
            }
        }),
        prisma.booking.findMany({
            where: {
                shootDate: { gte: startDate, lte: endDate },
                status: { in: ['NEW', 'CONFIRMED', 'IN_PROGRESS'] }
            },
            select: { shootDate: true }
        })
    ])

    success(res, {
        blockedDates: blockedDates.map(d => d.date.toISOString().split('T')[0]),
        bookedDates: bookings.map(b => b.shootDate.toISOString().split('T')[0])
    })
})

const adminGetCalendar = asyncHandler(async (req, res) => {
    const { month, year } = req.query

    const m = parseInt(month) || new Date().getMonth() + 1
    const y = parseInt(year) || new Date().getFullYear()

    const startDate = new Date(y, m - 1, 1)
    const endDate = new Date(y, m, 0)

    const [blockedDates, bookings] = await Promise.all([
        prisma.blockedDate.findMany({
            where: { date: { gte: startDate, lte: endDate } }
        }),
        prisma.booking.findMany({
            where: {
                shootDate: { gte: startDate, lte: endDate },
                status: { not: 'CANCELLED' }
            },
            include: { service: { select: { name: true } } }
        })
    ])

    success(res, {
        blockedDates,
        bookings: bookings.map(b => ({
            id: b.id,
            date: b.shootDate.toISOString().split('T')[0],
            clientName: b.clientName,
            service: b.service?.name,
            status: b.status
        }))
    })
})

const blockDate = asyncHandler(async (req, res) => {
    const { date, reason } = req.body

    const blockedDate = await prisma.blockedDate.create({
        data: {
            date: new Date(date),
            reason
        }
    })

    created(res, blockedDate)
})

const unblockDate = asyncHandler(async (req, res) => {
    await prisma.blockedDate.delete({ where: { id: req.params.id } })
    successMessage(res, 'Date unblocked')
})

module.exports = {
    getBlockedDates,
    adminGetCalendar,
    blockDate,
    unblockDate
}
