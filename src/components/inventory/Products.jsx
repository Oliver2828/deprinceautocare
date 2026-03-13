// Product.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Package, ChevronDown, ChevronLeft, ChevronRight, Edit2, Clock } from 'lucide-react'

function Product() {
  const [products, setProducts] = useState([])
  const [history, setHistory] = useState([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/products', {
        baseURL: import.meta.env.VITE_BACKEND_URL || 'https://deprinceautocare-backend.onrender.com',
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    const refresh = () => { setLoading(true); fetchProducts() }
    window.addEventListener('sale-added', refresh)
    window.addEventListener('inventory-updated', refresh)
    return () => {
      window.removeEventListener('sale-added', refresh)
      window.removeEventListener('inventory-updated', refresh)
    }
  }, [])

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filtered = products
    .filter(p =>
      (search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      ) &&
      (categoryFilter === 'all' || p.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'quantity') return a.quantity - b.quantity
      return 0
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [search, categoryFilter, sortBy])

  const handleEdit = async (prod) => {
    const qtyStr = prompt('Enter new quantity', prod.quantity)
    if (qtyStr == null) return
    const qty = parseInt(qtyStr, 10)
    if (isNaN(qty) || qty < 0) { alert('Invalid quantity'); return }
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/products/${prod._id || prod.id}`, { quantity: qty }, {
        baseURL: import.meta.env.VITE_BACKEND_URL || 'https://deprinceautocare-backend.onrender.com',
        headers: { Authorization: `Bearer ${token}` },
      })
      window.dispatchEvent(new Event('inventory-updated'))
    } catch (err) {
      alert('Failed to update product quantity')
    }
  }

  const openHistory = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/products/${id}`, {
        baseURL: import.meta.env.VITE_BACKEND_URL || 'https://deprinceautocare-backend.onrender.com',
        headers: { Authorization: `Bearer ${token}` },
      })
      setHistory(res.data.history || [])
      setShowHistoryModal(true)
    } catch (err) {
      alert('Could not fetch history')
    }
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (quantity <= 5) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' }
    if (quantity <= 20) return { label: 'Limited', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  const totalValue = filtered.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  const lowStockCount = filtered.filter(p => p.quantity <= 5).length

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...'); pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1); pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1); pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...'); pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your auto care product catalog</p>
        </div>

        {/* Stats — 2 col on mobile, 4 col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total Products', value: filtered.length },
            { label: 'Inventory Value', value: `₦${totalValue.toLocaleString()}` },
            { label: 'Low Stock Items', value: lowStockCount, red: lowStockCount > 0 },
            { label: 'Categories', value: categories.length - 1 },
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-red-50 to-white p-3 sm:p-4 rounded-xl border border-red-100">
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className={`text-lg sm:text-2xl font-bold ${stat.red ? 'text-red-600' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category or brand..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition bg-white"
                >
                  <option value="name">Sort: Name</option>
                  <option value="price">Sort: Price</option>
                  <option value="quantity">Sort: Qty</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 to-red-700">
                    {['#', 'Product', 'Category', 'Brand', 'Quantity', 'Unit Price', 'Total Value', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <Package className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-500 font-medium">No products found</p>
                      </td>
                    </tr>
                  ) : currentItems.map((product, index) => {
                    const status = getStockStatus(product.quantity)
                    return (
                      <tr key={product.id} className="hover:bg-red-50/20 transition">
                        <td className="px-4 py-4 text-sm text-gray-400 font-mono">{(indexOfFirstItem + index + 1).toString().padStart(2, '0')}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                              <Package className="text-red-600" size={14} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                              <p className="text-xs text-gray-400">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-4 py-4">
                          <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">{product.brand}</span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{product.quantity}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">₦{product.price.toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">₦{(product.price * product.quantity).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="px-4 py-4 flex gap-3">
                          <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 transition"><Edit2 size={16} /></button>
                          <button onClick={() => openHistory(product._id || product.id)} className="text-gray-400 hover:text-gray-700 transition"><Clock size={16} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <Package className="mx-auto text-gray-300 mb-3" size={36} />
              <p className="text-gray-500 font-medium">No products found</p>
            </div>
          ) : currentItems.map((product, index) => {
            const status = getStockStatus(product.quantity)
            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className={`font-semibold ${product.quantity <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Unit Price</p>
                    <p className="font-semibold text-gray-900">₦{product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Value</p>
                    <p className="font-semibold text-gray-900">₦{(product.price * product.quantity).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Brand</p>
                    <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{product.brand}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button onClick={() => handleEdit(product)} className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-800 transition">
                    <Edit2 size={14} /> Edit Qty
                  </button>
                  <button onClick={() => openHistory(product._id || product.id)} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition">
                    <Clock size={14} /> History
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'}`}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {getPageNumbers().map((page, i) => (
                page === '...' ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-red-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:text-red-600'}`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[80vh] overflow-auto">
              <h2 className="text-lg font-bold mb-4">Edit History</h2>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No quantity changes recorded.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {history.map((h, i) => (
                    <li key={i} className="text-gray-700">
                      {new Date(h.date).toLocaleString()} — <strong>{h.oldQuantity}</strong> → <strong>{h.newQuantity}</strong>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setShowHistoryModal(false)} className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:opacity-90 transition">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Product