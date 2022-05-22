import axios, { AxiosRequestConfig } from 'axios';

const axiosClient = axios.create();

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = { 'Authorization': 'Bearer ' + token };
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosClient;
