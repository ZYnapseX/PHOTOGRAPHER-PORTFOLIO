const path = require('path')
const fs = require('fs').promises
const config = require('./index')

const uploadsPath = path.join(__dirname, '..', '..', config.upload.dir)

const photoPaths = {
    original: path.join(uploadsPath, 'photos', 'original'),
    large: path.join(uploadsPath, 'photos', 'large'),
    medium: path.join(uploadsPath, 'photos', 'medium'),
    small: path.join(uploadsPath, 'photos', 'small'),
    thumbnail: path.join(uploadsPath, 'photos', 'thumbnail')
}

const avatarsPath = path.join(uploadsPath, 'avatars')
const tempPath = path.join(uploadsPath, 'temp')

async function ensureDirectories() {
    const dirs = [
        ...Object.values(photoPaths),
        avatarsPath,
        tempPath
    ]

    for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true })
    }
}

module.exports = {
    uploadsPath,
    photoPaths,
    avatarsPath,
    tempPath,
    ensureDirectories
}
