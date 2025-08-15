"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../../assets/lib/hook.tsx";
import { HeartIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid";

type Product = {
  CategoryId: number | null;
  colors: string[];
  id: number;
  name: string;
  imagePath: string | null;
  createdAt: string;
};

type ExpandableCardDemoProps = {
  productos: Product[] | null;
  image: string | null;
};

export function ExpandableCardDemo({ productos}: ExpandableCardDemoProps) {
  const [active, setActive] = useState<Array<string> | null>(null);
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
      console.log(active);
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
   console.log(productos)
  }, [productos]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Backdrop mejorado */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-night-900/70 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence> 

      {/* Modal de colores mejorado */}
      <AnimatePresence>
        {active && Array.isArray(active) ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            {/* Botón de cerrar mejorado */}
            <motion.button
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 md:top-6 md:right-6 items-center justify-center bg-gradient-to-r from-off-red to-poppy rounded-full h-10 w-10 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
              onClick={() => setActive(null)}
              aria-label="Cerrar modal de colores"
              title="Cerrar (Esc)"
            >
              <CloseIcon />
            </motion.button>

            {/* Contenedor del modal mejorado */}
            <motion.div
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] min-h-[300px] flex flex-col bg-white dark:bg-night-900 sm:rounded-3xl overflow-hidden border-2 border-hunyadi-yellow-400 shadow-2xl"
            >
              {/* Header del modal */}
              <div className=" p-4">
                <h2 className="text-xl font-bold text-night-500 text-center">
                  Colores Disponibles
                </h2>
              </div>

              {/* Contenido del modal */}
              <div className="flex justify-center items-center p-6 bg-gradient-to-br from-white to-hunyadi-yellow-50 dark:from-night-800 dark:to-night-700">
                <div className="w-full">
                  <motion.h3 className="font-bold text-night-700 dark:text-night-200">
                    <ul className="flex flex-col gap-4 mt-4">
                      {active.map((color) => (
                        <li
                          key={color}
                          className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-hunyadi-yellow-100 to-hunyadi-yellow-200 dark:from-night-800 dark:to-night-700 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-hunyadi-yellow-300 dark:border-night-600"
                        >
                          <PaperAirplaneIcon className="w-6 h-6 text-poppy" />
                          <span className="text-lg font-bold text-center uppercase text-white dark:text-night-200">
                            {color}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.h3>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Lista de productos mejorada */}
      <ul className="max-w-3xl mx-auto w-full flex flex-col gap-6 max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-hunyadi-yellow-400 scrollbar-track-hunyadi-yellow-100 rounded-xl">
        {productos && productos.map((producto: Product) => (
          <motion.div
            key={producto.id}
            className="group px-8 py-6 flex border-2 border-hunyadi-yellow-200 dark:border-night-600 flex-col md:flex-row justify-between items-center bg-gradient-to-r from-white to-hunyadi-yellow-50 dark:from-night-800 dark:to-night-700 hover:border-hunyadi-yellow-400 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => (setActive(producto.colors), console.log(producto.colors))}
            whileHover={{
              scale: 1.02,
              backgroundColor: "#f3c373", // hunyadi-yellow
              boxShadow: "0 8px 30px rgba(243,195,115,0.3)"
            }}
          >
            <motion.div className="flex gap-4 flex-col md:flex-row items-center">
              <i>
                <HeartIcon className="h-8 w-8 text-off-red group-hover:text-poppy transition-colors duration-300" />
              </i>
              <div>
                <motion.h3 className="font-bold text-night-800 dark:text-night-200 text-center md:text-left text-lg group-hover:text-night-900 transition-colors duration-300">
                  {producto.name}
                </motion.h3>
              </div>
            </motion.div>
            
            <motion.button className="px-6 py-3 text-sm rounded-full font-bold bg-gradient-to-r from-off-red to-poppy text-white mt-4 md:mt-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Ver Colores
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-white font-bold"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

