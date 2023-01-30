const request = require("supertest");
require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000;
const mongoose = require("mongoose");
const {ProductReviews} = require('../server/models/reviewsModels.js');
// jest.setTimeout(10000);

mongoose.connect(process.env.dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open', () => console.log('connected to Database'));

app.use(express.json());

const reviewsRouter = require('../server/routes/reviewsRoutes.js');
app.use('/reviews', reviewsRouter);

app.listen(port, () => {
  console.log(`Reviews server is listening on port ${port}`)
})




  test("It should accept GET request", async () => {
    const response = await request(app).get("/reviews");
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });

  // test("It should accept POST request", async () => {
  //   const response = await request(app)
  //     .post("/reviews")
  //     .send({
  //       product_id: 5,
  //       rating: 5,
  //       summary: "Great Product!",
  //       recommend: true,
  //       body: "I love this product",
  //       name: "ChonkyKitty",
  //       photos: [],
  //       characteristics: []
  //     });
  //   expect(response.statusCode).toBe(201);
  //   expect(response.type).toBe("application/json");
  // });


describe("Test the metadata path of ProductReviews API", () => {
  test("It should accept GET request", async () => {
    const response = await request(app).get("/reviews/metadata");
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });

describe("It should accept  PUT request to '/helpful'", () => {
  test("It should accept PUT", async () => {
    const review_id = 1;
    const response = await request(app)
      .put(`/reviews/helpful?review_id=${review_id}`)
      .send({});

    expect(response.statusCode).toBe(201);
    expect(response.type).toBe("application/json");
  });
});

});