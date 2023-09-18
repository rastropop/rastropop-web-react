// material-ui
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTrackingPoints } from 'services/tracker';
import GoogleMapComponent from './GoogleMap';
import { useTheme } from '@mui/material/styles';
import { InfoWindow, Marker, Polyline } from '@react-google-maps/api';
import logo from '../../assets/images/logo_rastro_subtitle.png';
import { getAddressByLatLng } from 'utils/axios';

// project imports
import InputsAndFilter from './InputsAndFilter';
import { duration } from 'moment';

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
    const theme = useTheme();
    const [selectedVehicleImei, setSelectedVehicleImei] = useState<string | null>('');
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [infoWindowToggle, setInfoWindowToggle] = useState<Boolean[]>([false]);
    const [markersPosition, setMarkersPosition] = useState<MarkerPosition[] | null>([]);
    const [decodedPoints, setDecodedPoints] = useState<LinePosition[]>([]);
    const [historyPoints, setHistoryPoints] = useState<any[]>([]);
    const [reRenderMap, setRerenderMap] = useState<boolean>();
    const [reRenderTable, setRerenderTable] = useState<boolean>();

    const defaultCenter = {
        lat: -3.7402,
        lng: -38.4997
    };
    let markersIdx: number;

    /* Variables needed to trackingPoints.map */
    let lastPointMap: any;
    let lastTrackpoint: any;

    let isParking = false;
    let parkingACC = -1; // | 0-Desligado | 1-Ligado | -1-Sem status
    let startTimestampParking: number;
    let endTimestampParking: number;
    let durationParkMin = 0;

    const filteredPoints = [];

    let markersPositionArray: MarkerPosition[] = [];
    let decodedPointsArray: LinePosition[] = [];
    let historyPointsArray: any = [];
    let infoWindowToggleArray: boolean[] = [];

    useEffect(() => {
        if (historyPoints) {
            const timerId = setInterval(() => {
                if (historyPoints[0]?.address != undefined) {
                    setRerenderTable(!reRenderTable);
                }
            }, 500);
            setTimeout(() => clearInterval(timerId), 10 * 1000); // After 10 seconds, close interval
        }
    }, [historyPoints]);

    // eslint-disable-next-line consistent-return
    const getTrackerPoints = async () => {
        markersPositionArray = [];
        decodedPointsArray = [];
        historyPointsArray = [];
        infoWindowToggleArray = [];
        markersIdx = 1;
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

        const trackingPoints: any[] = [];
        querySnapshot.forEach((value: any) => {
            trackingPoints.push(value.data());
        });

        // eslint-disable-next-line consistent-return
        trackingPoints?.map(async (element: any, index) => {
            const actualPoint = new google.maps.LatLng(-element.lat, -element.log);

            const isLastIndex = index == Object.keys(trackingPoints).length - 1;

            if (lastPointMap && google.maps.geometry.spherical.computeDistanceBetween(lastPointMap, actualPoint) < 100) {
                /// Extrair um ponto de parada e contabilizar o tempo da parada.
                if (element.velocity < 5 && !isLastIndex) {
                    if (isParking) {
                        /// 2+ ponto da parada atual.
                        // apenas continuar
                        if (element.acc_status != parkingACC) {
                            // veiculo mudou status de acc - finalizar parking, caso esteja
                            endTimestampParking = element.timestamp;
                            registerParkingPoint(startTimestampParking, endTimestampParking, element, markersIdx);
                            const diff = Math.abs(startTimestampParking - endTimestampParking);
                            durationParkMin = Math.ceil(diff / (1000 * 60));

                            console.log(`Parking: ${parkingACC} ElementACC: ${element.acc_status} -- duration: ${durationParkMin}`);

                            if (durationParkMin >= 5) {
                                const { data } = await getAddressByLatLng(-element.lat, -element.log);
                                let address;
                                if (data.status == 'OK') {
                                    console.log(`DataStatus: ${data.status}|` + `Address: ${data.results[0].formatted_address}`);
                                    if (data.results[0]) {
                                        address = data.results[0].formatted_address;
                                    }

                                    if (data.status == 'OVER_QUERY_LIMIT') {
                                        console.log('over query limit');
                                    }
                                    if (data.status == 'ZERO_RESULTS') {
                                        return false;
                                    }
                                }
                                historyPointsArray.push({
                                    key: 'parada',
                                    // eslint-disable-next-line object-shorthand
                                    address: address,
                                    // eslint-disable-next-line object-shorthand
                                    element: element,
                                    startTime: startTimestampParking,
                                    endTime: endTimestampParking,
                                    // eslint-disable-next-line object-shorthand
                                    parkingACC: parkingACC,
                                    key2: 'p1'
                                });
                            }

                            isParking = false;
                            parkingACC = -1;
                            startTimestampParking = 0;
                            endTimestampParking = 0;
                        }
                    } else {
                        /// 1o ponto de parada, inicio do processo de parada.
                        isParking = true;
                        parkingACC = element.acc_status;
                        durationParkMin = 0;
                        startTimestampParking = lastTrackpoint.timestamp;
                        // startTimestampParking = element.timestamp;
                        // let dd = new Date(startTimestampParking)
                        // console.log(element)
                        // console.log(parkingACC+" | "+dd)
                    }
                } else {
                    /// else -> velocity > 5 || isLastIndex
                    if (isParking) {
                        /// Fim do ponto de parada, ultimo ponto vem aqui.
                        endTimestampParking = element.timestamp;
                        registerParkingPoint(startTimestampParking, endTimestampParking, element, markersIdx);
                        const diff = Math.abs(startTimestampParking - endTimestampParking);
                        durationParkMin = Math.ceil(diff / (1000 * 60));
                        if (durationParkMin >= 5) {
                            const { data } = await getAddressByLatLng(-element.lat, -element.log);
                            let address;
                            if (data.status == 'OK') {
                                console.log(`DataStatus: ${data.status}|` + `Address: ${data.results[0].formatted_address}`);
                                if (data.results[0]) {
                                    address = data.results[0].formatted_address;
                                }

                                if (data.status == 'OVER_QUERY_LIMIT') {
                                    console.log('over query limit');
                                }
                                if (data.status == 'ZERO_RESULTS') {
                                    return false;
                                }
                            }
                            historyPointsArray.push({
                                key: 'parada',
                                // eslint-disable-next-line object-shorthand
                                address: address,
                                // eslint-disable-next-line object-shorthand
                                element: element,
                                startTime: startTimestampParking,
                                endTime: endTimestampParking,
                                // eslint-disable-next-line object-shorthand
                                parkingACC: parkingACC,
                                key2: 'p2'
                            });
                        }

                        isParking = false;
                        parkingACC = -1;
                        startTimestampParking = 0;
                        endTimestampParking = 0;
                    }

                    startTimestampParking = 0;
                    endTimestampParking = 0;
                    parkingACC = -1;
                    isParking = false;
                }

                lastTrackpoint = element;
                lastPointMap = actualPoint;
                if (element.acc_status == 1) {
                    decodedPointsArray.push({ lat: -element.lat, lng: -element.log });
                }
                return false;
                // eslint-disable-next-line no-else-return
            } else {
                /// else -> not has lastPointMap && (lastPointMap, actualPoint) distance > 100
                // if (element.quantSat > 3) {
                if (isParking && isLastIndex) {
                    endTimestampParking = lastTrackpoint.timestamp;
                    registerParkingPoint(startTimestampParking, endTimestampParking, element, markersIdx);
                    const diff = Math.abs(startTimestampParking - endTimestampParking);
                    durationParkMin = Math.ceil(diff / (1000 * 60));
                    if (durationParkMin >= 5) {
                        const { data } = await getAddressByLatLng(-element.lat, -element.log);
                        let address;
                        if (data.status == 'OK') {
                            console.log(`DataStatus: ${data.status}|` + `Address: ${data.results[0].formatted_address}`);
                            if (data.results[0]) {
                                address = data.results[0].formatted_address;
                            }

                            if (data.status == 'OVER_QUERY_LIMIT') {
                                console.log('over query limit');
                            }
                            if (data.status == 'ZERO_RESULTS') {
                                return false;
                            }
                        }

                        historyPointsArray.push({
                            key: 'parada',
                            // eslint-disable-next-line object-shorthand
                            address: address,
                            element: lastTrackpoint,
                            startTime: startTimestampParking,
                            endTime: endTimestampParking,
                            // eslint-disable-next-line object-shorthand
                            parkingACC: parkingACC,
                            key2: 'p3'
                        });
                    }

                    isParking = false;
                    parkingACC = -1;
                    durationParkMin = 0;
                    startTimestampParking = 0;
                    endTimestampParking = 0;
                }

                if (isParking && element.acc_status != parkingACC) {
                    endTimestampParking = lastTrackpoint.timestamp;
                    registerParkingPoint(startTimestampParking, endTimestampParking, element, markersIdx);
                    const diff = Math.abs(startTimestampParking - endTimestampParking);
                    durationParkMin = Math.ceil(diff / (1000 * 60));
                    if (durationParkMin >= 5) {
                        const { data } = await getAddressByLatLng(-element.lat, -element.log);
                        let address;
                        if (data.status == 'OK') {
                            console.log(`DataStatus: ${data.status}|` + `Address: ${data.results[0].formatted_address}`);
                            if (data.results[0]) {
                                address = data.results[0].formatted_address;
                            }

                            if (data.status == 'OVER_QUERY_LIMIT') {
                                console.log('over query limit');
                            }
                            if (data.status == 'ZERO_RESULTS') {
                                return false;
                            }
                        }

                        historyPointsArray.push({
                            key: 'parada',
                            // eslint-disable-next-line object-shorthand
                            address: address,
                            element: lastTrackpoint,
                            startTime: startTimestampParking,
                            endTime: endTimestampParking,
                            // eslint-disable-next-line object-shorthand
                            parkingACC: parkingACC,
                            key2: 'p4'
                        });
                    }

                    isParking = false;
                    parkingACC = -1;
                    durationParkMin = 0;
                    startTimestampParking = 0;
                    endTimestampParking = 0;
                }

                lastPointMap = actualPoint;
                lastTrackpoint = element;
                decodedPointsArray.push({ lat: -element.lat, lng: -element.log });
                filteredPoints.push(element);
            }
        });

        setHistoryPoints(historyPointsArray);
        setInfoWindowToggle(infoWindowToggleArray);
        setMarkersPosition(markersPositionArray);
        setDecodedPoints(decodedPointsArray);
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const registerParkingPoint = (
        // eslint-disable-next-line @typescript-eslint/no-shadow
        startTimestampParking: number,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        endTimestampParking: number,
        element: { lat: any; log: any },
        index: number
    ) => {
        const diff = Math.abs(startTimestampParking - endTimestampParking);
        const durationParkMinute = Math.ceil(diff / (1000 * 60));

        if (durationParkMinute >= 5) {
            // tempo min de parada 5min -- ADD UMA PARADA
            let totalStopTime = `${durationParkMin}min`;

            if (durationParkMin > 60) {
                const hoursPark = Math.floor(durationParkMin / 60);
                const minPark = durationParkMin % 60;

                totalStopTime = `${hoursPark}h` + ` ${minPark}min`;
            }

            const title = lastPointMap.acc_status == 1 ? 'Ponto de Parada Ocioso' : 'Ponto de Parada';
            markersPositionArray.push({
                lat: -element.lat,
                lng: -element.log,
                id: markersIdx.toString(),
                infoWindowTitle: title,
                infoWindowTotalStopTime: totalStopTime,
                infoWindowTimeStop: formatDate(startTimestampParking),
                infoWindowTimeDeparture: formatDate(endTimestampParking)
            });
            infoWindowToggleArray.push(false);
            // eslint-disable-next-line no-plusplus
            markersIdx++;
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR');
    };

    const updateInfoWindowToggle = (value: boolean, index: number) => {
        const infoWindowToggleArrayToUpdate = infoWindowToggle;
        infoWindowToggleArrayToUpdate[index] = value;
        setInfoWindowToggle(infoWindowToggleArrayToUpdate);

        setRerenderMap(!reRenderMap);
    };

    return (
        <>
            <h1>Histórico de posições</h1>
            <InputsAndFilter
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedVehicleImei={setSelectedVehicleImei}
                getTrackerPoints={getTrackerPoints}
            />

            <Grid
                container
                xs={12}
                sx={{
                    borderTop: 'solid 5px #5A35B4',
                    borderRadius: 4
                }}
            >
                <Grid item>
                    <h3 style={{ fontSize: '2em' }}>Instruções para buscar os pontos de parada</h3>
                    <h4 style={{ fontSize: '1.3em' }}>Para realizar a busca dos pontos de parada do seu veículo, siga os passos abaixo:</h4>
                    <ul>
                        <li>
                            <p>
                                <b>Escolha o período</b> no qual deseja fazer a busca. <br />
                                <small>O período é constituído de uma data de início e outra de fim.</small>
                            </p>
                        </li>
                        <li>
                            <p>
                                <b>Escolha o veículo</b> que deseja visualizar as informações.
                            </p>
                        </li>
                        <li>
                            <p>
                                Clique em <b>Buscar</b>. <br />
                                <small>
                                    Quando finalizado a busca, será apresentado no mapa os pontos de parada realizados pelo veículo.
                                </small>
                            </p>
                        </li>
                    </ul>
                </Grid>

                <br />

                <Grid item>
                    <h4 style={{ fontSize: '1.3em' }}>Para exportar os pontos de parada em PDF, siga os passos abaixo:</h4>
                    <ul>
                        <li>
                            <b>Após realizar uma Busca</b>, caso deseje exportar em arquivo PDF o relatório detalhado, das paradas
                            realizadas por seu veículo, clique em <b>Gerar relatório</b> detalhado.
                        </li>
                        <p>
                            O relatório é gerado mostrando, para cada ponto de parada, o tipo, a duração e a localização da mesma. Aguarde a
                            geração completa do documento para depois clicar em <b>Exportar PDF</b>.
                        </p>
                    </ul>
                </Grid>

                <br />
            </Grid>

            <Grid container sx={{ height: 800, marginBottom: '20px' }}>
                <Grid item xs={12} sx={{ borderTop: 'solid 5 #5A35B4', borderRadius: 4 }}>
                    <GoogleMapComponent apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} defaultCenter={defaultCenter}>
                        {markersPosition?.map((markerPosition: MarkerPosition, index) => (
                            <>
                                <Marker
                                    position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                    label={markerPosition.id}
                                    onClick={() => updateInfoWindowToggle(true, index)}
                                />
                                {infoWindowToggle[index] == true ? (
                                    <>
                                        <InfoWindow
                                            position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                            onCloseClick={() => updateInfoWindowToggle(false, index)}
                                            options={{ maxWidth: 200 }}
                                        >
                                            <div style={{ color: 'black' }}>
                                                <h3>{markersPosition[index].infoWindowTitle}</h3>
                                                <p>
                                                    Tempo total de parada: <b>{markersPosition[index].infoWindowTotalStopTime}</b>
                                                </p>
                                                <p>
                                                    Data de parada: <b>{markersPosition[index].infoWindowTimeStop}</b>
                                                </p>
                                                <p>
                                                    Data de saída: <b>{markersPosition[index].infoWindowTimeDeparture}</b>
                                                </p>
                                            </div>
                                        </InfoWindow>
                                        {reRenderMap && <></>}
                                    </>
                                ) : (
                                    <></>
                                )}
                                <Polyline
                                    path={decodedPoints}
                                    options={{
                                        geodesic: true,
                                        strokeColor: '#5A35B4',
                                        strokeOpacity: 0.6,
                                        strokeWeight: 2
                                    }}
                                />
                            </>
                        ))}
                    </GoogleMapComponent>
                </Grid>
            </Grid>
            <Grid container sx={{ borderTop: 'solid 5px #5A35B4', borderRadius: 4 }}>
                <Grid container xs={12}>
                    <Grid justifyContent="center" container xs={4}>
                        <img src={logo} alt="logo_rastro" style={{ width: 170, height: 100, marginTop: 10 }} />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <h2>Pontos de Parada</h2>
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
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead>
                                {reRenderTable && <></>}
                                <TableRow>
                                    <TableCell align="left">#</TableCell>
                                    <TableCell align="left">Data/Hora</TableCell>
                                    <TableCell align="left">Chave</TableCell>
                                    <TableCell align="left">Localização da Parada</TableCell>
                                    <TableCell align="left">Duração</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyPoints?.map((element: any, index: number) => {
                                    const pointDate = formatDate(element.element.timestamp).split(' ');
                                    const diff = Math.abs(element.startTime - element.endTime);
                                    // eslint-disable-next-line @typescript-eslint/no-shadow
                                    const durationParkMin = Math.ceil(diff / (1000 * 60));

                                    let parkingTimeStr = `${durationParkMin}min`;
                                    if (durationParkMin > 60) {
                                        const hoursPark = Math.floor(durationParkMin / 60);
                                        const minPark = durationParkMin % 60;

                                        parkingTimeStr = `${hoursPark}h` + ` ${minPark}min`;
                                    }

                                    return (
                                        <TableRow>
                                            <TableCell align="left">{index}</TableCell>
                                            <TableCell align="left">
                                                {pointDate[0]} <br />
                                                {pointDate[1]}
                                            </TableCell>
                                            <TableCell align="left">{element.parkingACC == 1 ? 'true' : 'false'}</TableCell>
                                            <TableCell>
                                                {element.parkingACC == 1 ? <b>Ponto de parada ocioso:</b> : <b>Ponto de parada:</b>}{' '}
                                                {element.address}
                                                {element.key == 'parada'
                                                    ? `${formatDate(element.startTime).split(' ')[1]} às ${
                                                          formatDate(element.endTime).split(' ')[1]
                                                      }`
                                                    : ''}
                                            </TableCell>
                                            <TableCell>{parkingTimeStr || <></>}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
};

export default StopPoints;
