/* eslint-disable object-shorthand */
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Checkbox, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import InputsAndFilter from '../InputsAndFilter';

type Props = {
    handleClose: () => void;
    createZone: () => void;
    open: boolean;
    nameZoneValue: string;
    zoneModel: any;
    setZoneModel: (value: any) => void;
    setAutocompleteValue: (value: string[]) => void;
    autocompleteValue: string[];
};

const ModalCreateZone: React.FC<Props> = ({
    handleClose,
    createZone,
    open,
    nameZoneValue,
    zoneModel,
    autocompleteValue,
    setZoneModel,
    setAutocompleteValue
}) => {
    const theme = useTheme();
    const min500 = useMediaQuery('(min-width:500px)');
    const min400 = useMediaQuery('(min-width:400px)');

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '90vh',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: min400 ? 'auto' : 'hidden'
    };

    const [isChecked, setIsChecked] = useState(false);
    const [numberOfVehicles, setNumberOfVehicles] = useState<number>();

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} sx={{ margin: 0 }}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Nova Zona
                    </Typography>
                    {/* Modal Content */}
                    <Grid item xs={12} sx={{ height: '100%', marginTop: 1, marginBottom: 3, borderRadius: 4 }}>
                        {/* Zone Name */}
                        <Grid
                            container
                            flexWrap={min500 == false ? undefined : 'nowrap'}
                            alignItems="center"
                            sx={{
                                border: '1px solid black',
                                borderRadius: 1,
                                background: theme.palette.dark[800],
                                overflow: 'hidden',
                                marginBottom: 2
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    width: min500 == false ? '100%' : undefined,
                                    padding: 1,
                                    borderRight: min500 == false ? 'none' : '1px solid black',
                                    background: theme.palette.dark[900]
                                }}
                            >
                                Nome da Zona
                            </Grid>
                            <Grid
                                item
                                flexGrow={min500 == true ? 1 : undefined}
                                sx={{ width: min500 == false ? '100%' : undefined, marginLeft: 1 }}
                            >
                                <span>{nameZoneValue}</span>
                            </Grid>
                        </Grid>

                        {/* Address */}
                        <Grid
                            container
                            alignItems="center"
                            flexWrap={min500 == false ? undefined : 'nowrap'}
                            sx={{
                                border: '1px solid black',
                                borderRadius: 2,
                                background: theme.palette.dark[900],
                                overflow: 'hidden',
                                marginBottom: 2
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    width: min500 == false ? '100%' : undefined,
                                    padding: 1,
                                    borderRight: min500 == false ? 'none' : '1px solid black'
                                }}
                            >
                                Endereço
                            </Grid>
                            <Grid item flexGrow={min500 == true ? 1 : undefined} sx={{ width: min500 == false ? '100%' : undefined }}>
                                <TextField
                                    sx={{ width: '100%', border: 'none', background: theme.palette.dark[800] }}
                                    size="small"
                                    value={zoneModel?.zoneAddress}
                                    onChange={(e) => setZoneModel({ ...zoneModel, address: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid sx={{ margin: 1 }}>
                            <span>Caso haja divergência ou queira corrigir/editar o endereço, modifique na caixa acima.</span>
                        </Grid>
                        <div style={{ marginTop: 8, borderBottom: '1px solid black' }} />
                        <Grid container>
                            <Grid item xs={12}>
                                <h3 style={{ marginTop: 12, marginBottom: 6 }}>Selecione os veículos para serem monitorados pela zona</h3>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="space-between" xs={12}>
                                <Grid item>
                                    <span>Qtde. Veículos monitorados: </span> <b>{numberOfVehicles}</b>
                                </Grid>
                                <Grid item>
                                    <Checkbox checked={isChecked} onChange={handleCheckboxChange} />{' '}
                                    <span>Selecionar todos os meus veículos</span>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginBottom: 2 }}>
                                <InputsAndFilter
                                    isChecked={isChecked}
                                    setNumberOfVehicles={setNumberOfVehicles}
                                    autocompleteValue={autocompleteValue}
                                    setAutocompleteValue={setAutocompleteValue}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button sx={{ width: '100%' }} variant="outlined" onClick={createZone}>
                                    Salvar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalCreateZone;
