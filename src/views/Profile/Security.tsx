// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// ==============================|| PROFILE 3 - SECURITY ||============================== //

const Security = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={8}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <SubCard title="Alterar Senha">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic9" fullWidth label="Senha Atual" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic10" fullWidth label="Nova Senha" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic11" fullWidth label="Digite a Nova Senha novamente" />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row">
                                    <AnimateButton>
                                        <Button variant="contained">Alterar</Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
);

export default Security;
