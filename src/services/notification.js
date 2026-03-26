import { app } from './Api';

const getNotification = async () => {
  return app.get(`notification`);
};

const sawNotification = async (id) => {
  return app.put(`saw_notification/${id}`);
};

export { getNotification, sawNotification };
