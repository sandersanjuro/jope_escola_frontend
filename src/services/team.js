import { app } from './Api';

const getResourceTeam = async () => {
  return app.get(`get_resource_team`);
};

const postTeam = async (data) => {
  return app.post(`team`, data);
};

const getTeam = async (page, qtdPerPage, nameTeam) => {
  return app.get(
    `team?page=${page}&qtdPerPage=${qtdPerPage}&nameTeam=${nameTeam}`
  );
};

const updateTeam = async (id, data) => {
  return app.put(`team/${id}`, data);
};

const deleteTeam = async (id) => {
  return app.delete(`team/${id}`);
};
const getTeamPerId = async (id) => {
  return app.get(`team/${id}`);
};

export {
  getResourceTeam,
  postTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  getTeamPerId,
};
