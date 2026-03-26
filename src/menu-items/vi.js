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
  
  const vi = {
    id: 'manager',
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
        id: 'corretivas',
        title: 'OS Corretivas',
        type: 'item',
        url: '/corretivas',
        icon: icons.IconListCheck,
        breadcrumbs: false,
        color: 'success',
        variant: 'success'
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
      }
    ],
  };
  
  export default vi;
  