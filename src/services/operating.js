import { app } from './Api';
import { appblob } from './ApiBlob';

const getResourceOperating = async () => {
  return app.get(`get_resource_operating`);
};
const postOperating = async (data) => {
  return app.post(`operating`, data);
};
const getOperatings = async (page, qtdPerPage, name, idUnit, idCategory) => {
  return app.get(
    `operating?page=${page}&qtdPerPage=${qtdPerPage}&name=${name}&idUnit=${idUnit}&idCategory=${idCategory}`
  );
};
const updateOperating = async (id, data) => {
  return app.put(`operating/${id}`, data);
};
const deleteOperating = async (id) => {
  return app.delete(`operating/${id}`);
};
const getOperatingPerId = async (id) => {
  return app.get(`operating/${id}`);
};
const getOperating = async () => {
  return app.get(`/get_operating`);
};
const changeStatus = async (id) => {
  return app.put(`/change_status_operating/${id}`);
};
const printerQr = async (data) => {
  return appblob.post(`/qrcode_operating`, data);
};
export {
  getResourceOperating,
  postOperating,
  getOperatings,
  updateOperating,
  deleteOperating,
  getOperatingPerId,
  getOperating,
  changeStatus,
  printerQr,
};
