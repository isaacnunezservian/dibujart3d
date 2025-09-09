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
  const [name, setName] = useState(product?.name || '')
  const [colorInput, setColorInput] = useState('')
  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [categoryId, setCategoryId] = useState<number>(product?.categoryId || categories[0]?.id || 0)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(product?.imagePath)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const API_URL = 'http://192.168.0.80:3001/api'

  useEffect(() => {
    if (product) {
      setName(product.name)
      setColors(product.colors)
      setCategoryId(product.categoryId)
      setPreviewUrl(product.imagePath)
    }
  }, [product])
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Validaciones mejoradas
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
    
    if (categoryId === 0) {
      setError('Debes seleccionar una categoría')
      setLoading(false)
      return
    }
    
    // Imagen es opcional ahora

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('colors', JSON.stringify(colors))
      formData.append('categoryId', categoryId.toString())
      
      if (image) {
        formData.append('image', image)
      }
      
      // Log para depuración
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      let response
      
      if (product) {
        response = await axios.put(`${API_URL}/products/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        response = await axios.post(`${API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      if (response.data.success) {
        onSubmitSuccess()
      } else {
        setError(response.data.message || 'Error al guardar el producto')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Log más detallado del error
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del producto
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
            placeholder="Ingresa el nombre del producto"
            required
          />
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colores disponibles
          </label>
          <div className="flex">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow border border-gray-300 rounded-md rounded-r-none shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
              placeholder="Añadir color y presiona Enter..."
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-poppy text-white py-2 px-4 rounded-md rounded-l-none hover:bg-off-red transition-colors font-medium"
            >
              Agregar
            </button>
          </div>
          
          {colors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-hunyadi-yellow-100 to-hunyadi-yellow-200 text-hunyadi-yellow-800 px-3 py-1 rounded-full text-sm flex items-center border border-hunyadi-yellow-300"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="ml-2 text-hunyadi-yellow-600 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {colors.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Añade al menos un color para el producto
            </p>
          )}
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del producto (opcional)
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {previewUrl && (
              <div className="flex-shrink-0">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="h-20 w-20 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
            <div className="flex-grow">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-poppy file:text-white hover:file:bg-off-red transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF hasta 5MB (opcional)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-poppy transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || colors.length === 0}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-poppy hover:bg-off-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-poppy disabled:opacity-50 transition-all"
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')} Producto
        </button>
      </div>
    </form>
  )
}

export default ProductForm
