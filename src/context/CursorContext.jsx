import { createContext, useContext, useState, useCallback } from 'react'

const CursorContext = createContext(null)

export function CursorProvider({ children }) {
    const [cursorType, setCursorType] = useState('default')
    const [cursorText, setCursorText] = useState('')

    const setCursor = useCallback((type, text = '') => {
        setCursorType(type)
        setCursorText(text)
    }, [])

    const resetCursor = useCallback(() => {
        setCursorType('default')
        setCursorText('')
    }, [])

    const value = {
        cursorType,
        cursorText,
        setCursor,
        resetCursor
    }

    return (
        <CursorContext.Provider value={value}>
            {children}
        </CursorContext.Provider>
    )
}

export function useCursor() {
    const context = useContext(CursorContext)
    if (!context) {
        throw new Error('useCursor must be used within CursorProvider')
    }
    return context
}
