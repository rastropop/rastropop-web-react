import { Link as RouterLink } from 'react-router-dom';

import { getCustomerByEmail, getMySubscriptionsByCustomerGalaxPayId } from 'utils/axios';

import moment from 'moment';

import { SetStateAction, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Accordion from 'ui-component/extended/Accordion/Accordion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import SubscriptionsList from './SubscriptionsList';

// ==============================|| PROFILE 3 - BILLING ||============================== //

const Billing = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
            <SubscriptionsList />
        </Grid>
    </Grid>
);

export default Billing;
