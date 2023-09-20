import http from "k6/http";
import { sleep } from "k6";

export const options = {
  // Key configurations for avg load test in users Login
  stages: [
    { duration: "30s", target: 100 }, // traffic ramp-up from 1 to 100 users over 50 seconds.
    { duration: "1m", target: 100 }, // stay at 100 users for 1 minute
    { duration: "30s", target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.03"],
  },
};

export default () => {
  const url = "http://localhost:5000/user/login";
  const payload = JSON.stringify({
    email: "mwai@gmail.com",
    password: "123456",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      "application-type": "application/json",
    },
  };

  http.post(url, payload, params);
  sleep(1);
};