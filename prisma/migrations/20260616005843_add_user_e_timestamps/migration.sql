/*
  Warnings:

  - You are about to drop the column `data_fim` on the `Treino` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `Treino` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `data_atualizacao` to the `Treino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treino" DROP COLUMN "data_fim",
DROP COLUMN "data_inicio",
ADD COLUMN     "data_atualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "data_atualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
