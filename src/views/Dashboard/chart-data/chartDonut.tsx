import { Props } from 'react-apexcharts';
// ==============================|| WIDGET - MARKET SHARE CHART ||============================== //

const chartDonutData = (autocompleteValue: string[], speedData: any) => ({
    height: 228,
    type: 'donut',
    options: {
        chart: {
            id: 'revenue-chart'
        },
        dataLabels: {
            enabled: false
        },
        labels: autocompleteValue,
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'inherit',
            labels: {
                colors: 'inherit'
            },
            itemMargin: {
                horizontal: 10,
                vertical: 10
            }
        }
    },
    series: speedData
});

export default chartDonutData;
