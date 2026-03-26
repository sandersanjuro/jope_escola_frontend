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

export default function GridFamily() {
    return (
        <>
            <ItemMenu
                data={[
                    {
                        title: 'Famílias',
                        url: '/familias',
                        icon: <IconBoxPadding size={100} />
                    },
                    {
                        title: 'Naturezas de Operações',
                        url: '/naturezas',
                        icon: <IconBrandTidal size={100} />
                    },
                    {
                        title: 'Equipamento',
                        url: '/tipoequipamentos',
                        icon: <IconListCheck size={100} />
                    },
                    {
                        title: 'SLA',
                        url: '/slas',
                        icon: <IconClock size={100} />
                    },
                    {
                        title: 'Calendários',
                        url: '/calendarios',
                        icon: <IconCalendar size={100} />
                    }
                ]}
            />
        </>
    );
}
