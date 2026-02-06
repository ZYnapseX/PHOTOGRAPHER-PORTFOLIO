const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success } = require('../utils/responseHelpers')

const getDashboardStats = asyncHandler(async (req, res) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [
        totalPhotos,
        totalAlbums,
        totalBookings,
        newBookings,
        totalMessages,
        unreadMessages,
        monthlyViews,
        recentBookings,
        bookingsByStatus,
        popularAlbums
    ] = await Promise.all([
        prisma.photo.count(),
        prisma.album.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'NEW' } }),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
        prisma.pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { service: { select: { name: true } } }
        }),
        prisma.booking.groupBy({
            by: ['status'],
            _count: true
        }),
        prisma.album.findMany({
            take: 5,
            orderBy: { viewCount: 'desc' },
            select: { id: true, title: true, viewCount: true }
        })
    ])

    const bookingsList = await prisma.booking.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
    })

    const monthlyMap = {}
    bookingsList.forEach(b => {
        const month = b.createdAt.toISOString().slice(0, 7) // YYYY-MM
        monthlyMap[month] = (monthlyMap[month] || 0) + 1
    })

    const bookingsByMonth = Object.entries(monthlyMap)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))

    const statusCounts = {}
    bookingsByStatus.forEach(b => {
        statusCounts[b.status] = b._count
    })

    success(res, {
        totalPhotos,
        totalAlbums,
        totalBookings,
        newBookings,
        totalMessages,
        unreadMessages,
        monthlyViews,
        popularAlbums,
        recentBookings: recentBookings.map(b => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            clientName: b.clientName,
            service: b.service?.name,
            shootDate: b.shootDate,
            status: b.status,
            createdAt: b.createdAt
        })),
        bookingsByStatus: statusCounts,
        bookingsByMonth
    })
})

module.exports = { getDashboardStats }
