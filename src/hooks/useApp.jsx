import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext({})

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en')
  const [dark, setDark] = useState(false)
  const [demoRole, setDemoRole] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('cb_lang')
    const savedDark = localStorage.getItem('cb_dark')
    if (savedLang) setLang(savedLang)
    if (savedDark === 'true') setDark(true)
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
    setProfile({
      role,
      full_name: role === 'doctor' ? 'Dr. Ananya Mehta' : role === 'receptionist' ? 'Ritu Gupta' : 'Patient'
    })
  }

  const isAuthenticated = !!demoRole
  const currentRole = profile?.role || demoRole

  return (
    <AppContext.Provider value={{
      profile, lang, dark, demoRole, currentRole,
      isAuthenticated, toggleDark, changeLang, activateDemo, setProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
