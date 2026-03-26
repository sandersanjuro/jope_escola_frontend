// assets
import {
  IconBoxPadding,
  IconWindmill,
  IconBuildingCommunity,
  IconBrandTidal,
} from '@tabler/icons';

// constant
const icons = {
  IconBoxPadding,
  IconWindmill,
  IconBuildingCommunity,
  IconBrandTidal,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const reportCenter = {
  id: 'report',
  type: 'group',
  title: 'Relatórios',
  children: [
    {
      id: 'unidades',
      title: 'Unidades',
      type: 'item',
      // url: '/unidades',
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'regionais',
      title: 'Regionais',
      type: 'item',
      // url: '/regionais',
      icon: icons.IconWindmill,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
  ],
};

export default reportCenter;
