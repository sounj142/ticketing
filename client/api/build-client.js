import axios from 'axios';

export default function buildClient ({ req }) {
  if (typeof window === 'undefined') {
    // we are on the server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: {
        // we need cookies from client
        ...req.headers,
      },
    });
  }
  // we must be on the browser
  return axios.create();
}
