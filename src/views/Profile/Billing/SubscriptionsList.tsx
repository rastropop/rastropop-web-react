import { Link as RouterLink } from 'react-router-dom';

import { getCustomerByEmail, getMySubscriptionsByCustomerGalaxPayId } from 'utils/axios';

import moment from 'moment';

import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';

// material-ui
import Accordion from 'ui-component/extended/Accordion/Accordion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CircularProgress from '@mui/material/CircularProgress';

import { Divider, Grid, Stack, Typography } from '@mui/material';

// project imports
import { Subscriptions, Transaction } from 'types/galaxpay';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

const formatCnpjCpf = (value: string) => {
    const cnpjCpf = value.replace(/\D/g, '');
    if (cnpjCpf.length === 11) {
        // eslint-disable-next-line prettier/prettier
        return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
    }
    // eslint-disable-next-line prettier/prettier
    return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
};

const handleTelefone = (value: string) => {
    const formatted = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    return formatted;
};

const SubscriptionsList = () => {
    const [formatedTransactionData, setFormatedTransactionData] = useState<any[]>([]);
    const { user } = useAuth();
    const [myUser, setMyUser] = useState(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    useEffect(() => {
        (async () => {
            // Getting galaxpayId from customer
            const myEmail = myUser?.email == undefined || myUser?.email == 'tele@teste.com.br' ? 'rubemarloc@hotmail.com' : myUser?.email; // 'rubemarloc@hotmail.com' to test
            const currentCustomer = await getCustomerByEmail(0, 20, myEmail);
            const customerGalaxPayId = currentCustomer.data.Customers[0].galaxPayId;

            // Getting all customer subscription
            const mySubscriptions = await getMySubscriptionsByCustomerGalaxPayId(0, 100, customerGalaxPayId);

            // Getting all active subscription
            let activeSubscriptionsArray: Subscriptions[] = [];
            mySubscriptions.data.Subscriptions.forEach((subscription: Subscriptions) => {
                if (subscription.status == 'active') {
                    activeSubscriptionsArray.push(subscription);
                }
            });
            console.log(activeSubscriptionsArray);
            // Sorting subscriptions by date - desc
            activeSubscriptionsArray = activeSubscriptionsArray
                .slice()
                .sort((a: Subscriptions, b: Subscriptions) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());

            const subscriptionsData: any[] = [];
            activeSubscriptionsArray.forEach((activeSubscription: Subscriptions) => {
                const subscriptionData = {
                    customerName: activeSubscription.Customer.name,
                    email: activeSubscription.Customer.emails[0],
                    value: String(activeSubscription.value / 100),
                    phones: handleTelefone(String(activeSubscription.Customer.phones[0])),
                    document: formatCnpjCpf(activeSubscription.Customer.document)
                };

                // Sorting transactions by date - desc
                const sortedTransactions = activeSubscription.Transactions.slice().sort(
                    (a: Transaction, b: Transaction) => new Date(b.payday).valueOf() - new Date(a.payday).valueOf()
                );

                // setting transactionRow
                const accordionData: any[] = [];

                sortedTransactions.map((transaction: Transaction) => {
                    let statusTitle = transaction.statusDescription;
                    let content: string | JSX.Element = '';
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
                                    <b>R$</b> {transaction.value / 100} &nbsp; <CalendarMonthIcon sx={{ marginBottom: '-5px' }} />
                                    Vencimento em{' '}
                                    <b>
                                        {transaction.payday.split('-')[2]}/{transaction.payday.split('-')[1]}/
                                        {transaction.payday.split('-')[0]}
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
                    accordionData.push({
                        dateTitle: `${moment(transaction.payday.split('-')[1]).format('MMMM')} / ${transaction.payday.split('-')[0]}`,
                        bankLine,
                        chipColor,
                        statusTitle,
                        content
                    });
                });
                subscriptionsData.push({
                    subscriptionData,
                    accordionData
                });
            });
            setFormatedTransactionData(subscriptionsData);
        })();
    }, [myUser]);

    return (
        <>
            {formatedTransactionData.length != 0 ? (
                formatedTransactionData.map((data) => (
                    <>
                        <Grid item sx={{ marginBottom: '20px' }} xs={12}>
                            <SubCard title={data.subscriptionData.customerName}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                    <Stack>
                                                        <Typography variant="subtitle1">Email de cobrança</Typography>
                                                        {data.subscriptionData.email ? (
                                                            <Typography variant="subtitle2">{data.subscriptionData.email}</Typography>
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
                                                        {data.subscriptionData.value ? (
                                                            <Typography variant="subtitle2">
                                                                R$ {parseFloat(data.subscriptionData.value).toFixed(2)}
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
                                                        {data.subscriptionData.phones ? (
                                                            <>
                                                                <Typography variant="subtitle2">{data.subscriptionData.phones}</Typography>
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
                                                        {data.subscriptionData.document ? (
                                                            <Typography variant="subtitle2">{data.subscriptionData.document}</Typography>
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
                                    <Accordion data={data.accordionData} />
                                </SubCard>
                            </Grid>
                        </Grid>
                    </>
                ))
            ) : (
                <Grid container alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Grid>
            )}
        </>
    );
};

export default SubscriptionsList;
