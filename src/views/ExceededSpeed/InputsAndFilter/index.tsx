import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid, TextField } from '@mui/material';
import DateFilter from './DateFilter';
import InputVehicle from './InputVehicle';

type Props = {
    setStartDate: (value: Date) => void;
    setEndDate: (value: Date) => void;
    setSelectedVehicleImei: (value: string) => void;
    overSpeed: number;
    setOverSpeed: (value: number) => void;
    getTrackerPoints: () => void;
};

const InputsAndFilter: React.FC<Props> = ({
    setStartDate,
    setEndDate,
    setSelectedVehicleImei,
    overSpeed,
    setOverSpeed,
    getTrackerPoints
}) => (
    <>
        <hr />

        <Grid container sx={{ marginBottom: '20px' }}>
            <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />

            <Grid container xs={6}>
                <Grid container flexDirection="column" xs={12}>
                    <b>Vel. Máxima Permitida</b>
                    <TextField
                        type="number"
                        defaultValue={overSpeed}
                        sx={{ width: 300, marginBottom: '10px' }}
                        onChange={(event) => {
                            setOverSpeed(Number(event.target.value));
                        }}
                    />
                </Grid>
                <InputVehicle setSelectedVehicleImei={setSelectedVehicleImei} getTrackerPoints={getTrackerPoints} />
            </Grid>
        </Grid>
    </>
);

export default InputsAndFilter;
