const express = require('express');
const prisma = require('@prisma/client');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.get("/details", auth.authenticateToken, async (req, res) => {
    try {
      const [categoryCount, productCount, billCount] = await Promise.all([
        prismaClient.category.count(),
        prismaClient.product.count(),
        prismaClient.bill.count(),
      ]);
  
      return res.status(200).json({
        data: {
          category: categoryCount,
          product: productCount,
          bill: billCount,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar os dados." });
    }
  });
  
  module.exports = router;