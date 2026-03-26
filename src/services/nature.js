import { app } from './Api';

const postNature = async (data) => {
  return app.post(`nature`, data);
};
const getNatures = async (page, qtdPerPage, nature) => {
  return app.get(
    `nature?page=${page}&qtdPerPage=${qtdPerPage}&nameNature=${nature}`
  );
};
const updateNature = async (id, data) => {
  return app.put(`nature/${id}`, data);
};
const deleteNature = async (id) => {
  return app.delete(`nature/${id}`);
};
const getNaturePerId = async (id) => {
  return app.get(`nature/${id}`);
};

export { postNature, getNatures, updateNature, deleteNature, getNaturePerId };
