/*
  Warnings:

  - The primary key for the `Treino` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Treino` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `data_fim` to the `Treino` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treino" DROP CONSTRAINT "Treino_pkey",
ADD COLUMN     "data_fim" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Treino_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
