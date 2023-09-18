/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-loop-func */
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
import Chart from 'react-apexcharts';
import moment from 'moment';
import chartBarData from './chart-data/chartBar';
import chartDonutData from './chart-data/chartDonut';
import chartAreaData from './chart-data/chartArea';

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

const Dashboard = () => {
    const theme = useTheme();
    const [autocompleteValue, setAutocompleteValue] = useState<Array<string>>([]);
    const [chartBarOptions, setChartBarOptions] = useState<any>();
    const [chartAreaOptions, setChartAreaOptions] = useState<any>();
    const [chartDonutOptions, setChartDonutOptions] = useState<any>();

    const getFirebasePoints = () => {
        (async () => {
            if (autocompleteValue.length != 0) {
                const allAccStatusData: Record<string, { on: number; off: number }> = {};
                const totalACC_ON_array: number[] = [];
                const totalACC_OFF_array: number[] = [];
                const allSpeedData: number[] = [];

                // 24 elements = 24hours of the day
                let totalSumKm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const allKmSumByHourData: { name: string; data: any[] }[] = [];

                let totalSumSpeed = 0;
                let numSpeedPoints = 0;

                // Stard and End date
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const currentTimestamp = new Date().getTime();

                for (const imei of autocompleteValue) {
                    totalSumKm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                    totalSumSpeed = 0;
                    numSpeedPoints = 0;
                    // eslint-disable-next-line no-await-in-loop
                    const querySnapshot = await getTrackingPoints(imei, startOfDay.getTime(), currentTimestamp);
                    let actualElement: any;
                    let lastElement: any;
                    let totalACC_ON: number = 0;
                    let totalACC_OFF: number = 0;

                    querySnapshot.forEach((trackingPoint) => {
                        actualElement = trackingPoint.data();

                        if (actualElement.acc_status == 1 && actualElement.velocity > 0) {
                            /// Somar velocidade acumulada com veículo rodando.
                            totalSumSpeed += actualElement.velocity;
                            numSpeedPoints += 1;
                        }

                        if (lastElement) {
                            if (lastElement.acc_status == 0) {
                                /* VEICULO DESLIGADO */

                                /// Somar minutos do veiculo desligado
                                const diff = Math.abs(actualElement.timestamp - lastElement.timestamp);
                                const durOffMin = Math.ceil(diff / (1000 * 60));
                                if (durOffMin > 1) {
                                    totalACC_OFF += durOffMin;
                                }
                            } else if (lastElement.acc_status == 1 && actualElement.min != lastElement.min) {
                                /* VEICULO LIGADO */

                                /// Somar minutos do veiculo ligado
                                const diff = Math.abs(actualElement.timestamp - lastElement.timestamp);
                                const durOnMin = Math.ceil(diff / (1000 * 60));
                                totalACC_ON += durOnMin;
                            }

                            const actualHour = parseInt(moment(actualElement.timestamp).format('H'), 10);
                            const lastHour = parseInt(moment(lastElement.timestamp).format('H'), 10);

                            if (actualHour == lastHour) {
                                let old = totalSumKm[actualHour + 1];
                                old += actualElement.mileage - lastElement.mileage;
                                totalSumKm[actualHour + 1] = old;
                            } else {
                                // nova hora iniciada
                                let previousKM = totalSumKm[actualHour];
                                previousKM += actualElement.mileage - lastElement.mileage;
                                totalSumKm[actualHour + 1] = previousKM;
                            }
                        }
                        lastElement = actualElement;
                    });
                    const hoursACC_On = Math.floor(totalACC_ON / 60);
                    const realMinOn = (totalACC_ON % 60) / 100;

                    const hoursACC_Off = Math.floor(totalACC_OFF / 60);
                    const realMinOff = (totalACC_OFF % 60) / 100;

                    // Bar Chart
                    allAccStatusData[imei.toString()] = { on: hoursACC_On + realMinOn, off: hoursACC_Off + realMinOff };
                    totalACC_ON_array.push(hoursACC_On + realMinOn);
                    totalACC_OFF_array.push(hoursACC_Off + realMinOff);

                    // Line Chart
                    totalSumKm = totalSumKm.map((el, idx) => {
                        if (el == 0 && idx > 0) {
                            if (lastElement > 0) {
                                return lastElement;
                            }
                            lastElement = parseFloat((totalSumKm[idx - 1] / 1000).toFixed(2));
                            return lastElement;
                        }
                        return parseFloat((el / 1000).toFixed(2));
                    });
                    allKmSumByHourData.push({
                        name: imei.toString(),
                        data: totalSumKm
                    });

                    // Donut Chart
                    if (numSpeedPoints > 0) {
                        allSpeedData.push(parseFloat((totalSumSpeed / numSpeedPoints).toFixed(1)));
                    } else {
                        allSpeedData.push(totalSumSpeed);
                    }
                }
                allKmSumByHourData.sort((a, b) => {
                    // Obtém os valores de data para comparação
                    const dataA = a.data.reduce((acc, val) => acc + val, 0);
                    const dataB = b.data.reduce((acc, val) => acc + val, 0);

                    // Ordena em ordem crescente (as linhas do gráfico precisam da ordem crescente para aparecer da forma esperada)
                    if (dataA < dataB) {
                        return -1;
                    }
                    if (dataA > dataB) {
                        return 1;
                    }
                    return 0;
                });

                // Bar Chart
                const chartBarSeries = [
                    {
                        name: 'Ligado',
                        data: totalACC_ON_array
                    },
                    {
                        name: 'Desligado',
                        data: totalACC_OFF_array
                    }
                ];
                // Bar Chart
                const barData = chartBarData(autocompleteValue, chartBarSeries);
                setChartBarOptions(barData);

                // Line Chart
                const areaData = chartAreaData(allKmSumByHourData);
                setChartAreaOptions(areaData);

                // Donut Chart
                const donutData = chartDonutData(autocompleteValue, allSpeedData);
                setChartDonutOptions(donutData);
            } else {
                alert('Selecione os veículos');
            }
        })();
    };

    return (
        <>
            <h1>Dashboard</h1>

            <InputsAndFilter
                autocompleteValue={autocompleteValue}
                setAutocompleteValue={setAutocompleteValue}
                getFirebasePoints={getFirebasePoints}
            />

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
                <Grid container>
                    <Grid item xs={12}>
                        <h3 style={{ marginBottom: 3, marginTop: 2 }}>Tempo total de uso dos veículos no período</h3>
                        <span style={{ fontSize: '0.9em', marginLeft: 1 }}>
                            Valores apresentados em horas. Total de horas considerado no período: 17h
                        </span>
                    </Grid>
                    <Grid container justifyContent="space-around" wrap="nowrap">
                        <Grid item xs={12}>
                            {chartBarOptions && <Chart {...chartBarOptions} />}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <h3 style={{ marginBottom: 3, marginTop: 2 }}>Quilometragem acumulada por hora</h3>
                        <span style={{ fontSize: '0.9em', marginLeft: 1 }}>Valores apresentados em km</span>
                    </Grid>
                    <Grid container justifyContent="space-around" wrap="nowrap">
                        <Grid item xs={12}>
                            {chartAreaOptions && <Chart {...chartAreaOptions} />}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <h3 style={{ marginBottom: 3, marginTop: 2 }}>Média de velocidade dos veículos no período</h3>
                        <span style={{ fontSize: '0.9em', marginLeft: 1 }}>Valores apresentados em km/h</span>
                    </Grid>
                    <Grid container justifyContent="space-around" wrap="nowrap">
                        <Grid item xs={12}>
                            {chartDonutOptions && <Chart {...chartDonutOptions} />}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
