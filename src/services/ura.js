import { app } from './Api';

const get = async (page, qtdPerPage) => {
    return app.get(`ura?page=${page}&qtd_per_page=${qtdPerPage}`);
};

const destroy = async (id) => {
    return app.delete(`ura/${id}`);
};

export { get, destroy };
