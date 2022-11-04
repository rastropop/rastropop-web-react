import { Link as RouterLink } from 'react-router-dom';

import { getCustomerByEmail, getMySubscriptionsByCustomerGalaxPayId } from 'utils/axios';

import moment from 'moment';

import { SetStateAction, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Accordion from 'ui-component/extended/Accordion/Accordion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import {
    CardMedia,
    Divider,
    Grid,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import BillCard from 'ui-component/cards/BillCard';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Chip from 'ui-component/extended/Chip';
import { gridSpacing } from 'store/constant';
import SubscriptionsList from './SubscriptionsList';

// ==============================|| PROFILE 3 - BILLING ||============================== //

const Billing = () => {
    const [transactionData, setTransactionData] = useState({ customerName: '', email: '', value: '', phones: '', document: '' });
    const [transactionRow, setTransactionRow] = useState<any[]>([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);

    const formatCnpjCpf = (value: any) => {
        const cnpjCpf = value.replace(/\D/g, '');
        if (cnpjCpf.length === 11) {
            // eslint-disable-next-line prettier/prettier
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }
        // eslint-disable-next-line prettier/prettier
        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    };

    const handleTelefone = (value: any) => {
        const formatted = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        return formatted;
    };

    useEffect(() => {
        (async () => {
            // Getting galaxpayId from customer
            const myEmail = 'rubemarloc@hotmail.com'; // miqueias.fms@gmail.com
            const currentCustomer = await getCustomerByEmail(0, 20, myEmail);
            const customerGalaxPayId = currentCustomer.data.Customers[0].galaxPayId;

            // getting customer subscription
            const mySubscriptions = await getMySubscriptionsByCustomerGalaxPayId(0, 100, customerGalaxPayId);
            const sortedTransactions = mySubscriptions.data.Subscriptions[6].Transactions.slice().sort(
                (a: any, b: any) => new Date(b.payday).valueOf() - new Date(a.payday).valueOf()
            );

            const activeSubscriptionsArray: SetStateAction<any[]> = [];
            mySubscriptions.data.Subscriptions.forEach((subscription: any) => {
                if (subscription.status == 'active') {
                    activeSubscriptionsArray.push(subscription);
                }
            });
            setActiveSubscriptions(activeSubscriptionsArray);

            setTransactionData({
                customerName: mySubscriptions.data.Subscriptions[0].Customer.name,
                email: mySubscriptions.data.Subscriptions[0].Customer.emails[0],
                value: String(mySubscriptions.data.Subscriptions[6].value / 100),
                phones: handleTelefone(String(mySubscriptions.data.Subscriptions[0].Customer.phones[0])),
                document: formatCnpjCpf(mySubscriptions.data.Subscriptions[0].Customer.document)
            });

            // setting transactionRow
            const arrayTransaction: any[] = [];
            sortedTransactions.map((transaction: any) => {
                let statusTitle = transaction.statusDescription;
                let content: any = '';
                let chipColor = '';
                let bankLine;

                switch (transaction.status) {
                    case 'payedBoleto':
                        chipColor = '#009454';
                        statusTitle = 'Compensado / Pago';
                        content = `Boleto compensado, recebemos o seu pagamento no valor de R$ ${transaction.value / 100}`;
                        break;

                    case 'pendingBoleto':
                        if (moment().isAfter(moment(transaction.payday).toDate())) {
                            chipColor = '#f39c11';
                            statusTitle = 'Em aberto / Vencido';
                        } else {
                            chipColor = '#337ab7';
                            statusTitle = 'Em aberto';
                        }
                        bankLine = transaction.Boleto.bankLine;
                        content = (
                            <Typography sx={{ fontSize: 17, fontWeight: 400 }}>
                                <b>R$</b> {transaction.value} &nbsp; <CalendarMonthIcon sx={{ marginBottom: '-5px' }} />
                                Vencimento em{' '}
                                <b>
                                    {transaction.payday.split('-')[2]}/{transaction.payday.split('-')[1]}/{transaction.payday.split('-')[0]}
                                </b>{' '}
                                &nbsp;
                                <InsertDriveFileIcon sx={{ marginBottom: '-5px' }} />{' '}
                                <a target="_blank" href={transaction.Boleto.pdf} style={{ color: '#337AB7' }}>
                                    Visualizar Boleto
                                </a>
                            </Typography>
                        );
                        break;

                    case 'notCompensated':
                        statusTitle = 'Prazo de pagamento vencido / Em débito';
                        content = `Este boleto excedeu o prazo para pagamento após o vencimento`;
                        break;

                    case 'lessValueBoleto':
                        content = `Boleto compensado, recebemos o seu pagamento no valor de R$ ${transaction.value}`;
                        break;
                }
                arrayTransaction.push({
                    dateTitle: `${moment(transaction.payday.split('-')[1]).format('MMMM')} / ${transaction.payday.split('-')[0]}`,
                    // disabled: content == '',
                    bankLine,
                    chipColor,
                    statusTitle,
                    content
                });
            });

            return (
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <SubCard title={transactionData.customerName}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                <Stack>
                                                    <Typography variant="subtitle1">Email de cobrança</Typography>
                                                    {transactionData.email ? (
                                                        <Typography variant="subtitle2">{transactionData.email}</Typography>
                                                    ) : (
                                                        <span>--</span>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                <Stack>
                                                    <Typography variant="subtitle1">Valor do plano atual</Typography>
                                                    {transactionData.value ? (
                                                        <Typography variant="subtitle2">
                                                            R$ {parseFloat(transactionData.value).toFixed(2)}
                                                        </Typography>
                                                    ) : (
                                                        <span>--</span>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                <Stack>
                                                    <Typography variant="subtitle1">Telefone de contato</Typography>
                                                    {transactionData.phones ? (
                                                        <>
                                                            <Typography variant="subtitle2">{transactionData.phones}</Typography>
                                                        </>
                                                    ) : (
                                                        <span>--</span>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                <Stack>
                                                    <Typography variant="subtitle1">Documento (cpf/cnpj)</Typography>
                                                    {transactionData.document ? (
                                                        <Typography variant="subtitle2">{transactionData.document}</Typography>
                                                    ) : (
                                                        <span>--</span>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12} sm={12}>
                            <SubCard title="Minhas faturas">
                                <Accordion data={transactionRow} />
                            </SubCard>
                        </Grid>
                    </Grid>
                </Grid>
            );
            setTransactionRow(arrayTransaction);
        })();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubscriptionsList />
            </Grid>
        </Grid>
    );
};

export default Billing;
