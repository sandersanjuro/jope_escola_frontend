import { app } from './Api';
import { appblob } from './ApiBlob';

const getResourceUnit = async () => {
  return app.get(`get_resource_unit`);
};
const postUnit = async (data) => {
  return app.post(`unit`, data);
};
const getUnits = async (page, qtdPerPage, unit, idReg) => {
  return app.get(
    `unit?page=${page}&qtdPerPage=${qtdPerPage}&nameUnit=${unit}&idReg=${idReg}`
  );
};
const updateUnit = async (id, data) => {
  return app.put(`unit/${id}`, data);
};
const deleteUnit = async (id) => {
  return app.delete(`unit/${id}`);
};
const getUnitPerId = async (id) => {
  return app.get(`unit/${id}`);
};
const getUnit = async () => {
  return app.get(`/get_unit`);
};

const getUnitContador = async () => {
  return app.get(`get_unit_contador`);
};

const generateQrUnit = async (id) => {
  return appblob.post(`qrcode_unit/${id}`);
};

export {
  getResourceUnit,
  postUnit,
  getUnits,
  updateUnit,
  deleteUnit,
  getUnitPerId,
  getUnit,
  getUnitContador,
  generateQrUnit
};
