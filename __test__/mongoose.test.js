const mongoose = require('mongoose');
require("dotenv").config();
const {ProductReviews} = require('../server/models/reviewsModels.js');
const reviewMock = {
  product: '5',
  results: [{
      review_id: 1,
      rating: 3,
      summary: 'It is awesome mouse toy',
      recommend: true,
      reported: 'no',
      response: 'yes it is',
      body: 'this is the best way to spend an afternoon',
      date: '121324213423',
      reviewer_name: 'bigChonkyKitty',
      helpfulness: 5,
      photos: [{id: 5, url: 'https://www.kittytoys.com'}],
      characteristics: [{name: 'size', id: 5, charId: 4, value: 3}]
    }]
};

describe('User Model Test', () => {

    beforeAll(async () => {

      await mongoose.connect(process.env.dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

    });

    it('create & save user successfully', async () => {
        const review = new ProductReviews(reviewMock);
        const savedReview = await review.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedReview._id).toBeDefined();
        expect(savedReview.rating).toBe(reviewMock.rating);
        expect(savedReview.response).toBe(reviewMock.response);
        expect(savedReview.reviewer_name).toBe(reviewMock.reviewer_name);
        expect(savedReview.helpfulness).toBe(reviewMock.helpfulness);
    });


})