import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Category, ApiResponse } from '../../types'

interface CategoryFormProps {
  category: Category | null
  onSubmitSuccess: () => void
  onCancel: () => void
}

const CategoryForm = ({
  category,
  onSubmitSuccess,
  onCancel
}: CategoryFormProps) => {
  const [title, setTitle] = useState(category?.title || '')
  const [headerUrl, setHeaderUrl] = useState(category?.header || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const API_URL = 'http://192.168.0.80:3001/api'

  useEffect(() => {
    if (category) {
      setTitle(category.title)
      setHeaderUrl(category.header)
    }
  }, [category])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = {
        title,
        header: headerUrl
      }
      
      let response
      
      if (category) {
        response = await axios.put(`${API_URL}/categories/${category.id}`, data)
      } else {
        response = await axios.post(`${API_URL}/categories`, data)
      }
      
      if (response.data.success) {
        onSubmitSuccess()
      } else {
        setError(response.data.message || 'Error al guardar la categoría')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error en la solicitud')
      } else {
        setError('Error de conexión')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título de la categoría
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hunyadi-yellow-500 focus:border-transparent transition-all"
          placeholder="Nombre de la categoría"
          required
        />
      </div>
      
      <div>
        <label htmlFor="header" className="block text-sm font-medium text-gray-700 mb-2">
          URL de la imagen de cabecera
        </label>
        <input
          type="url"
          id="header"
          value={headerUrl}
          onChange={(e) => setHeaderUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hunyadi-yellow-500 focus:border-transparent transition-all"
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
        
        {headerUrl && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
            <img
              src={headerUrl}
              alt="Vista previa"
              className="h-32 w-full object-cover rounded-md border border-gray-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png'
                e.currentTarget.className += ' bg-gray-100'
              }}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunyadi-yellow-500 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hunyadi-yellow-500 hover:bg-hunyadi-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunyadi-yellow-500 disabled:opacity-50 transition-all"
        >
          {loading ? 'Guardando...' : (category ? 'Actualizar' : 'Crear')} Categoría
        </button>
      </div>
    </form>
  )
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const API_URL = 'http://192.168.0.80:3001/api'
  
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/categories`)
      if (response.data.success) {
        setCategories(response.data.data)
      } else {
        setError('Error al cargar categorías')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro que quieres eliminar esta categoría? Esto puede afectar a los productos asociados.')) return
    
    try {
      const response = await axios.delete(`${API_URL}/categories/${id}`)
      if (response.data.success) {
        fetchCategories()
      } else {
        setError('Error al eliminar la categoría')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    }
  }
  
  const openEditForm = (category: Category) => {
    setEditCategory(category)
    setShowForm(true)
  }
  
  const closeForm = () => {
    setShowForm(false)
    setEditCategory(null)
  }

  // Filtrar categorías
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="mt-1 text-gray-600">Administra las categorías de productos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-hunyadi-yellow-500 hover:bg-hunyadi-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar categoría
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre de la categoría..."
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hunyadi-yellow-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredCategories.length} de {categories.length} categorías
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunyadi-yellow-500"></div>
          <p className="ml-4 text-gray-500">Cargando categorías...</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'No se encontraron categorías con el término de búsqueda'
                  : 'Comienza creando tu primera categoría'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-hunyadi-yellow-500 hover:bg-hunyadi-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    + Crear Categoría
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {category.header ? (
                      <img
                        src={category.header}
                        alt={category.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.png'
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">ID: {category.id}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(category)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-500">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <CategoryForm
                category={editCategory}
                onSubmitSuccess={() => {
                  fetchCategories()
                  closeForm()
                }}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
