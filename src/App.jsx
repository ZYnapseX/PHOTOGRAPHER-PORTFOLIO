import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CursorProvider } from './context/CursorContext'
import { AuthProvider } from './context/AuthContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { usePrefersReducedMotion } from './hooks/useMediaQuery'

import { Preloader } from './components/common/Preloader'
import { CustomCursor } from './components/common/Cursor'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { PageTransition } from './components/common/PageTransition'

import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Album from './pages/Album'
import About from './pages/About'
import Services from './pages/Services'
import Booking from './pages/Booking'
import Contact from './pages/Contact'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPhotos from './pages/admin/Photos'
import AdminAlbums from './pages/admin/Albums'
import AdminBookings from './pages/admin/Bookings'
import AdminCategories from './pages/admin/Categories'
import AdminServices from './pages/admin/Services'
import AdminServiceForm from './pages/admin/ServiceForm'
import AdminSettings from './pages/admin/Settings'
import AdminAlbumForm from './pages/admin/AlbumForm'

import './styles/globals.css'

function AppContent() {
    const location = useLocation()
    const reducedMotion = usePrefersReducedMotion()
    useSmoothScroll(!reducedMotion)

    // Check if we're on admin routes
    const isAdminRoute = location.pathname.startsWith('/admin')

    if (isAdminRoute) {
        return (
            <>
                <CustomCursor />
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="photos" element={<AdminPhotos />} />
                        <Route path="albums" element={<AdminAlbums />} />
                        <Route path="albums/create" element={<AdminAlbumForm />} />
                        <Route path="albums/:id" element={<AdminAlbumForm />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="services/create" element={<AdminServiceForm />} />
                        <Route path="services/:id" element={<AdminServiceForm />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>
                </Routes>
            </>
        )
    }

    return (
        <>
            <CustomCursor />
            <Header />
            <main>
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/portfolio/:slug" element={<Album />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </PageTransition>
                </AnimatePresence>
            </main>
            <Footer />
        </>
    )
}

export default function App() {
    const [loaded, setLoaded] = useState(false)

    return (
        <AuthProvider>
            <CursorProvider>
                <BrowserRouter>
                    {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
                    {loaded && <AppContent />}
                </BrowserRouter>
            </CursorProvider>
        </AuthProvider>
    )
}

