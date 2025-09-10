# DibujArt3D - Inventario de Productos

Sistema de gestión de inventario para productos 3D con panel de administración completo.

## 🚀 Características

- **Catálogo público**: Visualización de productos organizados por categorías
- **Búsqueda inteligente**: Filtrado de productos con normalización de texto
- **Panel de administración**: CRUD completo de productos y categorías
- **Interfaz responsive**: Optimizada para desktop y móviles
- **Autenticación**: Sistema de login para administradores

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS con paleta personalizada
- **Animaciones**: Motion (Framer Motion)
- **Iconos**: Heroicons + Material Tailwind
- **HTTP Client**: Axios
- **Backend**: Node.js API (deployed en Google Cloud Run)

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── admin/          # Panel de administración
│   ├── ui/             # Componentes reutilizables
│   ├── busqueda.tsx    # Página de búsqueda
│   └── hero.tsx        # Página principal
├── contexts/           # Contextos de React
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades
```

## 🎨 Paleta de Colores

- **Primarios**: 
  - `poppy`: #ff6b35 (Naranja vibrante)
  - `off-red`: #dd2d4a (Rojo coral)
  - `hunyadi-yellow`: #f9a03f (Amarillo dorado)
  - `night`: #0f0e0e (Negro profundo)

## 🌐 Deploy en Netlify

### Configuración automática

El proyecto está configurado para deploy automático en Netlify:

1. **netlify.toml**: Configuración de build
2. **_redirects**: Manejo de SPA routing
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`

### Variables de entorno

El backend está configurado para producción:
- **API URL**: `https://tigre-backend-195623852400.southamerica-east1.run.app`

### Pasos de deploy

1. **Conectar repositorio a Netlify**:
   ```bash
   # Opcional: usar Netlify CLI
   npm install -g netlify-cli
   netlify init
   ```

2. **Build automático**:
   - Netlify detectará automáticamente la configuración
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Variables de entorno** (si necesarias):
   ```
   NODE_VERSION=18
   ```

## 🚀 Desarrollo Local

### Requisitos previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone [URL_DEL_REPO]
cd dibujart3d

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # Linting con ESLint
```

## 📱 Funcionalidades

### Panel Público
- ✅ Visualización de categorías en grid responsivo
- ✅ Modal de productos por categoría
- ✅ Búsqueda inteligente con normalización de texto
- ✅ Visualización de colores por producto
- ✅ Thumbnails de productos

### Panel de Administración
- ✅ Dashboard con estadísticas
- ✅ CRUD de productos (crear, editar, eliminar)
- ✅ CRUD de categorías
- ✅ Carga de imágenes
- ✅ Gestión de colores por producto
- ✅ Diferentes tipos de operación (producto con categoría, sin categoría, solo categoría)

## 🔐 Sistema de Autenticación

- Acceso: `/tigre`
- Panel de admin protegido por contraseña
- Sesión persistente en localStorage

## 🌍 API Backend

**Base URL**: `https://tigre-backend-195623852400.southamerica-east1.run.app/api`

### Endpoints principales:
- `GET /products` - Lista todos los productos
- `POST /products` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `GET /categories` - Lista categorías
- `GET /categories/:id` - Productos por categoría
- `POST /categories` - Crear categoría
- `PUT /categories/:id` - Actualizar categoría

## 📝 Notas de Producción

### Cambios realizados para producción:
- ✅ URLs del backend actualizadas a producción
- ✅ Errores de TypeScript corregidos
- ✅ Variables no utilizadas eliminadas
- ✅ Configuración de Netlify añadida
- ✅ Redirecciones SPA configuradas
- ✅ Build optimizado para producción

### Consideraciones:
- Las imágenes se suben al backend y se sirven desde allí
- El sistema es completamente stateless
- Optimizado para SEO básico
- Responsive design para todos los tamaños de pantalla

## 🆘 Soporte

Para problemas o preguntas sobre el sistema, contactar al equipo de desarrollo.
