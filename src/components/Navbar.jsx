import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Globe, Menu, X, Activity, ChevronDown, Zap } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { t } from '../i18n/translations'

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export default function Navbar() {
  const { lang, dark, toggleDark, changeLang, isAuthenticated, currentRole, demoRole } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t(lang, 'nav_home') },
    { to: '/queue', label: t(lang, 'nav_queue') },
    ...(isAuthenticated ? [{ to: currentRole === 'doctor' ? '/doctor' : '/receptionist', label: t(lang, 'nav_dashboard') }] : []),
  ]

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-mist/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center shadow-teal group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-lg text-obsidian dark:text-ivory">
              Clinic<span className="text-teal">Brain</span>
            </span>
            {demoRole && (
              <span className="chip chip-amber text-[10px] ml-1">DEMO</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${location.pathname === link.to
                    ? 'bg-teal/10 text-teal'
                    : 'text-slate hover:text-obsidian hover:bg-mist/60 dark:text-sage dark:hover:text-ivory'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Lang Picker */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="btn-ghost text-xs gap-1"
              >
                <Globe className="w-4 h-4" />
                {LANGS.find(l => l.code === lang)?.flag}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 card py-1.5 z-50"
                  >
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { changeLang(l.code); setLangOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-mist/60 transition-colors
                          ${lang === l.code ? 'text-teal font-semibold' : 'text-slate dark:text-sage'}`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode */}
            <button
              onClick={toggleDark}
              className="btn-ghost w-9 h-9 p-0 justify-center"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Book CTA */}
            {!isAuthenticated && (
              <Link to="/#book" className="btn-primary hidden sm:inline-flex text-xs px-4 py-2">
                <Zap className="w-3.5 h-3.5" />
                {t(lang, 'book_now')}
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="btn-ghost w-9 h-9 p-0 justify-center md:hidden"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden glass border-t border-mist/40"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate hover:text-obsidian hover:bg-mist/60"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                <Link to="/#book" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center text-xs">
                  {t(lang, 'book_now')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
