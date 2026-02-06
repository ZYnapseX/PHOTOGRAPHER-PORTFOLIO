const { z } = require('zod')

const updatePhotoSchema = z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),
    altText: z.string().max(200).optional(),
    albumId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

const reorderPhotosSchema = z.object({
    albumId: z.string().min(1),
    photos: z.array(z.object({
        id: z.string(),
        sortOrder: z.number().int()
    }))
})

const movePhotosSchema = z.object({
    photoIds: z.array(z.string()).min(1),
    albumId: z.string().nullable()
})

const bulkDeleteSchema = z.object({
    ids: z.array(z.string()).min(1)
})

module.exports = { updatePhotoSchema, reorderPhotosSchema, movePhotosSchema, bulkDeleteSchema }
