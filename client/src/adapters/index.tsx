import axios from 'axios';
import jsonConfig from '@config/config.json';
import { handleDatesAndNull } from './helpers';

// Sets the base url for all backend requests
const backend_axios = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:8080' : jsonConfig.productionServerUrl,
});

// Converts dates in recived data from backend
backend_axios.interceptors.response.use((originalResponse) => {
  handleDatesAndNull(originalResponse.data);
  return originalResponse;
});

export default backend_axios;
