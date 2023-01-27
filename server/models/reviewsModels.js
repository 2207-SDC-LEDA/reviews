const mongoose =require('mongoose');


// const reviewSchema = new mongoose.Schema({
//   review_id: Number,
//   rating: Number,
//   summary: String,
//   recommend: String,
//   reported: String,
//   response: String,
//   body: String,
//   date: String,
//   reviewer_name: String,
//   helpfulness: Number,
//   photos: []
// });

const productReviewsSchema = new mongoose.Schema({
  product: { type: String, index: true },
  results: [{
      review_id: { type: Number, index: true },
      rating: Number,
      summary: String,
      recommend: String,
      reported: String,
      response: String,
      body: String,
      date: String,
      reviewer_name: String,
      helpfulness: Number,
      photos: [{id: Number, url: String}],
      characteristics: [{name: String, id: { type: Number, index: true }, charId: Number, value: Number}]
    }]
});

// const photosIdSchema = new mongoose.Schema({
//   review_id: { type: Number, index: true, unique: true },
//   results: []
// });


// const metaDataSchema = new mongoose.Schema({
//   product_id: Number,
//   ratings: {
//     1: Number,
//     2: Number,
//     3: Number,
//     4: Number,
//     5: Number,
//   },
//   recommended: {
//     0: Number,
//     1: Number
//   },
//   characteristics: {
//     Size: {
//       id: Number,
//       value: Number,
//     },
//     Width: {
//       id: Number,
//       value: Number
//     },
//     Comfort: {
//       id: Number,
//       value: Number
//     },
//   }
// });



var ProductReviewsSchema = mongoose.model('ProductReviews', productReviewsSchema)

// var photosSchema = mongoose.model('Photos', photosIdSchema)

// var MetaDataSchema =mongoose.model('MetaData', metaDataSchema)

// var ReviewSchema =mongoose.model('Review', reviewSchema)

module.exports = {ProductReviews: ProductReviewsSchema}
