// for refresh token

import axios from 'axios';

const Interceptor = axios.create({
  timeout: 20000,
});

Interceptor.interceptors.request.use((config) => {
  // Uncomment the following lines if needed
  // if (localStorage.getItem("supernova_token")) {
  //   config.headers.common = {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   };
  // }

  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // console.log('Modified Request Config:', config.headers);
  return config;
});

export default Interceptor
