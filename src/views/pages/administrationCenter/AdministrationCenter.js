import * as React from 'react';
import ItemMenu from '../../../components/ItemMenu/ItemMenu';
import {
    IconBoxPadding,
    IconWindmill,
    IconBuildingCommunity,
    IconBrandTidal,
    IconListCheck,
    IconClipboardCheck,
    IconUsers,
    IconClock,
    IconCheck,
    IconCalendar
} from '@tabler/icons';
import { useSelector } from 'react-redux';

export default function AdministrationCenter() {
    const supervisor = useSelector((state) => state.auth.user.supervisor);
    const id_role = useSelector((state) => state.auth.user.perfil_id);

    if (supervisor === 1 || id_role == 4 || id_role == 7) {
        return (
            <>
                <ItemMenu
                    data={[
                        {
                            title: 'Exportação Chamados',
                            icon: <IconBuildingCommunity size={100} />,
                            url: '/exportacao_chamados'
                        }
                    ]}
                />
            </>
        );
    } else {
        return (
            <>
                <ItemMenu
                    data={[
                        {
                            title: 'Logs',
                            icon: <IconBuildingCommunity size={100} />,
                            url: '/logs'
                        },
                        {
                            title: 'Exportação Chamados',
                            icon: <IconBuildingCommunity size={100} />,
                            url: '/exportacao_chamados'
                        },
                        {
                            title: 'Unidades',
                            icon: <IconBuildingCommunity size={100} />,
                            url: '/unidades'
                        },
                        {
                            title: 'Regionais',
                            url: '/regionais',
                            icon: <IconWindmill size={100} />
                        },
                        {
                            title: 'Usuários',
                            url: '/usuarios',
                            icon: <IconUsers size={100} />
                        },
                        {
                            title: 'Tipo de OS',
                            url: '/tipos_os',
                            icon: <IconWindmill size={100} />
                        },
                        {
                            title: 'Business Intelligence',
                            icon: <IconBuildingCommunity size={100} />,
                            url: '/bi'
                        },
                        {
                            title: 'Equipes',
                            icon: <IconUsers size={100} />,
                            url: '/equipes'
                        },
                        {
                            title: 'Problemas',
                            icon: <IconWindmill size={100} />,
                            url: '/tipo_problemas'
                        }
                    ]}
                />
            </>
        );
    }
}
