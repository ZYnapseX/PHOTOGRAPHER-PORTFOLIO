const { prisma } = require('../config/database')
const { asyncHandler } = require('../utils/asyncHandler')
const { success } = require('../utils/responseHelpers')

const getPublicSettings = asyncHandler(async (req, res) => {
    const settings = await prisma.setting.findMany({
        where: { isPublic: true }
    })

    const result = {}
    settings.forEach(s => {
        result[s.key] = s.value
    })

    success(res, result)
})

const getAllSettings = asyncHandler(async (req, res) => {
    const settings = await prisma.setting.findMany({
        orderBy: { group: 'asc' }
    })
    success(res, settings)
})

const updateSettings = asyncHandler(async (req, res) => {
    // Handle both single update { key, value } and generic updates
    const updates = req.body
    const settingsToUpdate = []

    if (updates.key && updates.value !== undefined) {
        // Single update
        settingsToUpdate.push(updates)
    } else {
        // Assume object with keys?? No, backend shouldn't assume structure it doesn't know. 
        // If it's a bulk object { group: { key: value } }, let's ignore that for now as frontend sends single items.
        // But to be safe, let's just handle what frontend sends.
    }

    // Actually, frontend sends { key, value } via settingsApi.update(u).
    // So req.body is { key, value }.

    if (updates.key) {
        const updated = await prisma.setting.update({
            where: { key: updates.key },
            data: { value: updates.value }
        })
        return success(res, updated)
    }

    // If it ever needs to handle bulk, we can add it later.
    // For now, let's keep it simple and safe.

    success(res, [])
})

module.exports = {
    getPublicSettings,
    getAllSettings,
    updateSettings
}
