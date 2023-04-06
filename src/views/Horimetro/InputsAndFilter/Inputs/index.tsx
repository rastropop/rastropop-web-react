import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getVehicleByUserId } from '../../../../services/vehicle';
import HourPicker from './HourPicker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type Props = {
    setSelectedVehicleImei: (value: string) => void;
    getTrackerPoints: () => void;
};

const Inputs: React.FC<Props> = ({ setSelectedVehicleImei, getTrackerPoints }) => {
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
        <Grid item xs={12}>
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <b>Selecione um veículo que deseja visualizar o Horímetro</b>
                <Autocomplete
                    value={autocompleteValue}
                    onInputChange={(event, newValue: string | null) => {
                        setAutocompleteValue(newValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={vehiclesArray}
                    sx={{ width: '100%' }}
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

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Grid container wrap="nowrap" alignContent="center">
                    <AccessTimeIcon />
                    <Grid container sx={{ marginLeft: 1 }} justifyContent="left" alignContent="center">
                        <b>Período de trabalho</b>
                    </Grid>
                </Grid>
                <b>
                    <small>No qual o equipamento deveria estar trabalhando/sendo utilizado</small>
                </b>
                <HourPicker startTime="08:00" endTime="17:00" interval />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Grid container wrap="nowrap" alignContent="center">
                    <AccessTimeIcon />
                    <Grid container sx={{ marginLeft: 1 }} justifyContent="left" alignContent="center">
                        <b>Período de pausa</b>
                    </Grid>
                </Grid>
                <b>
                    <small>No qual o equipamento NÃO deveria estar trabalhando/sendo utilizado</small>
                </b>
                <HourPicker startTime="12:00" endTime="13:00" interval />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Grid container wrap="nowrap" alignContent="center">
                    <AccessTimeIcon />
                    <Grid container sx={{ marginLeft: 1 }} justifyContent="left" alignContent="center">
                        <b>Tempo minimo Ocioso, em minutos</b>
                    </Grid>
                </Grid>
                <b>
                    <small>Acima disso, será considerado como um período de ociosidade (Veículo ligado PARADO)</small>
                </b>
                <TextField fullWidth type="number" defaultValue={10} />
            </Grid>

            <Grid item xs={12}>
                <Button variant="outlined" onClick={getTrackerPoints}>
                    Buscar
                </Button>
            </Grid>
        </Grid>
    );
};

export default Inputs;
