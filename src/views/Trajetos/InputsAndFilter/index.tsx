import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid } from '@mui/material';
import DateFilter from './DateFilter';
import InputVehicle from './InputVehicle';

type Props = {
    setStartDate: (value: Date) => void;
    setEndDate: (value: Date) => void;
    setSelectedVehicleImei: (value: Array<any>) => void;
    getVehiclesMileages: () => void;
};

const InputsAndFilter: React.FC<Props> = ({ setStartDate, setEndDate, setSelectedVehicleImei, getVehiclesMileages }) => (
    <>
        <hr />

        <Grid container wrap="wrap" sx={{ marginBottom: '20px' }}>
            <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />

            <InputVehicle setSelectedVehicleImei={setSelectedVehicleImei} getVehiclesMileages={getVehiclesMileages} />
        </Grid>
    </>
);

export default InputsAndFilter;
