import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const AppContext = createContext({})

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lang, setLang] = useState('en')
  const [dark, setDark] = useState(false)
  const [demoRole, setDemoRole] = useState(null) // 'patient' | 'doctor' | 'receptionist'

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Persisted prefs
    const savedLang = localStorage.getItem('cb_lang')
    const savedDark = localStorage.getItem('cb_dark')
    if (savedLang) setLang(savedLang)
    if (savedDark === 'true') setDark(true)

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('cb_dark', dark)
  }, [dark])

  const toggleDark = () => setDark(d => !d)

  const changeLang = (l) => {
    setLang(l)
    localStorage.setItem('cb_lang', l)
  }

  const activateDemo = (role) => {
    setDemoRole(role)
    setProfile({ role, full_name: role === 'doctor' ? 'Dr. Ananya Mehta' : role === 'receptionist' ? 'Receptionist Ritu' : 'Patient' })
  }

  const isAuthenticated = !!user || !!demoRole
  const currentRole = profile?.role || demoRole

  return (
    <AppContext.Provider value={{
      user, profile, lang, dark, demoRole, currentRole,
      isAuthenticated, toggleDark, changeLang, activateDemo, setUser, setProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
