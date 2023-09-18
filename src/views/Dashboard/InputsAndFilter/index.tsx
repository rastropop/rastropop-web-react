import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Button, Grid } from '@mui/material';
import DateFilter from './DateFilter';
import InputVehicle from './InputVehicle';

type Props = {
    autocompleteValue: string[];
    setAutocompleteValue: (value: string[]) => void;
    getFirebasePoints: () => void;
};

const InputsAndFilter: React.FC<Props> = ({ autocompleteValue, setAutocompleteValue, getFirebasePoints }) => (
    <>
        <Grid container wrap="wrap" sx={{ marginTop: 1, marginBottom: 1 }}>
            <InputVehicle autocompleteValue={autocompleteValue} setAutocompleteValue={setAutocompleteValue} />
            <Button variant="outlined" onClick={getFirebasePoints}>
                Buscar
            </Button>
        </Grid>
    </>
);

export default InputsAndFilter;
