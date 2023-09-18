/* eslint-disable object-shorthand */
/* eslint-disable no-await-in-loop */
// material-ui
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getLastTrackingPointsUntilTimestamp, getNextTrackingPointsByTimestamp, getTrackingPoints } from 'services/tracker';

import { useTheme } from '@mui/material/styles';

// project imports
import InputsAndFilter from './InputsAndFilter';
import moment, { duration } from 'moment';
import { getVehicleByImei } from 'services/vehicle';
import PerfectScrollbar from 'react-perfect-scrollbar';

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

const Trajetos = () => {
    const theme = useTheme();
    const [selectedVehicleImei, setSelectedVehicleImei] = useState<Array<any>>([]);
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [infoWindowToggle, setInfoWindowToggle] = useState<Boolean[]>([false]);
    const [markersPosition, setMarkersPosition] = useState<MarkerPosition[] | null>([]);
    const [decodedPoints, setDecodedPoints] = useState<LinePosition[]>([]);
    const [historyPoints, setHistoryPoints] = useState<any[]>([]);
    const [reRenderTable, setReRenderTable] = useState<boolean>();
    const [mileageReportTraveled, setMileageReportTraveled] = useState<any[]>([]);

    const google = window.google;
    let markersIdx: number;

    const vehicleMileageList: any = {};

    const showVehiclesMileageList = async () => {
        const mileageReportTraveledArray: any[] = [];
        for (const el of selectedVehicleImei) {
            const vehicleObj: any = await getVehicleByImei(el);
            // add +1 day because the endDate is 23:59:59 with 1 minute left to complete the last day
            const rangeOfDays = moment(endDate).diff(startDate, 'days') + 1;
            const kmInicial = (Math.max(vehicleMileageList[`${el}_start`], 0) / 1000).toFixed(2);
            const kmFinal = (Math.max(vehicleMileageList[`${el}_end`], 0) / 1000).toFixed(2);
            let totalKM = Math.max(vehicleMileageList[`${el}_end`] - vehicleMileageList[`${el}_start`], 0);
            totalKM = Number((totalKM / 1000).toFixed(2));
            const averageKmPerDay = (totalKM / rangeOfDays).toFixed(2);

            mileageReportTraveledArray.push({
                vehiclePlate: vehicleObj.plate,
                vehicleBrand: vehicleObj.brand,
                vehicleModel: vehicleObj.model,
                kmInicial: kmInicial,
                kmFinal: kmFinal,
                totalKM: totalKM,
                averageKmPerDay: averageKmPerDay,
                rangeOfDays: rangeOfDays
            });
        }
        setMileageReportTraveled(mileageReportTraveledArray);
    };
    useEffect(() => {
        setReRenderTable(!reRenderTable);
    }, [mileageReportTraveled]);

    // eslint-disable-next-line consistent-return
    const getVehiclesMileages = async () => {
        setMileageReportTraveled([]);
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

        let sumRequests = 0;
        let responseRequests = 0;

        for (const vehicleImei of selectedVehicleImei) {
            const searchTrackerImei: string = vehicleImei;
            console.log(startDate.valueOf());
            console.log(endDate.valueOf());
            // FirstTrackingPointsByTimestamp
            sumRequests += 1;
            const FirstTrackingPointsByTimestamp = await getNextTrackingPointsByTimestamp(searchTrackerImei, startDate.valueOf());
            // eslint-disable-next-line no-loop-func, @typescript-eslint/no-loop-func
            FirstTrackingPointsByTimestamp.forEach((tracking_point_doc) => {
                responseRequests += 1;
                let startKm = 0;
                const trackingObj = tracking_point_doc.data();
                startKm = trackingObj.mileage;
                console.log(startKm);
                vehicleMileageList[`${searchTrackerImei}_start`] = startKm;
            });

            // LastTrackingPointsUntilTimestamp
            sumRequests += 1;
            const LastTrackingPointsUntilTimestamp = await getLastTrackingPointsUntilTimestamp(searchTrackerImei, endDate.valueOf());
            // eslint-disable-next-line no-loop-func, @typescript-eslint/no-loop-func
            LastTrackingPointsUntilTimestamp.forEach((tracking_point_doc) => {
                responseRequests += 1;
                let endKm = 0;
                const trackingObj = tracking_point_doc.data();
                endKm = trackingObj.mileage;
                console.log(endKm);
                vehicleMileageList[`${searchTrackerImei}_end`] = endKm;
            });
            showVehiclesMileageList();
        }
    };

    return (
        <>
            <h1>Histórico de quilometragem percorrida</h1>
            <InputsAndFilter
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedVehicleImei={setSelectedVehicleImei}
                getVehiclesMileages={getVehiclesMileages}
            />
            <Grid container sx={{ borderTop: 'solid 5px #5A35B4', borderRadius: 4 }}>
                <Grid container xs={12}>
                    <TableContainer component={Paper} sx={{ width: '100%', marginBottom: 1 }}>
                        <Table sx={{ width: '100%' }}>
                            <TableHead>
                                {reRenderTable && <></>}
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Placa/Modelo</TableCell>
                                    <TableCell align="center">Km Inicial</TableCell>
                                    <TableCell align="center">Km Final</TableCell>
                                    <TableCell align="center">Total Km Rodados</TableCell>
                                    <TableCell align="center">Km médio por dia</TableCell>
                                    <TableCell align="center">Total de dias</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mileageReportTraveled?.map((dataObj, index) => (
                                    <TableRow>
                                        <TableCell align="center">{index}</TableCell>
                                        <TableCell align="center">
                                            {dataObj.vehiclePlate} <br />
                                            {dataObj.vehicleBrand} - {dataObj.vehicleModel}
                                        </TableCell>
                                        <TableCell align="center">{dataObj.kmInicial}</TableCell>
                                        <TableCell align="center">{dataObj.kmFinal}</TableCell>
                                        <TableCell align="center">{dataObj.totalKM}</TableCell>
                                        <TableCell align="center">{dataObj.averageKmPerDay}</TableCell>
                                        <TableCell align="center">{dataObj.rangeOfDays}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <span>
                        IMPORTANTE! Os valores apresentados são aproximados e com base nos dados enviados pelo equipamento, podendo haver
                        divergência com a realidade.
                    </span>
                </Grid>
            </Grid>
        </>
    );
};

export default Trajetos;
