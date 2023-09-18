import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getVehicleByUserId } from '../../../../services/vehicle';
import { getTrackingPoints } from 'services/tracker';
import { toast } from 'react-toastify';

type Props = {
    setSelectedVehicleImei: (value: string) => void;
    getTrackerPoints: () => void;
};

const InputVehicle: React.FC<Props> = ({ setSelectedVehicleImei, getTrackerPoints }) => {
    const [vehiclesArray, setVehiclesArray] = useState<Array<string>>([]);
    const [autocompleteValue, setAutocompleteValue] = useState<string | null>();

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

    return (
        <Grid item xs={6}>
            <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <Autocomplete
                    value={autocompleteValue}
                    onInputChange={(event, newValue: string | null) => {
                        setAutocompleteValue(newValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={vehiclesArray}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Veículos" />}
                    onChange={(event, newValue: any) => {
                        if (newValue) {
                            setAutocompleteValue(newValue.label ? newValue.label : '');
                            setSelectedVehicleImei(newValue.vehicleImei ? newValue.vehicleImei : '');
                        } else {
                            setAutocompleteValue('');
                            setSelectedVehicleImei('');
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" onClick={getTrackerPoints}>
                    Buscar
                </Button>
            </Grid>
        </Grid>
    );
};

export default InputVehicle;
