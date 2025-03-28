const express = require('express');
const prisma = require('@prisma/client');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.post('/add', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    let { category } = req.body;

    if (!category) {
        return res.status(400).json({ error: 'Obrigatório informar uma categoria.' });
    }

    try {
        const existingCategory = await prismaClient.category.findUnique({
            where: {
                name: category,
            },
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Categoria já cadastrada' });
        }

        const newCategory = await prismaClient.category.create({
            data: {
                name: category,
            },
        });

        return res.status(201).json({ message: 'Categoria cadastrada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a categoria' });
    } finally {
        await prismaClient.$disconnect();
    }
});

router.get('/get', auth.authenticateToken, async (req, res, next) => {
    var query = req.query;

    try {
        const categories = await prismaClient.category.findMany({
            where: {
                ...query,
            },
        });

        if (categories.length === 0) {
            return res.status(404).json({ error: 'Nenhuma categoria encontrada' });
        }

        return res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as categorias' });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.patch("/update", auth.authenticateToken, checkRole.checkRole, async (req, res) => {

    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "O ID e o nome são obrigatórios." });
    }

    try {

        const existingCategory = await prismaClient.category.findUnique({
            where: { id: id },
        });

        if (!existingCategory) {
            return res.status(404).json({ message: "Categoria não encontrada." });
        }

        const updatedCategory = await prismaClient.category.update({
            where: { id: id },
            data: { name: name },
        });

        return res.status(200).json({ message: "Categoria atualizada com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

module.exports = router;
