const express = require('express');
const router = express.Router();
const {ProductReviews} = require('../models/reviewsModels.js');
const csvtojson = require("csvtojson");
const fs = require('fs');
const reviewsCSV = "reviews.csv";
const mock = "mock.csv";
const product = "product.csv";
const PhotosFile = "reviews_photos.csv";
const characteristicReviewsCSV = "characteristic_reviews.csv";
const characteristicCSV = "characteristics.csv";
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

  var productID = row._1;
  var review = {
    "review_id": reviewIdNum,
    "rating": reviewRatingNum,
    "summary": row._4,
    "recommend": row._6,
    "reported": row._7,
    "response": row._10,
    "body": row._5,
    "date": row._3,
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

  ProductReviews.find({ product: product_id }, null, { sort: { 'results.date': -1 } })
  .then(data => {
    var currentDataobj = data[0];
    delete currentDataobj._id;
    delete currentDataobj.__v;
    currentDataobj.results = currentDataobj.results.map(result => {
      delete result._id;
      delete result.characteristics;
      return result;
    });
    currentDataobj.page = page;
    currentDataobj.count = count;
    console.log(currentDataobj);
    res.status(200).json(currentDataobj);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error getting reviews' });
  });
})


router.post('/', async (req, res) => {

  const lastReview = await ProductReviews.findOne().sort({review_id: -1});
  const newReviewId = lastReview.review_id + 1;

  const reviewObj = new ProductReviews({
    product: req.body.product_id,
    results: [{
      review_id: newReviewId,
      rating: req.body.rating,
      summary: req.body.summary,
      recommend: req.body.recommend,
      body: req.body.body,
      date: new Date(),
      reviewer_name: req.body.name,
      photos: req.body.photos,
      characteristics: req.body.characteristics
    }]
  });
  try {
    const savedReview = await reviewObj.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: 'Adding a new review encountered an error' });
}
});

// router.get('/metadata', (req, res) => {
//   const product_id = req.query.product_id;

//GET METADATA
//     .then(data => {
//       res.status.(200)json(data);
//     })
//     .catch(err => {
//       res.status(500).json({ message: 'MetaData had an error in retrieval' });
//     });
// });


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



