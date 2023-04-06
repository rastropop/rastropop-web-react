import { Grid, TextField } from '@mui/material';

interface Props {
    interval?: boolean;
    startTime?: number | string;
    endTime?: number | string;
}

const calendarPickerIconStyle = {
    // filter: 'invert(82%) sepia(5%) saturate(1607%) hue-rotate(192deg) brightness(97%) contrast(94%)',
    opacity: 0,
    position: 'absolute',
    right: 5,
    width: '100%',
    height: '65%',
    margin: 0,
    padding: 0,
    cursor: 'pointer',
    transform: 'scaleX(-1)'
};

const HourPicker: React.FC<Props> = ({ interval, startTime, endTime }) => (
    <>
        {!interval ? (
            <TextField
                type="time"
                sx={{
                    '& input[type="time"]::-webkit-calendar-picker-indicator': calendarPickerIconStyle,
                    width: '100%'
                }}
                defaultValue={startTime}
            />
        ) : (
            <Grid container wrap="wrap" justifyContent="space-between" alignItems="center" xs={12}>
                <TextField
                    type="time"
                    sx={{
                        '& input[type="time"]::-webkit-calendar-picker-indicator': calendarPickerIconStyle,
                        width: '48%'
                    }}
                    defaultValue={startTime}
                />
                -
                <TextField
                    type="time"
                    sx={{
                        '& input[type="time"]::-webkit-calendar-picker-indicator': calendarPickerIconStyle,
                        width: '48%'
                    }}
                    defaultValue={endTime}
                />
            </Grid>
        )}
    </>
);

export default HourPicker;
