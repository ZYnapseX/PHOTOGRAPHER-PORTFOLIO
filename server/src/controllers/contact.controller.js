const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success, successMessage } = require('../utils/responseHelpers')
const emailService = require('../services/email.service')

const sendContactMessage = asyncHandler(async (req, res) => {
    const message = await prisma.contactMessage.create({
        data: req.body
    })

    emailService.sendContactMessage(message).catch(() => { })

    successMessage(res, 'Message sent successfully. We will get back to you soon.')
})

const adminGetMessages = asyncHandler(async (req, res) => {
    const { status } = req.query

    const where = {}
    if (status) where.status = status

    const messages = await prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })

    success(res, messages)
})

const adminGetMessage = asyncHandler(async (req, res) => {
    const message = await prisma.contactMessage.findUnique({
        where: { id: req.params.id }
    })

    if (message && message.status === 'UNREAD') {
        await prisma.contactMessage.update({
            where: { id: req.params.id },
            data: { status: 'READ' }
        })
    }

    success(res, message)
})

const updateMessage = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (data.status === 'REPLIED') {
        data.repliedAt = new Date()
    }

    const message = await prisma.contactMessage.update({
        where: { id: req.params.id },
        data
    })

    success(res, message)
})

const deleteMessage = asyncHandler(async (req, res) => {
    await prisma.contactMessage.delete({ where: { id: req.params.id } })
    successMessage(res, 'Message deleted')
})

module.exports = {
    sendContactMessage,
    adminGetMessages,
    adminGetMessage,
    updateMessage,
    deleteMessage
}
