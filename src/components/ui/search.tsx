import { useRef } from 'react';

interface SearchProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export default function Search({ busqueda, setBusqueda }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    
    // Scroll optimizado hacia la sección de resultados
      if (e.target.value.trim() !== "") {
        const resultsSection = document.querySelector('[data-results-section]');
        if (resultsSection) {
          // Calcular posición óptima para mantener visible la búsqueda
          const rect = resultsSection.getBoundingClientRect();
          const searchBarHeight = 120; // Altura aproximada del área de búsqueda
          const offset = 0; // Margen adicional
          
          // Scroll solo si la sección no está visible o está muy abajo
          if (rect.top > window.innerHeight * 0.7 || rect.top < searchBarHeight) {
            window.scrollTo({
              top: window.scrollY + rect.top - searchBarHeight - offset,
              behavior: 'smooth'
            });
          }
        } else {
          // Fallback: scroll moderado si no encuentra la sección
          window.scrollBy({
            top: 50,
            behavior: 'smooth'
          });
        }
      }
    }  // Aumenté el delay para mejor sincronización
  

  return (
    <div className="xl:w-96">
      <div className="relative flex flex-wrap items-stretch w-full group">
        {/* Input mejorado con protagonismo rojo */}
        <input
          ref={inputRef}
          type="search"
          className="
            relative m-0 block flex-auto rounded-l-xl 
            border-2 border-off-red-300 dark:border-night-600 
            bg-gradient-to-r from-white to-off-red-50 dark:from-night-800 dark:to-night-700
            bg-clip-padding px-4 py-3 
            text-base font-medium leading-[1.6] 
            text-night-500 dark:text-off-red-200 
            placeholder:text-night-300 dark:placeholder:text-night-400
            outline-none transition-all duration-300 ease-in-out 
            
            focus:z-[3] 
            focus:border-off-red dark:focus:border-poppy 
            focus:text-night-700 dark:focus:text-white
            focus:shadow-lg focus:shadow-off-red/30 dark:focus:shadow-poppy/20
            focus:bg-gradient-to-r focus:from-off-red-50 focus:to-white dark:focus:bg-night-700
            focus:scale-[1.02] focus:outline-none
            
            hover:border-off-red-400 dark:hover:border-poppy-600
            hover:shadow-md hover:shadow-off-red-200/30
            hover:bg-gradient-to-r hover:from-off-red-25 hover:to-white
          "
          placeholder="Buscar por nombre..."
          aria-label="Buscar productos"
          aria-describedby="search-icon"
          value={busqueda}
          onChange={handleInputChange}
        />

        {/* Icono de búsqueda con protagonismo rojo */}
        <span
          className="
            input-group-text flex items-center justify-center
            whitespace-nowrap rounded-r-xl 
            px-4 py-3 text-center text-base font-medium 
            
            bg-gradient-to-r from-off-red-400 to-poppy-500
            dark:from-poppy-700 dark:to-off-red-600
            
            border-2 border-l-0 border-off-red-300 dark:border-night-600
            
            text-white dark:text-off-red-100
            
            transition-all duration-300
            
            group-focus-within:border-off-red dark:group-focus-within:border-poppy
            group-focus-within:bg-gradient-to-r group-focus-within:from-off-red group-focus-within:to-poppy
            group-focus-within:text-white
            group-focus-within:shadow-lg group-focus-within:shadow-off-red/30
            group-focus-within:scale-[1.02]
            group-focus-within:shadow-[0_0_20px_rgba(243,15,15,0.5)]
            
            hover:bg-gradient-to-r hover:from-poppy-500 hover:to-off-red-500
            dark:hover:from-off-red-600 dark:hover:to-poppy-600
            hover:shadow-md hover:shadow-off-red/40
            hover:shadow-[0_0_15px_rgba(218,66,67,0.4)]
            
            cursor-pointer
          "
          id="search-icon"
          onClick={() => {
            // Scroll inteligente al hacer click en el icono
            if (busqueda.trim() !== "") {
              const resultsSection = document.querySelector('[data-results-section]');
              if (resultsSection) {
                const rect = resultsSection.getBoundingClientRect();
                const searchBarHeight = 120;
                const offset = 20;
                
                window.scrollTo({
                  top: window.scrollY + rect.top - searchBarHeight - offset,
                  behavior: 'smooth'
                });
              }
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 transition-transform duration-300 group-focus-within:scale-110 drop-shadow-sm"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </div>
    </div>
  );
}