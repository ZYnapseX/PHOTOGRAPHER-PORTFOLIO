const { z } = require('zod')

const createAlbumSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    slug: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    location: z.string().max(200).optional(),
    shootDate: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional()
})

const updateAlbumSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    slug: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    location: z.string().max(200).optional(),
    shootDate: z.string().optional(),
    categoryId: z.string().optional(),
    coverImage: z.string().optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

module.exports = { createAlbumSchema, updateAlbumSchema }
