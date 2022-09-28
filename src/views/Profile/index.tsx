import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project imports
import UserProfile from './UserProfile';
import Billing from './Billing';
import Security from './Security';
import Vehicles from './Vehicles';

import MainCard from 'ui-component/cards/MainCard';
import { TabsProps } from 'types';

// tabs
function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const Profile = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <MainCard title="Minha Conta">
            <div>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    onChange={handleChange}
                    sx={{
                        mb: 3,
                        minHeight: 'auto',
                        '& button': {
                            minWidth: 100
                        },
                        '& a': {
                            minHeight: 'auto',
                            minWidth: 10,
                            py: 1.5,
                            px: 1,
                            mr: 2.25,
                            color: 'grey.600'
                        },
                        '& a.Mui-selected': {
                            color: 'primary.main'
                        }
                    }}
                    aria-label="Tabs profile"
                    variant="scrollable"
                >
                    <Tab component={Link} to="#" label="Perfil" {...a11yProps(0)} />
                    <Tab component={Link} to="#" label="Veiculos" {...a11yProps(1)} />
                    <Tab component={Link} to="#" label="Pagamentos" {...a11yProps(2)} />
                    <Tab component={Link} to="#" label="Senha" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <UserProfile />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Vehicles />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Billing />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Security />
                </TabPanel>
            </div>
        </MainCard>
    );
};

export default Profile;
