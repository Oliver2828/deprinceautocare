import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiBox, FiFileText, FiUsers,
  FiBarChart2, FiLogOut, FiMenu, FiX
} from 'react-icons/fi'
import { GiExpense } from "react-icons/gi"
import { FaChartLine } from "react-icons/fa"
import { MdQueryStats } from "react-icons/md"

const menuItems = [
//   { id: 'over-view',      label: 'Dashboard',         icon: FiGrid,       to: '/invendash' },
  { id: 'newrecords',     label: 'Add Sales',  icon: FiBox,        to: '/daily-sales/new-sales' },
  { id: 'productlist',    label: 'Check Sales',       icon: FiUsers,      to: '/daily-sales/check-sales' },
  
]

export default function SideBar({
  initialOpen = false,
  onLogout = () => {},
  onExpand = () => {},
  onCollapse = () => {},
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [activeItem, setActiveItem] = useState('over-view')
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  const navigate = useNavigate()

  useEffect(() => {
    isOpen ? onExpand?.() : onCollapse?.()
  }, [isOpen])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024 && initialOpen) setIsOpen(true)
      if (window.innerWidth < 1024 && !initialOpen) setIsOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initialOpen])

  const isMobile = windowWidth < 1024
  const OPEN_PX  = windowWidth < 768 ? 280 : 260
  const CLOSED_PX = windowWidth < 768 ? 0 : 72

  const sidebarVariants = {
    open:   { width: OPEN_PX,   transition: { type: 'spring', stiffness: 320, damping: 32 } },
    closed: { width: CLOSED_PX, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  }
  const mobileSidebarVariants = {
    open:   { x: 0,        transition: { type: 'spring', stiffness: 320, damping: 32 } },
    closed: { x: -OPEN_PX, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    onLogout()
    navigate("/")
  }

  /* ─── Inline styles (no Tailwind conflicts) ─── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .cof-sidebar {
      font-family: 'DM Sans', sans-serif;
      background: #fff;
      border-right: 1px solid #fde8e8;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: fixed;
      top: 0; left: 0;
      z-index: 50;
      overflow: hidden;
      box-shadow: 4px 0 24px rgba(200,0,0,0.07);
    }

    /* scarlet accent line on the right edge */
    .cof-sidebar::after {
      content: '';
      position: absolute;
      right: 0; top: 0;
      width: 3px; height: 100%;
      background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%);
      pointer-events: none;
    }

    /* ── Header ── */
    .cof-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px 16px;
      border-bottom: 1px solid #fde8e8;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    }

    .cof-logo-mark {
      width: 40px; height: 40px;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
      border: 1.5px solid rgba(255,255,255,0.35);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      backdrop-filter: blur(4px);
    }
    .cof-logo-mark span {
      font-family: 'Playfair Display', serif;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    }

    .cof-brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }
    .cof-brand-sub {
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* ── Profile ── */
    .cof-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid #fde8e8;
    }
    .cof-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #dc2626, #991b1b);
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(220,38,38,0.35);
    }
    .cof-profile-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a0505;
      white-space: nowrap;
    }
    .cof-profile-role {
      font-size: 10px;
      color: #dc2626;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* ── Nav section label ── */
    .cof-section-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #ccc;
      padding: 14px 18px 4px;
      white-space: nowrap;
    }

    /* ── Nav items ── */
    .cof-nav {
      flex: 1;
      overflow-y: auto;
      padding: 6px 10px 10px;
      scrollbar-width: none;
    }
    .cof-nav::-webkit-scrollbar { display: none; }

    .cof-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 9px 10px;
      border-radius: 8px;
      text-decoration: none;
      color: #555;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
    }
    .cof-nav-item:hover {
      background: #fff1f1;
      color: #dc2626;
    }
    .cof-nav-item.active {
      background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(220,38,38,0.3);
    }
    .cof-nav-item.active .cof-icon { color: #fff; }

    .cof-icon {
      flex-shrink: 0;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
    }
    .cof-nav-item.active .cof-icon { color: #fff; }

    /* active left pip */
    .cof-nav-item.active::before {
      content: '';
      position: absolute;
      left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 60%;
      border-radius: 0 3px 3px 0;
      background: rgba(255,255,255,0.5);
    }

    /* ── Divider ── */
    .cof-divider {
      height: 1px;
      background: #fde8e8;
      margin: 8px 10px;
    }

    /* ── Logout ── */
    .cof-logout {
      padding: 10px;
      border-top: 1px solid #fde8e8;
    }
    .cof-logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 9px 10px;
      border-radius: 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #dc2626;
      font-size: 13px;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.15s;
      white-space: nowrap;
      overflow: hidden;
    }
    .cof-logout-btn:hover { background: #fff1f1; }

    /* ── Mobile hamburger ── */
    .cof-hamburger {
      display: none;
    }
    @media (max-width: 1023px) {
      .cof-hamburger {
        display: flex;
        position: fixed;
        top: 14px; left: 14px;
        z-index: 60;
        width: 40px; height: 40px;
        border-radius: 8px;
        background: linear-gradient(135deg, #dc2626, #991b1b);
        color: #fff;
        border: none;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(220,38,38,0.4);
      }
    }

    .cof-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 40;
    }
  `

  const isExpanded = isOpen || !isMobile

  return (
    <>
      <style>{css}</style>

      {/* Mobile hamburger */}
      <button
        className="cof-hamburger"
        onClick={() => setIsOpen(s => !s)}
        aria-label="Toggle menu"
        style={{ opacity: isOpen && isMobile ? 0 : 1, pointerEvents: isOpen && isMobile ? 'none' : 'auto' }}
      >
        <FiMenu size={18} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="cof-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="cof-sidebar"
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={isMobile ? 'closed' : false}
        onMouseEnter={() => { if (!isMobile) setIsOpen(true) }}
        onMouseLeave={() => { if (!isMobile && !initialOpen) setIsOpen(false) }}
        style={{ minWidth: isMobile ? 0 : CLOSED_PX, maxWidth: isMobile ? '85vw' : 'none' }}
      >
        {/* Header */}
        <div className="cof-header">
          <div className="cof-logo-mark">
            <span> AC</span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <div className="cof-brand-title">Auto_Care</div>
                <div className="cof-brand-sub">Management Portal</div>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', marginLeft: 'auto' }}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="cof-profile">
          <div className="cof-avatar">AC</div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
              >
                <div className="cof-profile-name">Welcome Back</div>
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="cof-nav">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="cof-section-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Main Menu
              </motion.div>
            )}
          </AnimatePresence>

          {menuItems.map((item, i) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            // small divider before Expenses
            const showDivider = item.id === 'expenses'

            return (
              <React.Fragment key={item.id}>
                {showDivider && <div className="cof-divider" />}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={item.to}
                    className={`cof-nav-item${isActive ? ' active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.id)
                      if (isMobile) setIsOpen(false)
                    }}
                  >
                    <motion.span
                      className="cof-icon"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <Icon size={17} />
                    </motion.span>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          key={`label-${item.id}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.13 }}
                          style={{ flex: 1 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              </React.Fragment>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="cof-logout">
          <motion.button
            className="cof-logout-btn"
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.span whileHover={{ scale: 1.1 }} style={{ display: 'flex' }}>
              <FiLogOut size={17} />
            </motion.span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  key="logout-label"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.13 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}