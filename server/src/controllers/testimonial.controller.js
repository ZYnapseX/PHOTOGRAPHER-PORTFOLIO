const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage, successPaginated } = require('../utils/responseHelpers')
const { paginate, formatPagination } = require('../utils/pagination')

const getTestimonials = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 10, 30)
    const featured = req.query.featured === 'true'
    
    const where = { isPublished: true }
    if (featured) where.isFeatured = true
    
    const testimonials = await prisma.testimonial.findMany({
        where,
        take: limit,
        orderBy: { sortOrder: 'asc' }
    })
    
    success(res, testimonials)
})

const adminGetTestimonials = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const [testimonials, total] = await Promise.all([
        prisma.testimonial.findMany({
            ...paginate(page, limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.testimonial.count()
    ])

    successPaginated(res, testimonials, formatPagination(total, page, limit))
})

const createTestimonial = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (data.projectDate) data.projectDate = new Date(data.projectDate)
    
    const testimonial = await prisma.testimonial.create({ data })
    created(res, testimonial)
})

const updateTestimonial = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (data.projectDate) data.projectDate = new Date(data.projectDate)
    
    const testimonial = await prisma.testimonial.update({
        where: { id: req.params.id },
        data
    })
    
    success(res, testimonial)
})

const deleteTestimonial = asyncHandler(async (req, res) => {
    await prisma.testimonial.delete({ where: { id: req.params.id } })
    successMessage(res, 'Testimonial deleted')
})

module.exports = {
    getTestimonials,
    adminGetTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
}
