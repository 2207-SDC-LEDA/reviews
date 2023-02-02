import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 1,
  duration: '20s',
};
export default function () {
  const randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  };

  const rndInt = randomIntFromInterval(1, 100)
    // http.get(`http://localhost:3000/reviews`);
    // http.get(`http://localhost:3000/reviews?product_id=${rndInt}`);
    // http.put(`http://localhost:3000/reviews/helpful?review_id=${rndInt}`)

      let reviewObj = {
      product_id: 1,
      rating: 4,
      summary: "Great product!",
      recommend: true,
      body: "I love this product and would recommend it to anyone.",
      name: "John Doe",
      photos: [],
      characteristics: []
      };

      let res = http.post("http://localhost:3000/reviews", JSON.stringify(reviewObj), {
      headers: {
      "Content-Type": "application/json"
      }
      });

      check(res, {
      "status is 201": (r) => r.status === 201,
      "response is not empty": (r) => r.body.length > 0
      });
// GET http://localhost:3000/reviews/metadata
// ###


  sleep(1);
}