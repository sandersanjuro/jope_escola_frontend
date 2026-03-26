import { app } from './Api';

const getSlas = async (page, qtdPerPage, nameSla) => {
  return app.get(
    `sla?page=${page}&qtdPerPage=${qtdPerPage}&nameSla=${nameSla}`
  );
};
const deleteSla = async (id) => {
  return app.delete(`sla/${id}`);
};
const getResourceSla = async () => {
  return app.get(`get_resource_sla`);
};
const postSla = async (data) => {
  return app.post(`sla`, data);
};
const getSlaPerId = async (id) => {
  return app.get(`sla/${id}`);
};
const updateSla = async (id, data) => {
  return app.put(`sla/${id}`, data);
};
export { getSlas, deleteSla, getResourceSla, postSla, getSlaPerId, updateSla };
