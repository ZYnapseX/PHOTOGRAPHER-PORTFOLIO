const { z } = require('zod')

const createServiceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    shortDescription: z.string().max(500).optional(),
    categoryId: z.string().min(1, 'Category is required'),
    price: z.number().positive('Price must be positive'),
    priceFrom: z.boolean().optional(),
    duration: z.string().max(100).optional(),
    features: z.array(z.string()).optional(),
    includes: z.array(z.string()).optional(),
    isPopular: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

const updateServiceSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    shortDescription: z.string().max(500).optional(),
    categoryId: z.string().optional(),
    price: z.number().positive().optional(),
    priceFrom: z.boolean().optional(),
    duration: z.string().max(100).optional(),
    features: z.array(z.string()).optional(),
    includes: z.array(z.string()).optional(),
    isPopular: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

module.exports = { createServiceSchema, updateServiceSchema }
