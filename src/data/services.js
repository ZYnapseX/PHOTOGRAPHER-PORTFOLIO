export const services = [
    {
        id: 'weddings',
        name: 'Wedding Photography',
        description: 'Capturing your special day with a blend of documentary and fine art styles. Every moment, every emotion, preserved forever.',
        packages: [
            {
                id: 'wedding-essential',
                name: 'Essential',
                price: 1500,
                duration: '6 hours coverage',
                features: [
                    '6 hours of photography',
                    '300+ edited photographs',
                    'Online gallery',
                    'Print release included',
                    'Pre-wedding consultation'
                ],
                popular: false
            },
            {
                id: 'wedding-classic',
                name: 'Classic',
                price: 2500,
                duration: '10 hours coverage',
                features: [
                    '10 hours of photography',
                    '500+ edited photographs',
                    'Engagement session included',
                    'Second photographer',
                    'Premium online gallery',
                    'USB with high-res images',
                    'Print release included'
                ],
                popular: true
            },
            {
                id: 'wedding-premium',
                name: 'Premium',
                price: 4000,
                duration: 'Full day coverage',
                features: [
                    'Full day coverage',
                    '800+ edited photographs',
                    'Engagement session',
                    'Second photographer',
                    'Drone photography',
                    'Luxury photo album',
                    'Parent albums (2)',
                    'Same-day preview'
                ],
                popular: false
            }
        ]
    },
    {
        id: 'portraits',
        name: 'Portrait Sessions',
        description: 'Whether for personal branding, family memories, or creative expression. Professional portraits that tell your story.',
        packages: [
            {
                id: 'portrait-mini',
                name: 'Mini Session',
                price: 200,
                duration: '30 minutes',
                features: [
                    '30 minute session',
                    '10 edited photographs',
                    'One location',
                    'Online gallery',
                    'Print release'
                ],
                popular: false
            },
            {
                id: 'portrait-standard',
                name: 'Standard',
                price: 400,
                duration: '1 hour',
                features: [
                    '1 hour session',
                    '25 edited photographs',
                    'Up to 2 outfit changes',
                    'Two locations',
                    'Online gallery',
                    'Print release'
                ],
                popular: true
            },
            {
                id: 'portrait-creative',
                name: 'Creative',
                price: 750,
                duration: '2 hours',
                features: [
                    '2 hour session',
                    '50 edited photographs',
                    'Unlimited outfit changes',
                    'Multiple locations',
                    'Hair & makeup guide',
                    'Fine art retouching',
                    'Print credit £100'
                ],
                popular: false
            }
        ]
    },
    {
        id: 'commercial',
        name: 'Commercial Photography',
        description: 'Professional imagery for brands, products, and corporate clients. Elevate your visual presence.',
        packages: [
            {
                id: 'commercial-half',
                name: 'Half Day',
                price: 800,
                duration: '4 hours',
                features: [
                    '4 hours shooting',
                    '20 final images',
                    'Basic retouching',
                    'Commercial license',
                    'Web resolution delivery'
                ],
                popular: false
            },
            {
                id: 'commercial-full',
                name: 'Full Day',
                price: 1500,
                duration: '8 hours',
                features: [
                    '8 hours shooting',
                    '40 final images',
                    'Advanced retouching',
                    'Commercial license',
                    'High-res delivery',
                    'Rush delivery available'
                ],
                popular: true
            },
            {
                id: 'commercial-campaign',
                name: 'Campaign',
                price: 3500,
                duration: 'Multi-day',
                features: [
                    'Multi-day production',
                    '100+ final images',
                    'Creative direction',
                    'Full commercial rights',
                    'Video b-roll option',
                    'Dedicated project manager'
                ],
                popular: false
            }
        ]
    }
]

export const additionalServices = [
    { name: 'Extra hour of coverage', price: '£150/hour' },
    { name: 'Second photographer', price: '£400/day' },
    { name: 'Rush editing (48 hours)', price: '£200' },
    { name: 'Fine art prints', price: 'From £50' },
    { name: 'Photo album design', price: 'From £300' },
    { name: 'Drone photography', price: '£250' }
]

export function formatPrice(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0
    }).format(amount)
}
