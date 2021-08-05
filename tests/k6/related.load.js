import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 1000);
    const response = http.get(`http://localhost:3000/products/${rnd}/related`);
    check(response, {
        "is status 200": (r) => r.status === 200,
        "is the result an array": (r) => Array.isArray(JSON.parse(r.body)) === true
    })
}

export let options = {
    vus: 1,
    duration: '5s',
    // thresholds: {
    //     'failed requests': ['rate<0.02'],
    //     http_req_duration: ['p(95)<500'],
    //     http_reqs: ['count>6000']
    // },
};