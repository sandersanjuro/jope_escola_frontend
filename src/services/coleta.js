import { app } from './Api';
import { appblob } from './ApiBlob';

const postColeta = async (data) => {
  return app.post(`coleta`, data);
};
const getColetas = async (page = '', qtdPerPage = '', unidade_id = '', driver_id = '', initialDate = '', finalDate = '') => {
  return app.get(
    `coleta?page=${page}&qtdPerPage=${qtdPerPage}&unidade_id=${unidade_id}&driver_id=${driver_id}&initialDate=${initialDate}&finalDate=${finalDate}`
  );
};
const updateColeta = async (id, data) => {
  return app.put(`coleta/${id}`, data);
};
const deleteColeta = async (id) => {
  return app.delete(`coleta/${id}`);
};
const getColetaPerId = async (id) => {
  return app.get(`coleta/${id}`);
};
const pesoColeta = async (id, data) => {
    return app.put(`peso_coleta/${id}`, data);
};
const getExcel = async (page = '', qtdPerPage = '', unidade_id = '', driver_id = '', initialDate = '', finalDate = '') => {
  return appblob.get(
    `relatorio/coleta?page=${page}&qtdPerPage=${qtdPerPage}&unidade_id=${unidade_id}&driver_id=${driver_id}&initialDate=${initialDate}&finalDate=${finalDate}`
  );
};

export { postColeta, getColetas, updateColeta, deleteColeta, getColetaPerId, pesoColeta, getExcel };
