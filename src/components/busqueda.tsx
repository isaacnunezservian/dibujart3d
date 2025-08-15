import { TypewriterEffectPremium } from "../components/ui/typewritter.tsx";
import Search from "./ui/search.jsx";
import { useState, useEffect } from "react";
import axios from 'axios';
import { motion } from "motion/react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import logo from "../assets/Logo.svg"

// Tipo para los productos
type Product = {
  id: number;
  name: string;
  colors: string[];
  imagePath: string | null;
  createdAt: string;
  categoryId: number;
};

// Tipo para la respuesta de la API
type ApiResponse = {
  success: boolean;
  data: Product[];
  count: number;
};

const words = [
  {
    text: "Inventario",
  },
  {
    text: "de",
  },
  {
    text: "Productos ",
  },
  {
    text: "DibujArt3D",
    className: "text-off-red dark:text-off-red-400", // Cambié de azul a tu rojo característico
  },
];

export default function Busqueda() {

  const [allProducts, setAllProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [busqueda, setBusqueda] = useState("");
  const [active, setActive] = useState<string[] | null>(null);

  useEffect(() => {
    axios.get<ApiResponse>(`https://tigre-backend-195623852400.southamerica-east1.run.app/api/products/`)
    .then(response => {
      const products = response.data.data || response.data;
      setAllProducts(products);
      console.log('Productos obtenidos:', products);
    })
    .catch(error => {
      console.error('Error al obtener productos de la categoría seleccionada:', error);
    });

  }, []);

  const handleClick = (_id: number, colors: string[]) => {
    setActive(colors);
  };

  // Función para normalizar texto (eliminar tildes y caracteres especiales)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD") // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
      .replace(/[^\w\s]/g, ""); // Elimina caracteres especiales excepto espacios
  };

  useEffect(() => {
    // Filtrar productos por nombre (ignorando tildes y acentos)
    const filtered = allProducts.filter(item => {
      const normalizedName = normalizeText(item.name);
      const normalizedSearch = normalizeText(busqueda);
      return normalizedName.includes(normalizedSearch);
    });
    setFilteredProducts(filtered);
  }, [busqueda, allProducts]);

  return (

    // Fondo con gradiente sutil usando tu paleta
    <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-br from-white via-hunyadi-yellow-900 to-white dark:from-night dark:via-night-400 dark:to-night">
      <div className="flex flex-col items-center justify-center mb-10">
        <div>
          <img src={logo} alt="Logo" className="w-24 h-24 my-8 md:w-32 md:h-32" />
        </div>
        <TypewriterEffectPremium words={words} />
        <div className="flex flex-col mt-10 space-x-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Search busqueda={busqueda} setBusqueda={setBusqueda} />
        </div>
      </div>

      {/* Mostrar resultados de búsqueda */}
      <div className="w-full max-w-6xl px-4">
        {busqueda.trim() !== "" && (
          <p className="mb-4 text-sm text-night-600 dark:text-night-400">
            Mostrando {filteredProducts.length} resultado(s) para "{busqueda}"
          </p>
        )}

        {busqueda.trim() !== "" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((producto) => (
              <div 
                key={producto.id} 
                className="p-6 transition-all duration-300 transform bg-white border-2 shadow-lg cursor-pointer border-hunyadi-yellow-300 rounded-xl hover:shadow-xl hover:scale-105 dark:bg-night-800 dark:border-night-600" 
                onClick={() => handleClick(producto.id, producto.colors)}
              >
                <h3 className="mb-3 text-lg font-bold text-black dark:text-white">
                  {producto.name}
                </h3>
                <div className="mb-3">
                  <p className="mb-2 text-sm font-medium text-night-600 dark:text-night-400">Colores del producto</p>
                  <div className="flex flex-wrap gap-2">
                    {producto.colors.map((color, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-xs font-semibold text-white transition-shadow duration-200 rounded-full shadow-md bg-gradient-to-r from-poppy to-off-red hover:shadow-lg"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-night-500 dark:text-night-400">
                  ID: {producto.id} • Categoría: {producto.categoryId}
                </p>
              </div>
            ))}
          </div>
        )}
       
        {active && Array.isArray(active) ? (
          <div data-results-section className="fixed inset-0 grid place-items-center z-[100] bg-night-900/50 backdrop-blur-sm">
            <motion.button
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute z-50 flex items-center justify-center w-10 h-10 transition-transform duration-200 rounded-full shadow-lg bg-gradient-to-r from-off-red to-poppy top-4 right-4 md:top-6 md:right-6 hover:scale-110"
              onClick={() => setActive(null)}
              aria-label="Cerrar modal"
              title="Cerrar (Esc)"
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] min-h-[300px] flex flex-col bg-white dark:bg-night-900 sm:rounded-3xl overflow-hidden border-2 border-hunyadi-yellow-400 shadow-2xl"
            >
              <div className="p-4 ">
                <h2 className="text-xl font-bold text-center text-black">
                  Colores del producto
                </h2>
              </div>
              <div>
                <div className="flex items-center justify-center p-6">
                  <div className="w-full">
                    <motion.h3
                      className="font-bold text-night-800 dark:text-night-200"
                    >
                      <ul className="flex flex-col gap-4 mt-4">
                        {active.map((color) => (
                          <li
                            key={color}
                            className="flex items-center justify-center gap-4 px-6 py-4 transition-all duration-300 border shadow-md bg-gradient-to-r from-hunyadi-yellow-100 to-hunyadi-yellow-200 rounded-xl hover:shadow-lg hover:scale-105 dark:from-night-800 dark:to-night-700 border-hunyadi-yellow-300 dark:border-night-600"
                          >
                            <PaperAirplaneIcon className="w-6 h-6 text-poppy" />
                            <span className="text-lg font-bold text-center text-white uppercase dark:text-night-200">
                              {color}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}

        {filteredProducts.length === 0 && busqueda.trim() !== "" && (
          <div className="py-10 text-center">
            <p className="text-lg font-medium text-night-600 dark:text-night-400">
              No se encontraron productos que coincidan con "{busqueda}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 font-bold text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};