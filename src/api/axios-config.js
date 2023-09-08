import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:3456',
});

instance.interceptors.request.use(
  (config) => {
    const cookies = Cookies.get('auth');

    if(cookies) {
      const user = JSON.parse(cookies);
      const token = user.token
      config.headers['x-access-token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
