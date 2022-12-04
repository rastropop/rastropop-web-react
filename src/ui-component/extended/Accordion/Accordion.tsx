import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Chip, Card, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/pt-br';

// assets
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type AccordionItem = {
    id: string;
    bankLine: string;
    chipColor: string;
    statusTitle: ReactElement | string;
    dateTitle: string;
    content: ReactElement | string;
    disabled?: boolean;
    expanded?: boolean;
    defaultExpand?: boolean | undefined;
};

interface accordionProps {
    data: AccordionItem[];
    defaultExpandedId?: string | boolean | null;
    expandIcon?: ReactElement;
    square?: boolean;
    toggle?: boolean;
}

// ==============================|| ACCORDION ||============================== //

const Accordion = ({ data, defaultExpandedId = null, expandIcon, square, toggle }: accordionProps) => {
    const theme = useTheme();
    moment.locale('pt-br');

    const [expanded, setExpanded] = useState<string | boolean | null>(null);
    const handleChange = (panel: string) => (event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
        toggle && setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        setExpanded(defaultExpandedId);
    }, [defaultExpandedId]);

    const formartBankLine = (bankline: any) => {
        // eslint-disable-next-line prefer-template
        const output = `${bankline.substring(0, 5)}.${bankline.substring(5, 10)} ${bankline.substring(10, 15)}.${bankline.substring(
            15,
            21
        )} ${bankline.substring(21, 26)}.${bankline.substring(26, 32)} ${bankline.substring(32, 33)} ${bankline.substring(33)}`;

        return output;
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const BankLineContainer = styled(Card)(({ theme }) => ({
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        marginBottom: '10px',
        border: `1px solid ${theme.palette.background.default}`,
        background: theme.palette.background.default,
        '&:hover': {
            border: `1px solid #BDC8F0`,
            cursor: 'pointer'
        }
    }));

    const TitleContainer = styled('div')(() => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    }));

    return (
        <Box sx={{ width: '100%' }}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {data?.map((item: AccordionItem) => (
                <MuiAccordion
                    key={item.id}
                    defaultExpanded={item.bankLine ? true : !item.disabled && item.defaultExpand}
                    expanded={(!toggle && !item.disabled && item.expanded) || (toggle && expanded === item.id)}
                    disabled={item.disabled}
                    square={square}
                    onChange={handleChange(item.id)}
                >
                    <MuiAccordionSummary
                        expandIcon={expandIcon || expandIcon === false ? expandIcon : <ExpandMoreIcon />}
                        sx={{ color: theme.palette.mode === 'dark' ? 'grey.500' : 'grey.800', fontWeight: 500, alignItems: 'center' }}
                    >
                        <TitleContainer>
                            {item.dateTitle} &nbsp; &nbsp;
                            <Chip size="small" label={item.statusTitle} style={{ backgroundColor: item.chipColor, color: 'white' }} />
                        </TitleContainer>
                    </MuiAccordionSummary>
                    <MuiAccordionDetails>
                        {item.bankLine && item.bankLine != 'empty' ? (
                            <>
                                <BankLineContainer
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.bankLine);
                                        toast.success('Código de barras copiado!', {
                                            position: 'top-right',
                                            autoClose: 2000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: 'colored'
                                        });
                                    }}
                                >
                                    <Typography variant="h2">{formartBankLine(item.bankLine)}</Typography> <ContentCopyIcon />
                                </BankLineContainer>
                                {item.content}
                            </>
                        ) : (
                            <Typography variant="subtitle1">{item.content}</Typography>
                        )}
                    </MuiAccordionDetails>
                </MuiAccordion>
            ))}
        </Box>
    );
};

export default Accordion;
