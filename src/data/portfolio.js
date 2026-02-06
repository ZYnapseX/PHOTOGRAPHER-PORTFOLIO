export const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'weddings', name: 'Weddings' },
    { id: 'portraits', name: 'Portraits' },
    { id: 'commercial', name: 'Commercial' }
]

export const albums = [
    {
        id: 'anna-michael-wedding',
        slug: 'anna-michael-wedding',
        title: 'Anna & Michael',
        category: 'weddings',
        description: 'An intimate summer wedding at Kensington Palace Gardens with stunning floral arrangements and heartfelt moments.',
        cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        date: '2024-06-15',
        location: 'London, UK',
        photos: [
            { id: 'am1', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80', alt: 'Wedding ceremony' },
            { id: 'am2', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80', alt: 'First dance' },
            { id: 'am3', src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80', alt: 'Wedding rings' },
            { id: 'am4', src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80', alt: 'Bouquet toss' },
            { id: 'am5', src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80', alt: 'Couple portrait' },
            { id: 'am6', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80', alt: 'Reception' }
        ]
    },
    {
        id: 'coastal-romance',
        slug: 'coastal-romance',
        title: 'Coastal Romance',
        category: 'weddings',
        description: 'A breathtaking seaside ceremony in Cornwall with dramatic cliffs and golden hour light.',
        cover: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
        date: '2024-09-22',
        location: 'Cornwall, UK',
        photos: [
            { id: 'cr1', src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80', alt: 'Coastal ceremony' },
            { id: 'cr2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', alt: 'Sunset vows' },
            { id: 'cr3', src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80', alt: 'Beach walk' },
            { id: 'cr4', src: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=80', alt: 'Cliff portrait' }
        ]
    },
    {
        id: 'summer-portraits',
        slug: 'summer-portraits',
        title: 'Summer Portraits',
        category: 'portraits',
        description: 'A golden hour portrait session capturing natural beauty and authentic expressions.',
        cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
        date: '2024-07-10',
        location: 'Hyde Park, London',
        photos: [
            { id: 'sp1', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80', alt: 'Portrait 1' },
            { id: 'sp2', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80', alt: 'Portrait 2' },
            { id: 'sp3', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80', alt: 'Portrait 3' },
            { id: 'sp4', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80', alt: 'Portrait 4' }
        ]
    },
    {
        id: 'aurora-cosmetics',
        slug: 'aurora-cosmetics',
        title: 'Aurora Cosmetics',
        category: 'commercial',
        description: 'Product photography for Aurora Cosmetics spring collection featuring luxury skincare.',
        cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        date: '2024-03-20',
        location: 'Studio, London',
        photos: [
            { id: 'ac1', src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80', alt: 'Product shot' },
            { id: 'ac2', src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80', alt: 'Lifestyle shot' },
            { id: 'ac3', src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80', alt: 'Makeup flatlay' }
        ]
    },
    {
        id: 'family-johnsons',
        slug: 'family-johnsons',
        title: 'The Johnson Family',
        category: 'portraits',
        description: 'A warm family portrait session at their countryside home in the Cotswolds.',
        cover: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
        date: '2024-08-05',
        location: 'Cotswolds, UK',
        photos: [
            { id: 'fj1', src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80', alt: 'Family portrait' },
            { id: 'fj2', src: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=1200&q=80', alt: 'Garden shot' },
            { id: 'fj3', src: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=1200&q=80', alt: 'Candid moment' }
        ]
    },
    {
        id: 'heritage-estate',
        slug: 'heritage-estate',
        title: 'Heritage Estate Wedding',
        category: 'weddings',
        description: 'A classic English countryside wedding at a beautiful Georgian manor house.',
        cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        date: '2024-05-18',
        location: 'Oxfordshire, UK',
        photos: [
            { id: 'he1', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80', alt: 'Manor house' },
            { id: 'he2', src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80', alt: 'Garden ceremony' },
            { id: 'he3', src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80', alt: 'Reception dinner' },
            { id: 'he4', src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80', alt: 'Evening dance' }
        ]
    }
]

export const featuredPhotos = [
    albums[0].photos[0],
    albums[2].photos[0],
    albums[1].photos[0],
    albums[3].photos[0],
    albums[4].photos[0],
    albums[5].photos[0]
]

export function getAlbumBySlug(slug) {
    return albums.find(a => a.slug === slug)
}

export function getAlbumsByCategory(category) {
    if (category === 'all') return albums
    return albums.filter(a => a.category === category)
}

export function getRelatedAlbums(albumId, limit = 3) {
    const current = albums.find(a => a.id === albumId)
    if (!current) return []

    return albums
        .filter(a => a.id !== albumId && a.category === current.category)
        .slice(0, limit)
}
