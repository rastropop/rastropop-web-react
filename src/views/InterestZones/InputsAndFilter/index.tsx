import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid } from '@mui/material';
import DateFilter from './DateFilter';
import InputVehicle from './InputVehicle';

type Props = {
    autocompleteValue: string[];
    setAutocompleteValue: (value: string[]) => void;
    setNumberOfVehicles: (value: number) => void;
    isChecked: boolean | undefined;
};

const InputsAndFilter: React.FC<Props> = ({ autocompleteValue, setAutocompleteValue, isChecked, setNumberOfVehicles }) => (
    <>
        <Grid container wrap="wrap" sx={{ marginTop: 1, marginBottom: 1 }}>
            <InputVehicle
                autocompleteValue={autocompleteValue}
                setAutocompleteValue={setAutocompleteValue}
                isChecked={isChecked}
                setNumberOfVehicles={setNumberOfVehicles}
            />
        </Grid>
    </>
);

export default InputsAndFilter;
