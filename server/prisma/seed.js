const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash('Admin123!', 12)

    await prisma.user.upsert({
        where: { email: 'admin@alexandravolkova.co.uk' },
        update: {},
        create: {
            email: 'admin@alexandravolkova.co.uk',
            passwordHash,
            name: 'Alexandra Volkova',
            role: 'SUPER_ADMIN'
        }
    })

    const categories = [
        { name: 'Weddings', slug: 'weddings', description: 'Beautiful wedding photography capturing your special day', sortOrder: 1 },
        { name: 'Portraits', slug: 'portraits', description: 'Professional portrait photography', sortOrder: 2 },
        { name: 'Commercial', slug: 'commercial', description: 'Commercial and brand photography', sortOrder: 3 },
        { name: 'Events', slug: 'events', description: 'Corporate and private event coverage', sortOrder: 4 }
    ]

    const createdCategories = {}
    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat
        })
        createdCategories[cat.slug] = created.id
    }

    const services = [
        {
            name: 'Wedding Essential',
            slug: 'wedding-essential',
            shortDescription: 'Perfect for intimate ceremonies',
            description: 'A complete wedding photography package for smaller celebrations. Includes pre-wedding consultation, 6 hours coverage, and beautifully edited digital images.',
            categoryId: createdCategories['weddings'],
            price: 1500,
            duration: '6 hours',
            features: JSON.stringify(['Pre-wedding consultation', '6 hours coverage', '200+ edited photos', 'Online gallery', 'Print release']),
            includes: JSON.stringify(['All photos in high resolution', 'Professional colour grading', 'Online gallery for 1 year']),
            sortOrder: 1
        },
        {
            name: 'Wedding Premium',
            slug: 'wedding-premium',
            shortDescription: 'Full day coverage with second photographer',
            description: 'Comprehensive wedding coverage from preparation to party. Includes second photographer and luxury album.',
            categoryId: createdCategories['weddings'],
            price: 2800,
            duration: '10 hours',
            features: JSON.stringify(['Full day coverage', 'Second photographer', '500+ edited photos', 'Luxury album', 'Engagement shoot']),
            includes: JSON.stringify(['All photos in high resolution', 'Luxury 30-page album', 'Engagement session included']),
            isPopular: true,
            sortOrder: 2
        },
        {
            name: 'Portrait Session',
            slug: 'portrait-session',
            shortDescription: 'Studio or location portrait session',
            description: 'Professional portrait photography for individuals, couples, or families.',
            categoryId: createdCategories['portraits'],
            price: 250,
            duration: '1 hour',
            features: JSON.stringify(['1 hour session', '20+ edited photos', 'Outfit changes', 'Online gallery']),
            includes: JSON.stringify([]),
            sortOrder: 1
        },
        {
            name: 'Corporate Headshots',
            slug: 'corporate-headshots',
            shortDescription: 'Professional business portraits',
            description: 'High-quality headshots for your team and corporate communications.',
            categoryId: createdCategories['commercial'],
            price: 150,
            priceFrom: true,
            duration: '30 min per person',
            features: JSON.stringify(['Professional lighting', 'Multiple backgrounds', '5 edited photos per person', 'Fast turnaround']),
            includes: JSON.stringify([]),
            sortOrder: 1
        },
        {
            name: 'Event Coverage',
            slug: 'event-coverage',
            shortDescription: 'Corporate and private events',
            description: 'Professional photography for conferences, parties, and celebrations.',
            categoryId: createdCategories['events'],
            price: 500,
            priceFrom: true,
            duration: 'Half day',
            features: JSON.stringify(['Professional coverage', 'Quick turnaround', 'High resolution images', 'Online gallery']),
            includes: JSON.stringify([]),
            sortOrder: 1
        }
    ]

    for (const service of services) {
        await prisma.service.upsert({
            where: { slug: service.slug },
            update: service,
            create: service
        })
    }

    const settings = [
        { key: 'siteName', value: 'Alexandra Volkova Photography', group: 'general', isPublic: true },
        { key: 'siteDescription', value: 'Professional photographer based in London', group: 'general', isPublic: true },
        { key: 'contactEmail', value: 'hello@alexandravolkova.co.uk', group: 'general', isPublic: true },
        { key: 'contactPhone', value: '+44 20 7946 0958', group: 'general', isPublic: true },
        { key: 'address', value: 'London, United Kingdom', group: 'general', isPublic: true }
    ]

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: setting,
            create: setting
        })
    }

    const testimonials = [
        {
            clientName: 'Emma & James',
            text: 'Alexandra captured our wedding day perfectly. Every photo tells a story and we could not be happier with the results.',
            rating: 5,
            serviceType: 'Wedding Photography',
            isPublished: true,
            isFeatured: true,
            sortOrder: 1
        },
        {
            clientName: 'Sarah Thompson',
            text: 'The family portrait session was so relaxed and fun. Alexandra made even our kids feel comfortable in front of the camera.',
            rating: 5,
            serviceType: 'Family Portrait',
            isPublished: true,
            sortOrder: 2
        }
    ]

    for (const testimonial of testimonials) {
        await prisma.testimonial.create({ data: testimonial })
    }

    console.log('Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
