const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, created, successMessage, successPaginated } = require('../utils/responseHelpers')
const { paginate, formatPagination } = require('../utils/pagination')
const { generateSlug, ensureUniqueSlug } = require('../utils/slug')
const { ApiError } = require('../utils/ApiError')
const { parseBoolean } = require('../utils/helpers')

const getAlbums = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 12, 50)
    const { category, featured, sort } = req.query

    const where = { isPublished: true }

    if (category) {
        const cat = await prisma.category.findUnique({ where: { slug: category } })
        if (cat) where.categoryId = cat.id
    }

    if (featured === 'true') where.isFeatured = true

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' }
        : sort === 'popular' ? { viewCount: 'desc' }
            : { createdAt: 'desc' }

    const [albums, total] = await Promise.all([
        prisma.album.findMany({
            where,
            ...paginate(page, limit),
            orderBy,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                _count: { select: { photos: true } }
            }
        }),
        prisma.album.count({ where })
    ])

    const mapped = albums.map(a => ({
        ...a,
        photoCount: a._count.photos,
        _count: undefined
    }))

    successPaginated(res, mapped, formatPagination(total, page, limit))
})

const getFeaturedAlbums = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 6, 12)

    const albums = await prisma.album.findMany({
        where: { isPublished: true, isFeatured: true },
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            _count: { select: { photos: true } }
        }
    })

    const mapped = albums.map(a => ({
        ...a,
        photoCount: a._count.photos,
        _count: undefined
    }))

    success(res, mapped)
})

const getAlbumBySlug = asyncHandler(async (req, res) => {
    const album = await prisma.album.findUnique({
        where: { slug: req.params.slug },
        include: {
            category: true,
            photos: {
                where: { isPublished: true },
                orderBy: { sortOrder: 'asc' }
            }
        }
    })

    if (!album || !album.isPublished) {
        throw ApiError.notFound('Album not found')
    }

    await prisma.album.update({
        where: { id: album.id },
        data: { viewCount: { increment: 1 } }
    })

    const relatedAlbums = await prisma.album.findMany({
        where: {
            categoryId: album.categoryId,
            id: { not: album.id },
            isPublished: true
        },
        take: 3,
        include: { _count: { select: { photos: true } } }
    })

    success(res, { ...album, relatedAlbums })
})

const adminGetAlbums = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const { search, category, published, featured, sort } = req.query

    const where = {}

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (category) where.categoryId = category
    if (published !== undefined) where.isPublished = parseBoolean(published)
    if (featured !== undefined) where.isFeatured = parseBoolean(featured)

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' }
        : sort === 'title' ? { title: 'asc' }
            : { createdAt: 'desc' }

    const [albums, total] = await Promise.all([
        prisma.album.findMany({
            where,
            ...paginate(page, limit),
            orderBy,
            include: {
                category: { select: { id: true, name: true } },
                _count: { select: { photos: true } }
            }
        }),
        prisma.album.count({ where })
    ])

    const mapped = albums.map(a => ({
        ...a,
        photoCount: a._count.photos,
        _count: undefined
    }))

    successPaginated(res, mapped, formatPagination(total, page, limit))
})

const adminGetAlbum = asyncHandler(async (req, res) => {
    const album = await prisma.album.findUnique({
        where: { id: req.params.id },
        include: {
            category: true,
            photos: { orderBy: { sortOrder: 'asc' } }
        }
    })

    if (!album) throw ApiError.notFound('Album not found')

    success(res, album)
})

const createAlbum = asyncHandler(async (req, res) => {
    let slug = req.body.slug || generateSlug(req.body.title)
    slug = await ensureUniqueSlug(prisma, 'album', slug)

    const album = await prisma.album.create({
        data: {
            ...req.body,
            slug,
            shootDate: req.body.shootDate ? new Date(req.body.shootDate) : null
        },
        include: { category: true }
    })

    created(res, album)
})

const updateAlbum = asyncHandler(async (req, res) => {
    const data = { ...req.body }

    if (data.slug) {
        data.slug = await ensureUniqueSlug(prisma, 'album', data.slug, req.params.id)
    }

    if (data.shootDate) {
        data.shootDate = new Date(data.shootDate)
    }

    const album = await prisma.album.update({
        where: { id: req.params.id },
        data,
        include: { category: true }
    })

    success(res, album)
})

const deleteAlbum = asyncHandler(async (req, res) => {
    const deletePhotos = req.query.deletePhotos === 'true'

    if (deletePhotos) {
        const photos = await prisma.photo.findMany({
            where: { albumId: req.params.id }
        })

        const { deleteImageFiles } = require('../services/image.service')
        for (const photo of photos) {
            await deleteImageFiles(photo)
        }

        await prisma.photo.deleteMany({ where: { albumId: req.params.id } })
    } else {
        await prisma.photo.updateMany({
            where: { albumId: req.params.id },
            data: { albumId: null }
        })
    }

    await prisma.album.delete({ where: { id: req.params.id } })

    successMessage(res, 'Album deleted')
})

module.exports = {
    getAlbums,
    getFeaturedAlbums,
    getAlbumBySlug,
    adminGetAlbums,
    adminGetAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum
}
