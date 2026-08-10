import axios from 'axios';

const BASE_URL = 'http://192.168.1.18/scms.beas.in/api';

export const RestApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Optional: Interceptor (for token later)
RestApi.interceptors.request.use(
  async config => {
    // Example: attach token here later
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

RestApi.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error?.response || error.message);
    return Promise.reject(error);
  }
);