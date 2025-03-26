const express = require('express');
const prisma = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.post('/signup', async (req, res) => {
    const { name, email, phone, password, status, role } = req.body;

    if (!name || !email || !phone || !password || !status || !role) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
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

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'E-mail e senha são obrigatórios' });
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingUser) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        if (existingUser.status === false) {
            return res.status(401).json({ error: 'Usuário não está ativo' });
        }

        const token = jwt.sign(
            { email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login realizado com sucesso!', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    } finally {
        await prismaClient.$disconnect();
    }

})

module.exports = router;
