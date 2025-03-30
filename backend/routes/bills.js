const express = require('express');
const prisma = require('@prisma/client');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
const { v4: uuidv4 } = require("uuid");
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

router.post("/generateReport", auth.authenticateToken, async (req, res) => {
    const orderDetails = req.body;
    const generatedUUID = uuidv4();
    const pdfDirectory = path.join(__dirname, "../generated_PDF");
    const pdfPath = path.join(pdfDirectory, `${generatedUUID}.pdf`);

    try {
        const newBill = await prismaClient.bill.create({
            data: {
                uuid: generatedUUID,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                total: parseInt(orderDetails.totalAmount),
                productDetails: orderDetails.productDetails,
                createdBy: req.user.email, //Mudar para user id
                //createdBy: req.user.email,
            }
        });

        ejs.renderFile(
            path.join(__dirname, "", "report.ejs"),
            {
                productDetails: JSON.parse(orderDetails.productDetails),
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount,
                uuid: generatedUUID,
            },
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao gerar PDF" });
                } else {
                    pdf.create(results).toFile(
                        pdfPath,
                        (err, data) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: "Erro ao salvar PDF" });
                            } else {
                                return res.status(200).json({ message: "PDF gerado com sucesso", uuid: generatedUUID });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
        await prismaClient.$disconnect();
    }
});

router.post("/getPDF", auth.authenticateToken, async (req, res) => {
    const { uuid } = req.body;
    const pdfDirectory = path.join(__dirname, "../generated_PDF");
    const pdfPath = path.join(pdfDirectory, `${uuid}.pdf`);

    try {
        const orderDetails = await prismaClient.bill.findUnique({
            where: { uuid },
        });

        if (!orderDetails) {
            return res.status(404).json({ message: "Fatura não encontrada." });
        }

        if (fs.existsSync(pdfPath)) {
            res.contentType("application/pdf");
            return fs.createReadStream(pdfPath).pipe(res);
        }

        const productDetailsReport = JSON.parse(orderDetails.productDetails);

        ejs.renderFile(
            path.join(__dirname, "report.ejs"),
            {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.total,
                uuid: uuid,
            },
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao renderizar template." });
                } else {
                    pdf.create(results).toFile(pdfPath, (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Erro ao criar PDF." });
                        } else {
                            res.contentType("application/pdf");
                            fs.createReadStream(pdfPath).pipe(res);
                        }
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
});


router.get("/getBills", auth.authenticateToken, async (req, res) => {
    try {
        const bills = await prismaClient.bill.findMany({
            where: { isDeleted: false },
            orderBy: { id: "desc" },
        });
        return res.status(200).json({ data: bills });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
});

router.delete("/delete/:id", auth.authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const bill = await prismaClient.bill.findUnique({ where: { id } });

        if (!bill) {
            return res.status(404).json({ message: "Fatura não encontrada" });
        }

        await prismaClient.bill.delete({
            where: { id },
        });

        return res.status(200).json({ message: "Fatura deletada com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } finally {
        await prismaClient.$disconnect();
    }
});

//   router.patch("/delete/:id", auth.authenticateToken, async (req, res) => { //SOFT DELETE
//     const id = parseInt(req.params.id);

//     try {
//       const bill = await prismaClient.bill.findUnique({ where: { id } });

//       if (!bill) {
//         return res.status(404).json({ message: "Bill ID not found" });
//       }

//       await prisma.bill.update({
//         where: { id },
//         data: { isDeleted: true },
//       });

//       return res.status(200).json({ message: "Bill deleted successfully (soft delete)." });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Erro interno do servidor." });
//     }
//   });

module.exports = router;