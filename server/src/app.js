const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const path = require('path')
const config = require('./config')
const routes = require('./routes')
const { errorHandler } = require('./middleware/errorHandler.middleware')
const { notFoundHandler } = require('./middleware/notFound.middleware')

const app = express()

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

app.use(hpp())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use(config.apiPrefix, routes)

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
