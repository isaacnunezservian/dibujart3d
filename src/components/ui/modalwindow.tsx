"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../../assets/lib/hook.tsx";
import { HeartIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid";

type Product = {
  CategoryId: number | null;
  colors: string[]; // Ajusta el tipo si los colores son objetos
  id: number;
  name: string;
  imagePath: string | null;
  createdAt: string; // ISO date string
  // ...agrega otras propiedades si existen
};

type ExpandableCardDemoProps = {
  productos: Product[] | null;
  image: string | null;
};

export function ExpandableCardDemo({ productos}: ExpandableCardDemoProps) {
  const [active, setActive] = useState<Array<string> | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }


    if (active ) {
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
      <AnimatePresence>
        {active  && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 h-full w-full z-10"
          />
        )}
      </AnimatePresence> 
       <AnimatePresence>
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
              className="flex absolute top-10 right-10  items-center justify-center  bg-blue-200 rounded-full h-10 w-10"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  min-h-[300px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div>
                <div className="flex justify-center items-center p-4">
                  <div className="">
                    <motion.h3
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >

                                            <ul className="flex flex-col gap-3 mt-4">
                        {active.map((color) => (
                          <li
                            key={color}
                            className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-neutral-800 rounded-lg py-2 px-4 shadow transition hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <PaperAirplaneIcon className="h-5 w-5 text-gray-500" />
                            <span className="font-semibold text-neutral-700 dark:text-neutral-200 text-center text-base uppercase">{color}</span>
                          </li>
                        ))}
                      </ul>


                    </motion.h3>
                  
                  </div>

                </div>
                <div className="pt-4 relative px-4">
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
      </AnimatePresence>
      <ul className="max-w-3xl mx-auto w-full flex flex-col gap-4 max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 rounded-xl">
        {productos && productos.map((producto: Product) => (
          <motion.div
            key={producto.id}
            className="group px-8 py-4 flex border border-neutral-200 dark:border-neutral-700 flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
            onClick={() => (setActive(producto.colors), console.log(producto.colors))}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#3b82f6", // azul
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(34,197,94,0.2)"
            }}
          >
            <motion.div className="flex gap-4 flex-col md:flex-row items-center">
              <i>
                <HeartIcon className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" />
              </i>
              <div>
                <motion.h3
                  className="font-bold text-neutral-800 dark:text-neutral-200 text-center md:text-left group-hover:text-white transition-colors"
                >
                  {producto.name}
                </motion.h3>
              </div>
            </motion.div>
            <motion.button
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100   text-black mt-4 md:mt-0"
            >
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
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

