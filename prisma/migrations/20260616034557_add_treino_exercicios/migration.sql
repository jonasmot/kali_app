-- AlterTable
ALTER TABLE "Treino" ADD COLUMN     "exercicios" JSONB;

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "videoUrl" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL,
    "grupo_muscular" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);
