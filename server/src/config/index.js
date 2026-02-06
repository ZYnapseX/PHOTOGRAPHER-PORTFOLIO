module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    apiPrefix: process.env.API_PREFIX || '/api',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },

    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,

    upload: {
        maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 20971520,
        allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp').split(','),
        dir: process.env.UPLOADS_DIR || 'uploads'
    },

    image: {
        quality: parseInt(process.env.IMAGE_QUALITY, 10) || 85,
        sizes: {
            large: 1920,
            medium: 1200,
            small: 800,
            thumbnail: 400
        }
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100
    },

    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM,
        adminEmail: process.env.ADMIN_EMAIL
    }
}
