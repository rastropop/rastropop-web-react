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
import { fireStore, fireStoreBatch, fireStoreFieldValue } from 'services/firebase';
import { callUpdateZonesToApplyChanges } from 'utils/axios';

type Props = {
    handleClose: () => void;
    securityAreaToDelete: any;
    open: boolean;
};

const ModalDeleteZone: React.FC<Props> = ({ handleClose, open, securityAreaToDelete }) => {
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

    const deleteZoneFromFirebase = async () => {
        try {
            // Get a new write batch
            const batchCreation = fireStoreBatch;

            const zoneDocDeleteRef = fireStore.collection('security_areas').doc(securityAreaToDelete.id);
            await batchCreation.delete(zoneDocDeleteRef);

            const deletingZone = securityAreaToDelete;
            if (deletingZone != undefined && deletingZone.assigned_trackers) {
                // eslint-disable-next-line guard-for-in
                for (const key in deletingZone.assigned_trackers) {
                    console.log(deletingZone.assigned_trackers[key]);
                    batchCreation.update(fireStore.collection('trackers').doc(deletingZone.assigned_trackers[key]), {
                        assigned_zones: fireStoreFieldValue.arrayRemove(securityAreaToDelete.id)
                    });
                }
            }
            await batchCreation.commit();
            toast.success('Zona deletada com sucesso', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });

            try {
                await callUpdateZonesToApplyChanges();
            } catch (e) {
                toast.error('A Zona foi deletada, mas não conseguimos atualizar os equipamentos. Entre em contato com o suporte.', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });
            }

            await Promise.resolve().then(() => {
                window.location.reload();
            });
        } catch (e) {
            toast.error('Erro ao deletar zona.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} sx={{ margin: 0 }}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirmar deleção de zona
                    </Typography>
                    {/* Modal Content */}
                    <Grid item xs={12} sx={{ height: '100%', marginTop: 1, marginBottom: 3, borderRadius: 4 }}>
                        <Grid sx={{ margin: 1 }}>
                            <p>
                                Nome da zona: <b>{securityAreaToDelete?.name ? securityAreaToDelete?.name : <></>}</b>
                            </p>
                            <p>
                                Endereço: <b>{securityAreaToDelete?.address ? securityAreaToDelete?.address : <></>}</b>
                            </p>
                        </Grid>
                        <div style={{ marginTop: 8, borderBottom: '1px solid #b7b7b7' }} />
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <h3 style={{ marginTop: 12, marginBottom: 12 }}>Verifique os dados antes de confirmar</h3>
                                </Grid>

                                <Button sx={{ width: '100%' }} variant="outlined" color="error" onClick={() => deleteZoneFromFirebase()}>
                                    Deletar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalDeleteZone;
