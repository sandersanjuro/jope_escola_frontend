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
  };
  
  // ==============================|| UTILITIES MENU ITEMS ||============================== //
  
  const coleta = {
    id: 'coleta',
    type: 'group',
    titleName: true,
    children: [
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
        id: 'coletas',
        title: 'Coletas',
        type: 'item',
        url: '/coletas',
        icon: icons.IconListCheck,
        breadcrumbs: false,
        color: 'success',
        variant: 'success',
      }
    ],
  };
  
  export default coleta;
  