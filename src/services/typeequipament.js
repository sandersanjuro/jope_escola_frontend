import { app } from './Api';

const postTypeEquipament = async (data) => {
  return app.post(`typeequipament`, data);
};
const getTypeEquipaments = async (page, qtdPerPage, typeequipament) => {
  return app.get(
    `typeequipament?page=${page}&qtdPerPage=${qtdPerPage}&nameTypeEquipament=${typeequipament}`
  );
};
const updateTypeEquipament = async (id, data) => {
  return app.put(`typeequipament/${id}`, data);
};
const deleteTypeEquipament = async (id) => {
  return app.delete(`typeequipament/${id}`);
};
const getTypeEquipamentPerId = async (id) => {
  return app.get(`typeequipament/${id}`);
};
const getResourceTypeEquipament = async () => {
  return app.get(`get_resource_equipament`);
};

export {
  postTypeEquipament,
  getTypeEquipaments,
  updateTypeEquipament,
  deleteTypeEquipament,
  getTypeEquipamentPerId,
  getResourceTypeEquipament,
};
