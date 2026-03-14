import axios from 'axios';

const client = axios.create({
  baseURL: 'https://bloodlink-ftzc.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

export default client;