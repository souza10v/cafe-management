const express = require('express');
const prisma = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

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

router.post('/forgotPassword', async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'E-mail é obrigatório' });
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingUser) {
            return res.status(200).json({ message: 'Senha enviada com sucesso para o seu email' });
        }

        var mailOptions = {
            from: process.env.EMAIL,
            to: existingUser.email,
            subject: 'Acesso à sua conta',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #007bff;">Olá, ${existingUser.name}!</h1>
                    <p>Estamos enviando este e-mail com os detalhes de acesso à sua conta.</p>
                    <p>Sua senha atual é: <strong>${existingUser.password}</strong></p>
                    <p>Para acessar sua conta, clique no link abaixo:</p>
                    <p><a href="${process.env.FRONTEND_BASE_URL}/login" 
                          style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; 
                                 text-decoration: none; border-radius: 5px;">
                          Acessar minha conta
                       </a></p>
                    <p>Recomendamos que você altere sua senha após o primeiro acesso para garantir maior segurança.</p>
                    <p>Se não foi você que solicitou esse e-mail, desconsidere esta mensagem.</p>
                    <br>
                </div>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao recuperar senha' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Senha enviada com sucesso para o seu email' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao recuperar senha' });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.get("/get", auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    try {
        const users = await prismaClient.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
        res.status(500).json({ error: "Erro ao buscar os usuários" });
    } finally {
        await prismaClient.$disconnect();
    }
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || status === undefined) {
            return res.status(400).json({ message: "ID e status são obrigatórios." });
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: Number(id) },
            data: { status: Boolean(status) },
        });

        return res.status(200).json({ message: "Usuário atualizado com sucesso.", status: updatedUser.data });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor.", error });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.get('/checkToken', auth.authenticateToken, async (req, res) => {
    const token = req.header.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token não informado." });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Token válido." });
    } catch (error) {
        return res.status(401).json({ message: "Token inválido." });
    }
});

router.post('/changePassword', auth.authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const email = req.locals.email;

    if ( !newPassword || !oldPassword) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Token invalido' });
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingUser) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha antiga incorreta' });
        }       

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prismaClient.user.update({
            where: { email: email },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Senha alterada com sucesso!' });

    } catch {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar a senha' });
    } finally {
        await prismaClient.$disconnect();
    }
})

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = router;
