/* eslint-disable object-shorthand */
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Checkbox, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import InputsAndFilter from '../InputsAndFilter';
import { editSecurityAreaVehicles } from 'services/security_areas';
import { toast } from 'react-toastify';
import { callUpdateZonesToApplyChanges } from 'utils/axios';

type Props = {
    handleClose: () => void;
    securityAreaToEditVehicle: any;
    open: boolean;
    setAutocompleteValue: (value: string[]) => void;
    autocompleteValue: string[];
};

const ModalEditZone: React.FC<Props> = ({ handleClose, open, autocompleteValue, setAutocompleteValue, securityAreaToEditVehicle }) => {
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

    const [isChecked, setIsChecked] = useState(undefined);
    const [numberOfVehicles, setNumberOfVehicles] = useState<number>();

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };

    const editZoneVehicle = async (vehicles: string[], id: string) => {
        await editSecurityAreaVehicles(vehicles, id);
        try {
            await callUpdateZonesToApplyChanges();
        } catch (e) {
            toast.error(
                'A Nova Zona foi salva, mas não conseguimos atualizar os equipamentos. Entre em contato com o suporte, ou edite a nova Zona e salve novamente.',
                {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                }
            );
        }
        toast.success('Veículos da zona editados com sucesso!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });

        await Promise.resolve().then(() => {
            window.location.reload();
        });
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} sx={{ margin: 0 }}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Veículos monitorados pela zona
                    </Typography>
                    {/* Modal Content */}
                    <Grid item xs={12} sx={{ height: '100%', marginTop: 1, marginBottom: 3, borderRadius: 4 }}>
                        <Grid sx={{ margin: 1 }}>
                            <p>
                                Nome da zona: <b>{securityAreaToEditVehicle?.name ? securityAreaToEditVehicle?.name : <></>}</b>
                            </p>
                            <p>
                                Endereço: <b>{securityAreaToEditVehicle?.address ? securityAreaToEditVehicle?.address : <></>}</b>
                            </p>
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
                                <Button
                                    sx={{ width: '100%' }}
                                    variant="outlined"
                                    onClick={() => editZoneVehicle(autocompleteValue, securityAreaToEditVehicle?.id)}
                                >
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

export default ModalEditZone;
