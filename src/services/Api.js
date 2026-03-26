import axios from 'axios';

const baseIBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades/';
const baseVIACEP = 'https://viacep.com.br/ws/';
const { REACT_APP_BASE_URL } = process.env;

const app = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

app.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

app.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

const auth = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

auth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

auth.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   // Se o token for inválido ou expirar, remover o token do localStorage
    //   localStorage.removeItem('token');
    //   // Redirecionar para a página de login ou lidar com o erro conforme necessário
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

const ibge = axios.create({
  baseURL: baseIBGE,
});

const viacep = axios.create({
  baseURL: baseVIACEP,
});

export { auth, app, ibge, viacep };
