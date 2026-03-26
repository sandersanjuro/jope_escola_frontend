import { app } from './Api';

const postTypeTask = async (data) => {
  return app.post(`typetask`, data);
};
const getTypeTasks = async (page, qtdPerPage, nometarefa, idUnit) => {
  return app.get(
    `typetask?page=${page}&qtdPerPage=${qtdPerPage}&tarefa=${nometarefa}&idUnit=${idUnit}`
  );
};
const updateTypeTask = async (id, data) => {
  return app.put(`typetask/${id}`, data);
};
const deleteTypeTask = async (id) => {
  return app.delete(`typetask/${id}`);
};
const getTypeTaskPerId = async (id) => {
  return app.get(`typetask/${id}`);
};

export {
  postTypeTask,
  getTypeTasks,
  updateTypeTask,
  deleteTypeTask,
  getTypeTaskPerId,
};
