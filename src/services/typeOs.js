import { app } from './Api';

const getResourceTypeOs = async () => {
  return app.get(`get_resource_typeos`);
};
const postTypeOs = async (data) => {
  return app.post(`type_os`, data);
};
const getTypeOs = async (page, qtdPerPage, nameTypeOs) => {
  return app.get(
    `type_os?page=${page}&qtdPerPage=${qtdPerPage}&nameTypeOs=${nameTypeOs}`
  );
};
const updateTypeOs = async (id, data) => {
  return app.put(`type_os/${id}`, data);
};
const deleteTypeOs = async (id) => {
  return app.delete(`type_os/${id}`);
};
const getTypeOsPerId = async (id) => {
  return app.get(`type_os/${id}`);
};
const activeTypeOsPerId = async (id) => {
  return app.put(`active_type_os/${id}`);
};
const getTypeOsUser = async (user_id = '') => {
  return app.get(`type_os_user?user_id=${user_id}`);
};

export {
  getResourceTypeOs,
  postTypeOs,
  getTypeOs,
  updateTypeOs,
  deleteTypeOs,
  getTypeOsPerId,
  activeTypeOsPerId,
  getTypeOsUser
};
