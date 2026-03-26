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

const registrationCenter = {
  id: 'configuration',
  type: 'group',
  title: 'Configurações',
  children: [
    {
      id: 'unidades',
      title: 'Unidades',
      type: 'item',
      url: '/unidades',
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'regionais',
      title: 'Regionais',
      type: 'item',
      url: '/regionais',
      icon: icons.IconWindmill,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'familias',
      title: 'Famílias',
      type: 'item',
      url: '/familias',
      icon: icons.IconBoxPadding,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'naturezas',
      title: 'Naturezas de Operações',
      type: 'item',
      url: '/naturezas',
      icon: icons.IconBrandTidal,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'tarefa',
      title: 'Tipo de Tarefa',
      type: 'item',
      url: '/tarefas',
      icon: icons.IconBrandTidal,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'tipoequipamento',
      title: 'Tipo de Equipamento',
      type: 'item',
      url: '/tipoequipamentos',
      icon: icons.IconBrandTidal,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'ativos',
      title: 'Ativos',
      type: 'item',
      url: '/ativos',
      icon: icons.IconBrandTidal,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
  ],
};

export default registrationCenter;
