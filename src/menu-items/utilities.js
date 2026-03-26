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

const utilities = {
  id: 'utilities',
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
      id: 'preventivas',
      title: 'OS Preventivas',
      type: 'item',
      url: '/preventivas',
      icon: icons.IconListCheck,
      breadcrumbs: false,
      color: 'success',
      variant: 'success',
    },
    // {
    //     id: 'chamados',
    //     title: 'Chamados',
    //     type: 'collapse',
    //     icon: icons.IconListCheck,
    //     children: [
    //         {
    //             id: 'corretivas',
    //             title: 'Corretiva',
    //             type: 'item',
    //             url: '/corretivas',
    //             target: false
    //         },
    //         {
    //             id: 'preventivas',
    //             title: 'Preventiva',
    //             type: 'item',
    //             url: '/preventivas',
    //             target: false
    //         }
    //     ]
    // }
    // {
    //     id: 'chamados',
    //     title: 'Chamados',
    //     type: 'item',
    //     url: '/chamados',
    //     icon: icons.IconListCheck,
    //     breadcrumbs: false,
    //     color: 'success',
    //     variant: 'success'
    // }
    // {
    //     id: 'icons',
    //     title: 'Time Line',
    //     type: 'collapse',
    //     icon: icons.IconWindmill,
    //     children: [
    //         {
    //             id: 'tabler-icons',
    //             title: 'Tabler Icons',
    //             type: 'item',
    //             url: '/icons/tabler-icons',
    //             breadcrumbs: false
    //         },
    //         {
    //             id: 'material-icons',
    //             title: 'Material Icons',
    //             type: 'item',
    //             url: '/icons/material-icons',
    //             breadcrumbs: false
    //         }
    //     ]
    // }
  ],
};

export default utilities;
