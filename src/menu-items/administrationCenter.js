// assets
import {
  IconBoxPadding,
  IconWindmill,
  IconBuildingCommunity,
  IconBrandTidal,
  IconListCheck,
  IconClipboardCheck,
  IconUsers,
  IconClock,
  IconCalendar,
  IconSettings,
} from '@tabler/icons';

// constant
const icons = {
  IconBoxPadding,
  IconWindmill,
  IconBuildingCommunity,
  IconBrandTidal,
  IconListCheck,
  IconClipboardCheck,
  IconUsers,
  IconCalendar,
  IconClock,
  IconSettings,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const administrationCenter = {
  id: 'utilities',
  type: 'group',
  title: 'Administração',
  children: [
    {
      id: 'administracoes',
      title: 'Administrações',
      type: 'item',
      url: '/administracoes',
      icon: icons.IconSettings,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
  ],
};

export default administrationCenter;
