/*
  Warnings:

  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/

-- 1. Agrega la columna como nullable primero
ALTER TABLE "products" ADD COLUMN "categoryId" INTEGER;

-- 2. Crea la tabla Category
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "header" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- 3. Crea el índice único para el título
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- 4. Inserta una categoría por defecto y asigna ese id a los productos existentes
INSERT INTO "Category" ("title", "header") VALUES ('Sin categoría', '');

UPDATE "products" SET "categoryId" = 1 WHERE "categoryId" IS NULL;

-- 5. Haz la columna NOT NULL y agrega la relación
ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
