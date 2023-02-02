const express = require('express');
const router = express.Router();
const {ProductReviews} = require('../models/reviewsModels.js');
const csvtojson = require("csvtojson");
const fs = require('fs');
const reviewsCSV = "/Users/briankuzma/Desktop/HR/SDC/reviews.csv";
const mock = "mock.csv";
const product = "/Users/briankuzma/Desktop/HR/SDC/product.csv";
const PhotosFile = "/Users/briankuzma/Desktop/HR/SDC/reviews_photos.csv";
const characteristicReviewsCSV = "/Users/briankuzma/Desktop/HR/SDC/characteristic_reviews.csv";
const characteristicCSV = "/Users/briankuzma/Desktop/HR/SDC/characteristics.csv";
const csv = require('csv-parser');


router.post('/addProductIds', async (req, res) => {

  var data = [];
  var thousandLines = 0;
  var batchSize = 1000;

  const readable = fs.createReadStream(product)
    .pipe(csv({ headers: true }))
    .on('data', async (row) => {
      var currentDataobj = row;

      var modifyDataObj = {
        product: currentDataobj._0,
      }
      data.push(modifyDataObj);
      if (data.length === batchSize) {
        readable.pause()
        await ProductReviews.insertMany(data)
        .then(() => {
          console.log(thousandLines, 'thousand lines entered successfully')
          data = [];
          thousandLines++;
        })
        .then(()=>{
          readable.resume();
        })
        .catch(error => {
          console.log(error);
        });
      }
    })
    .on('end', () => {
      if (data.length > 0) {
        ProductReviews.insertMany(data)
        .then(() => {
          console.log('last', data.length, 'lines inserted successfully');
        })
        .catch(error => {
          console.log(error);
        });
      }
    });
    res.sendStatus(201)
});


router.post('/addPhotos', async (req, res) => {

  const readable = fs.createReadStream(PhotosFile)
  .pipe(csv({ headers: true }))


    const dataArr = [];
    var thousandLine = 0;

  readable.on('data', async (row) => {
    var reviewId = parseInt(row._1);
    var photoId = parseInt(row._0);

    var photoObj = {
      id: photoId,
      url: row._2
    }

    dataArr.push({
      updateOne: {
          filter: {'results.review_id': reviewId},
          update: {$push: {'results.$.photos': photoObj}}
      }
    });

    if (dataArr.length === 1000) {
      readable.pause()
      await ProductReviews.bulkWrite(dataArr);
      dataArr.length = 0;
      thousandLine++;
      console.log(thousandLine, 'thousand lines entered')
      readable.resume()
    }
    });

    readable.on('end', async () => {
    if (dataArr.length > 0) {
      await ProductReviews.bulkWrite(dataArr);
    }
    });
  res.sendStatus(201)
});


router.post('/addReview', async (req, res) => {
  const readable = fs.createReadStream(reviewsCSV)
  .pipe(csv({ headers: true }));

  const dataArr = [];
  var thousandLine = 0;

  readable.on('data', async (row) => {
    var reviewIdNum = parseInt(row._0);
    var reviewRatingNum = parseInt(row._2);
    var reviewHelpfulessNum = parseInt(row._11);

    if (row._6 === "true") {
      row._6 = true;
    } else {
      row._6 = false;
    }

    if (row._6 === "true") {
      row._7 = true;
    } else {
      row._7 = false;
    }

    if (row._10 === "null") {
      row._10 = null;
    }

    row._3;
    var timestamp = Number(row._3);
    var date = new Date(timestamp);
    var finalDate = date.toISOString().slice(0, -1) + "0Z";

  var productID = row._1;
  var review = {
    "review_id": reviewIdNum,
    "rating": reviewRatingNum,
    "summary": row._4,
    "recommend": row._6,
    "reported": row._7,
    "response": row._10,
    "body": row._5,
    "date": finalDate,
    "reviewer_name": row._9,
    "helpfulness": reviewHelpfulessNum,
    "photos": []
  };

  dataArr.push({
      updateOne: {
          filter: { product: row._1 },
          update: { $push: { results: review } }
      }
  });

  if (dataArr.length === 1000) {
    readable.pause()
    await ProductReviews.bulkWrite(dataArr);
    dataArr.length = 0;
    thousandLine++;
    console.log(thousandLine, 'thousand lines entered')
    readable.resume()
  }
  });

  readable.on('end', async () => {
  if (dataArr.length > 0) {
    await ProductReviews.bulkWrite(dataArr);
  }
  });
  res.sendStatus(201)
});

router.post('/addCharacteristics', async (req, res) => {

  const readable = fs.createReadStream(characteristicReviewsCSV)
  .pipe(csv({ headers: true }))


    const dataArr = [];
    var thousandLine = 0;

  readable.on('data', async (row) => {
    var reviewId = parseInt(row._2);
    var id = parseInt(row._0);
    var characteristicId = parseInt(row._1);
    var charVal = parseInt(row._3);

    var characteristicObj = {
      name: '',
      id: id,
      charId: characteristicId,
      value: charVal
    }

    dataArr.push({
      updateOne: {
          filter: {'results.review_id': reviewId},
          update: {$push: {'results.$.characteristics': characteristicObj}}
      }
    });

    if (dataArr.length === 1000) {
      readable.pause()
      await ProductReviews.bulkWrite(dataArr);
      dataArr.length = 0;
      thousandLine++;
      console.log(thousandLine, 'thousand lines entered')
      readable.resume()
    }
    });

    readable.on('end', async () => {
    if (dataArr.length > 0) {
      await ProductReviews.bulkWrite(dataArr);
    }
    });
  res.sendStatus(201)
});


router.post('/addCharNames', async (req, res) => {

  const readable = fs.createReadStream(characteristicCSV)
  .pipe(csv({ headers: true }))


    const dataArr = [];
    var thousandLine = 0;

  readable.on('data', async (row) => {
    var id = parseInt(row._0);

    dataArr.push({
      updateOne: {
        filter: { "results.characteristics.id": id },
        update: { $set: { "results.$[].characteristics.$[elem].name": row._2 } },
        arrayFilters: [ { "elem.id": id } ]
      }
    });

    if (dataArr.length === 1000) {
      readable.pause()
      await ProductReviews.bulkWrite(dataArr);
      dataArr.length = 0;
      thousandLine++;
      console.log(thousandLine, 'thousand lines entered')
      readable.resume()
    }
    });

    readable.on('end', async () => {
    if (dataArr.length > 0) {
      await ProductReviews.bulkWrite(dataArr);
    }
    });
  res.sendStatus(201)
});



////////////////////////////////////////////// FEC API ROUTES //////////////////////////////////////////////

router.get('/', async (req, res) => {
  const product_id = req.query.product_id || 5;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'newest';

  try {
    const currentDataobj = await ProductReviews.find({ product: product_id }, null, { sort: { 'results.date': -1 } });
    const returnObj = {};
    // var ProductsArr = currentDataobj[0].product
    returnObj.product = currentDataobj[0].product;
    returnObj.page = Number(page);
    returnObj.count = Number(5);
    returnObj.results = currentDataobj[0].results;
    returnObj.results.splice(count);
    // console.log('here is return Obj', returnObj);

    res.status(200).json(returnObj);
  } catch (error) {
    res.status(500).json({ message: 'Error getting reviews' });
  }
});


router.post('/', async (req, res) => {
  var lastReviewId = null;
  await ProductReviews.findOne().sort({'results.review_id': -1}).select('results.review_id').exec(function(err, review) {
    if (err) {
      console.log(err);
    } else {
      lastReviewId = review ? review.results[0].review_id + 1 : 1;
      console.log(lastReviewId);
    }
  });

  const characteristicsArray = Object.entries(req.body.characteristics).map(([charId, value]) => ({
    name: '',
    id: '',
    charId: Number(charId),
    value
  }));

  const newReview = {
    review_id: lastReviewId,
    rating: req.body.rating,
    summary: req.body.summary,
    recommend: req.body.recommend,
    reported: 'null',
    response: '',
    body: req.body.body,
    date: new Date().toISOString(),
    reviewer_name: req.body.name,
    helpfulness: 0,
    photos: req.body.photos,
    characteristics: characteristicsArray
  };

  const product = await ProductReviews.findOne({ product: req.body.product_id });
  if (!product) {
    const reviewObj = new ProductReviews({
      product: req.body.product_id,
      results: [newReview]
    });
    await reviewObj.save();
  } else {
    product.results.push(newReview);
    await product.save();
  }

  res.send(newReview);
});


router.get('/metadata', (req, res) => {
  const product_id = req.query.product_id || 5;
  ProductReviews.find({ product: product_id })
    .then(response => {
      var resultsArr = response[0].results;
      // console.log('here is results arr', resultsArr)
      var rawCharsArr = [];
      var ratingsObj ={
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };

      var recommendObj ={
        0: 0,
        1: 0
      };

      for (var i = 0; i < resultsArr.length; i++) {
        resultsArr[i].characteristics.forEach(element => {
          rawCharsArr.push(element);
        });
        var currentRating = resultsArr[i].rating;
        ratingsObj[currentRating] += 1;
        if (resultsArr[i].recommend === true){
          recommendObj[1] += 1;
        } else {
          recommendObj[0] += 1;
        }
      };
    // console.log('here is raw charsArr', rawCharsArr)
    charsArr = {}
    for (var i = 0; i < rawCharsArr.length; i++) {
      if (charsArr[rawCharsArr[i].name] === undefined ) {
        charsArr[rawCharsArr[i].name] = {};
        charsArr[rawCharsArr[i].name].id = rawCharsArr[i].id;
        charsArr[rawCharsArr[i].name].valCount = 1;
        charsArr[rawCharsArr[i].name].value = rawCharsArr[i].value;
      }
      else {
        charsArr[rawCharsArr[i].name].valCount += 1;
        charsArr[rawCharsArr[i].name].value += rawCharsArr[i].value;
      }
    }
    for (var key in charsArr) {
      var count = charsArr[key].valCount;
      var val = charsArr[key].value;
      charsArr[key].value = val/count;
      delete charsArr[key].valCount;
    }

    // console.log('cleaned up charsArr', charsArr);

    var returnObj = {};
    returnObj.product_id = response[0].product
    returnObj.ratings = ratingsObj;
    returnObj.recommend =recommendObj;
    returnObj.characteristics = charsArr;

    console.log(returnObj);

    res.status(200).json(returnObj);
    })
    .catch(err => {
      res.status(500).json({ message: 'MetaData had an error in retrieval' });
    });
});


router.put('/helpful', async (req, res) => {
  const review_id = req.query.review_id || 1;

    ProductReviews.updateOne({ "results.review_id": review_id }, { $inc: { "results.$.helpfulness": 1 } }, {new: true})
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      res.status(500).json({ message: 'Helpful post had an error' });
    });
});


module.exports = router;



