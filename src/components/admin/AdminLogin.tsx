import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import logo from "../../assets/Logo.svg"

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const success = await login(password)
    if (success) {
      navigate('/tigre')
    } else {
      setError('Contraseña incorrecta')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hunyadi-yellow-50 via-white to-poppy-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-hunyadi-yellow-200">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h2>
            <p className="text-gray-600">
              Acceso restringido para administradores
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-poppy focus:border-transparent transition-all"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-poppy to-off-red text-white py-3 px-4 rounded-lg hover:from-off-red hover:to-poppy transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-poppy transition-colors"
            >
              ← Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
