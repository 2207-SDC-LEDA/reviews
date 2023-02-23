require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect('mongodb://35.86.250.116:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open', () => console.log('connected to Database'));

app.use(express.json());

const reviewsRouter = require('./routes/reviewsRoutes.js');
app.use('/reviews', reviewsRouter);

app.get('/loaderio-ebdfaa65115e9cd291cefc1692966416.txt', (req, res) => {
  res.status(200).download('./loaderio-ebdfaa65115e9cd291cefc1692966416.txt')
})

app.listen(port, () => {
  console.log(`Reviews server is listening on port ${port}`)
})

