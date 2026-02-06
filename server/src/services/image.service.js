const sharp = require('sharp')
const path = require('path')
const fs = require('fs').promises
const config = require('../config')
const { photoPaths } = require('../config/storage')
const { generateFilename } = require('../utils/helpers')

async function processUploadedImage(file) {
    const image = sharp(file.path)
    const metadata = await image.metadata()

    const filename = generateFilename(file.originalname)
    const baseName = path.parse(filename).name
    const ext = '.jpg'

    const paths = {
        original: path.join(photoPaths.original, `${baseName}-original${ext}`),
        large: path.join(photoPaths.large, `${baseName}-large${ext}`),
        medium: path.join(photoPaths.medium, `${baseName}-medium${ext}`),
        small: path.join(photoPaths.small, `${baseName}-small${ext}`),
        thumbnail: path.join(photoPaths.thumbnail, `${baseName}-thumb${ext}`)
    }

    await image
        .resize(4000, 4000, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toFile(paths.original)

    await sharp(file.path)
        .resize(config.image.sizes.large, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: config.image.quality })
        .toFile(paths.large)

    await sharp(file.path)
        .resize(config.image.sizes.medium, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: config.image.quality })
        .toFile(paths.medium)

    await sharp(file.path)
        .resize(config.image.sizes.small, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(paths.small)

    await sharp(file.path)
        .resize(config.image.sizes.thumbnail, config.image.sizes.thumbnail, { fit: 'cover' })
        .jpeg({ quality: 75 })
        .toFile(paths.thumbnail)

    await fs.unlink(file.path).catch(() => {})

    const dominantColor = await extractDominantColor(paths.thumbnail)

    const relativePaths = {
        pathOriginal: `/uploads/photos/original/${path.basename(paths.original)}`,
        pathLarge: `/uploads/photos/large/${path.basename(paths.large)}`,
        pathMedium: `/uploads/photos/medium/${path.basename(paths.medium)}`,
        pathSmall: `/uploads/photos/small/${path.basename(paths.small)}`,
        pathThumbnail: `/uploads/photos/thumbnail/${path.basename(paths.thumbnail)}`
    }

    return {
        filename: baseName + ext,
        originalName: file.originalname,
        mimeType: 'image/jpeg',
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        dominantColor,
        ...relativePaths
    }
}

async function extractDominantColor(imagePath) {
    try {
        const { dominant } = await sharp(imagePath)
            .resize(1, 1)
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data }) => ({
                dominant: `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`
            }))
        return dominant
    } catch {
        return '#888888'
    }
}

async function deleteImageFiles(photo) {
    const basePath = path.join(__dirname, '..', '..')
    
    const filesToDelete = [
        photo.pathOriginal,
        photo.pathLarge,
        photo.pathMedium,
        photo.pathSmall,
        photo.pathThumbnail
    ]

    for (const filePath of filesToDelete) {
        if (filePath) {
            const fullPath = path.join(basePath, filePath)
            await fs.unlink(fullPath).catch(() => {})
        }
    }
}

module.exports = { processUploadedImage, deleteImageFiles, extractDominantColor }
