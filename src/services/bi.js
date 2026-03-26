import { app } from './Api';

const getTasksBi = async (filterDate, filterUnit) => {
  return app.get(`bi_task?filterDate=${filterDate}&filterUnit=${filterUnit}`);
};

const getManagerBi = async (year, unit) => {
  return app.get(`bi_sla_manager?year=${year}&unit=${unit}`);
};

const getManagerBiUnit = async (year, unit) => {
  return app.get(`bi_sla_manager_unit?year=${year}&unit=${unit}`);
};

const getCountVisitsBi = async (date, unit) => {
  return app.get(`bi_count_visit?date=${date}&unit=${unit}`);
};

export { getManagerBi, getTasksBi, getManagerBiUnit, getCountVisitsBi };
