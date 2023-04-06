// material-ui
import { Grid } from '@mui/material';
import { LoadScript, useLoadScript } from '@react-google-maps/api';
import { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTrackingPoints } from 'services/tracker';
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/images/logo_rastro_subtitle.png';
import { getAddressByLatLng } from 'utils/axios';
import InputsAndFilter from './InputsAndFilter';
import moment from 'moment';

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

const Horimetro = () => {
    const theme = useTheme();
    const [selectedVehicleImei, setSelectedVehicleImei] = useState<string | null>('');
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [totalIdleTimePerDay, setTotalIdleTimePerDay] = useState<MarkerPosition[] | null>([]);
    const [markersPosition, setMarkersPosition] = useState<MarkerPosition[] | null>([]);
    const [decodedPoints, setDecodedPoints] = useState<LinePosition[]>([]);
    const [historyPoints, setHistoryPoints] = useState<any[]>([]);
    const [totalPointsONPerDay, setTotalPointsONPerDay] = useState<any[]>([]);
    const [totalVelocidadeSum, setTotalVelocidadeSum] = useState(0);

    let markersIdx: number;

    const totalSumKm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let totalACC_ONPerDay: any[] = [];
    let totalKmPerDay: any[] = [];
    const totalVelocPerDay: any[] = [];
    let totalPointsONPerDayArray: any[] = [];
    let totalIdleTimePerDayArray: any[] = [];
    const totalEstAccOFFTimePerDay: any[] = [];
    const totalEstAccONTimePerDay: any[] = [];
    const [totalDaysACC_ON, setTotalDaysACC_ON] = useState(0);
    const [totalDaysACC_OFF, setTotalDaysACC_OFF] = useState(0);
    let lastONTrackpoint: any = null;
    let lastOFFTrackpoint: any = null;

    const [totalACCtime_ON, setTotalACCtime_ON] = useState(0);
    let totalACCtime_OFF = 0;
    let startTimestampParking: number;
    let endTimestampParking: number;

    /* Variables needed to trackingPoints.map */
    let lastPointMap: any;
    let lastTrackpoint: any;

    let isParking = false;
    let parkingACC = -1; // | 0-Desligado | 1-Ligado | -1-Sem status
    let durationParkMin = 0;

    const filteredPoints = [];

    const decodedPointsArray: LinePosition[] = [];
    const historyPointsArray: any = [];
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY ? process.env.REACT_APP_GOOGLE_MAPS_KEY : 'null',
        libraries: ['places', 'geometry']
    });
    // eslint-disable-next-line consistent-return
    const getTrackerPoints = async () => {
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

        const querySnapshot = await getTrackingPoints(selectedVehicleImei, 1678644000000, 1679251500000);

        const trackingPoints: any[] = [];
        querySnapshot.forEach((value: any) => {
            trackingPoints.push(value.data());
        });

        // eslint-disable-next-line consistent-return
        trackingPoints?.map(async (element: any, index) => {
            const actualPoint = new google.maps.LatLng(-element.lat, -element.log);
            const isLastIndex = index == Object.keys(trackingPoints).length - 1;

            const elementDate = moment(element.timestamp);
            const idxArrayPerDay = elementDate.diff(startDate, 'days');
            const qtdeDays = moment(new Date(endDate)).diff(moment(new Date(startDate)), 'days') + 1;

            totalACC_ONPerDay = Array(qtdeDays).fill(0);
            totalPointsONPerDayArray = Array(qtdeDays).fill(0);
            totalKmPerDay = Array(qtdeDays).fill(0);
            totalIdleTimePerDayArray = Array(qtdeDays).fill(0);

            if (element.hour < 3) {
                const idx = element.hour + 21;
                let old = totalSumKm[idx];
                // eslint-disable-next-line no-plusplus
                old++;
                totalSumKm[idx] = old;
            } else {
                const idx = element.hour - 3;
                let old = totalSumKm[idx];
                // eslint-disable-next-line no-plusplus
                old++;
                totalSumKm[idx] = old;
            }
            console.log(lastTrackpoint);
            /* COMPUTAR TEMPO DE ACC LIGADO/DESLIGADO */
            if (lastTrackpoint) {
                console.log(element.min);
                if (lastTrackpoint.acc_status == 1) alert(`-->>>>>>>>>>>>>>>>>>>>`);
                if (lastTrackpoint.acc_status == 0) {
                    /* VEICULO DESLIGADO */
                    /// Somar minutos do veiculo desligado
                    const diff = Math.abs(element.timestamp - lastTrackpoint.timestamp);
                    const durOffMin = Math.ceil(diff / (1000 * 60));
                    if (durOffMin > 1) {
                        totalACCtime_OFF += durOffMin;
                    }
                } else if (lastTrackpoint.acc_status == 1 && element.min != lastTrackpoint.min) {
                    alert('veio');
                    /* VEICULO LIGADO */
                    /// Somar minutos do veiculo ligado
                    const diff = Math.abs(element.timestamp - lastTrackpoint.timestamp);
                    const durOnMin = Math.ceil(diff / (1000 * 60));
                    // THIS ONE
                    if (durOnMin < 60) {
                        /// Usando apenas pontos onde a diff é menos que 1h, desconsiderando pontos com leitura erradas.
                        /// Somar tempo ligado ao dia atual
                        setTotalACCtime_ON(totalACCtime_ON + durOnMin);
                        let old = totalACC_ONPerDay[idxArrayPerDay];
                        old += durOnMin;
                        totalACC_ONPerDay[idxArrayPerDay] = old;
                    }
                }

                /// Somar KM total ao dia atual
                let old = totalKmPerDay[idxArrayPerDay];
                old += element.mileage - lastTrackpoint.mileage;
                totalKmPerDay[idxArrayPerDay] = old;
            }
            if (element.acc_status == 1 && element.velocity > 0) {
                /// Somar velocidade acumulada com veículo rodando.
                /// Somar Veloc ao dia atual
                let old = totalVelocPerDay[idxArrayPerDay];
                old += element.velocity;
                totalVelocPerDay[idxArrayPerDay] = old;
                setTotalVelocidadeSum(totalVelocidadeSum + element.velocity);

                /// Aumentar qtde de pontos por dia
                old = totalPointsONPerDayArray[idxArrayPerDay];
                old += 1;
                totalPointsONPerDayArray[idxArrayPerDay] = old;
            }

            /* COMPUTAR TEMPO DE ACC LIGADO/DESLIGADO POR DIA */
            if (lastTrackpoint) {
                if (element.acc_status == 0 && lastOFFTrackpoint == null) {
                    /* VEICULO iniciou DESLIGADO */
                    console.log('1st DESLIGADO as:');
                    console.log(new Date(element.timestamp));
                    lastOFFTrackpoint = element;
                }
                if (element.acc_status == 1 && lastONTrackpoint == null) {
                    /* VEICULO iniciou LIGADO */
                    console.log('1st LIGADO as:');
                    console.log(new Date(element.timestamp));
                    lastONTrackpoint = element;
                }

                if (lastTrackpoint.acc_status == 0 && element.acc_status == 1) {
                    /* VEICULO LIGOU */
                    lastONTrackpoint = element;

                    if (lastOFFTrackpoint) {
                        let previousTime = lastOFFTrackpoint.timestamp;
                        if (moment(element.timestamp).isAfter(moment(previousTime), 'day')) {
                            // tempo atual entrou no prox dia da contagem
                            // previousTime para o ponto atual, será o inicio do dia atual
                            previousTime = moment(element.timestamp).startOf('day').valueOf();
                            // usar tempo anterior como inicio do dia da contagem atual
                            const finalPoint = moment(lastOFFTrackpoint.timestamp).endOf('day');
                            const initialPoint = moment(lastOFFTrackpoint.timestamp);
                            // criar range DESLIGADO com incio em lastOFF.timestamp até o fim do dia anterior
                            const diff = Math.abs(initialPoint.valueOf() - finalPoint.valueOf());
                            const durOffMin = Math.ceil(diff / (1000 * 60));
                            const init = (initialPoint.hour() * 100 + initialPoint.minute()) / 100;
                            const end = (finalPoint.hour() * 100 + finalPoint.minute()) / 100;
                            totalEstAccOFFTimePerDay[idxArrayPerDay - 1] = [init, end];

                            console.log('DESLIGADO desde as:');
                            console.log(init);
                            console.log('até:');
                            console.log(end);
                            console.log('-----------********-------------');
                        }
                        const diff = Math.abs(element.timestamp - previousTime);
                        const durOffMin = Math.ceil(diff / (1000 * 60));
                        if (durOffMin > 5) {
                            console.log(`${element.timestamp} DESLIGADO desde as:${previousTime}`);
                            const startOffDate = new Date(previousTime);
                            const value = (startOffDate.getHours() * 100 + startOffDate.getMinutes()) / 100;
                            console.log(value);
                            console.log('até:');
                            const endOffDate = new Date(element.timestamp);
                            const value2 = (endOffDate.getHours() * 100 + endOffDate.getMinutes()) / 100;
                            console.log(value2);

                            totalEstAccOFFTimePerDay[idxArrayPerDay] = [value, value2];

                            console.log('-------------------------------');
                            console.log('-------------------------------');
                        }
                    }
                } else if (lastTrackpoint.acc_status == 1 && element.acc_status == 0) {
                    /* VEICULO DESLIGOU */
                    let shouldCreateAccONTrigger = true;

                    lastOFFTrackpoint = element;

                    if (lastONTrackpoint) {
                        /* Verificar para primeiro ponto descarregado com status antigo */
                        const deviceWasDischarged = lastONTrackpoint.tracker_state.battery_voltage == '00';
                        if (deviceWasDischarged) {
                            // Device estava desconectado e descarregado. Podendo primeiro ponto vir com Data incorreta.
                            const eventTime = moment(lastONTrackpoint.timestamp);
                            const capturedTrackerStateTime = moment(
                                lastONTrackpoint.tracker_state.utcDateTimeSrvCapStr,
                                'DD-MM-YYYY hh:mm:ss'
                            );

                            if (Math.abs(eventTime.diff(capturedTrackerStateTime, 'minutes')) > 30) {
                                // Desconsiderar para pontos com discrepância entre
                                // o evento do ponto e a captura dos status, maior que 30 min
                                shouldCreateAccONTrigger = false;
                            }
                        }
                    }

                    if (lastONTrackpoint && shouldCreateAccONTrigger) {
                        let previousTime = lastONTrackpoint.timestamp;
                        if (moment(element.timestamp).isAfter(moment(previousTime), 'day')) {
                            // tempo atual entrou no prox dia da contagem
                            // previousTime para o ponto atual, será o inicio do dia atual
                            previousTime = moment(element.timestamp).startOf('day').valueOf();
                            // usar tempo anterior como inicio do dia da contagem atual
                            const finalPoint = moment(lastONTrackpoint.timestamp).endOf('day');
                            const initialPoint = moment(lastONTrackpoint.timestamp);
                            // criar range DESLIGADO com incio em lastOFF.timestamp até o fim do dia anterior
                            const diff = Math.abs(initialPoint.valueOf() - finalPoint.valueOf());
                            const durOffMin = Math.ceil(diff / (1000 * 60));
                            const init = (initialPoint.hour() * 100 + initialPoint.minute()) / 100;
                            const end = (finalPoint.hour() * 100 + finalPoint.minute()) / 100;
                            totalEstAccONTimePerDay[idxArrayPerDay - 1].push([init, end]);

                            console.log(`LIGADO desde as:${init} ate ${end}`);
                            console.log(new Date(lastONTrackpoint.timestamp));
                            console.log(lastONTrackpoint.tracker_state.utcDateTimeSrvCapStr);
                            console.log(element.tracker_state.utcDateTimeSrvCapStr);
                            console.log(lastTrackpoint.tracker_state.utcDateTimeSrvCapStr);

                            console.log('-----------********-------------');
                        }
                        const diff = Math.abs(element.timestamp - previousTime);
                        const durONMin = Math.ceil(diff / (1000 * 60));
                        if (durONMin > 5) {
                            console.log('LIGADO desde as:');
                            const startOnDate = new Date(previousTime);
                            console.log(startOnDate);
                            const value = (startOnDate.getHours() * 100 + startOnDate.getMinutes()) / 100;
                            console.log(value);

                            console.log('até:');
                            const endOnDate = new Date(element.timestamp);
                            const value2 = (endOnDate.getHours() * 100 + endOnDate.getMinutes()) / 100;
                            console.log(value2);

                            totalEstAccONTimePerDay[idxArrayPerDay].push([value, value2]);

                            console.log('-------------------------------');
                            console.log('-------------------------------');
                        }
                    }
                }
            }

            if (index == trackingPoints.length - 1) {
                if (lastOFFTrackpoint && element.acc_status == 0) {
                    /* VEICULO PERMENECEU DESLIGADO */
                    let previousTime = lastOFFTrackpoint.timestamp;
                    if (moment(element.timestamp).isAfter(moment(previousTime), 'day')) {
                        // tempo atual entrou no prox dia da contagem
                        // previousTime para o ponto atual, será o inicio do dia atual
                        previousTime = moment(element.timestamp).startOf('day').valueOf();
                        // usar tempo anterior como inicio do dia da contagem atual
                        const finalPoint = moment(lastOFFTrackpoint.timestamp).endOf('day');
                        const initialPoint = moment(lastOFFTrackpoint.timestamp);
                        // criar range DESLIGADO com incio em lastOFF.timestamp até o fim do dia anterior
                        const diff = Math.abs(initialPoint.valueOf() - finalPoint.valueOf());
                        const durOffMin = Math.ceil(diff / (1000 * 60));
                        const init = (initialPoint.hour() * 100 + initialPoint.minute()) / 100;
                        const end = (finalPoint.hour() * 100 + finalPoint.minute()) / 100;
                        totalEstAccOFFTimePerDay[idxArrayPerDay - 1] = [init, end];

                        console.log('DESLIGADO desde as:');
                        console.log(init);
                        console.log('até:');
                        console.log(end);
                        console.log('-----------********-------------');
                    }
                    const diff = Math.abs(element.timestamp - previousTime);
                    const durOffMin = Math.ceil(diff / (1000 * 60));
                    if (durOffMin > 5) {
                        console.log('DESLIGADO desde as:');
                        const startOffDate = new Date(previousTime);
                        const value = (startOffDate.getHours() * 100 + startOffDate.getMinutes()) / 100;
                        console.log(value);

                        console.log('até:');
                        const endOffDate = new Date(element.timestamp);
                        const value2 = (endOffDate.getHours() * 100 + endOffDate.getMinutes()) / 100;
                        console.log(value2);

                        totalEstAccOFFTimePerDay[idxArrayPerDay] = [value, value2];

                        console.log('-------------------------------');
                        console.log('-------------------------------');
                    }
                } else if (lastONTrackpoint && element.acc_status == 1) {
                    /* VEICULO PERMENECEU LIGADO */
                    let previousTime = lastONTrackpoint.timestamp;
                    if (moment(element.timestamp).isAfter(moment(previousTime), 'day')) {
                        // tempo atual entrou no prox dia da contagem
                        // previousTime para o ponto atual, será o inicio do dia atual
                        previousTime = moment(element.timestamp).startOf('day').valueOf();
                        // usar tempo anterior como inicio do dia da contagem atual
                        const finalPoint = moment(lastONTrackpoint.timestamp).endOf('day');
                        const initialPoint = moment(lastONTrackpoint.timestamp);
                        // criar range DESLIGADO com incio em lastOFF.timestamp até o fim do dia anterior
                        const diff = Math.abs(initialPoint.valueOf() - finalPoint.valueOf());
                        const durOffMin = Math.ceil(diff / (1000 * 60));
                        const init = (initialPoint.hour() * 100 + initialPoint.minute()) / 100;
                        const end = (finalPoint.hour() * 100 + finalPoint.minute()) / 100;
                        totalEstAccONTimePerDay[idxArrayPerDay - 1].push([init, end]);

                        console.log('LIGADO desde as:');
                        console.log(init);
                        console.log('até:');
                        console.log(end);
                        console.log('-----------********-------------');
                    }
                    const diff = Math.abs(element.timestamp - previousTime);
                    const durONMin = Math.ceil(diff / (1000 * 60));
                    if (durONMin > 5) {
                        console.log('LIGADO desde as:');
                        const startOnDate = new Date(previousTime);
                        const value = (startOnDate.getHours() * 100 + startOnDate.getMinutes()) / 100;
                        console.log(value);

                        console.log('até:');
                        const endOnDate = new Date(element.timestamp);
                        const value2 = (endOnDate.getHours() * 100 + endOnDate.getMinutes()) / 100;
                        console.log(value2);

                        totalEstAccONTimePerDay[idxArrayPerDay].push([value, value2]);

                        console.log('-------------------------------');
                        console.log('-------------------------------');
                    }
                }
            }

            if (lastPointMap && google.maps.geometry.spherical.computeDistanceBetween(lastPointMap, actualPoint) < 100) {
                /// Extrair um ponto de parada e contabilizar o tempo da parada.
                if (element.velocity < 5 && !isLastIndex) {
                    if (isParking) {
                        /// 2+ ponto da parada atual.
                        // apenas continuar
                        if (element.acc_status != parkingACC) {
                            // veiculo mudou status de acc - finalizar parking, caso esteja
                            endTimestampParking = element.timestamp;
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

            historyPointsArray.forEach((el: any, idx: number) => {
                const momentStartPark = moment(el.startTime);
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const idxArrayPerDay = momentStartPark.diff(startDate, 'days');
                if (el.parkingACC == 1) {
                    let old = totalIdleTimePerDayArray[idxArrayPerDay];
                    old += Math.abs(el.startTime - el.endTime);
                    totalIdleTimePerDayArray[idxArrayPerDay] = old;
                }
            });
            console.log('2');
            setTotalIdleTimePerDay(totalIdleTimePerDayArray);
            console.log('3');
            totalACC_ONPerDay.forEach((el) => {
                if (el > 10) {
                    // eslint-disable-next-line no-plusplus
                    setTotalDaysACC_ON(totalDaysACC_ON + 1);
                } else {
                    // eslint-disable-next-line no-plusplus
                    console.log(totalDaysACC_OFF + 1);
                    setTotalDaysACC_OFF(totalDaysACC_OFF + 1);
                }
            });
        });
        setTotalPointsONPerDay(totalPointsONPerDayArray);
    };

    const formatTimeToHourWithMinute = (time: number) => {
        const hours = Math.floor(time / 60);
        const mathOperation = time % 60;
        const min = parseInt(mathOperation.toString(), 10);
        return `${hours}h` + ` ${min}min`;
    };

    const TotalTimeIdle = () => {
        if (totalIdleTimePerDay) {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const durationParkMin = Math.ceil(totalIdleTimePerDay.reduce((a, b) => a + b, 0) / (1000 * 60));
            return <span>{formatTimeToHourWithMinute(durationParkMin / totalDaysACC_ON)}</span>;
        }
        return <></>;
    };
    const TotalTimeIdleTotal = () => {
        if (totalIdleTimePerDay) {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const durationParkMin = Math.ceil(totalIdleTimePerDay.reduce((a, b) => a + b, 0) / (1000 * 60));
            return <span>{formatTimeToHourWithMinute(durationParkMin)}</span>;
        }
        return <></>;
    };

    return (
        <>
            <h1>Controle de Horas Trabalhada </h1>
            <InputsAndFilter
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedVehicleImei={setSelectedVehicleImei}
                getTrackerPoints={getTrackerPoints}
            />

            <Grid container xs={12}>
                <Grid item>
                    <h3 style={{ fontSize: '2em' }}>Instruções para realizar a consulta do horímetro</h3>
                    <h4 style={{ fontSize: '1.3em' }}>Para realizar a consulta do horímetro de seu veículo, siga os passos abaixo:</h4>
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
            </Grid>

            <Grid
                container
                sx={{
                    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    borderTop: 'solid 5px #5A35B4',
                    borderRadius: 4,
                    padding: 4,
                    paddingTop: 1
                }}
            >
                <Grid container xs={12}>
                    <Grid justifyContent="center" container xs={3}>
                        <img src={logo} alt="logo_rastro" style={{ width: 170, height: 100, marginTop: 10 }} />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'center' }}>
                        <h2>Pontos de Parada</h2>
                        <h4 style={{ marginTop: 5, marginBottom: 5 }}>Cliente: R2 Construções e Transportes EIRELI ME</h4>
                        <h4 style={{ marginTop: 5, marginBottom: 5 }}>Gerado em: 13/03/2023 18:37</h4>
                    </Grid>
                    <Grid item xs={3}>
                        <></>
                    </Grid>
                </Grid>
                <Grid sx={{ borderTop: '3px solid green' }}>
                    <Grid item>
                        <h3>220 - HXJ5815</h3>
                        <hr />
                    </Grid>
                    <Grid container justifyContent="space-around" wrap="nowrap">
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Tempo LIGADO por dia de atividade</strong> <br />
                            {formatTimeToHourWithMinute(totalACCtime_ON / totalDaysACC_ON)}
                        </Grid>
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Tempo LIGADO TOTAL somatório em todo o período</strong> <br />
                            {formatTimeToHourWithMinute(totalACCtime_ON)}
                        </Grid>
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Tempo OCIOSO por dia de atividade</strong> <br />
                            <TotalTimeIdle />
                        </Grid>
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Tempo OCIOSO TOTAL somatório em todo o período</strong>
                            <TotalTimeIdleTotal />
                        </Grid>
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Dias COM atividade</strong> {totalDaysACC_ON} <br />
                            <strong>KM total</strong> {(totalKmPerDay.reduce((a, b) => a + b, 0) / 1000).toFixed(2)} Km
                        </Grid>
                        <Grid item sx={{ border: '1px solid black' }}>
                            <strong>Dias SEM atividade</strong> {totalDaysACC_OFF} <br />
                            <strong>Veloc. média</strong> {(totalVelocidadeSum / totalPointsONPerDay.reduce((a, b) => a + b, 0)).toFixed(2)}{' '}
                            Km/h
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Horimetro;
