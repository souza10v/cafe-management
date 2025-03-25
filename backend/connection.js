const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados!');
  } catch (error) {
    console.error('❌ Erro na conexão com o banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
