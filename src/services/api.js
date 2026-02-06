const API_BASE = 'http://localhost:5000/api'

let accessToken = localStorage.getItem('accessToken')
let refreshToken = localStorage.getItem('refreshToken')

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`

    const headers = {
        ...options.headers
    }

    if (accessToken && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(options.body)
    }

    let response = await fetch(url, { ...options, headers })

    if (response.status === 401 && refreshToken && !options.skipAuth) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
            headers['Authorization'] = `Bearer ${accessToken}`
            response = await fetch(url, { ...options, headers })
        }
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
    }

    return data
}

async function refreshAccessToken() {
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (!res.ok) {
            logout()
            return false
        }

        const data = await res.json()
        accessToken = data.data.accessToken
        localStorage.setItem('accessToken', accessToken)
        return true
    } catch {
        logout()
        return false
    }
}

function setTokens(tokens) {
    accessToken = tokens.accessToken
    refreshToken = tokens.refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}

function logout() {
    accessToken = null
    refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}

export const authApi = {
    login: (email, password) => request('/auth/login', {
        method: 'POST',
        body: { email, password },
        skipAuth: true
    }).then(res => {
        setTokens(res.data.tokens)
        return res.data
    }),

    logout: () => request('/auth/logout', {
        method: 'POST',
        body: { refreshToken }
    }).finally(logout),

    getMe: () => request('/auth/me'),

    updateProfile: (data) => request('/auth/profile', {
        method: 'PUT',
        body: data
    }),

    changePassword: (data) => request('/auth/password', {
        method: 'PUT',
        body: data
    })
}

export const dashboardApi = {
    getStats: () => request('/admin/dashboard/stats')
}

export const photosApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/photos${query ? '?' + query : ''}`)
    },

    upload: (files, categoryId, albumId) => {
        const formData = new FormData()
        files.forEach(f => formData.append('photos', f))
        if (categoryId) formData.append('categoryId', categoryId)
        if (albumId) formData.append('albumId', albumId)
        return request('/admin/photos', { method: 'POST', body: formData })
    },

    update: (id, data) => request(`/admin/photos/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/photos/${id}`, { method: 'DELETE' }),

    bulkDelete: (ids) => request('/admin/photos/bulk-delete', { method: 'POST', body: { ids } }),

    reorder: (albumId, photos) => request('/admin/photos/reorder', {
        method: 'PUT',
        body: { albumId, photos }
    }),

    move: (photoIds, albumId) => request('/admin/photos/move', {
        method: 'POST',
        body: { photoIds, albumId }
    })
}

export const albumsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/albums${query ? '?' + query : ''}`)
    },

    getOne: (id) => request(`/admin/albums/${id}`),

    create: (data) => request('/admin/albums', { method: 'POST', body: data }),

    update: (id, data) => request(`/admin/albums/${id}`, { method: 'PUT', body: data }),

    delete: (id, deletePhotos = false) => request(`/admin/albums/${id}?deletePhotos=${deletePhotos}`, { method: 'DELETE' })
}

export const categoriesApi = {
    getAll: () => request('/admin/categories'),

    create: (data) => request('/admin/categories', { method: 'POST', body: data }),

    update: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' })
}

export const servicesApi = {
    getAll: () => request('/admin/services'),

    create: (data) => request('/admin/services', { method: 'POST', body: data }),

    update: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/services/${id}`, { method: 'DELETE' })
}

export const bookingsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/bookings${query ? '?' + query : ''}`)
    },

    getOne: (id) => request(`/admin/bookings/${id}`),

    update: (id, data) => request(`/admin/bookings/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/bookings/${id}`, { method: 'DELETE' })
}

export const testimonialsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/testimonials${query ? '?' + query : ''}`)
    },

    create: (data) => request('/admin/testimonials', { method: 'POST', body: data }),

    update: (id, data) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' })
}

export const messagesApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/messages${query ? '?' + query : ''}`)
    },

    getOne: (id) => request(`/admin/messages/${id}`),

    update: (id, data) => request(`/admin/messages/${id}`, { method: 'PUT', body: data }),

    delete: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' })
}

export const calendarApi = {
    getCalendar: (month, year) => request(`/admin/calendar?month=${month}&year=${year}`),

    blockDate: (date, reason) => request('/admin/calendar/block', {
        method: 'POST',
        body: { date, reason }
    }),

    unblockDate: (id) => request(`/admin/calendar/block/${id}`, { method: 'DELETE' })
}

export const settingsApi = {
    getAll: () => request('/admin/settings'),

    update: (data) => request('/admin/settings', { method: 'PUT', body: data })
}

export const publicApi = {
    getAlbums: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/public/albums${query ? '?' + query : ''}`, { skipAuth: true })
    },

    getAlbum: (slug) => request(`/public/albums/${slug}`, { skipAuth: true }),

    getCategories: () => request(`/public/categories`, { skipAuth: true }),

    getServices: () => request(`/public/services`, { skipAuth: true }),

    createBooking: (data) => request(`/public/bookings`, { method: 'POST', body: data, skipAuth: true }),

    sendMessage: (data) => request(`/public/contact`, { method: 'POST', body: data, skipAuth: true })
}

export { logout, setTokens }
