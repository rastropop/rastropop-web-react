/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
// material-ui
import {
    Button,
    Checkbox,
    Grid,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getTrackingPoints } from 'services/tracker';
import GoogleMapComponent from './GoogleMap';
import { useTheme } from '@mui/material/styles';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import { Autocomplete, InfoWindow, Marker, Polygon, Polyline } from '@react-google-maps/api';
import logo from '../../assets/images/logo_rastro_subtitle.png';
import { callUpdateZonesToApplyChanges, getAddressByLatLng } from 'utils/axios';

import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DeleteIcon from '@mui/icons-material/Delete';

// project imports
import InputsAndFilter from './InputsAndFilter';
import { duration } from 'moment';
import { auth, fireStore, fireStoreBatch, fireStoreFieldValue } from 'services/firebase';
import ModalCreateZone from './ModalCreateZone';
import { createSecurityArea, editSecurityArea, getAllSecurityAreas } from 'services/security_areas';
import ModalEditZone from './ModalEditZoneVehicles';
import ModalDeleteZone from './ModalDeleteZone';

const InterestZones = () => {
    const [map, setMap] = useState<any>();
    const [securityAreas, setSecurityAreas] = useState<any[]>([]);
    const [securityAreasToggle, setSecurityAreasToggle] = useState<boolean[]>([]);
    const [autocompleteValue, setAutocompleteValue] = useState<Array<string>>([]);
    const mapComponentRef = useRef(null);

    // To Create
    const [isChecked, setIsChecked] = useState(false);
    const [paths, setPaths] = useState<any[]>([]);
    const [newPolygon, setNewPolygon] = useState<any>();
    const [nameZoneValue, setNameZoneValue] = useState<string>('');
    const [zoneModel, setZoneModel] = useState<any>();
    const [willCreateSecurityArea, setWillCreateSecurityArea] = useState<boolean>(false);
    const [modalToCreate, setModalToCreate] = useState<boolean>(false);

    // To Edit
    const [myPolygons, setMyPolygons] = useState<any[]>([]);
    const [securityAreaIdToEdit, setSecurityAreaIdToEdit] = useState<string | null>(null);
    const [securityAreaToEditVehicle, setSecurityAreaToEditVehicle] = useState<any>();
    const [modalToEditVehicles, setModalToEditVehicles] = useState<boolean>(false);

    // To Delete
    const [securityAreaToDelete, setSecurityAreaToDelete] = useState<string>();
    const [modalToDeleteZone, setModalToDeleteZone] = useState<boolean>(false);

    const myPolygonsOptions = {
        fillOpacity: 0.1,
        strokeColor: '#5A35B4',
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1
    };

    useEffect(() => {
        populateTable();
    }, []);

    useEffect(() => {
        const docId = securityAreaIdToEdit;

        // Create new Security Area
        if (!docId && willCreateSecurityArea) {
            (async () => {
                // Get a new write batch
                const batchCreation = fireStoreBatch;
                try {
                    const docRef = await createSecurityArea(zoneModel);
                    toast.success('Zona criada com sucesso!', {
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
                        // eslint-disable-next-line guard-for-in
                        for (const key in zoneModel.assignedTrackers) {
                            batchCreation.update(fireStore.collection('trackers').doc(zoneModel.assignedTrackers[key]), {
                                // @ts-ignore
                                assigned_zones: fireStoreFieldValue.arrayUnion(docRef.id)
                            });
                        }
                        // Commit the batch
                        batchCreation.commit();
                        setModalToCreate(false);
                    } catch (e) {
                        toast.error('Erro ao atualizar rastreador!', {
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
                } catch (e) {
                    toast.error('Erro ao criar zona!', {
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
                clearZone();
                setWillCreateSecurityArea(false);

                await Promise.resolve().then(() => {
                    window.location.reload();
                });
            })();
        }

        // Update Security Area
        if (docId && willCreateSecurityArea) {
            (async () => {
                try {
                    await editSecurityArea(zoneModel, docId);
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
                    toast.success('Zona editada com sucesso!', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored'
                    });

                    clearZone();
                    setWillCreateSecurityArea(false);

                    await Promise.resolve().then(() => {
                        window.location.reload();
                    });
                } catch (e) {
                    toast.error('Erro ao editar zona!', {
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
            })();
        }
    }, [zoneModel]);

    useEffect(() => {
        if (securityAreasToggle.length != 0 && securityAreasToggle.length == myPolygons.length) {
            // Update SecurityAreasToggle to false to don't show zones in map
            let securityAreasToggleArray = securityAreasToggle;
            securityAreasToggleArray = securityAreasToggleArray.map(() => false);
            setSecurityAreasToggle(securityAreasToggleArray);
        }
    }, [myPolygons]);

    useEffect(() => {
        if (isChecked) {
            let securityAreasToggleArray = securityAreasToggle;
            securityAreasToggleArray = securityAreasToggleArray.map(() => true);
            setSecurityAreasToggle(securityAreasToggleArray);
        } else {
            let securityAreasToggleArray = securityAreasToggle;
            securityAreasToggleArray = securityAreasToggleArray.map(() => false);
            setSecurityAreasToggle(securityAreasToggleArray);
        }
    }, [isChecked]);

    const populateTable = () => {
        (async () => {
            const securityAreasFormated = await getAllSecurityAreas();
            const securityAreasToggleArray: boolean[] = [];
            securityAreasFormated.forEach((zone: any) => {
                zone.numberVehicles = zone.assigned_trackers.length;
                securityAreasToggleArray.push(true);
            });
            setSecurityAreas(securityAreasFormated);
            // SecurityAreasToggle with true, to render on map and call OnLoad function
            setSecurityAreasToggle(securityAreasToggleArray);
        })();
    };

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };

    const handleOpen = () => {
        if (nameZoneValue == '') {
            toast.warn('Verifique o nome da zona!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return;
        }
        if (paths.length == 0) {
            toast.warn('Adicione a zona através da barra de pesquisa do maps!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return;
        }
        setModalToCreate(true);
    };

    const updateZoneModel = async () => {
        if (newPolygon) {
            setWillCreateSecurityArea(true);
            let referencePolygonPaths = newPolygon.getPaths().getArray()[0].g;
            referencePolygonPaths = referencePolygonPaths.map((element: any) => ({ lat: element.lat(), lng: element.lng() }));
            const newZoneModelValue = {
                ...zoneModel,
                zoneName: nameZoneValue,
                polygonPaths: referencePolygonPaths,
                assignedTrackers: autocompleteValue.length != 0 ? autocompleteValue : []
            };
            setZoneModel(newZoneModelValue); // Will call useEffect to create security_area in database
        }
    };

    const clearZone = () => {
        setSecurityAreaIdToEdit(null);
        setNameZoneValue('');
        setZoneModel(undefined);
        setPaths([]);
    };

    // Actions table

    // To View Zone In Map
    const focusOnTheZone = (polygon: any, index: number) => {
        const bounds = new google.maps.LatLngBounds();
        let i;

        let securityAreasToggleArray = securityAreasToggle;
        securityAreasToggleArray = securityAreasToggleArray.map((zoneToggle) => false);
        securityAreasToggleArray[index] = true;
        setSecurityAreasToggle(securityAreasToggleArray);

        // eslint-disable-next-line no-plusplus
        for (i = 0; i < polygon.getPath().length; i++) {
            bounds.extend({ lat: polygon.getPath().g[i].lat(), lng: polygon.getPath().g[i].lng() });
        }

        map.setCenter({ lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() });
        map.setZoom(17);

        if (mapComponentRef.current) {
            const mapComponent = mapComponentRef.current as HTMLElement;
            const mapComponentPositionY = mapComponent.getBoundingClientRect().top;
            window.scrollTo(0, mapComponentPositionY);
        }
    };
    // To Edit Zone
    const editZone = async (polygon: any, index: number) => {
        // Update SecurityAreasToggle to false to don't show zones in map
        let securityAreasToggleArray = securityAreasToggle;
        securityAreasToggleArray = securityAreasToggleArray.map(() => false);
        setSecurityAreasToggle(securityAreasToggleArray);
        // -- --

        setSecurityAreaIdToEdit(securityAreas[index].id);
        setNameZoneValue(securityAreas[index].name);
        setPaths(securityAreas[index].polygonPaths);

        const bounds = new google.maps.LatLngBounds();
        let i;
        // eslint-disable-next-line no-plusplus
        for (i = 0; i < polygon.getPath().length; i++) {
            bounds.extend({ lat: polygon.getPath().g[i].lat(), lng: polygon.getPath().g[i].lng() });
        }

        const { data } = await getAddressByLatLng(bounds.getCenter().lat(), bounds.getCenter().lng());
        const addressFormated = data.results[0].formatted_address;
        setZoneModel({ ...zoneModel, zoneAddress: addressFormated });

        map.setCenter({ lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() });
        map.setZoom(17);

        if (mapComponentRef.current) {
            const mapComponent = mapComponentRef.current as HTMLElement;
            const mapComponentPositionY = mapComponent.getBoundingClientRect().top;
            window.scrollTo(0, mapComponentPositionY);
        }
    };
    // To Edit Vehicles
    const editVehiclesZone = (polygon: any, index: number) => {
        setSecurityAreaToEditVehicle({ ...securityAreas[index] });
    };

    useEffect(() => {
        if (securityAreaToEditVehicle) {
            setAutocompleteValue(securityAreaToEditVehicle?.assigned_trackers);
            setModalToEditVehicles(true);
        }
    }, [securityAreaToEditVehicle]);

    // To Delete Zone
    const deleteZone = (polygon: any, index: number) => {
        setSecurityAreaToDelete({ ...securityAreas[index] });
    };
    useEffect(() => {
        if (securityAreaToDelete) {
            setModalToDeleteZone(true);
        }
    }, [securityAreaToDelete]);

    return (
        <>
            <h2>Minhas zonas</h2>
            <Grid container sx={{ borderTop: 'solid 5px #5A35B4', marginBottom: 4, borderRadius: 4 }}>
                <Grid container xs={12}>
                    <TableContainer component={Paper} sx={{ width: '100%', marginBottom: 1 }}>
                        <Table sx={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nome</TableCell>
                                    <TableCell align="center">Endereço</TableCell>
                                    <TableCell align="center">Qtde. veículos monitorados</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {securityAreas?.map((dataObj, index) => (
                                    <TableRow>
                                        <TableCell align="center">{dataObj.name}</TableCell>
                                        <TableCell align="center">{dataObj.address}</TableCell>
                                        <TableCell align="center">{dataObj.assigned_trackers.length}</TableCell>
                                        <TableCell align="center">
                                            <span onClick={() => focusOnTheZone(myPolygons[index], index)} title="Visualizar zona no mapa">
                                                <ZoomInMapIcon
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#9ba8d9',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                />{' '}
                                            </span>
                                            <span onClick={() => editZone(myPolygons[index], index)} title="Editar zona">
                                                <EditIcon
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#9ba8d9',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                />{' '}
                                            </span>
                                            <span
                                                onClick={() => editVehiclesZone(myPolygons[index], index)}
                                                title="Editar veículos monitorados"
                                            >
                                                <DirectionsCarFilledIcon
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#9ba8d9',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                />{' '}
                                            </span>
                                            <span onClick={() => deleteZone(myPolygons[index], index)} title="Deletar zona">
                                                <DeleteIcon
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#9ba8d9',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                />{' '}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <span>
                        IMPORTANTE! Os valores apresentados são aproximados e com base nos dados enviados pelo equipamento, podendo haver
                        divergência com a realidade.
                    </span>
                </Grid>
            </Grid>

            <Grid container xs={12}>
                <Grid item>
                    <h2 style={{ fontSize: '1.3em' }}>Para criar uma nova Zona:</h2>
                    <ul>
                        <li>
                            <p>
                                Preencha o campo abaixo com o <b>nome da nova Zona</b>
                            </p>
                        </li>
                        <li>
                            <p>
                                <b>Pesquise o endereço</b> no qual a Zona será criada no mapa (Pesquise nomes de ruas, locais ou coloque
                                coordenadas: lat,long)
                            </p>
                        </li>
                        <li>
                            <p>
                                <b>Arraste o componente</b> e crie a Zona que englobe a área desejada de acordo com a sua necessidade <br />
                                (Em alguns casos, como garagens cobertas, subsolos, ou outros ambientes que possam distorcer a leitura do
                                GPS,{' '}
                                <b>
                                    é recomendado criar Zonas um pouco maiores, para obter um melhor resultado e garantir que seja capturado
                                    a entrada/saída
                                </b>
                                )
                            </p>
                        </li>
                        <li>
                            <p>
                                Para finalizar o cadastro <b>clique em Adicionar Zona</b> e depois verifique os dados informados
                            </p>
                        </li>
                    </ul>
                </Grid>

                <br />
            </Grid>

            <ModalCreateZone
                open={modalToCreate}
                handleClose={() => setModalToCreate(false)}
                nameZoneValue={nameZoneValue}
                zoneModel={zoneModel}
                setZoneModel={setZoneModel}
                autocompleteValue={autocompleteValue}
                setAutocompleteValue={setAutocompleteValue}
                createZone={updateZoneModel}
            />

            <ModalEditZone
                open={modalToEditVehicles}
                handleClose={() => setModalToEditVehicles(false)}
                autocompleteValue={autocompleteValue}
                setAutocompleteValue={setAutocompleteValue}
                securityAreaToEditVehicle={securityAreaToEditVehicle}
            />

            <ModalDeleteZone
                open={modalToDeleteZone}
                handleClose={() => setModalToDeleteZone(false)}
                securityAreaToDelete={securityAreaToDelete}
            />

            <Grid container sx={{ height: 800 }}>
                <Grid item xs={12} sx={{ borderTop: 'solid 5 #5A35B4', borderRadius: 4 }}>
                    <Grid container justifyContent="space-between" xs={12} sx={{ marginBottom: 2 }}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                label="Nome da zona"
                                value={nameZoneValue}
                                onChange={(value: any) => setNameZoneValue(value.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ControlCameraIcon style={{ color: '#5A35B4' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <br />
                            <Grid container alignItems="center">
                                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                                <span>Ver Zonas salvas</span>
                            </Grid>
                        </Grid>

                        <Grid xs={3}>
                            <Button
                                sx={{ width: '100%', marginBottom: 1 }}
                                variant="outlined"
                                onClick={
                                    securityAreaIdToEdit
                                        ? () => {
                                              setWillCreateSecurityArea(true);
                                              let referencePolygonPaths = newPolygon.getPaths().getArray()[0].g;
                                              referencePolygonPaths = referencePolygonPaths.map((element: any) => ({
                                                  lat: element.lat(),
                                                  lng: element.lng()
                                              }));
                                              setZoneModel({
                                                  ...zoneModel,
                                                  zoneName: nameZoneValue,
                                                  polygonPaths: referencePolygonPaths
                                              });
                                          }
                                        : handleOpen
                                }
                            >
                                {securityAreaIdToEdit ? 'Editar zona' : 'Criar zona'}
                            </Button>
                            <Button sx={{ width: '100%' }} variant="outlined" color="error" onClick={clearZone}>
                                Limpar zona
                            </Button>
                        </Grid>
                    </Grid>

                    <span ref={mapComponentRef}>
                        <></>
                    </span>
                    <GoogleMapComponent
                        map={map}
                        setMap={setMap}
                        zoneModel={zoneModel}
                        setZoneModel={setZoneModel}
                        setPaths={setPaths}
                        paths={paths}
                        setPolygon={setNewPolygon}
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                    >
                        {securityAreas?.map((securityArea: any, index) => (
                            <>
                                {securityAreasToggle[index] == true ? (
                                    <>
                                        <Polygon
                                            onLoad={(element) => {
                                                setMyPolygons((prevPolygons) => [...prevPolygons, element]);
                                            }}
                                            paths={securityArea.polygonPaths}
                                            options={myPolygonsOptions}
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        ))}
                    </GoogleMapComponent>
                </Grid>
            </Grid>
        </>
    );
};

export default InterestZones;
