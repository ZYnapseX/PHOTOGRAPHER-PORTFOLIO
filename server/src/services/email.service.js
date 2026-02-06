const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs').promises
const config = require('../config')
const { logger } = require('../config/logger')

let transporter = null

function getTransporter() {
    if (transporter) return transporter
    
    if (!config.email.user || !config.email.pass) {
        return null
    }
    
    transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    })
    
    return transporter
}

async function loadTemplate(templateName, variables) {
    const templatePath = path.join(__dirname, '..', 'templates', 'email', `${templateName}.html`)
    
    try {
        let html = await fs.readFile(templatePath, 'utf-8')
        
        for (const [key, value] of Object.entries(variables)) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value || '')
        }
        
        return html
    } catch (error) {
        logger.error(`Failed to load email template: ${templateName}`, error)
        return null
    }
}

async function sendEmail(to, subject, html) {
    const transport = getTransporter()
    
    if (!transport) {
        logger.info('Email would be sent:', { to, subject })
        return false
    }
    
    try {
        await transport.sendMail({
            from: config.email.from,
            to,
            subject,
            html
        })
        logger.info('Email sent successfully', { to, subject })
        return true
    } catch (error) {
        logger.error('Failed to send email', { to, subject, error: error.message })
        return false
    }
}

async function sendBookingConfirmation(booking) {
    const shootDate = new Date(booking.shootDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const html = await loadTemplate('bookingConfirmation', {
        clientName: booking.clientName,
        bookingNumber: booking.bookingNumber,
        serviceName: booking.service?.name || 'Photography Session',
        shootDate,
        shootTime: booking.shootTime || 'To be confirmed',
        location: booking.location || 'To be confirmed',
        contactEmail: config.email.adminEmail,
        contactPhone: '+44 20 7946 0958'
    })

    if (!html) {
        const fallbackHtml = `
            <h1>Booking Confirmation</h1>
            <p>Dear ${booking.clientName},</p>
            <p>Your booking has been received. Reference: ${booking.bookingNumber}</p>
            <p>Date: ${shootDate}</p>
            <p>We will contact you within 24 hours.</p>
        `
        return sendEmail(booking.clientEmail, 'Booking Confirmation - Alexandra Volkova Photography', fallbackHtml)
    }

    return sendEmail(booking.clientEmail, 'Booking Confirmation - Alexandra Volkova Photography', html)
}

async function sendBookingNotification(booking) {
    const shootDate = new Date(booking.shootDate).toLocaleDateString('en-GB')

    const html = `
        <h2>New Booking Request</h2>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>Client:</strong> ${booking.clientName}</p>
        <p><strong>Email:</strong> ${booking.clientEmail}</p>
        <p><strong>Phone:</strong> ${booking.clientPhone}</p>
        <p><strong>Service:</strong> ${booking.service?.name || 'N/A'}</p>
        <p><strong>Date:</strong> ${shootDate}</p>
        <p><strong>Time:</strong> ${booking.shootTime || 'Not specified'}</p>
        <p><strong>Location:</strong> ${booking.location || 'Not specified'}</p>
        <p><strong>Message:</strong> ${booking.message || 'No message'}</p>
    `

    return sendEmail(config.email.adminEmail, `New Booking: ${booking.bookingNumber}`, html)
}

async function sendContactMessage(message) {
    const html = `
        <h2>New Contact Form Message</h2>
        <p><strong>From:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${message.subject || 'General enquiry'}</p>
        <hr>
        <p>${message.message}</p>
    `

    return sendEmail(config.email.adminEmail, `Contact: ${message.subject || 'New Message'}`, html)
}

module.exports = {
    sendEmail,
    sendBookingConfirmation,
    sendBookingNotification,
    sendContactMessage
}
