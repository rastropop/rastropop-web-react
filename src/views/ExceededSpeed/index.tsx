// material-ui
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTrackingPoints } from 'services/tracker';
import ModalMap from './ModalMap';
import logo from '../../assets/images/logo_rastro_subtitle.png';
import { getAddressByLatLng } from 'utils/axios';
import MapIcon from '@mui/icons-material/Map';

// project imports
import InputsAndFilter from './InputsAndFilter';

interface MarkerPosition {
    lat: number;
    lng: number;
    id: string;
    infoWindowTitle: string;
    infoWindowTotalStopTime: string;
    infoWindowTimeStop: string;
    infoWindowTimeDeparture: string;
}

interface LinePosition {
    lat: number;
    lng: number;
}

const StopPoints = () => {
    const [selectedVehicleImei, setSelectedVehicleImei] = useState<string | null>('');
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [overSpeed, setOverSpeed] = useState<number>(80);
    const [open, setOpen] = useState([false]);
    const [trackingPoints, setTrackingPoints] = useState<any[]>([]);
    const [reRenderTable, setReRenderTable] = useState<boolean>();

    const google = window.google;

    useEffect(() => {
        setReRenderTable(!reRenderTable);
    }, [trackingPoints]);

    useEffect(() => {
        setReRenderTable(!reRenderTable);
    }, [JSON.stringify(open)]);

    const handleOpen = (index: number) => {
        const openArray = [...open];
        openArray[index] = true;
        setOpen(openArray);
    };
    const handleClose = (index: number) => {
        const openArray = [...open];
        openArray[index] = false;
        setOpen(openArray);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR');
    };

    // eslint-disable-next-line consistent-return
    const getTrackerPoints = async () => {
        if (!selectedVehicleImei) {
            toast.warning('Selecione um veículo', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return false;
        }

        if (!startDate || !endDate) {
            toast.warning('Selecione uma data!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return false;
        }

        const querySnapshot = await getTrackingPoints(selectedVehicleImei, startDate.valueOf(), endDate.valueOf());

        const trackingPointsArray: any[] = [];
        const openArray: any[] = [];
        querySnapshot.forEach((value: any) => {
            if (value.data().velocity > overSpeed) {
                openArray.push(false);
                trackingPointsArray.push(value.data());
            }
        });

        const trackingPointsArrayFormated: any[] = [];
        for (const element of trackingPointsArray) {
            const ignicaoStart = element.statusMsg.match(/:/);
            const ignicaoEnd = element.statusMsg.match(/No/);
            const ignicao = element.statusMsg.substring(ignicaoStart.index, ignicaoEnd.index).replace(':', ' ').trim();

            // Adding ignicao to newValue object
            element.ignicao = ignicao == 'ON' ? 'Ligado' : 'Desligado';

            // Adding timeDate and timeHour to newValue object
            element.timeDate = formatDate(element.timestamp).split(' ')[0];
            element.timeHour = formatDate(element.timestamp).split(' ')[1];

            // Adding address
            // eslint-disable-next-line no-await-in-loop
            const { data } = await getAddressByLatLng(-element.lat, -element.log);
            element.address = data.results[0].formatted_address;

            // Updating lat and log
            element.lat = Number(-element.lat).toFixed(4);
            element.log = Number(-element.log).toFixed(4);

            trackingPointsArrayFormated.push(element);
        }
        setTrackingPoints(trackingPointsArrayFormated);
        setOpen(openArray);
    };

    return (
        <>
            <h1>Velocidade Excedida</h1>
            <InputsAndFilter
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedVehicleImei={setSelectedVehicleImei}
                overSpeed={overSpeed}
                setOverSpeed={setOverSpeed}
                getTrackerPoints={getTrackerPoints}
            />
            <Grid container sx={{ borderTop: 'solid 5px #5A35B4', borderRadius: 4 }}>
                <Grid container xs={12}>
                    <Grid justifyContent="center" container xs={4}>
                        <img src={logo} alt="logo_rastro" style={{ width: 170, height: 100, marginTop: 10 }} />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <h2>Velocidade excedida</h2>
                        <p style={{ fontSize: '1.2em' }}>220 - HXJ5815</p>
                        <p style={{ fontSize: '1.2em' }}>0:00 11/03/2023 -- 23:55 11/03/2023</p>
                    </Grid>
                    <Grid item xs={4}>
                        <></>
                    </Grid>
                </Grid>
                <Grid container direction="column" sx={{ fontSize: '1.2em' }}>
                    <h4 style={{ marginTop: 5, marginBottom: 5 }}>Cliente: R2 Construções e Transportes EIRELI ME</h4>
                    <h4 style={{ marginTop: 5, marginBottom: 5 }}>Gerado em: 13/03/2023 18:37</h4>
                    <small>
                        <p>Legenda:</p>
                        <ul>
                            <li>Ponto de Parada - Identifica uma parada com veículo desligado.</li>
                            <li>Ponto de Parada OCIOSO - Identifica uma parada com veículo ligado.</li>
                        </ul>
                    </small>
                </Grid>
                <Grid container xs={12}>
                    <TableContainer component={Paper} sx={{ width: '100%', marginBottom: 1 }}>
                        <Table sx={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Data/Hora</TableCell>
                                    <TableCell align="center">Vel. (Km/h)</TableCell>
                                    <TableCell align="center">Ignição</TableCell>
                                    <TableCell align="center">Lat. / Long.</TableCell>
                                    <TableCell align="center">Localização mais próxima</TableCell>
                                    <TableCell align="center">Mapa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reRenderTable && <></>}
                                {trackingPoints?.map((dataObj, index) => (
                                    <TableRow>
                                        <TableCell align="center">{index}</TableCell>
                                        <TableCell align="center">
                                            {dataObj.timeDate} <br />
                                            {dataObj.timeHour}
                                        </TableCell>
                                        <TableCell align="center">{dataObj.velocity}</TableCell>
                                        <TableCell align="center">{dataObj.ignicao}</TableCell>
                                        <TableCell align="center">
                                            {dataObj.lat} , {dataObj.log}
                                        </TableCell>
                                        <TableCell align="center">{dataObj.address}</TableCell>
                                        <TableCell align="center">
                                            <ModalMap
                                                lat={parseFloat(dataObj.lat)}
                                                long={parseFloat(dataObj.log)}
                                                vel={dataObj.velocity}
                                                timestamp={dataObj.timestamp}
                                                open={open[index]}
                                                handleClose={() => handleClose(index)}
                                            />
                                            <Button onClick={() => handleOpen(index)}>
                                                <MapIcon sx={{ color: '#5A35B4' }} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
};

export default StopPoints;
