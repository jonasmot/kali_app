// ============================================
// Kali App — Seed Iniciais
// ============================================
// Popula o banco com os perfis de usuário e
// exercícios iniciais de calistenia.
//
// Uso: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const perfis = [
  { id: 1, nome: 'Aluno' },
  { id: 2, nome: 'Professor' },
  { id: 3, nome: 'Admin' }
];

const exercicios = [
  {
    titulo: 'Pull Ups',
    descricao: ' ',
    grupo_muscular: 'Costas',
    video_url: 'PullUps.mp4',
  },
  {
    titulo: 'Push Ups',
    descricao: ' ',
    grupo_muscular: 'Peito',
    video_url: 'PushUps.mp4',
  },
  {
    titulo: 'Dips',
    descricao: ' ',
    grupo_muscular: 'Peito',
    video_url: 'Dips.mp4',
  },
  {
    titulo: 'Muscle Ups',
    descricao: ' ',
    grupo_muscular: 'Costas',
    video_url: 'MuscleUps.mp4',
  },
  {
    titulo: 'L-Sit',
    descricao: ' ',
    grupo_muscular: 'Abdômen',
    video_url: 'Lsit.mp4',
  },
];

async function main() {
  console.log('🌱 Iniciando seed de perfis...');
  for (const perfil of perfis) {
    await prisma.tipoPerfil.upsert({
      where: { nome: perfil.nome },
      update: {},
      create: perfil,
    });
    console.log(`  ✅ Perfil: ${perfil.nome}`);
  }

  console.log('🌱 Iniciando seed de exercícios...');
  
  // Limpar exercícios para não duplicar se rodar novamente sem reset
  await prisma.exercicio.deleteMany({});
  
  for (const exercicio of exercicios) {
    const result = await prisma.exercicio.create({
      data: exercicio,
    });
    console.log(`  ✅ ${result.titulo} (${result.grupo_muscular})`);
  }

  console.log('🌱 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
