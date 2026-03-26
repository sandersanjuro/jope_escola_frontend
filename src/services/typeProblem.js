import { app } from './Api';

const postTypeProblem = async (data) => {
  return app.post(`type_problem`, data);
};
const getTypeProblems = async (page, qtdPerPage, typeProblem) => {
  return app.get(
    `type_problem?page=${page}&qtdPerPage=${qtdPerPage}&nameProblem=${typeProblem}`
  );
};
const updateTypeProblem = async (id, data) => {
  return app.put(`type_problem/${id}`, data);
};
const deleteTypeProblem = async (id) => {
  return app.delete(`type_problem/${id}`);
};
const getTypeProblemPerId = async (id) => {
  return app.get(`type_problem/${id}`);
};

export {
  postTypeProblem,
  getTypeProblems,
  updateTypeProblem,
  deleteTypeProblem,
  getTypeProblemPerId,
};
