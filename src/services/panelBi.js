import { app } from './Api';

const getPanelBi = async (id, idFarm) => {
  return app.get(`url_panel_bi/${id}?idFarm=${idFarm}`);
};
export { getPanelBi };
