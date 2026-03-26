import { auth, app } from './Api';

const authentication = async (data) => auth.post('login', data);
const information = async () => app.post('me');
const register = async (data) => app.post('register', data);
const updatePassword = async (data) => app.put('userPassword/edit', data);
const rememberPassword = async (data) => auth.post(`password/email`, data);
const updatePasswordRemember = async (data) =>
  auth.post(`password/reset`, data);

export {
  authentication,
  information,
  register,
  updatePassword,
  rememberPassword,
  updatePasswordRemember,
};
