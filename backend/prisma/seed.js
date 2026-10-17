// Idempotente: roda a cada publicação. Cria o admin inicial e o catálogo inicial da barbearia
// (barbeiros e serviços) só quando ainda não existem; depois tudo é editado pelo painel.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ARTISTS = [
  { name: 'Rafa Monteiro', style: 'Degradê', years: 8, bio: 'Especialista em degradê e navalhado, acabamento impecável na nuca e na lateral.', services: ['Corte masculino', 'Corte + barba', 'Pezinho'] },
  { name: 'Duda Kaneshiro', style: 'Barba', years: 6, bio: 'Barba desenhada com toalha quente, navalha e hidratação.', services: ['Barba', 'Corte + barba', 'Sobrancelha'] },
  { name: 'Theo Barreto', style: 'Clássico', years: 10, bio: 'Cortes clássicos na tesoura, social e pompadour.', services: ['Corte masculino', 'Barba', 'Corte + barba', 'Pezinho', 'Sobrancelha'] },
  { name: 'Lia Vasconcelos', style: 'Química', years: 5, bio: 'Luzes, platinado e pigmentação de barba.', services: ['Luzes / platinado'], available: false, unavailableNote: 'De férias até 30 out' },
];

const SERVICES = [
  { name: 'Corte masculino', description: 'Máquina e tesoura, lavagem e finalização.', priceCents: 4500, durationMin: 60, icon: 'scissors' },
  { name: 'Barba', description: 'Barba com toalha quente e navalha.', priceCents: 3500, durationMin: 60, icon: 'droplet' },
  { name: 'Corte + barba', description: 'O combo completo com desconto.', priceCents: 7000, durationMin: 60, icon: 'star' },
  { name: 'Pezinho', description: 'Acabamento do contorno entre um corte e outro.', priceCents: 1500, durationMin: 30, icon: 'pen' },
  { name: 'Sobrancelha', description: 'Limpeza e alinhamento na navalha.', priceCents: 1500, durationMin: 30, icon: 'eye' },
  { name: 'Luzes / platinado', description: 'Descoloração e tonalização.', priceCents: 15000, durationMin: 120, icon: 'sparkles' },
];

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Administrador';
  if (!password) throw new Error('SEED_ADMIN_PASSWORD não definido');

  if ((await prisma.user.count({ where: { role: 'admin' } })) === 0) {
    await prisma.user.upsert({
      where: { email },
      update: { role: 'admin' },
      create: { email, name, role: 'admin', passwordHash: await bcrypt.hash(password, 10) },
    });
    console.log(`Admin criado: ${email}`);
  }

  if ((await prisma.service.count()) === 0 && (await prisma.artist.count()) === 0) {
    const ids = {};
    for (const [i, s] of SERVICES.entries()) {
      const created = await prisma.service.create({ data: { ...s, active: s.active !== false, sortOrder: i } });
      ids[s.name] = created.id;
    }
    for (const [i, a] of ARTISTS.entries()) {
      const { services, ...data } = a;
      await prisma.artist.create({
        data: { ...data, sortOrder: i, services: { connect: services.map((n) => ({ id: ids[n] })) } },
      });
    }
    console.log('Catálogo inicial criado');
  }

  await prisma.setting.upsert({ where: { key: 'studioName' }, update: {}, create: { key: 'studioName', value: "Barbearia" } });
  await prisma.setting.upsert({ where: { key: 'depositCents' }, update: {}, create: { key: 'depositCents', value: '1000' } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
