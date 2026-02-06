const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage } = require('../utils/responseHelpers')
const { generateSlug, ensureUniqueSlug } = require('../utils/slug')
const { ApiError } = require('../utils/ApiError')

const getServices = asyncHandler(async (req, res) => {
    const { category, grouped } = req.query
    
    const where = { isActive: true }
    
    if (category) {
        const cat = await prisma.category.findUnique({ where: { slug: category } })
        if (cat) where.categoryId = cat.id
    }

    const services = await prisma.service.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        include: { category: { select: { id: true, name: true, slug: true } } }
    })

    if (grouped === 'true') {
        const grouped = {}
        services.forEach(s => {
            const catId = s.category.id
            if (!grouped[catId]) {
                grouped[catId] = { category: s.category, services: [] }
            }
            grouped[catId].services.push(s)
        })
        return success(res, Object.values(grouped))
    }
    
    success(res, services)
})

const getServiceBySlug = asyncHandler(async (req, res) => {
    const service = await prisma.service.findUnique({
        where: { slug: req.params.slug },
        include: { category: true }
    })
    
    if (!service || !service.isActive) {
        throw ApiError.notFound('Service not found')
    }
    
    success(res, service)
})

const adminGetServices = asyncHandler(async (req, res) => {
    const services = await prisma.service.findMany({
        orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
        include: {
            category: { select: { id: true, name: true } },
            _count: { select: { bookings: true } }
        }
    })
    
    success(res, services)
})

const createService = asyncHandler(async (req, res) => {
    let slug = req.body.slug || generateSlug(req.body.name)
    slug = await ensureUniqueSlug(prisma, 'service', slug)
    
    const service = await prisma.service.create({
        data: { ...req.body, slug },
        include: { category: true }
    })
    
    created(res, service)
})

const updateService = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    
    if (data.slug) {
        data.slug = await ensureUniqueSlug(prisma, 'service', data.slug, req.params.id)
    }
    
    const service = await prisma.service.update({
        where: { id: req.params.id },
        data,
        include: { category: true }
    })
    
    success(res, service)
})

const deleteService = asyncHandler(async (req, res) => {
    const bookingCount = await prisma.booking.count({ where: { serviceId: req.params.id } })
    
    if (bookingCount > 0) {
        throw ApiError.badRequest('Cannot delete service with existing bookings')
    }
    
    await prisma.service.delete({ where: { id: req.params.id } })
    
    successMessage(res, 'Service deleted')
})

module.exports = {
    getServices,
    getServiceBySlug,
    adminGetServices,
    createService,
    updateService,
    deleteService
}
