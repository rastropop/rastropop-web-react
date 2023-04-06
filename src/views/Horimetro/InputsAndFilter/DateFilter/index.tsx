import { ptBR } from 'date-fns/locale';
import {
    addDays,
    addMonths,
    differenceInCalendarDays,
    endOfDay,
    endOfMonth,
    endOfWeek,
    isSameDay,
    startOfDay,
    startOfMonth,
    startOfWeek
} from 'date-fns';

import { DateRangePicker } from 'react-date-range';

import DateRangeIcon from '@mui/icons-material/DateRange';
import { Button, Grid } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';

type Props = {
    setStartDate: (val: Date) => void;
    setEndDate: (val: Date) => void;
};

const DateFilter: React.FC<Props> = ({ setStartDate, setEndDate }) => {
    const [openDateRange, setOpenDateRange] = useState(false);

    // Input Ranges in Portuguese
    const defineds = {
        startOfWeek: startOfWeek(new Date()),
        endOfWeek: endOfWeek(new Date()),
        startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
        endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
        startOfToday: startOfDay(new Date()),
        endOfToday: endOfDay(new Date()),
        startOfYesterday: startOfDay(addDays(new Date(), -1)),
        endOfYesterday: endOfDay(addDays(new Date(), -1)),
        startOfMonth: startOfMonth(new Date()),
        endOfMonth: endOfMonth(new Date()),
        startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
        endOfLastMonth: endOfMonth(addMonths(new Date(), -1))
    };
    const defaultInputRanges = [
        {
            label: 'Dias até hoje',
            range(value: any) {
                return {
                    startDate: addDays(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
                    endDate: defineds.endOfToday
                };
            },
            getCurrentValue(range: any) {
                if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
                if (!range.startDate) return '∞';
                return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
            }
        },
        {
            label: 'Dias começando de hoje',
            range(value: any) {
                const today = new Date();
                return {
                    startDate: today,
                    endDate: addDays(today, Math.max(Number(value), 1) - 1)
                };
            },
            getCurrentValue(range: any) {
                if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
                if (!range.endDate) return '∞';
                return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
            }
        }
    ];

    // Static Ranges in Portuguese
    const staticRangeHandler = {
        range: {},
        isSelected(range: any) {
            const definedRange = range;
            return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
        }
    };
    const createStaticRanges = (ranges: any) => ranges.map((range: any) => ({ ...staticRangeHandler, ...range }));
    const defaultStaticRanges = createStaticRanges([
        {
            label: 'Hoje',
            range: () => ({
                startDate: defineds.startOfToday,
                endDate: defineds.endOfToday
            })
        },
        {
            label: 'Ontem',
            range: () => ({
                startDate: defineds.startOfYesterday,
                endDate: defineds.endOfYesterday
            })
        },
        {
            label: 'Essa semana',
            range: () => ({
                startDate: defineds.startOfWeek,
                endDate: defineds.endOfWeek
            })
        },
        {
            label: 'Última semana',
            range: () => ({
                startDate: defineds.startOfLastWeek,
                endDate: defineds.endOfLastWeek
            })
        },
        {
            label: 'Esse mês',
            range: () => ({
                startDate: defineds.startOfMonth,
                endDate: defineds.endOfMonth
            })
        },
        {
            label: 'Último passado',
            range: () => ({
                startDate: defineds.startOfLastMonth,
                endDate: defineds.endOfLastMonth
            })
        }
    ]);

    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const onChangeDateRange = (ranges: any) => {
        setSelectionRange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
            key: 'selection'
        });
        setStartDate(ranges.selection.startDate);
        // @ts-ignore
        setEndDate(new Date(moment(ranges.selection.endDate).add(moment.duration('23:59'))));

        console.log('---');
        console.log(ranges.selection.startDate);
        // @ts-ignore
        console.log(new Date(moment(ranges.selection.endDate).add(moment.duration('23:59'))));
    };

    return (
        <Grid item xs={6} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
                <b>Escolha o período que deseja visualizar:</b>
            </Grid>
            <Grid item xs={12}>
                <Button
                    onClick={() => setOpenDateRange(!openDateRange)}
                    variant="outlined"
                    endIcon={<DateRangeIcon />}
                    sx={{ marginBottom: 1, marginTop: 1 }}
                >
                    Período de busca
                </Button>
                {openDateRange && (
                    <DateRangePicker
                        inputRanges={defaultInputRanges}
                        staticRanges={defaultStaticRanges}
                        locale={ptBR}
                        ranges={[selectionRange]}
                        onChange={onChangeDateRange}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default DateFilter;
