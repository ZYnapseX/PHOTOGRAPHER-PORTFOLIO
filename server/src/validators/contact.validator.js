const { z } = require('zod')

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email format'),
    phone: z.string().max(20).optional(),
    subject: z.string().max(200).optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000)
})

module.exports = { contactSchema }
