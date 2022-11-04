import React, { ChangeEvent, useEffect, useState } from 'react';
// material-ui
import { Button, Grid, Stack, TextField } from '@mui/material';
import CurrencyFormat from 'react-currency-format';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

import useAuth from 'hooks/useAuth';
import { updateMyProfile } from 'services/user';

import { UserProfile as UserProfileType } from 'types/user-profile';

// assets

const UserProfile = () => {
    const { user } = useAuth();

    const [myUser, setMyUser] = useState(user);

    // useEffect(() => {}, []);

    const handleSave = () => {
        updateMyProfile(myUser as UserProfileType);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={8}>
                <SubCard title="Perfil">
                    <form>
                        <Grid container spacing={gridSpacing}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="Nome"
                                    value={myUser!.name}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, name: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="Endereço"
                                    defaultValue="Rua 1, 1"
                                    value={myUser!.address}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, address: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="Email"
                                    defaultValue="name@example.com"
                                    value={myUser!.email}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, email: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Registrado em" defaultValue="**/**/****" />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CurrencyFormat
                                    customInput={TextField}
                                    format="(##) #####-####"
                                    id="outlined-basic"
                                    fullWidth
                                    label="Telefone"
                                    defaultValue="(00) 00000-0000"
                                    value={myUser!.phone}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, phone: e.target.value });
                                    }}
                                />
                                {/* <TextField id="outlined-basic" fullWidth label="Telefone" defaultValue="(085) 99905-2977" value={user!.phone} /> */}
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CurrencyFormat
                                    customInput={TextField}
                                    format="###.###.###-##"
                                    id="outlined-basic"
                                    fullWidth
                                    label="CPF"
                                    defaultValue="000.000.000-00"
                                    value={myUser?.cpf}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, cpf: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CurrencyFormat
                                    customInput={TextField}
                                    format="##.###.###/####-##"
                                    id="outlined-basic"
                                    fullWidth
                                    label="CNPJ"
                                    defaultValue="00.000.000/0001-00"
                                    value={myUser?.cnpj}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, cnpj: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="RG"
                                    defaultValue="0000000000000"
                                    value={myUser!.rg}
                                    onChange={(e) => {
                                        setMyUser({ ...myUser, rg: e.target.value });
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Stack direction="row">
                                    <AnimateButton>
                                        <Button onClick={handleSave} variant="contained">
                                            Salvar
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default UserProfile;
