import { BentoGrid,BentoGridItem } from "../components/ui/grid.tsx";
import { TypewriterEffect } from "../components/ui/typewritter.tsx";
// import {
//   IconArrowWaveRightUp,
//   IconSignature,
//   IconTableColumn,
// } from "@tabler/icons-react";
// Puedes colocar este código en cualquier componente React, por ejemplo en src/components/CategoryList.tsx
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

export default function Hero() {

  // Estado booleano para abrir/cerrar el Dialog
  const [open, setOpen] = React.useState(false);

  // Función que acepta booleano, como espera Dialog
  const handleOpen = (value: boolean) => setOpen(value);

  type Category = {
    id: number;
    title: string;
    header: string;
  };

type Product = {
  CategoryId: number | null;
  colors: string[]; // Ajusta el tipo si los colores son objetos
  id: number;
  name: string;
  imagePath: string | null;
  createdAt: string; // ISO date string
  // ...agrega otras propiedades si existen
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
    axios.get(`http://192.168.0.80:3001/api/categories/${id}`)
      .then(response => {
        setSelectedCategory(response.data.data);
        console.log('Productos de la categoría seleccionada:', response.data.data);
        handleOpen(true); // Abrir el modal al seleccionar categoría
      })
      .catch(error => {
        console.error('Error al obtener productos de la categoría seleccionada:', error);
      });
  };

  useEffect(() => {
    axios.get('http://192.168.0.80:3001/api/categories')
      .then(response => {
        setCategories(response.data.data);
        console.log('Categorías obtenidas:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  }, []);
  return (
  <div>
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="mb-10 text-base text-neutral-600 dark:text-neutral-200">
        Cada producto con sus caracteristicas
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col mt-10 space-x-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <button className="w-40 h-10 text-sm text-white bg-black border border-transparent rounded-xl dark:border-white">
          Buscar un producto
        </button>
        <button className="w-40 h-10 text-sm text-black bg-white border border-black rounded-xl">
          Futuro comando de voz
        </button>
      </div>
    </div>
    <BentoGrid className="max-w-4xl mx-auto">
      {categories.map((categoria, i) => (
        // <div key={i} onClick={() => handleCategoryClick(categoria.id)}>
          <BentoGridItem
            key={i}
            onClick={() => handleCategoryClick(categoria.id)}
            title={categoria.title}
            // description={categoria.description}
            header={
              typeof categoria.header === "string"
                ? <img src={categoria.header} alt={categoria.title} className="w-full flex flex-1 min-h-[6rem] h-full object-cover rounded-xl" />
                : categoria.header  
            }
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        // </div>
        
      ))}
    </BentoGrid>
    {/* @ts-ignore */}
    <Dialog
      open={open}
      size={"lg"}
      handler={handleOpen}
    >
      {/* @ts-ignore */}
      <DialogHeader>{selectedCategory?.title}</DialogHeader>
      {/* @ts-ignore */}
      <DialogBody>
        <ExpandableCardDemo
          productos={selectedCategory?.products ?? null}
          image={selectedCategory?.header ?? null}
        />
      </DialogBody>
      {/* @ts-ignore */}
      <DialogFooter>
        {/* @ts-ignore */}
        <Button
          variant="gradient"
          color="blue"
          onClick={() => handleOpen(false)}
        >
          <span>Cerrar</span>
        </Button>
      </DialogFooter>
    </Dialog>
      <p></p>

    {/* {selectedCategory && (
      <div>
        <h2>{selectedCategory.title}</h2>
        <p>{selectedCategory.header}</p>
        <ul>
          {selectedCategory.products.map(product => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>Colores: {product.colors.join(", ")}</p>
              <p>{product.id}</p>
            </li>
          ))}
        </ul>
      </div>
    )} */}
  </div>
);
}

// const Skeleton = () => (
//   <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
// );
