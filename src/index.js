import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';
import 'assets/scss/style.scss';
import { information } from 'services/auth'; // Certifique-se de que o caminho está correto
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');

const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token); // Apenas decodificando o token sem verificar a validade
    console.log("Decoded token:", decoded); // Exibe o token decodificado
    return decoded;  // Retorna o payload do token
  } catch (err) {
    console.error('Erro ao decodificar o token:', err);
    return null;
  }
};

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
};

const handleToken = async () => {
  if (!token) {
    console.log('No token found. Rendering without token.');
    renderApp();
    return;
  }

  console.log('Token found:', token);

  try {
    const decoded = decodeToken(token);  // Apenas decodificando o token
    if (decoded) {
      await loadUserInformation();  // Carregar informações do usuário
      renderApp();
    } else {
      handleTokenError(new Error('Token is invalid.'));
      renderApp();
    }
  } catch (err) {
    console.error('Error handling token:', err);
    handleTokenError(err);
    renderApp();
  }
};

const loadUserInformation = async () => {
  const unit = parseInt(localStorage.getItem('unit'));
  const unidade_modelo = parseInt(localStorage.getItem('unidade_modelo'));
  const res = await information();
  store.dispatch({ type: 'SET_LOGIN', payload: res.data });
  store.dispatch({ type: 'SET_UNIT_USER', payload: unit });
  store.dispatch({ type: 'SET_UNIT_MODELO_USER', payload: unidade_modelo });
};

const handleTokenError = (err) => {
  console.error('Token validation failed with error:', err);
  // Lógica para lidar com erro de token (ex: limpar o token, redirecionar para login, etc.)
};

handleToken();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
