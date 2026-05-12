import { app } from './Api';

export const getRotaUnidadeConfig = async () => {
  return app.get('rota_unidade_config');
};

export const syncRotaUnidade = async (unidadeId, rotaIds) => {
  return app.post('rota_unidade_sync', {
    unidade_id: unidadeId,
    rota_ids: rotaIds,
  });
};
