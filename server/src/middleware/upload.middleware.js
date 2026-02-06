const multer = require('multer')
const path = require('path')
const config = require('../config')
const { ApiError } = require('../utils/ApiError')
const { tempPath } = require('../config/storage')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `upload-${uniqueSuffix}${ext}`)
    }
})

function fileFilter(req, file, cb) {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new ApiError(400, 'INVALID_FILE_TYPE', 'Only JPEG, PNG and WebP images are allowed'))
    }
}

const uploadPhotos = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.upload.maxSize,
        files: 20
    }
})

const uploadSingle = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.upload.maxSize,
        files: 1
    }
})

module.exports = { uploadPhotos, uploadSingle }
