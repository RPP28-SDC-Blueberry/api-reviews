import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 1000);
    const response = http.get(`http://3.85.185.210:3000/products/${rnd}/related`);
    check(response, {
        "is status 200": (r) => r.status === 200,
        "is the result an array": (r) => Array.isArray(JSON.parse(r.body)) === true
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