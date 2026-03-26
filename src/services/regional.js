import { app } from './Api';

const getResourceRegional = async () => {
  return app.get(`get_resource_regional`);
};
const postRegional = async (data) => {
  return app.post(`regional`, data);
};
const getRegionals = async (page, qtdPerPage, regional, idBusiness) => {
  return app.get(
    `regional?page=${page}&qtdPerPage=${qtdPerPage}&nameRegional=${regional}&idBusiness=${idBusiness}`
  );
};
const updateRegional = async (id, data) => {
  return app.put(`regional/${id}`, data);
};
const deleteRegional = async (id) => {
  return app.delete(`regional/${id}`);
};
const getRegionalPerId = async (id) => {
  return app.get(`regional/${id}`);
};

export {
  getResourceRegional,
  postRegional,
  getRegionals,
  updateRegional,
  deleteRegional,
  getRegionalPerId,
};
