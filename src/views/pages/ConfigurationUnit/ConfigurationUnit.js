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

export default function ConfigurationUnit() {
    return (
        <>
            <ItemMenu
                data={[
                    {
                        title: 'Ativos',
                        url: '/ativos',
                        icon: <IconCheck size={100} />
                    },
                    {
                        title: 'Tarefa',
                        url: '/tarefas',
                        icon: <IconClipboardCheck size={100} />
                    }
                ]}
            />
        </>
    );
}
