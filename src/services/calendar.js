import { app } from './Api';

const getCalendar = async (page, qtdPerPage, title) => {
  return app.get(
    `calendar?page=${page}&qtdPerPage=${qtdPerPage}&title=${title}`
  );
};
const postCalendar = async (data) => {
  return app.post(`calendar`, data);
};
const updateCalendar = async (id, data) => {
  return app.put(`calendar/${id}`, data);
};
const getCalendarPerId = async (id) => {
  return app.get(`calendar/${id}`);
};
const deleteCalendar = async (id) => {
  return app.delete(`calendar/${id}`);
};
export {
  getCalendar,
  postCalendar,
  updateCalendar,
  getCalendarPerId,
  deleteCalendar,
};
