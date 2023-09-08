import axios from 'axios';
import store from '../store/index';

const instance = axios.create({
  baseURL: 'http://localhost:3456',
});

instance.interceptors.request.use(
  (config) => {

    const token = store.state.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
