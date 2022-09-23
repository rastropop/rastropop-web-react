import React from 'react';
// material-ui
import { Button, Grid, Stack, TextField } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets

const UserProfile = () => (
    // const { user } = useAuth();

    <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={8}>
            <SubCard title="Perfil">
                <Grid container spacing={gridSpacing}>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Nome" defaultValue="Rodrigo Andrade" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Endereço" defaultValue="Rua 1, 1" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Email" defaultValue="name@example.com" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Registrado em" defaultValue="01/06/2018" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Telefone" defaultValue="(085) 99905-2977" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="CPF" defaultValue="000.000.000-00" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="CNPJ" defaultValue="00.000.000/0001-00" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField id="outlined-basic" fullWidth label="RG" defaultValue="0000000000000" />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row">
                            <AnimateButton>
                                <Button variant="contained">Salvar</Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </SubCard>
        </Grid>
    </Grid>
);

export default UserProfile;
