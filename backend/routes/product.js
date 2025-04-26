const express = require('express');
const prisma = require('@prisma/client');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.post('/add', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    let { name, categoryID, description, price } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!categoryID) missingFields.push("categoryID");
    if (!description) missingFields.push("description");
    if (!price) missingFields.push("price");

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`
        });
    }

    try {
        product = await prismaClient.product.create({
            data: {
                name,
                categoryID,
                description,
                price,
                status: "true",
            },
        });

        return res.status(201).json({ message: "Produto criado com sucesso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o produto' });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.get('/get', auth.authenticateToken, async (req, res) => {
    try {
        const products = await prismaClient.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                status: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado." });
        }

        return res.status(200).json({ data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
});

router.get('/getCategory/:id', auth.authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const products = await prismaClient.product.findMany({
            where: {
                categoryID: parseInt(id),
                status: "true"
            },
            select: {
                id: true,
                name: true
            }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado para essa categoria." });
        }

        return res.status(200).json({ data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.get('/getProduct/:id', auth.authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prismaClient.product.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                status: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        return res.status(200).json({ data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, async (req, res, next) => {
    let { name, ID, categoryID, description, price } = req.body;

    try {
        const product = await prismaClient.product.findUnique({
            where: { id: parseInt(ID) }
        });

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (categoryID) dataToUpdate.categoryID = categoryID;
        if (description) dataToUpdate.description = description;
        if (price) dataToUpdate.price = price;

        const updatedProduct = await prismaClient.product.update({
            where: { id: parseInt(ID) },
            data: dataToUpdate
        });

        return res.status(200).json({ message: "Produto atualizado com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Necessário ID do produto." });
    }

    try {
        const product = await prismaClient.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        await prismaClient.product.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({ message: "Produto deletado com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
})

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, async (req, res, next) => {
    const { productID, status } = req.body;

    if (!productID || !status ) {
        return res.status(400).json({ message: "ID e status são obrigatórios." });
    }

    try {
        const updatedProduct = await prismaClient.product.update({
            where: { id: parseInt(productID) },
            data: { status: status },
        });

        return res.status(200).json({ message: "Produto atualizado com sucesso.", status: updatedProduct.status });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
 })

// router.patch('/delete-s', auth.authenticateToken, checkRole.checkRole, async (req, res, next) => { //softdelete
//     const { productID } = req.body;

//     if (!productID) {
//         return res.status(400).json({ message: "Necessário ID do produto." });
//     }

//     try {
//         const product = await prismaClient.product.findUnique({
//             where: { id: parseInt(productID) }
//         });

//         if (!product) {
//             return res.status(404).json({ message: "Produto não encontrado" });
//         }

//         await prismaClient.product.update({
//             where: { id: parseInt(productID) },
//             data: { isdeleted: true }  // Marcar como deletado
//         });

//         return res.status(200).json({ message: "Produto marcado como deletado com sucesso." });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Erro interno do servidor." });
//     } finally {
//         await prismaClient.$disconnect();
//     }
// });


module.exports = router;