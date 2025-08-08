import { BentoGrid, BentoGridItem } from "../components/ui/grid.tsx";
import { TypewriterEffect } from "../components/ui/typewritter.tsx";

// import {
//   IconArrowWaveRightUp,
//   IconSignature,
//   IconTableColumn,
// } from "@tabler/icons-react";


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
  return (
  <div>

    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="mb-10 text-base text-neutral-600 dark:text-neutral-200">
Cada producto con sus caracteristicas      </p>
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
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          // description={item.description}
          header={
            typeof item.header === "string"
              ? <img src={item.header} alt={item.title} className="w-full flex flex-1 min-h-[6rem] h-full object-cover rounded-xl" />
              : item.header
          }
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>

      
    </div>

);
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
  {
    title: "Digital Circus",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/digitalcircus.jpg",
  },
  {
    title: "Bluey",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/Bluey.jpg",
  },
    {
    title: "Colapinto",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/colapa.jpg",
  },
  
  {
    title: "Animalitos",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/Animalitos.jpg",
  },

  
  {
    title: "Bebidas",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/bebidas.jpg",
  },
  {
    title: "Brawl Stars",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/descarga.png"
  },
  {
    title: "Baby Shark",
    header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/babyshark.jpg"
  },
  {
            title: "Disney",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/disney.jpg",
          },
          {
            title: "Dragon Ball",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/dragonball.jpg",
          },
          {
            title: "Five Nights at Freddy's",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/fivenight.webp",
          },
    
          {
            title: "Minecraft",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/minecraft.png",
          },
    
          {
            title: "Fortnite",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/fornite.webp",
          },
    
          {
            title: "Godzilla y Kong",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/godzi.webp",
          },
          {
            title: "Granja Zenon",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/granja.webp",
          },
         
          {
            title: "Free fire",
            header: "https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/freefire.webp",
          },
         
    
        ];
