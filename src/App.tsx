import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import "./App.css"
import Hero from "./components/hero.tsx"
import Busqueda from "./components/busqueda.tsx"
import AdminLayout from "./components/admin/AdminLayout"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import ProductManager from "./components/admin/ProductManager"
import CategoryManager from "./components/admin/CategoryManager"

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/tigre/login" replace />
  }
  return children
}

// Componente del catálogo público
const PublicCatalog = () => {
  return (
    <>
      <Busqueda />
      <Hero />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<PublicCatalog />} />
          
          {/* Login administrativo */}
          <Route path="/tigre/login" element={<AdminLogin />} />
          
          {/* Rutas administrativas protegidas */}
          <Route
            path="/tigre"
            element={
              <ProtectedRoute>
                <AdminLayout onLogout={() => {
                  const auth = JSON.parse('{"logout": null}')
                  if (auth.logout) auth.logout()
                  window.location.href = '/'
                }}>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tigre/products"
            element={
              <ProtectedRoute>
                <AdminLayout onLogout={() => {
                  localStorage.removeItem('tigre-admin-auth')
                  window.location.href = '/'
                }}>
                  <ProductManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tigre/categories"
            element={
              <ProtectedRoute>
                <AdminLayout onLogout={() => {
                  localStorage.removeItem('tigre-admin-auth')
                  window.location.href = '/'
                }}>
                  <CategoryManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
