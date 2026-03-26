// adm.js
// assets
import {
  IconHome,
  IconUser,
  IconSettings,
  IconBuildingCommunity,
  IconChartLine,
  IconChartBar,
  IconLicense,
  IconMessages,
  IconNews,
  IconListCheck,
  IconBrandInstagram,
  IconMessageCircle,
  IconLogout,
  IconTractor,
  IconWindmill,
  IconBoxPadding,
  IconFileReport,
} from '@tabler/icons';

// constant
const icons = {
  IconHome,
  IconUser,
  IconSettings,
  IconChartLine,
  IconChartBar,
  IconLicense,
  IconBuildingCommunity,
  IconMessages,
  IconNews,
  IconListCheck,
  IconBrandInstagram,
  IconMessageCircle,
  IconLogout,
  IconTractor,
  IconWindmill,
  IconBoxPadding,
  IconFileReport
};

// função que retorna o menu de acordo com o negócio
const getAdmMenu = (negocio_id) => {
  const children = [
    {
      id: 'index',
      title: 'Home',
      type: 'item',
      url: '/index',
      icon: icons.IconHome,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'corretivas',
      title: 'OS Corretivas',
      type: 'item',
      url: '/corretivas',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'proativas',
      title: 'OS Proativas',
      type: 'item',
      url: '/proativas',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'chamados_gerente',
      title: 'OS Gerente',
      type: 'item',
      url: '/chamados_gerente',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'preventivas',
      title: 'OS Preventivas',
      type: 'item',
      url: '/preventivas',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
        id: 'dashboard_directors',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard_directors',
        icon: icons.IconChartBar,
        breadcrumbs: false,
        color: 'success',
        variant: 'success',
    },
    {
      id: 'report_task',
      title: 'Relatório',
      type: 'item',
      url: '/report_task',
      icon: icons.IconFileReport,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    {
      id: 'task_pdf',
      title: 'Caderno OS',
      type: 'item',
      url: '/task_pdf',
      icon: icons.IconFileReport,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    }
  ];

  if (negocio_id === 2) {
    children.push({
      id: 'uras',
      title: 'URA',
      type: 'item',
      url: '/uras',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    });
  }

  return {
    id: 'adm',
    type: 'group',
    titleName: true,
    children
  };
};

export default getAdmMenu;
