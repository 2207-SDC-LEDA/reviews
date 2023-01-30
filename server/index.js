require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect(process.env.dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open', () => console.log('connected to Database'));

app.use(express.json());

const reviewsRouter = require('./routes/reviewsRoutes.js');
app.use('/reviews', reviewsRouter);

app.listen(port, () => {
  console.log(`Reviews server is listening on port ${port}`)
})

