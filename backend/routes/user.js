const express = require('express');
const prisma = require('@prisma/client'); // Importando o Prisma Client
const bcrypt = require('bcryptjs'); // Importando o bcryptjs para criptografar a senha
const router = express.Router();

// Criar uma instância do Prisma Client
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.post('/signup', async (req, res) => {
  const { name, email, phone, password, status, role } = req.body;

  if (!name || !email || !phone || !password || !status || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword, 
        status,
        role,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário' });
  } finally {
    await prismaClient.$disconnect();
  }
});

module.exports = router;
