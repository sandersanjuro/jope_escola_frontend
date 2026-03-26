import { app } from './Api';

const postFamily = async (data) => {
  return app.post(`family`, data);
};
const getFamilys = async (page, qtdPerPage, family) => {
  return app.get(
    `family?page=${page}&qtdPerPage=${qtdPerPage}&nameFamily=${family}`
  );
};
const updateFamily = async (id, data) => {
  return app.put(`family/${id}`, data);
};
const deleteFamily = async (id) => {
  return app.delete(`family/${id}`);
};
const getFamilyPerId = async (id) => {
  return app.get(`family/${id}`);
};

export { postFamily, getFamilys, updateFamily, deleteFamily, getFamilyPerId };
