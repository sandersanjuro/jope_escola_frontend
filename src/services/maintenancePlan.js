import { app } from './Api';

const getResourceMaintenancePlan = async (idUnit = '') => {
  return app.get(`get_resource_maintenance_plan?idUnit=${idUnit}`);
};
const postMaintenancePlan = async (data) => {
  return app.post(`maintenance_plan`, data);
};
const getMaintenancePlans = async (
  page,
  qtdPerPage,
  name,
  idUnit,
  idCategory
) => {
  return app.get(
    `maintenance_plan?page=${page}&qtdPerPage=${qtdPerPage}&name=${name}&idUnit=${idUnit}&idCategory=${idCategory}`
  );
};
const updateMaintenancePlan = async (id, data) => {
  return app.put(`maintenance_plan/${id}`, data);
};
const deleteMaintenancePlan = async (id) => {
  return app.delete(`maintenance_plan/${id}`);
};
const getMaintenancePlanPerId = async (idOperating) => {
  return app.get(`maintenance_plan/${idOperating}`);
};
const getTeamsByTypeOs = async (tipoOsId, idUnit) => {
  return app.get(`get_teams_by_type_os?tipo_os_id=${tipoOsId}&idUnit=${idUnit}`);
};
const changeStatus = async (id) => {
  return app.put(`/change_status_maintenance_plan/${id}`);
};

export {
  getResourceMaintenancePlan,
  postMaintenancePlan,
  getMaintenancePlans,
  updateMaintenancePlan,
  deleteMaintenancePlan,
  getMaintenancePlanPerId,
  getTeamsByTypeOs,
  changeStatus,
};
