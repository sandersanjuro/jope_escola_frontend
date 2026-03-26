// menu-items/index.js
import administrationCenter from './administrationCenter';
import configurationCenter from './configurationCenter';
import getAdmMenu from './adm'; // agora é uma função

const getMenuItems = (negocio_id) => ({
  items: [getAdmMenu(negocio_id), configurationCenter, administrationCenter],
});

export default getMenuItems;
