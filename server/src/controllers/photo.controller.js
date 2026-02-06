const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage, successPaginated } = require('../utils/responseHelpers')
const { paginate, formatPagination } = require('../utils/pagination')
const { ApiError } = require('../utils/ApiError')
const { processUploadedImage, deleteImageFiles } = require('../services/image.service')
const { parseBoolean } = require('../utils/helpers')

const getPhotos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const { category, album, featured } = req.query
    
    const where = { isPublished: true }
    
    if (category) {
        const cat = await prisma.category.findUnique({ where: { slug: category } })
        if (cat) where.categoryId = cat.id
    }
    
    if (album) {
        const alb = await prisma.album.findUnique({ where: { slug: album } })
        if (alb) where.albumId = alb.id
    }
    
    if (featured === 'true') where.isFeatured = true

    const [photos, total] = await Promise.all([
        prisma.photo.findMany({
            where,
            ...paginate(page, limit),
            orderBy: { sortOrder: 'asc' },
            include: {
                album: { select: { id: true, title: true, slug: true } },
                category: { select: { id: true, name: true, slug: true } }
            }
        }),
        prisma.photo.count({ where })
    ])

    successPaginated(res, photos, formatPagination(total, page, limit))
})

const getFeaturedPhotos = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 8, 20)
    
    const photos = await prisma.photo.findMany({
        where: { isPublished: true, isFeatured: true },
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
            album: { select: { id: true, title: true, slug: true } }
        }
    })
    
    success(res, photos)
})

const getPhotoById = asyncHandler(async (req, res) => {
    const photo = await prisma.photo.findUnique({
        where: { id: req.params.id },
        include: {
            album: true,
            category: true
        }
    })
    
    if (!photo || !photo.isPublished) {
        throw ApiError.notFound('Photo not found')
    }
    
    success(res, photo)
})

const adminGetPhotos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const { search, category, album, featured, published, sort } = req.query
    
    const where = {}
    
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ]
    }
    
    if (category) where.categoryId = category
    if (album) where.albumId = album
    if (featured !== undefined) where.isFeatured = parseBoolean(featured)
    if (published !== undefined) where.isPublished = parseBoolean(published)

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' } 
        : sort === 'name' ? { title: 'asc' } 
        : { createdAt: 'desc' }

    const [photos, total] = await Promise.all([
        prisma.photo.findMany({
            where,
            ...paginate(page, limit),
            orderBy,
            include: {
                album: { select: { id: true, title: true } },
                category: { select: { id: true, name: true } }
            }
        }),
        prisma.photo.count({ where })
    ])

    successPaginated(res, photos, formatPagination(total, page, limit))
})

const uploadPhotos = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw ApiError.badRequest('No files uploaded')
    }

    const results = { uploaded: 0, failed: 0, photos: [], errors: [] }
    const { categoryId, albumId } = req.body

    for (const file of req.files) {
        try {
            const imageData = await processUploadedImage(file)
            
            const photo = await prisma.photo.create({
                data: {
                    ...imageData,
                    categoryId: categoryId || null,
                    albumId: albumId || null
                }
            })
            
            results.photos.push(photo)
            results.uploaded++
        } catch (error) {
            results.failed++
            results.errors.push({ filename: file.originalname, error: error.message })
        }
    }

    created(res, results)
})

const updatePhoto = asyncHandler(async (req, res) => {
    const photo = await prisma.photo.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
            album: { select: { id: true, title: true } },
            category: { select: { id: true, name: true } }
        }
    })
    
    success(res, photo)
})

const deletePhoto = asyncHandler(async (req, res) => {
    const photo = await prisma.photo.findUnique({ where: { id: req.params.id } })
    
    if (!photo) throw ApiError.notFound('Photo not found')
    
    await deleteImageFiles(photo)
    await prisma.photo.delete({ where: { id: req.params.id } })
    
    successMessage(res, 'Photo deleted')
})

const bulkDeletePhotos = asyncHandler(async (req, res) => {
    const { ids } = req.body
    
    const photos = await prisma.photo.findMany({ where: { id: { in: ids } } })
    
    for (const photo of photos) {
        await deleteImageFiles(photo)
    }
    
    await prisma.photo.deleteMany({ where: { id: { in: ids } } })
    
    success(res, { deleted: photos.length })
})

const reorderPhotos = asyncHandler(async (req, res) => {
    const { photos } = req.body
    
    for (const item of photos) {
        await prisma.photo.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder }
        })
    }
    
    successMessage(res, 'Order updated')
})

const movePhotos = asyncHandler(async (req, res) => {
    const { photoIds, albumId } = req.body
    
    await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { albumId }
    })
    
    success(res, { moved: photoIds.length })
})

module.exports = {
    getPhotos,
    getFeaturedPhotos,
    getPhotoById,
    adminGetPhotos,
    uploadPhotos,
    updatePhoto,
    deletePhoto,
    bulkDeletePhotos,
    reorderPhotos,
    movePhotos
}
