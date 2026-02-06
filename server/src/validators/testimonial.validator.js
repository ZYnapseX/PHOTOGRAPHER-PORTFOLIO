const { z } = require('zod')

const createTestimonialSchema = z.object({
    clientName: z.string().min(2, 'Name is required').max(100),
    text: z.string().min(10, 'Review must be at least 10 characters').max(2000),
    rating: z.number().int().min(1).max(5).optional(),
    serviceType: z.string().max(100).optional(),
    projectDate: z.string().optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

const updateTestimonialSchema = z.object({
    clientName: z.string().min(2).max(100).optional(),
    clientPhoto: z.string().optional(),
    text: z.string().min(10).max(2000).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    serviceType: z.string().max(100).optional(),
    projectDate: z.string().optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().optional()
})

module.exports = { createTestimonialSchema, updateTestimonialSchema }
