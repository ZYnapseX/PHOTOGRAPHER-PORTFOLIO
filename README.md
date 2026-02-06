# Photographer Portfolio Platform

A modern, high-performance portfolio website designed for photographers. Built with a focus on aesthetics, smooth animations, and a powerful content management system.

![Home Page](public/screenshots/home-preview.png)
*(Place a screenshot here named home-preview.png)*

## ✨ Features

- **Immersive Gallery**: Masonry grid layout with lazy loading and custom lightbox.
- **Smooth Animations**: Powered by Framer Motion and Lenis Scroll for a premium feel.
- **Admin Dashboard**: Full control over photos, albums, categories, and services.
- **Booking System**: Clients can book sessions directly through the site with date availability checks.
- **Responsive**: Flawless experience on mobile, tablet, and desktop.

## 🛠 Tech Stack

**Frontend**
- React 18 & Vite
- Framer Motion (Animations)
- CSS Modules (Styling)
- React Router 6

**Backend**
- Node.js & Express
- Prisma ORM (SQLite for dev / PostgreSQL ready)
- Sharp (Image processing)
- JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/photographer-portfolio.git
   cd photographer-portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (Frontend)
   npm install

   # Install server dependencies
   cd server
   npm install
   ```

3. **Environment Setup**
   - Create `.env` in the `server` folder (copy from `.env.example`).
   - Run database migrations:
     ```bash
     cd server
     npx prisma migrate dev --name init
     npm run seed  # Optional: Seeds default admin user
     ```

4. **Run Development Servers**
   Open two terminals:

   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

   The site will open at `http://localhost:5173`.

## 🔐 Admin Access

To access the CMS, navigate to `/admin`.

- **Default Email:** `admin@volkova-photo.ru`
- **Default Password:** `demo123`

*(Change these credentials immediately after deployment via the Settings page)*

## 📸 Screenshots

| Dashboard | Photo Management |
|-----------|------------------|
| ![Dashboard](public/screenshots/dashboard.png) | ![Photos](public/screenshots/photos.png) |

| Booking Flow | Mobile View |
|--------------|-------------|
| ![Booking](public/screenshots/booking.png) | ![Mobile](public/screenshots/mobile.png) |

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
