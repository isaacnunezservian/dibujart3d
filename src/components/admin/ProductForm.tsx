import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product, Category } from '../../types'

interface ProductFormProps {
  product: Product | null
  categories: Category[]
  onSubmitSuccess: () => void
  onCancel: () => void
}

const ProductForm = ({
  product,
  categories,
  onSubmitSuccess,
  onCancel
}: ProductFormProps) => {
  // Estados principales
  const [name, setName] = useState(product?.name || '')
  const [colorInput, setColorInput] = useState('')
  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [categoryId, setCategoryId] = useState<number>(product?.categoryId || 0)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(product?.imagePath || undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Nuevo estado para tipo de operación
  const [operationType, setOperationType] = useState<'existing' | 'nocategory' | 'newcategory'>(
    product ? 'existing' : 'existing'
  )
  
  // Estados para manejo de categorías
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null)
  const [newCategoryPreview, setNewCategoryPreview] = useState<string | undefined>(undefined)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [updatedCategories, setUpdatedCategories] = useState<Category[]>(categories)
  
  const API_URL = 'https://tigre-backend-195623852400.southamerica-east1.run.app/api'

  useEffect(() => {
    setUpdatedCategories(categories)
  }, [categories])

  useEffect(() => {
    if (product) {
      setName(product.name)
      setColors(product.colors)
      setCategoryId(product.categoryId)
      setPreviewUrl(product.imagePath || undefined)
    }
  }, [product])
  
  // Función para cambiar tipo de operación y limpiar campos
  const handleOperationTypeChange = (type: 'existing' | 'nocategory' | 'newcategory') => {
    setOperationType(type)
    setError('')
    
    // Limpiar campos específicos según el cambio
    if (type === 'newcategory') {
      // Solo crear categoría: limpiar productos
      setName('')
      setColors([])
      setColorInput('')
      // Mantener campos de categoría si existen
    } else {
      // Crear producto: limpiar categoría nueva
      setNewCategoryTitle('')
      setNewCategoryImage(null)
      setNewCategoryPreview(undefined)
      setShowCategoryForm(false)
      
      if (type === 'nocategory') {
        setCategoryId(0)
      }
    }
  }
  
  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()])
      setColorInput('')
    }
  }
  
  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter(color => color !== colorToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddColor()
    }
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }
  
  const handleNewCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewCategoryImage(file)
      const url = URL.createObjectURL(file)
      setNewCategoryPreview(url)
    }
  }
  
  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) {
      setError('El título de la categoría es obligatorio')
      return
    }
    
    setCreatingCategory(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('title', newCategoryTitle.trim())
      
      if (newCategoryImage) {
        formData.append('image', newCategoryImage)
      }
      
      const response = await axios.post(`${API_URL}/categories/quick`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (response.data.success) {
        const newCategory = response.data.data
        setUpdatedCategories(prev => [...prev, newCategory])
        setCategoryId(newCategory.id)
        
        // Limpiar formulario de categoría
        setNewCategoryTitle('')
        setNewCategoryImage(null)
        setNewCategoryPreview(undefined)
        setShowCategoryForm(false)
      } else {
        setError(response.data.message || 'Error al crear la categoría')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al crear la categoría')
      } else {
        setError('Error de conexión al crear la categoría')
      }
    } finally {
      setCreatingCategory(false)
    }
  }
  
  const handleCancelCategoryForm = () => {
    setNewCategoryTitle('')
    setNewCategoryImage(null)
    setNewCategoryPreview(undefined)
    setShowCategoryForm(false)
    setError('')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Validaciones según el tipo de operación
    if (operationType === 'newcategory') {
      // Validación para crear solo categoría
      if (!newCategoryTitle.trim()) {
        setError('El título de la categoría es obligatorio')
        setLoading(false)
        return
      }
    } else {
      // Validaciones para crear producto
      if (!name.trim()) {
        setError('El nombre del producto es obligatorio')
        setLoading(false)
        return
      }
      
      if (colors.length === 0) {
        setError('Debes agregar al menos un color')
        setLoading(false)
        return
      }
      
      if (!product && operationType === 'existing' && categoryId === 0) {
        setError('Debes seleccionar una categoría')
        setLoading(false)
        return
      }
    }

    try {
      let response
      
      // MODO EDICIÓN: Solo nombre y colores con PUT + JSON
      if (product) {
        const updateData = {
          name: name.trim(),
          colors: JSON.stringify(colors)
        }
        
        response = await axios.put(`${API_URL}/products/${product.id}`, updateData, {
          headers: { 'Content-Type': 'application/json' }
        })
        
      } else if (operationType === 'newcategory') {
        // Crear solo categoría
        const formData = new FormData()
        formData.append('title', newCategoryTitle.trim())
        
        if (newCategoryImage) {
          formData.append('image', newCategoryImage)
        }
        
        response = await axios.post(`${API_URL}/categories/quick`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
      } else if (operationType === 'nocategory') {
        // Crear producto sin categoría
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('colors', JSON.stringify(colors))
        
        if (image) {
          formData.append('image', image)
        }
        
        response = await axios.post(`${API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
      } else {
        // Crear producto con categoría existente
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('colors', JSON.stringify(colors))
        formData.append('categoryId', categoryId.toString())
        
        response = await axios.post(`${API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      if (response.data.success) {
        onSubmitSuccess()
      } else {
        setError(response.data.message || 'Error al procesar la solicitud')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        setError(err.response.data.message || `Error ${err.response.status}: ${err.response.statusText}`)
      } else {
        setError('Error de conexión')
      }
      console.error('Full error object:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
      
          {/* Mensaje informativo para modo edición */}
          {product && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1">
                    Modo edición
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Solo puedes modificar el nombre y los colores del producto. La imagen y categoría no se pueden cambiar.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Selector de tipo de operación */}
          {!product && (
            <div className="mb-6 bg-gradient-to-r from-hunyadi-yellow-50 to-orange-50 border border-hunyadi-yellow-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4">
                Tipo de operación
              </label>
              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="operationType"
                    value="existing"
                    checked={operationType === 'existing'}
                    onChange={() => handleOperationTypeChange('existing')}
                    className="mt-1 h-4 w-4 text-poppy focus:ring-poppy focus:ring-2 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-poppy transition-colors">
                      Crear producto en categoría existente
                    </span>
                    
                  </div>
                </label>
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="operationType"
                    value="nocategory"
                    checked={operationType === 'nocategory'}
                    onChange={() => handleOperationTypeChange('nocategory')}
                    className="mt-1 h-4 w-4 text-poppy focus:ring-poppy focus:ring-2 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-poppy transition-colors">
                      Crear producto sin categoría
                    </span>
                    
                  </div>
                </label>
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="operationType"
                    value="newcategory"
                    checked={operationType === 'newcategory'}
                    onChange={() => handleOperationTypeChange('newcategory')}
                    className="mt-1 h-4 w-4 text-poppy focus:ring-poppy focus:ring-2 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-poppy transition-colors">
                      Crear solo una categoría (sin producto)
                    </span>
                    
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 space-y-6">
            {/* Campo de nombre - para productos o como título para categorías */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
                {operationType === 'newcategory' ? 'Título de la categoría' : 'Nombre del producto'}
                <span className="text-red-500 ml-1 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={operationType === 'newcategory' ? newCategoryTitle : name}
                  onChange={(e) => operationType === 'newcategory' ? setNewCategoryTitle(e.target.value) : setName(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl shadow-sm text-sm sm:text-base
                           focus:outline-none focus:ring-4 focus:ring-poppy/20 focus:border-poppy 
                           transition-all duration-200 hover:border-gray-300
                           placeholder:text-gray-400"
                  placeholder={operationType === 'newcategory' ? 'Ej: Figuras' : 'Nombre '}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
            </div>        {/* Selector de categoría existente - solo para operationType 'existing' Y NO edición */}
        {operationType === 'existing' && !product && (
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="space-y-3">
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
                required
              >
                <option value={0}>Selecciona una categoría</option>
                {updatedCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              
              
              {/* Formulario colapsable para crear categoría */}
              {showCategoryForm && (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Crear nueva categoría</h4>
                  
                  <div>
                    <label htmlFor="newCategoryTitle" className="block text-sm font-medium text-gray-600 mb-1">
                      Título de la categoría
                    </label>
                    <input
                      type="text"
                      id="newCategoryTitle"
                      value={newCategoryTitle}
                      onChange={(e) => setNewCategoryTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
                      placeholder="Ej: Figuras de acción"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Imagen de la categoría (opcional)
                    </label>
                    <div className="flex items-center space-x-3">
                      {newCategoryPreview && (
                        <img
                          src={newCategoryPreview}
                          alt="Vista previa categoría"
                          className="h-12 w-12 object-cover rounded-md border border-gray-300"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewCategoryImageChange}
                        className="block text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-poppy file:text-white hover:file:bg-off-red transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCancelCategoryForm}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={creatingCategory || !newCategoryTitle.trim()}
                      className="px-3 py-1 text-sm bg-poppy text-white rounded-md hover:bg-off-red disabled:opacity-50 transition-colors"
                    >
                      {creatingCategory ? 'Creando...' : 'Crear categoría'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Campos de colores - solo para productos (existing y nocategory) */}
        {operationType !== 'newcategory' && (
          <div className="sm:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
              Colores disponibles
              <span className="text-red-500 ml-1 text-lg">*</span>
            </label>
            
            {/* Input para agregar colores */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl shadow-sm text-sm sm:text-base
                           focus:outline-none focus:ring-4 focus:ring-poppy/20 focus:border-poppy 
                           transition-all duration-200 hover:border-gray-300
                           placeholder:text-gray-400"
                  placeholder="Ej: Rojo, Azul..."
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddColor}
                className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gradient-to-r from-poppy to-off-red text-white 
                         rounded-xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 
                         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-poppy/30
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!colorInput.trim()}
              >
                <span className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar
                </span>
              </button>
            </div>
            
            {/* Lista de colores agregados */}
            {colors.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Colores agregados ({colors.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-hunyadi-yellow-100 to-hunyadi-yellow-200 text-hunyadi-yellow-800 
                               px-3 py-2 rounded-xl text-sm flex items-center border border-hunyadi-yellow-300
                               shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span className="font-medium">{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full 
                                 text-hunyadi-yellow-600 hover:text-red-600 hover:bg-red-100 
                                 transition-all duration-200"
                        title={`Eliminar ${color}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mensaje cuando no hay colores */}
            {colors.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Agrega al menos un color</strong> para continuar con el producto
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Puedes usar colores básicos como "Rojo", "Azul" o ser más específico como "Azul marino"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Campo de imagen - NO mostrar en modo edición */}
        {(operationType !== 'existing' || (operationType === 'existing' && !product)) && (
          <div className="sm:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
              {operationType === 'newcategory' ? 'Imagen de la categoría' : 'Imagen del producto'}
              <span className="text-sm font-normal text-gray-500 ml-2">(opcional)</span>
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors duration-200">
              {((operationType === 'newcategory' && newCategoryPreview) || (operationType !== 'newcategory' && previewUrl)) ? (
                <div className="flex flex-col items-center space-y-4">
                  {/* Vista previa de imagen */}
                  <div className="relative">
                    <img
                      src={operationType === 'newcategory' ? newCategoryPreview : previewUrl}
                      alt="Vista previa"
                      className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (operationType === 'newcategory') {
                          setNewCategoryPreview('')
                        } else {
                          setPreviewUrl('')
                          setImage(null)
                        }
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full 
                               flex items-center justify-center hover:bg-red-600 transition-colors
                               shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Botón para cambiar imagen */}
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 
                                   rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Cambiar imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={operationType === 'newcategory' ? handleNewCategoryImageChange : handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-poppy to-off-red 
                                   text-white rounded-xl font-semibold shadow-sm hover:shadow-md 
                                   transform hover:scale-105 transition-all duration-200
                                   focus:outline-none focus:ring-4 focus:ring-poppy/30">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Seleccionar imagen
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={operationType === 'newcategory' ? handleNewCategoryImageChange : handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-3 text-sm text-gray-500">
                    PNG, JPG o GIF hasta 5MB
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recomendado: imágenes cuadradas de al menos 300x300px
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t-2 border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-xl shadow-sm 
                   text-sm sm:text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 
                   hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 
                   transition-all duration-200 hover:shadow-md"
        >
          <span className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </span>
        </button>
        
        <button
          type="submit"
          disabled={loading || (operationType !== 'newcategory' && colors.length === 0) || (operationType === 'newcategory' && !newCategoryTitle.trim())}
          className="w-full sm:w-auto px-6 py-3 sm:py-4 border-2 border-transparent rounded-xl shadow-sm 
                   text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-poppy to-off-red 
                   hover:from-off-red hover:to-night focus:outline-none focus:ring-4 focus:ring-poppy/30 
                   disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 
                   transition-all duration-200 hover:shadow-lg disabled:transform-none"
        >
          <span className="flex items-center justify-center">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {operationType === 'newcategory' ? 'Creando categoría...' : 'Guardando producto...'}
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={product ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
                {product 
                  ? 'Actualizar Producto' 
                  : (operationType === 'newcategory' 
                      ? 'Crear Categoría' 
                      : 'Crear Producto'
                    )
                }
              </>
            )}
          </span>
        </button>
      </div>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
