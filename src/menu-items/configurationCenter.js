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

const configurationCenter = {
  id: 'utilities',
  type: 'group',
  title: 'Configurações',
  children: [
    {
      id: 'configuracoes',
      title: 'Gerais',
      type: 'item',
      url: '/configuracoes',
      icon: icons.IconSettings,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'configuracoes_unidade',
      title: 'Locais',
      type: 'item',
      url: '/configuracoes_unidade',
      icon: icons.IconSettings,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
  ],
};

export default configurationCenter;
