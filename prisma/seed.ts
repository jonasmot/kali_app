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

// Perfis removidos da aplicação

const exercicios = [
  {
    titulo: 'Pull Ups',
    descricao: 'Barra fixa focada em dorsais e bíceps.',
    grupo_muscular: 'Costas',
    video_url: 'PullUps.gif',
  },
  {
    titulo: 'Push Ups',
    descricao: 'Flexão de braço tradicional para peito e tríceps.',
    grupo_muscular: 'Peito',
    video_url: 'PushUps.gif',
  },
  {
    titulo: 'Dips',
    descricao: 'Mergulho nas paralelas, excelente para tríceps e peitoral inferior.',
    grupo_muscular: 'Peito',
    video_url: 'Dips.gif',
  },
  {
    titulo: 'Muscle Ups',
    descricao: 'Exercício avançado combinando barra e mergulho.',
    grupo_muscular: 'Costas',
    video_url: 'MuscleUps.gif',
  },
  {
    titulo: 'L-Sit',
    descricao: 'Isometria no solo focada em core e flexores do quadril.',
    grupo_muscular: 'Abdômen',
    video_url: 'Lsit.gif',
  },
];

async function main() {
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
