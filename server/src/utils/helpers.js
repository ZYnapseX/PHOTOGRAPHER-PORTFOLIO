const crypto = require('crypto')
const path = require('path')

function generateBookingNumber() {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 9000) + 1000
    return `BK-${year}-${random}`
}

function generateFilename(originalName) {
    const ext = path.extname(originalName).toLowerCase()
    const random = crypto.randomBytes(16).toString('hex')
    const timestamp = Date.now()
    return `${timestamp}-${random}${ext}`
}

function parseBoolean(value) {
    if (typeof value === 'boolean') return value
    if (value === 'true' || value === '1') return true
    if (value === 'false' || value === '0') return false
    return undefined
}

function pick(obj, keys) {
    const result = {}
    keys.forEach(key => {
        if (obj[key] !== undefined) result[key] = obj[key]
    })
    return result
}

function omit(obj, keys) {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
}

module.exports = {
    generateBookingNumber,
    generateFilename,
    parseBoolean,
    pick,
    omit
}
