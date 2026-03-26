// MenuList.js
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';

import getMenuItems from 'menu-items';
import menuTechnical from 'menu-items/menuTechnical';
import menuManager from 'menu-items/menuManager';
import menuSupervisor from 'menu-items/menuSupervisor';
import menuVi from 'menu-items/meuVi';
import menuColeta from 'menu-items/menuColeta';
import menuDiertor from 'menu-items/menuDiretor';

const MenuList = () => {
    const { perfil_id, supervisor, negocio_id } = useSelector((state) => state.auth.user);

    let nav;

    if (perfil_id === 3) {
        nav = supervisor === 1 ? menuSupervisor : menuTechnical;
    } else if (perfil_id === 4) {
        nav = menuManager;
    } else if (perfil_id === 7) {
        nav = menuVi;
    } else if (perfil_id === 8) {
        nav = menuColeta;
    } else if (perfil_id === 9) {
        nav = menuDiertor;
    } else {
        nav = getMenuItems(negocio_id); // aqui o menu padrão com `adm` é montado com base no negócio
    }

    const navItems = nav.items.map((item) => {
        if (item.type === 'group') {
            return <NavGroup key={item.id} item={item} />;
        }

        return (
            <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
            </Typography>
        );
    });

    return <>{navItems}</>;
};

export default MenuList;
