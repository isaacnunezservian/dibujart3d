import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import type { Product, Category, ApiResponse } from '../../types'
import ProductForm from './ProductForm'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    loading: true,
    error: ''
  })

  // Estados para el modal de nuevo producto
  const [showProductForm, setShowProductForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const API_URL = 'https://tigre-backend-195623852400.southamerica-east1.run.app/api'

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get<ApiResponse<Product[]>>(`${API_URL}/products`),
        axios.get<ApiResponse<Category[]>>(`${API_URL}/categories`)
      ])

      setStats({
        totalProducts: productsRes.data.success ? productsRes.data.data.length : 0,
        totalCategories: categoriesRes.data.success ? categoriesRes.data.data.length : 0,
        loading: false,
        error: ''
      })

      // Guardar las categorías para el formulario
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data)
      }
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estadísticas'
      }))
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleNewProductClick = () => {
    setShowProductForm(true)
  }

  const handleProductFormClose = () => {
    setShowProductForm(false)
  }

  const handleProductFormSuccess = () => {
    setShowProductForm(false)
    fetchStats() // Actualizar las estadísticas después de crear un producto
  }

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-poppy"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Gestiona tu inventario de productos
        </p>
      </div>

      {/* Error Display */}
      {stats.error && (
        <div className="p-4 border-l-4 border-red-400 rounded-md bg-red-50">
          <p className="text-red-700">{stats.error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-poppy">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Productos
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {/* <div className="px-5 py-3 bg-gray-50">
            <div className="text-sm">
              <Link 
                to="/tigre/products" 
                className="font-medium transition-colors text-poppy hover:text-off-red"
              >
                Gestionar productos(catálogo) →
              </Link>
            </div>
          </div> */}
        </div>

        {/* <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-hunyadi-yellow-500">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Categorías
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalCategories}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50">
            <div className="text-sm">
              <Link 
                to="/tigre/categories" 
                className="font-medium transition-colors text-hunyadi-yellow-600 hover:text-hunyadi-yellow-700"
              >
                Gestionar categorías →
              </Link>
            </div>
          </div>
        </div> */}
{/* 
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-off-red">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Promedio productos/categoría
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalCategories > 0 
                      ? Math.round(stats.totalProducts / stats.totalCategories * 10) / 10 
                      : 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50">
            <div className="text-sm">
              <Link 
                to="/" 
                className="font-medium transition-colors text-off-red hover:text-red-600"
              >
                Ver catálogo público →
              </Link>
            </div>
          </div>
        </div> */}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={handleNewProductClick}
              className="relative p-4 text-center transition-all transform rounded-lg group bg-poppy hover:bg-off-red hover:scale-105"
            >
              <div className="text-white">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="font-medium">Nuevo Producto</p>
              </div>
            </button>

            {/* <Link
              to="/tigre/categories"
              className="relative p-4 text-center transition-all transform rounded-lg group bg-hunyadi-yellow-500 hover:bg-hunyadi-yellow-600 hover:scale-105"
            >
              <div className="text-white">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="font-medium">Nueva Categoría</p>
              </div>
            </Link> */}

            <Link
              to="/tigre/products"
              className="relative p-4 text-center transition-all transform rounded-lg group bg-night hover:bg-night-700 hover:scale-105"
            >
              <div className="text-white">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="font-medium">Editar productos</p>
              </div>
            </Link>

            <Link
              to="/"
              className="relative p-4 text-center transition-all transform bg-gray-600 rounded-lg group hover:bg-gray-700 hover:scale-105"
            >
              <div className="text-white">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="font-medium">Volver a  Inventario</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal para Nuevo Producto */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-full max-w-2xl max-h-screen mx-4 overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Nuevo Producto
              </h2>
              <button onClick={handleProductFormClose} className="text-gray-400 hover:text-gray-500">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                product={null}
                categories={categories}
                onSubmitSuccess={handleProductFormSuccess}
                onCancel={handleProductFormClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard


