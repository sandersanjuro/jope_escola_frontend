import axios from 'axios';
const baseIBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades/';
const baseVIACEP = 'https://viacep.com.br/ws/';
const { REACT_APP_BASE_URL } = process.env;

const appblob = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

appblob.interceptors.request.use(
  (config) => {
    return {
      ...config,
      responseType: 'blob',
      headers: {
        ...config.headers,
        common: {
          ...config.headers.common,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    };
  },
  (error) => Promise.reject(error)
);

const auth = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

const ibge = axios.create({
  baseURL: baseIBGE,
});

const viacep = axios.create({
  baseURL: baseVIACEP,
});

export { auth, appblob, ibge, viacep };
