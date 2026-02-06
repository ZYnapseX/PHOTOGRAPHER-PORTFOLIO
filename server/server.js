require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const path = require('path')
const app = require('./src/app')
const { logger } = require('./src/config/logger')
const { connectDatabase } = require('./src/config/database')

const PORT = process.env.PORT || 5000

async function startServer() {
    try {
        await connectDatabase()

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
            logger.info(`Environment: ${process.env.NODE_ENV}`)
        })
    } catch (err) {
        logger.error('Failed to start server:', err)
        process.exit(1)
    }
}

startServer()
