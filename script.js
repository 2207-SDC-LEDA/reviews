import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 1000,
  duration: '20s',
};
export default function () {
  const randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  };

  const rndInt = randomIntFromInterval(900000, 1000000)

  // let res = http.get(`http://34.210.236.200/reviews?product_id=${rndInt}`);


    // http.get(`http://localhost:3000/reviews`);
    let res = http.get(`http://localhost:3000/reviews?product_id=${rndInt}`);
    // let res = http.put(`http://localhost:3000/reviews/helpful?review_id=${rndInt}`)

      // let reviewObj = {
      // product_id: 1,
      // rating: 4,
      // summary: "Great product!",
      // recommend: true,
      // body: "I LOVE THIS.",
      // name: "Chonky",
      // photos: [],
      // characteristics: []
      // };

      // let res = http.post("http://localhost:3000/reviews", JSON.stringify(reviewObj), {
      // headers: {
      // "Content-Type": "application/json"
      // }
      // });

      // var res = http.get(`http://localhost:3000/reviews/metadata?product_id=${rndInt}`)

      // check(res, {
      // "status is 201": (r) => r.status === 200,
      // "response is not empty": (r) => r.body.length > 0
      // });


  sleep(1);
}







// export default function() {
//   const requests = [];
//   for (let i = 900000; i <= 1000000; i++) {
//     requests.push({ method: "GET", url: `http://your-url.com?param=${i}` });
//   }
//   const res = http.batch(requests);

//   check(res, {
//     "status is 200": (r) => r.every((res) => res.status === 200)
//   });
// }