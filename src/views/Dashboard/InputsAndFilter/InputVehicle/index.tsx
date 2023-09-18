import { Autocomplete, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getVehicleByUserId } from '../../../../services/vehicle';
import { getTrackingPoints } from 'services/tracker';
import { toast } from 'react-toastify';

type Props = {
    autocompleteValue: string[];
    setAutocompleteValue: (value: string[]) => void;
};

const InputVehicle: React.FC<Props> = ({ autocompleteValue, setAutocompleteValue }) => {
    const [vehiclesArray, setVehiclesArray] = useState<Array<any>>([]);

    useEffect(() => {
        (async () => {
            const vehicles = await getVehicleByUserId();

            const vehiclesArrayFormated: any[] = [];
            vehicles.map((vehicle: any) => {
                vehiclesArrayFormated.push({ label: `${vehicle.model} - ${vehicle.plate}`, vehicleImei: vehicle.tracker_imei });
            });
            setVehiclesArray(vehiclesArrayFormated);
        })();
    }, []);

    const handleChange = (event: any) => {
        const {
            target: { value }
        } = event;
        setAutocompleteValue(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <Grid item xs={12}>
            <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-chip-label">Veículos</InputLabel>
                    <Select
                        multiple
                        sx={{ width: '100%' }}
                        value={autocompleteValue}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Veículos" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {vehiclesArray?.map((vehicle) => (
                            <MenuItem key={vehicle.vehicleImei} value={vehicle.vehicleImei}>
                                {vehicle.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default InputVehicle;
