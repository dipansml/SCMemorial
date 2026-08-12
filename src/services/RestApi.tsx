import axios from 'axios';
import StorageManager from './StorageManager';

//const BASE_URL = 'http://192.168.1.18/scms.beas.in/api';
const BASE_URL = 'http://182.73.216.93/scms.beas.in/api';

export const RestApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
RestApi.interceptors.request.use(
  async config => {
    try {
      const token = await StorageManager.getToken();

      // ✅ Add token
      if (token && token.trim() !== '') {
        config.headers['X-Authorization'] = `Bearer ${token}`;
      }

      // ✅ LOG API REQUEST
      console.log('\n================ API REQUEST ================');
      console.log('URL:', `${config.baseURL}${config.url}`);
      console.log('METHOD:', config.method?.toUpperCase());
      console.log('HEADERS:', config.headers);
      console.log('PARAMS:', config.params);
      console.log('BODY:', config.data);
      console.log('============================================\n');

      return config;
    } catch (error) {
      console.log('Request Interceptor Error:', error);
      return config;
    }
  },
  error => Promise.reject(error),
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
RestApi.interceptors.response.use(
  response => {
    // ✅ LOG API RESPONSE
    console.log('\n================ API RESPONSE ================');
    console.log('URL:', response.config.url);
    console.log('STATUS:', response.status);
    console.log('DATA:', response.data);
    console.log('=============================================\n');

    return response;
  },

  error => {
    // ✅ LOG API ERROR
    console.log('\n================ API ERROR ==================');
    console.log('URL:', error?.config?.url);
    console.log('STATUS:', error?.response?.status);
    console.log('ERROR DATA:', error?.response?.data);
    console.log('MESSAGE:', error?.message);
    console.log('=============================================\n');

    return Promise.reject(error);
  },
);
