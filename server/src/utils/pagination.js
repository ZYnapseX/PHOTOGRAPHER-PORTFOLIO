function paginate(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    return { skip, take: limit }
}

function formatPagination(total, page, limit) {
    const totalPages = Math.ceil(total / limit)
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    }
}

module.exports = { paginate, formatPagination }
