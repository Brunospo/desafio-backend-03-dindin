const express = require('express');
require('dotenv').config();

const userRouter = require('./routers/userRouter');
const authenticationRouter = require('./routers/authenticationRouter');
const categoryRouter = require('./routers/categoryRouter');
const transactionRouter = require('./routers/transactionRouter');

const app = express();

app.use(express.json());

app.use('/usuario', userRouter);
app.use('/login', authenticationRouter);
app.use('/categoria', categoryRouter);
app.use('/transacao', transactionRouter);

app.listen(3000);