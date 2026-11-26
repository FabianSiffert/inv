import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

const themePreferences: ThemePreference[] = ['system', 'light', 'dark']

const themeStorageKey = 'inv-theme-preference'
const legacyThemeStorageKey = 'inv-theme'
const darkSchemeQuery = '(prefers-color-scheme: dark)'

interface ContextProps {
  themePreference: ThemePreference
  darkTheme: boolean
  cycleTheme: () => void
}

export const ThemeContext = createContext<ContextProps>({
  themePreference: 'system',
  darkTheme: false,
  cycleTheme: () => {}
})

interface Props {
  children?: React.ReactNode
}

export const nextThemePreference = (preference: ThemePreference): ThemePreference =>
  themePreferences[(themePreferences.indexOf(preference) + 1) % themePreferences.length]

const isThemePreference = (value: unknown): value is ThemePreference => themePreferences.some((preference) => preference == value)

// The legacy key was written on every visit, so a stored 'light' was never an explicit choice; only 'dark' carries over.
const readStoredPreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(themeStorageKey)
    if (isThemePreference(stored)) {
      return stored
    }
    return window.localStorage.getItem(legacyThemeStorageKey) == 'dark' ? 'dark' : 'system'
  } catch {
    return 'system'
  }
}

const writeStoredPreference = (preference: ThemePreference) => {
  try {
    window.localStorage.setItem(themeStorageKey, preference)
    window.localStorage.removeItem(legacyThemeStorageKey)
  } catch {
    return
  }
}

const prefersDarkScheme = (): boolean => window.matchMedia(darkSchemeQuery).matches

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [themePreference, setThemePreference] = useState(readStoredPreference)
  const [systemDark, setSystemDark] = useState(prefersDarkScheme)
  const darkTheme = themePreference == 'dark' || (themePreference == 'system' && systemDark)

  useEffect(() => {
    const query = window.matchMedia(darkSchemeQuery)
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light')
  }, [darkTheme])

  const cycleTheme = useCallback(() => {
    const next = nextThemePreference(themePreference)
    setThemePreference(next)
    writeStoredPreference(next)
  }, [themePreference])

  const contextValue = useMemo(() => ({ themePreference, darkTheme, cycleTheme }), [themePreference, darkTheme, cycleTheme])

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
