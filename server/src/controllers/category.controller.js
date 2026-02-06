const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage } = require('../utils/responseHelpers')
const { generateSlug, ensureUniqueSlug } = require('../utils/slug')
const { ApiError } = require('../utils/ApiError')

const getCategories = asyncHandler(async (req, res) => {
    const { withAlbumCount, withPhotoCount } = req.query

    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: {
                select: {
                    albums: withAlbumCount === 'true' ? { where: { isPublished: true } } : false,
                    photos: withPhotoCount === 'true' ? { where: { isPublished: true } } : false
                }
            }
        }
    })

    const mapped = categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImage: c.coverImage,
        sortOrder: c.sortOrder,
        albumCount: c._count?.albums || 0,
        photoCount: c._count?.photos || 0
    }))

    success(res, mapped)
})

const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await prisma.category.findUnique({
        where: { slug: req.params.slug },
        include: {
            albums: {
                where: { isPublished: true },
                take: 6,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { photos: true } } }
            }
        }
    })

    if (!category || !category.isActive) {
        throw ApiError.notFound('Category not found')
    }

    success(res, category)
})

const adminGetCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: { select: { albums: true, photos: true, services: true } }
        }
    })

    success(res, categories)
})

const createCategory = asyncHandler(async (req, res) => {
    let slug = req.body.slug || generateSlug(req.body.name)
    slug = await ensureUniqueSlug(prisma, 'category', slug)

    const category = await prisma.category.create({
        data: { ...req.body, slug }
    })

    created(res, category)
})

const updateCategory = asyncHandler(async (req, res) => {
    const data = { ...req.body }

    if (data.slug) {
        data.slug = await ensureUniqueSlug(prisma, 'category', data.slug, req.params.id)
    }

    const category = await prisma.category.update({
        where: { id: req.params.id },
        data
    })

    success(res, category)
})

const deleteCategory = asyncHandler(async (req, res) => {
    const albumCount = await prisma.album.count({ where: { categoryId: req.params.id } })
    const photoCount = await prisma.photo.count({ where: { categoryId: req.params.id } })

    if (albumCount > 0 || photoCount > 0) {
        throw ApiError.badRequest('Cannot delete category with albums or photos. Move them first.')
    }

    await prisma.category.delete({ where: { id: req.params.id } })

    successMessage(res, 'Category deleted')
})

module.exports = {
    getCategories,
    getCategoryBySlug,
    adminGetCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
