const { z } = require('zod')

const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional()
})

const updateCategorySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    coverImage: z.string().optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional()
})

module.exports = { createCategorySchema, updateCategorySchema }
