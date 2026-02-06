const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categories = [
    { id: 'weddings', name: 'Weddings', sortOrder: 1 },
    { id: 'portraits', name: 'Portraits', sortOrder: 2 },
    { id: 'commercial', name: 'Commercial', sortOrder: 3 }
]

const albums = [
    {
        slug: 'anna-michael-wedding',
        title: 'Anna & Michael',
        category: 'weddings',
        description: 'An intimate summer wedding at Kensington Palace Gardens with stunning floral arrangements and heartfelt moments.',
        cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        date: '2024-06-15T00:00:00Z',
        location: 'London, UK',
        photos: [
            { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80', alt: 'Wedding ceremony' },
            { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80', alt: 'First dance' },
            { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80', alt: 'Wedding rings' },
            { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80', alt: 'Bouquet toss' },
            { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80', alt: 'Couple portrait' },
            { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80', alt: 'Reception' }
        ]
    },
    {
        slug: 'coastal-romance',
        title: 'Coastal Romance',
        category: 'weddings',
        description: 'A breathtaking seaside ceremony in Cornwall with dramatic cliffs and golden hour light.',
        cover: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
        date: '2024-09-22T00:00:00Z',
        location: 'Cornwall, UK',
        photos: [
            { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80', alt: 'Coastal ceremony' },
            { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', alt: 'Sunset vows' },
            { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80', alt: 'Beach walk' },
            { src: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=80', alt: 'Cliff portrait' }
        ]
    },
    {
        slug: 'summer-portraits',
        title: 'Summer Portraits',
        category: 'portraits',
        description: 'A golden hour portrait session capturing natural beauty and authentic expressions.',
        cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
        date: '2024-07-10T00:00:00Z',
        location: 'Hyde Park, London',
        photos: [
            { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80', alt: 'Portrait 1' },
            { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80', alt: 'Portrait 2' },
            { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80', alt: 'Portrait 3' },
            { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80', alt: 'Portrait 4' }
        ]
    },
    {
        slug: 'aurora-cosmetics',
        title: 'Aurora Cosmetics',
        category: 'commercial',
        description: 'Product photography for Aurora Cosmetics spring collection featuring luxury skincare.',
        cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        date: '2024-03-20T00:00:00Z',
        location: 'Studio, London',
        photos: [
            { src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80', alt: 'Product shot' },
            { src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80', alt: 'Lifestyle shot' },
            { src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80', alt: 'Makeup flatlay' }
        ]
    },
    {
        slug: 'family-johnsons',
        title: 'The Johnson Family',
        category: 'portraits',
        description: 'A warm family portrait session at their countryside home in the Cotswolds.',
        cover: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
        date: '2024-08-05T00:00:00Z',
        location: 'Cotswolds, UK',
        photos: [
            { src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80', alt: 'Family portrait' },
            { src: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=1200&q=80', alt: 'Garden shot' },
            { src: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=1200&q=80', alt: 'Candid moment' }
        ]
    },
    {
        slug: 'heritage-estate',
        title: 'Heritage Estate Wedding',
        category: 'weddings',
        description: 'A classic English countryside wedding at a beautiful Georgian manor house.',
        cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        date: '2024-05-18T00:00:00Z',
        location: 'Oxfordshire, UK',
        photos: [
            { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80', alt: 'Manor house' },
            { src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80', alt: 'Garden ceremony' },
            { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80', alt: 'Reception dinner' },
            { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80', alt: 'Evening dance' }
        ]
    }
]

async function main() {
    console.log('Start migrating data...')

    // 1. Create/Update Categories
    const categoryMap = {}
    for (const cat of categories) {
        // Use slug-like logic for cleaner URLs if needed, or just name
        const slug = cat.id // Using id as slug from static data

        // Find existing or create
        // We look up by name or slug if we had one.
        // Let's first search by name loops 
        let category = await prisma.category.findFirst({
            where: { slug: slug }
        })

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: cat.name,
                    slug: slug,
                    description: `${cat.name} photography`,
                    sortOrder: cat.sortOrder
                }
            })
            console.log(`Created category: ${cat.name}`)
        } else {
            console.log(`Found category: ${cat.name}`)
        }
        categoryMap[cat.id] = category.id
    }

    // 2. Create Albums & Photos
    for (const albumData of albums) {
        const categoryId = categoryMap[albumData.category]
        if (!categoryId) {
            console.warn(`Category not found for album ${albumData.title}, skipping...`)
            continue
        }

        let album = await prisma.album.findUnique({
            where: { slug: albumData.slug }
        })

        if (!album) {
            album = await prisma.album.create({
                data: {
                    title: albumData.title,
                    slug: albumData.slug,
                    description: albumData.description,
                    location: albumData.location,
                    shootDate: new Date(albumData.date),
                    categoryId: categoryId,
                    isPublished: true,
                    coverImage: albumData.cover,
                    isFeatured: true
                }
            })
            console.log(`Created album: ${album.title}`)
        } else {
            // Update cover if needed
            await prisma.album.update({
                where: { id: album.id },
                data: { coverImage: albumData.cover }
            })
            console.log(`Updated album: ${album.title}`)
        }

        // Create Photos for this album
        for (const photoData of albumData.photos) {
            // Check if photo exists via source url (assuming unique)
            // But we don't have a unique source url field indexed, so we just add them if not present?
            // Or simpler: just add them.
            // Let's try to match by filename or just create.

            // We'll create a dummy "filename" from the URL for valid storage
            const filename = `migrated-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`

            await prisma.photo.create({
                data: {
                    filename: filename,
                    originalName: 'unsplash-image.jpg',
                    mimeType: 'image/jpeg',
                    size: 0,
                    pathOriginal: photoData.src,
                    pathLarge: photoData.src,
                    pathMedium: photoData.src,
                    pathSmall: photoData.src,
                    pathThumbnail: photoData.src,
                    width: 1200,
                    height: 800,
                    title: photoData.alt,
                    albumId: album.id
                }
            })
        }
        console.log(`Added ${albumData.photos.length} photos to ${album.title}`)
    }

    console.log('Migration finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
