# Photographer Portfolio API

## Author
**ZynapseX**

## Description
Full-featured REST API for a photographer portfolio website with authentication, image uploads, bookings, and email notifications.

## Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (access + refresh tokens)
- **Image Processing:** Sharp
- **Email:** Nodemailer
- **Validation:** Zod

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation

```bash
cd server
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your database and email credentials
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Server will be available at `http://localhost:5000`

## Default Admin Credentials

- **Email:** admin@alexandravolkova.co.uk
- **Password:** Admin123!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Public
- `GET /api/categories` - List categories
- `GET /api/albums` - List albums
- `GET /api/photos` - List photos
- `GET /api/services` - List services
- `GET /api/testimonials` - List testimonials
- `POST /api/bookings` - Create booking
- `POST /api/contact` - Send message
- `GET /api/settings/public` - Get public settings

### Admin (requires authentication)
- Dashboard stats, CRUD for photos, albums, categories, services, bookings, testimonials, messages, settings, calendar

## License
MIT
