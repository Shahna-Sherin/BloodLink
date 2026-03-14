import { Link } from 'react-router-dom'
import { Moon, Sun, Droplets, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { dark, setDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Find Donors' },
    { to: '/compatibility', label: '🧬 Compatibility' },
    { to: '/register', label: 'Become a Donor' },
    { to: '/request', label: 'Request Blood' },
    { to: '/admin', label: 'Admin' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Droplets className="text-red-500" size={28} />
          <span className="text-xl font-bold text-red-500">BloodLink</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Dark Mode + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}