import { app } from './Api';

const getPainelChamado = async (user_id = '') => {
  return app.get(`bi_painel_chamado?user_id=${user_id}`);
};

const getResourcePainelChamado = async () => {
    return app.get(`bi_painel_chamado_resource`);
  };

export { getPainelChamado, getResourcePainelChamado };
