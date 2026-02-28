'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Updated and reordered navigation items
  const navItems = [
    { name: 'Reports', href: '/report-download' },
    { name: 'Users Management', href: '/user-crud' },
    { name: 'QR', href: '/dashboard/qr-crud' },
    { name: 'Factories', href: '/factory' },
    { name: 'Download App', href: 'https://drive.google.com/file/d/1Oo7J1pmQvwb2ANvkryuO5lAdWbFr5V1R' }, // New Item Added
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080883] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <div className="flex h-10 w-auto items-center">
            <Image src="/logocomm.png" alt="SRM Logo" width={190} height={4} priority />
          </div>
        </Link>

        {/* MOBILE TOGGLE */}
        <button className="max-[1050px]:flex hidden text-white bg-transparent border-0 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden min-[1051px]:flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm relative overflow-visible">
          {navItems.map((item) => {
            // Check if link is external to handle opening in new tab
            const isExternal = item.href.startsWith('http');
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  {/* FLUID ACTIVE PILL */}
                  {isActive(item.href) && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0 bg-gray-100 rounded-full" 
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                    />
                  )}
                  <span className={`px-4 py-2 text-sm font-medium rounded-full z-10 transition-colors ${isActive(item.href) ? 'text-[#080883]' : 'text-gray-600 hover:text-[#080883]'}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            )
          })}

          {/* USER AVATAR */}
          <div className="relative ml-1 z-50" ref={userMenuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#080883]/10 hover:shadow transition-shadow"
            >
              <User className="h-5 w-5 text-[#080883]" />
            </motion.button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <button onClick={() => router.push('/')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Log out</button>
                  <button onClick={() => router.push('/login')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Switch User</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="max-[1050px]:block hidden border-t bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => {
                const isExternal = item.href.startsWith('http');

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => !isExternal && setIsMobileMenuOpen(false)} // Don't close menu if opening in new tab
                    className={`block rounded-md px-3 py-2 font-medium ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="border-t pt-3">
                <button onClick={() => router.push('/login')} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">Login</button>
                <button className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">Log out</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar