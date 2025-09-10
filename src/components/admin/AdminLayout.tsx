import { Link, useLocation } from 'react-router-dom'

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

const AdminLayout = ({ children, onLogout }: AdminLayoutProps) => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-poppy" onClick={onLogout}>Volver a Inventario</h1>
              <nav className="flex ml-8 space-x-8">
                <Link
                  to="/tigre"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === '/tigre'
                      ? 'border-poppy text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Panel de Admin
                </Link>
                {/* <Link
                  to="/tigre/products"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === '/tigre/products'
                      ? 'border-poppy text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Productos
                </Link> */}
                {/* <Link
                  to="/tigre/categories"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === '/tigre/categories'
                      ? 'border-poppy text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Categorías
                </Link> */}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-500 transition-colors rounded-md hover:text-gray-700"
              >
                Ver Catálogo
              </Link> */}
              {/* <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-poppy hover:bg-off-red"
              >
                Cerrar Sesión
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
