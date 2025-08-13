"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const productsData = {
    "Digital Circus": [
        { "name": "Caine", "colors": ["blanco", "verde", "celeste", "negro", "rojo"] },
        { "name": "Jax", "colors": ["violeta", "amarillo", "negro"] },
        { "name": "Ponmi", "colors": ["rojo", "azul", "blanco", "amarillo"] }
    ],
    "Bluey": [
        { "name": "Bluey", "colors": ["celeste", "celeste claro", "dorado 3n3", "blanco", "negro", "azul zafiro", "rojo"] },
        { "name": "Bingo", "colors": ["naranja", "hueso", "blanco", "negro", "marrón", "rústico", "rojo"] }
    ],
    "Colapinto": [
        { "name": "Colapinto 43 x1", "colors": ["blanco", "celeste", "negro"] },
        { "name": "Casco Colapinto x1", "colors": ["blanco", "fucsia", "negro", "celeste", "plateado", "dorado"] },
        { "name": "Colapinto Auto x1", "colors": ["blanco", "celeste", "fucsia", "negro", "violeta"] }
    ],
    "Animalitos": [
        { "name": "Cebrita", "colors": ["blanco", "rosa", "plateado", "negro"] },
        { "name": "Cocodrilito", "colors": ["verde", "blanco", "negro"] },
        { "name": "Elefantito", "colors": ["plateado", "rosa", "negro", "blanco"] },
        { "name": "Hipopotamito", "colors": ["plateado", "blanco", "rosa", "negro"] },
        { "name": "Jirafita", "colors": ["dorado 3n3", "rústico", "rosa", "negro", "blanco"] },
        { "name": "Leoncito", "colors": ["dorado 3n3 rustico", "blanco", "negro"] },
        { "name": "Monito", "colors": ["marrón havana", "piel blanco y negro"] },
        { "name": "Tigrecito", "colors": ["naranja", "rosa", "blanco", "negro"] },
        { "name": "Zorrito", "colors": ["blanco hueso", "naranja", "negro"] }
    ],
    "Bebidas": [
        { "name": "Cerveza", "colors": ["verde", "plateado"] },
        { "name": "Cerveza (versión 2)", "colors": ["marrón", "plateado"] },
        { "name": "Chop cerveza", "colors": ["amarillo", "blanco"] },
        { "name": "Coca", "colors": ["negro translúcido", "rojo"] },
        { "name": "Corona", "colors": ["amarillo traslúcido", "blanco"] },
        { "name": "Fernet (botella)", "colors": ["negro", "verde 3n3"] },
        { "name": "Sprite", "colors": ["traslúcido", "verde"] },
        { "name": "Seven Up", "colors": ["verde"] },
        { "name": "Vino", "colors": ["negro", "bordó"] },
        { "name": "Gancia", "colors": ["verde", "azul"] }
    ],
    "Brawl Stars": [
        { "name": "Logo Brawl Stars", "colors": ["negro", "rojo", "amarillo", "blanco"] }
    ],
    "Baby Shark": [
        { "name": "Abuela Shark", "colors": ["blanco", "negro", "naranja", "rústico"] },
        { "name": "Abuelo Shark", "colors": ["blanco", "negro", "verde", "rústico"] },
        { "name": "Papi Shark", "colors": ["blanco", "negro", "azul", "rústico"] },
        { "name": "Mami Shark", "colors": ["blanco", "negro", "fucsia", "violeta", "rústico"] },
        { "name": "Bebé Shark", "colors": ["blanco", "negro", "amarillo", "rústico"] }
    ],
    "Disney": [
        { "name": "Angel", "colors": ["negro", "fucsia", "rosa", "blanco"] },
        { "name": "Daisy", "colors": ["blanco", "rosa", "naranja", "negro"] },
        { "name": "Donald", "colors": ["celeste", "blanco", "naranja", "negro"] },
        { "name": "Mickey", "colors": ["rojo", "blanco", "piel", "negro"] },
        { "name": "Minnie", "colors": ["rojo", "blanco", "piel", "negro"] },
        { "name": "Stitch", "colors": ["azul", "fucsia", "azul", "celeste", "negro", "blanco"] }
    ],
    "Dragon Ball": [
        { "name": "Goku fase 1", "colors": ["negro", "piel", "blanco", "negro"] },
        { "name": "Goku instinto(version fiera)", "colors": ["negro", "piel", "plateado", "blanco"] },
        { "name": "Goku chiquito", "colors": ["blanco", "naranja", "rojo", "negro"] },
        { "name": "Goku ultra", "colors": ["blanco", "piel", "negro"] },
        { "name": "Vegeta Dios", "colors": ["celeste", "piel", "negro", "blanco", "celeste"] }
    ],
    "Five Nights at Freddy's": [
        { "name": "Bonnie v2", "colors": ["violeta", "negro", "blanco", "fucsia", "violeta", "lavanda"] },
        { "name": "Chica v2", "colors": ["amarillo", "negro", "blanco", "violeta", "amarillo", "naranja"] },
        { "name": "Foxy v2", "colors": ["rojo", "negro", "blanco", "amarillo", "rojo", "piel"] },
        { "name": "Freddy v2", "colors": ["rústico", "negro", "blanco", "celeste", "rustico", "piel"] },
        { "name": "Freddy", "colors": ["rústico", "negro", "blanco"] }
    ],
    "Minecraft": [
        { "name": "Espada 1", "colors": ["violeta", "negro", "rosa", "amarillo", "marrón havana"] },
        { "name": "Espada 2", "colors": ["negro", "plateado", "marrón havana"] },
        { "name": "Espada 3", "colors": ["rojo", "negro", "naranja", "amarillo", "marrón havana"] },
        { "name": "Espada 4", "colors": ["plateado", "negro", "blanco", "plateado", "marrón havana"] },
        { "name": "Espada 5", "colors": ["verde", "negro", "verde caribe", "verde", "marrón havana"] },
        { "name": "Espada 6", "colors": ["celeste", "negro", "celeste claro", "celeste", "marrón havana"] }
    ],
    "Fortnite": [
        { "name": "Fortnite rank", "colors": ["plateado", "negro", "rojo", "blanco"] },
        { "name": "Fortnite logo", "colors": ["negro", "blanco", "amarillo"] }
    ],
    "Free fire": [
        { "name": "Free Fire logo", "colors": ["negro", "blanco", "amarillo"] },
        { "name": "Free Fire pack", "colors": ["plateado", "negro", "rojo", "blanco"] }
    ],
    "Godzilla y Kong": [
        { "name": "Godzilla", "colors": ["celeste", "plateado", "negro"] },
        { "name": "Kong", "colors": ["plateado", "havana", "negro", "blanco"] }
    ],
    "Granja Zenon": [
        { "name": "Bartolito (gallo)", "colors": ["amarillo", "blanco", "negro", "rojo"] },
        { "name": "Chancha", "colors": ["rosa", "fucsia", "blanco", "salmon", "negro", "dorado"] },
        { "name": "Percherón (caballo)", "colors": ["cobre", "blanco", "hueso", "negro"] },
        { "name": "Pollito pío", "colors": ["amarillo", "blanco", "negro", "rosa"] },
        { "name": "Vaca Lola", "colors": ["blanco", "rosa", "negro"] },
        { "name": "Zenón", "colors": ["piel", "rojo", "blanco", "marrón", "negro"] }
    ]
};
async function main() {
    let totalProductsCreated = 0;
    // Obtener todas las categorías con sus IDs
    const categories = await prisma.category.findMany({
        select: { id: true, title: true }
    });
    console.log('Categorías encontradas:', categories.map(c => `${c.id}: ${c.title}`));
    // Crear productos por categoría
    for (const [categoryTitle, products] of Object.entries(productsData)) {
        const category = categories.find(c => c.title === categoryTitle);
        if (!category) {
            console.warn(`⚠️  Categoría "${categoryTitle}" no encontrada. Saltando productos.`);
            continue;
        }
        console.log(`\n📦 Creando productos para "${categoryTitle}" (ID: ${category.id})`);
        for (const product of products) {
            try {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        colors: product.colors,
                        categoryId: category.id
                    }
                });
                console.log(`  ✅ ${product.name}`);
                totalProductsCreated++;
            }
            catch (error) {
                if (error.code === 'P2002') {
                    console.log(`  ⚠️  ${product.name} (ya existe)`);
                }
                else {
                    console.error(`  ❌ Error creando ${product.name}:`, error.message);
                }
            }
        }
    }
    console.log(`\n🎉 Productos creados exitosamente: ${totalProductsCreated}`);
}
main()
    .catch(e => {
    console.error('Error ejecutando script:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedProducts.js.map