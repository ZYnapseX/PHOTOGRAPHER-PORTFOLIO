function generateSlug(text) {
    const translitMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }

    let result = text.toLowerCase()
    
    for (const [cyr, lat] of Object.entries(translitMap)) {
        result = result.replace(new RegExp(cyr, 'g'), lat)
    }

    return result
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

async function ensureUniqueSlug(prisma, model, slug, excludeId = null) {
    let uniqueSlug = slug
    let counter = 1
    
    while (true) {
        const where = { slug: uniqueSlug }
        if (excludeId) where.id = { not: excludeId }
        
        const exists = await prisma[model].findFirst({ where })
        if (!exists) break
        
        uniqueSlug = `${slug}-${counter}`
        counter++
    }
    
    return uniqueSlug
}

module.exports = { generateSlug, ensureUniqueSlug }
