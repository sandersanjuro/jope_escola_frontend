import { app } from './Api';

const getItens = async (page = '', qtdPerPage = '', filter = '') => {
  return app.get(
    `item?page=${page}&qtdPerPage=${qtdPerPage}&filter=${filter}`
  );
};
export { getItens };
