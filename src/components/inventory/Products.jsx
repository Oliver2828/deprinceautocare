// Product.jsx - Enhanced Product List View with Working Pagination
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Package, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

function Product() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  
  // Pagination states
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

    const refresh = () => {
      setLoading(true)
      fetchProducts()
    }

    // listen for any event that indicates inventory changed
    window.addEventListener('sale-added', refresh)
    window.addEventListener('inventory-updated', refresh)

    return () => {
      window.removeEventListener('sale-added', refresh)
      window.removeEventListener('inventory-updated', refresh)
    }
  }, [])

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter and sort products
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, sortBy])

  const totalValue = filtered.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  const lowStockCount = filtered.filter(p => p.quantity <= 5).length

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (quantity <= 5) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' }
    if (quantity <= 20) return { label: 'Limited', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i)
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products Inventory</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your auto care product catalog</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {lowStockCount}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, category, or brand..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price (High to Low)</option>
                <option value="quantity">Sort by Quantity (Low to High)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600" size={20} />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 to-red-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <Package className="mx-auto text-gray-400 mb-3" size={40} />
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((product, index) => {
                      const stockStatus = getStockStatus(product.quantity)
                      const globalIndex = indexOfFirstItem + index + 1
                      return (
                        <tr 
                          key={product.id} 
                          className="hover:bg-red-50/30 transition group"
                        >
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <span className="font-mono">{globalIndex.toString().padStart(2, '0')}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-white rounded-lg flex items-center justify-center mr-3">
                                <Package className="text-red-600" size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-400">ID: {product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{product.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                              {product.brand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${
                              product.quantity <= 5 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {product.quantity.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">
                              ₦{product.price.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">
                              ₦{(product.price * product.quantity).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium text-gray-900">
                {Math.min(indexOfLastItem, filtered.length)}
              </span>{' '}
              of <span className="font-medium text-gray-900">{filtered.length}</span> products
            </p>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Product





// import React, { useState, useEffect } from 'react'

// function Product() {
//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')

//   useEffect(() => {
//     // Replace this with your API call later
//     // e.g. fetch('/api/products').then(res => res.json()).then(data => setProducts(data))
//   }, [])

//   const filtered = products.filter(p =>
//     p.name.toLowerCase().includes(search.toLowerCase()) ||
//     p.category.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <div className="p-6">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Products</h2>
//           <p className="text-sm text-gray-400 mt-0.5">All DePrince AutoCare inventory</p>
//         </div>
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search product..."
//           className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-400 transition w-56"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full text-sm">

//           <thead>
//             <tr className="bg-gradient-to-br from-red-600 to-red-700 text-white">
//               <th className="text-left px-4 py-3 font-semibold">#</th>
//               <th className="text-left px-4 py-3 font-semibold">Product Name</th>
//               <th className="text-left px-4 py-3 font-semibold">Category</th>
//               <th className="text-left px-4 py-3 font-semibold">Brand</th>
//               <th className="text-left px-4 py-3 font-semibold">Quantity</th>
//               <th className="text-left px-4 py-3 font-semibold">Price (₦)</th>
//               <th className="text-left px-4 py-3 font-semibold">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-gray-400">
//                   No products yet
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((product, index) => (
//                 <tr
//                   key={product.id}
//                   className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//                 >
//                   <td className="px-4 py-3 text-gray-400">{index + 1}</td>
//                   <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
//                   <td className="px-4 py-3 text-gray-500">{product.category}</td>
//                   <td className="px-4 py-3">
//                     <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-lg">
//                       {product.brand}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">{product.quantity}</td>
//                   <td className="px-4 py-3 text-gray-700">₦{product.price.toLocaleString()}</td>
//                   <td className="px-4 py-3">
//                     {product.quantity <= 5 ? (
//                       <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">Low Stock</span>
//                     ) : (
//                       <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">In Stock</span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>

//         </table>
//       </div>

//       {/* Footer */}
//       <p className="text-sm text-gray-400 mt-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

//     </div>
//   )
// }

// export default Product