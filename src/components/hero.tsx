import { BentoGrid, BentoGridItem } from "../components/ui/grid.tsx";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExpandableCardDemo } from "./ui/modalwindow.tsx";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function Hero() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (value: boolean) => setOpen(value);

  type Category = {
    id: number;
    title: string;
    header: string;
  };

  type Product = {
    CategoryId: number | null;
    colors: string[];
    id: number;
    name: string;
    imagePath: string | null;
    createdAt: string;
  };

  type CategoryResponse = {
    id: number;
    title: string;
    header: string;
    products: Product[];
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);

  const handleCategoryClick = (id: number) => {
    console.log('Categoría seleccionada:', id);
    axios.get(`https://tigre-backend-195623852400.southamerica-east1.run.app/api/categories/${id}`)
      .then(response => {
        setSelectedCategory(response.data.data);
        console.log('Productos de la categoría seleccionada:', response.data.data);
        handleOpen(true);
      })
      .catch(error => {
        console.error('Error al obtener productos de la categoría seleccionada:', error);
      });
  };

  useEffect(() => {
    axios.get('https://tigre-backend-195623852400.southamerica-east1.run.app/api/categories')
      .then(response => {
        setCategories(response.data.data);
        console.log('Categorías obtenidas:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  }, []);

  return (
    // Contenedor principal con gradiente sutil de fondo
    <div className="min-h-screen bg-gradient-to-br from-white via-hunyadi-yellow-900/10 to-white dark:from-night dark:via-night-700 dark:to-night-800 py-10 px-4">
      
      {/* Título de la sección */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-off-red via-poppy to-off-red bg-clip-text text-transparent mb-4">
          Categorías de Productos
        </h1>
        <p className="text-lg text-night-600 dark:text-night-300 max-w-2xl mx-auto">
Todas las categorías con sus productos y colores. Hacé click        </p>
      </div>

      {/* Grid de categorías mejorado */}
      <BentoGrid className="max-w-6xl mx-auto">
        {categories.map((categoria, i) => (
          <BentoGridItem
            key={i}
            onClick={() => handleCategoryClick(categoria.id)}
            title={categoria.title}
            header={
              typeof categoria.header === "string"
                ? <div className="relative overflow-hidden rounded-xl group">
                    <img 
                      src={categoria.header} 
                      alt={categoria.title} 
                      className="w-full flex flex-1 min-h-[6rem] h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" 
                    />
                    {/* Overlay con gradiente para mejor legibilidad del título */}
                    <div className="absolute inset-0 bg-gradient-to-t from-night-900/60 via-transparent to-transparent rounded-xl"></div>
                  </div>
                : categoria.header  
            }
            className={`${i === 3 || i === 6 ? "md:col-span-2" : ""} 
              bg-gradient-to-br from-white to-hunyadi-yellow-50 
              dark:from-night-800 dark:to-night-700 
              border-2 border-hunyadi-yellow-200 dark:border-night-600
              hover:border-hunyadi-yellow-400 dark:hover:border-hunyadi-yellow-600
              hover:shadow-xl hover:shadow-hunyadi-yellow-200/20
              transform hover:scale-[1.02] transition-all duration-300
              cursor-pointer rounded-xl p-4`}
          />
        ))}
      </BentoGrid>

      {/* Modal mejorado */}
      {/* @ts-ignore */}
      <Dialog
        open={open}
        size={"lg"}
        handler={handleOpen}
        className="bg-white dark:bg-night-800 border-2 border-hunyadi-yellow-400 dark:border-hunyadi-yellow-600 shadow-2xl"
      >
        {/* @ts-ignore */}
        <DialogHeader className=" text-night-700  border-b-2 border-night-700">
          <h2 className="text-2xl font-bold text-center w-full">
            {selectedCategory?.title}
          </h2>
        </DialogHeader>
        
        {/* @ts-ignore */}
        <DialogBody className="p-6 bg-gradient-to-br from-white to-hunyadi-yellow-50 dark:from-night-800 dark:to-night-700 max-h-[70vh] overflow-y-auto">
          <ExpandableCardDemo
            productos={selectedCategory?.products ?? null}
            image={selectedCategory?.header ?? null}
          />
        </DialogBody>
        
        {/* @ts-ignore */}
        <DialogFooter className="bg-gradient-to-r from-hunyadi-yellow-100 to-hunyadi-yellow-200 dark:from-night-700 dark:to-night-800 border-t-2 border-hunyadi-yellow-300 dark:border-night-600 rounded-b-lg p-4 md:p-2">
          <div className="flex justify-center w-full">
            {/* @ts-ignore */}
            <Button
              className="bg-gradient-to-r from-off-red to-poppy hover:from-poppy hover:to-off-red text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-off-red-600"
              onClick={() => handleOpen(false)}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 md:w-2 md:h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cerrar
              </span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// // Skeleton mejorado con tus colores
// const Skeleton = () => (
//   <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-hunyadi-yellow-200 dark:from-night-800 dark:to-night-700 to-hunyadi-yellow-100 animate-pulse border border-hunyadi-yellow-300 dark:border-night-600"></div>
// );
