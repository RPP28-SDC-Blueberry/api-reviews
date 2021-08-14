import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 1000);
    const response = http.get(`http://localhost:3000/products/${rnd}/styles`);
    check(response, {
        "is status 200": (r) => r.status === 200,
        "is id the same we asked": (r) => {
            const id = Number(r.json("product_id"))
            return id === rnd
        }
    })
}

export let options = {
    scenarios: {
        constant_request_rate: {
          executor: 'constant-arrival-rate',
          rate: 1000,
          timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
          duration: '30s',
          preAllocatedVUs: 100, // how large the initial pool of VUs would be
          maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
        },
      },
};