// ==============================|| DASHBOARD - MARKET SHARE AREA CHART ||============================== //
import { Props } from 'react-apexcharts';

const chartAreaData = (dataArray: any[]) => ({
    height: 480,
    type: 'area',
    options: {
        chart: {
            foreColor: '#FFFFFF',
            stacked: true,
            toolbar: {
                show: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        yaxis: {
            labels: {
                style: {
                    colors: ['white']
                }
            }
        },
        xaxis: {
            type: 'category',
            categories: Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, '0')}h`),
            position: 'bottom',
            labels: {
                show: true
            }
        },
        legend: {
            show: true,
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 100],
                    colorStops: []
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: dataArray
});

export default chartAreaData;
