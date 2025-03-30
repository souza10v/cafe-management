const express = require('express');
const cors = require('cors');

const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billsRoute = require('./routes/bills');
const dashboardRoute = require('./routes/dashboard');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bills', billsRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;
