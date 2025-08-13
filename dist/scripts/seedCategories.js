"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const categories = [
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
async function main() {
    const result = await prisma.category.createMany({
        data: categories,
        skipDuplicates: true
    });
    console.log(`Categorías creadas: ${result.count}`);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedCategories.js.map