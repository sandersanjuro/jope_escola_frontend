import { app } from './Api';

const getUsers = async (page, qtdPerPage, nameUser) => {
  return app.get(
    `user?page=${page}&qtdPerPage=${qtdPerPage}&nameUser=${nameUser}`
  );
};
const deleteUser = async (id) => {
  return app.delete(`user/${id}`);
};
const getResourceUser = async () => {
  return app.get(`get_resource_user`);
};
const getUserPerId = async (id) => {
  return app.get(`user/${id}`);
};
const updateUser = async (id, data) => {
  return app.put(`user/${id}`, data);
};
const postUser = async (data) => {
  return app.post(`user`, data);
};
const updatePassword = async (data) => {
  return app.post(`update_password`, data);
};
const getUserRegional = async (regional_id) => {
  return app.get(`user_regional?regional_id=${regional_id}`);
};
const updateProfile = async (id, data) => {
  return app.put(`profile/${id}`, data);
};
const getAllUsers = async (page = '', qtdPerPage = '', perfil_id = '') => {
  return app.get(
    `getAll/user?page=${page}&qtdPerPage=${qtdPerPage}&perfil_id=${perfil_id}`
  );
};

export {
  getUsers,
  deleteUser,
  getResourceUser,
  getUserPerId,
  updateUser,
  postUser,
  updatePassword,
  getUserRegional,
  updateProfile,
  getAllUsers
};
