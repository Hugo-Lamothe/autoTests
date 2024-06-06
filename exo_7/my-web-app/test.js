import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5m', target: 500 }, // 500 utilisateurs pendant 5 minutes
    ],
};

export default function () {
    http.get('http://localhost:3000');
    sleep(1);
}