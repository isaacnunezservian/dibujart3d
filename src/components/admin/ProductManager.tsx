import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product, Category, ApiResponse } from '../../types'
import ProductForm from './ProductForm'

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const API_URL = 'https://tigre-backend-195623852400.southamerica-east1.run.app/api'
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/products`)
      if (response.data.success) {
        setProducts(response.data.data)
      } else {
        setError('Error al cargar productos')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/categories`)
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro que quieres eliminar este producto?')) return
    
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`)
      if (response.data.success) {
        fetchProducts()
      } else {
        setError('Error al eliminar el producto')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    }
  }
  
  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }
  
  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editá o eliminá los productos</h1>
        </div>
        {/* <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 font-medium text-white transition-colors rounded-lg bg-poppy hover:bg-off-red"
        >
          
    </button> */}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-l-4 border-red-400 rounded-md bg-red-50">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Buscar producto
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del producto..."
              className="w-full px-3 py-2 transition-all border border-gray-300 rounded-md focus:ring-2 focus:ring-poppy focus:border-transparent"
            />
          </div>
          
        
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-poppy"></div>
          <p className="ml-4 text-gray-500">Cargando productos...</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'No se encontraron productos con el término de búsqueda'
                  : 'Comienza creando tu primer producto'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 font-medium text-white transition-colors rounded-lg bg-poppy hover:bg-off-red"
                  >
                    + Crear Producto
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Colores
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hunyadi-yellow-100 text-hunyadi-yellow-800">
                          {categories.find(c => c.id === product.categoryId)?.title || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap max-w-xs gap-1">
                          {product.colors.slice(0, 3).map((color, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{product.colors.length - 3} más
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-md">
                          {product.imagePath ? (
                            <img
                              src={product.imagePath}
                              alt={product.name}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.png'
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-x-2 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-blue-600 transition-colors hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 transition-colors hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductForm 
              product={editingProduct} 
              categories={categories}
              onSubmitSuccess={() => {
                closeForm();
                fetchProducts(); // Recargar productos después de guardar
              }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManager
