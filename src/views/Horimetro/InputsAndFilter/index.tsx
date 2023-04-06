import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid } from '@mui/material';
import DateFilter from './DateFilter';
import Inputs from './Inputs';

type Props = {
    setStartDate: (value: Date) => void;
    setEndDate: (value: Date) => void;
    setSelectedVehicleImei: (value: string) => void;
    getTrackerPoints: () => void;
};

const InputsAndFilter: React.FC<Props> = ({ setStartDate, setEndDate, setSelectedVehicleImei, getTrackerPoints }) => (
    <>
        <hr />

        <Grid container sx={{ marginBottom: '20px' }}>
            <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />

            <Inputs setSelectedVehicleImei={setSelectedVehicleImei} getTrackerPoints={getTrackerPoints} />
        </Grid>
    </>
);

export default InputsAndFilter;
