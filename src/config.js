import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //baseURL: import.meta.env.VITE_API_BASE_URL
      //  baseURL: 'http://localhost:3004/api/v1'

        baseURL:'https://gandhitvs.in/dealership/api/v1'
};

export default config;
