import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InitialTask from './InitialTask';
import { Card } from '@mui/material';
import TaskInformation from './TaskInformation';

export default function TabTask() {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Card sx={{ width: '100%' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Atendimento" value="1" />
                        <Tab label="Informações Gerais" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <InitialTask />
                </TabPanel>
                <TabPanel value="2">
                    <TaskInformation />
                </TabPanel>
            </TabContext>
        </Card>
    );
}
