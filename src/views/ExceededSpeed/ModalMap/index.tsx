/* eslint-disable object-shorthand */
import * as React from 'react';
import Box from '@mui/material/Box';
import GoogleMapComponent from '../GoogleMap';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid } from '@mui/material';
import { useState } from 'react';
import { InfoWindow, Marker, Polygon } from '@react-google-maps/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    height: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

type Props = {
    open: boolean;
    handleClose: () => void;
    lat: number;
    long: number;
    timestamp: number;
    vel: number;
};

const defaultCenter = {
    lat: -3.7402,
    lng: -38.4997
};

const ModalMap: React.FC<Props> = ({ open, handleClose, lat, long, timestamp, vel }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [infoWindowToggle, setInfoWindowToggle] = useState<Boolean>(true);
    const imgDefaultURL =
        'https://vignette.wikia.    nocookie.net/unturned-bunker/images/2/28/ICON-Vehicle.png/revision/latest?cb=20150419052215';

    const updateInfoWindowToggle = () => {
        setInfoWindowToggle(!infoWindowToggle);
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function formatDate(timestamp: any) {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR');
    }

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Mapa
                    </Typography>
                    <Grid item xs={12} sx={{ height: '100%', marginBottom: 3, borderRadius: 4 }}>
                        <GoogleMapComponent apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} defaultCenter={{ lat: lat, lng: long }}>
                            <Marker position={{ lat: lat, lng: long }} onClick={updateInfoWindowToggle} />
                            {infoWindowToggle == true ? (
                                <InfoWindow position={{ lat, lng: long }} onCloseClick={updateInfoWindowToggle} options={{ maxWidth: 200 }}>
                                    <div style={{ color: 'black' }}>
                                        <h3>Velocidade</h3>
                                        <p>
                                            KM: <b>{vel}</b>
                                        </p>
                                        <p>
                                            Data/Hora: <b>{formatDate(timestamp)}</b>
                                        </p>
                                    </div>
                                </InfoWindow>
                            ) : (
                                <></>
                            )}
                            <Polygon
                                path={[
                                    { lat: 52.52549080781086, lng: 13.398118538856465 },
                                    { lat: 52.48578559055679, lng: 13.36653284549709 },
                                    { lat: 52.48871246221608, lng: 13.44618372440334 }
                                ]}
                            />
                        </GoogleMapComponent>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalMap;
