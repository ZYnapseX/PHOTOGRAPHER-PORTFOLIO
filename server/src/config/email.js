const nodemailer = require('nodemailer')
const config = require('./index')
const { logger } = require('./logger')

let transporter = null

function getTransporter() {
    if (transporter) return transporter

    if (!config.email.user || !config.email.pass) {
        logger.warn('Email credentials not configured, emails will be logged only')
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

module.exports = { getTransporter }
