import { app } from './Api';

const postItemColeta = async (data) => {
  return app.post(`item_coleta`, data);
};

export { postItemColeta };
