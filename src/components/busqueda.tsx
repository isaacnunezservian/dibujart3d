import { TypewriterEffect } from "../components/ui/typewritter.tsx";
import Search from "./ui/search.jsx";
import { useState, useEffect } from "react";
import axios from 'axios';
import { motion } from "motion/react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

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
  // {
  //   text: "Caracteristicas",
  // },
  {
    text: "DibujArt3D",
    className: "text-blue-500 dark:text-blue-500",
  },
];

export default function Busqueda() {

  const [allProducts, setAllProducts] = useState<Product[]>([]); // Productos originales
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Productos filtrados
  const [busqueda, setBusqueda] = useState("");
const [active, setActive] = useState<string[] | null>(null);

  useEffect(() => {
    axios.get<ApiResponse>(`https://dibujart3d.onrender.com/api/products/`)
    .then(response => {
      const products = response.data.data || response.data; // Manejar ambas estructuras
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

    <div className="flex flex-col items-center justify-center min-h-screen py-10">
      <div className="flex flex-col items-center justify-center mb-10">
        <p className="mb-10 text-base text-neutral-600 dark:text-neutral-200">
          Cada producto con sus caracteristicas
        </p>
        <TypewriterEffect words={words} />
        <div className="flex flex-col mt-10 space-x-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Search busqueda={busqueda} setBusqueda={setBusqueda} />
        </div>
      </div>

      {/* Mostrar resultados de búsqueda */}
      <div className="w-full max-w-6xl px-4">
        {busqueda.trim() !== "" && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredProducts.length} resultado(s) para "{busqueda}"
          </p>
        )}

        {busqueda.trim() !== "" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((producto) => (
            <div key={producto.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700" onClick={() => handleClick(producto.id, producto.colors)}>
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {producto.name}
              </h3>
              <div className="mb-3">
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Colores disponibles:</p>
                <div className="flex flex-wrap gap-2">
                  {producto.colors.map((color, index) => (
                    <span key={index} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {producto.id} • Categoría: {producto.categoryId}
              </p>
            </div>
          ))}
        </div>
        )}
       
        {active && Array.isArray(active) ? (
    <div className="fixed inset-0  grid place-items-center z-[100]">
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
              className="absolute flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full top-10 right-10"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  min-h-[300px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-center p-4">
                  <div className="">
                    <motion.h3
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                        <ul className="flex flex-col gap-3 mt-4">
                        {active.map((color) => (
                          <li
                            key={color}
                            className="flex items-center justify-center gap-3 px-4 py-2 transition bg-gray-100 rounded-lg shadow dark:bg-neutral-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <PaperAirplaneIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-base font-semibold text-center uppercase text-neutral-700 dark:text-neutral-200">{color}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.h3>
                  </div>
                </div>
                <div className="relative px-4 pt-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
        

        {filteredProducts.length === 0 && busqueda.trim() !== "" && (
          <div className="py-10 text-center">
            <p className="text-gray-600 dark:text-gray-400">No se encontraron productos que coincidan con "{busqueda}"</p>
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
      className="w-4 h-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};