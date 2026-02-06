const { z } = require('zod')

const createBookingSchema = z.object({
    serviceId: z.string().min(1, 'Service is required'),
    clientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    clientEmail: z.string().email('Invalid email format'),
    clientPhone: z.string().min(10, 'Invalid phone number').max(20),
    shootDate: z.string().refine(val => {
        const date = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date >= today
    }, 'Date cannot be in the past'),
    shootTime: z.string().optional(),
    location: z.string().max(200).optional(),
    message: z.string().max(2000).optional()
})

const updateBookingSchema = z.object({
    status: z.enum(['NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    adminNotes: z.string().max(2000).optional(),
    shootDate: z.string().optional(),
    shootTime: z.string().optional(),
    location: z.string().max(200).optional(),
    totalPrice: z.number().positive().optional(),
    depositPaid: z.boolean().optional(),
    depositAmount: z.number().positive().optional()
})

module.exports = { createBookingSchema, updateBookingSchema }
