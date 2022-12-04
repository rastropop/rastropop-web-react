import React, { SetStateAction, useEffect, useState } from 'react';
// material-ui
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { getAllVehicles } from 'services/vehicle';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

const Vehicles = () => {
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const vehicles = await getAllVehicles();
            setRows(vehicles);
        })();
    }, []);

    return (
        <MainCard title="Meus Veículos" content={false}>
            <>
                {rows.length != 0 ? (
                    <PerfectScrollbar style={{ height: 440, padding: 0 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            Placa
                                        </TableCell>
                                        <TableCell align="center">Marca/Modelo</TableCell>
                                        <TableCell align="center">Cor</TableCell>
                                        <TableCell align="center">Ano</TableCell>
                                        <TableCell align="center">Tipo</TableCell>
                                        <TableCell align="center">Ancoragem</TableCell>
                                        <TableCell align="center">Km Atual</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell align="center">{row.placa}</TableCell>
                                            <TableCell align="center">{row.marca}</TableCell>
                                            <TableCell align="center">{row.cor}</TableCell>
                                            <TableCell align="center">{row.ano}</TableCell>
                                            <TableCell align="center">{row.tipo}</TableCell>
                                            <TableCell align="center">{row.ancoragem}</TableCell>
                                            <TableCell align="center">{row.km}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </PerfectScrollbar>
                ) : (
                    <Grid container alignItems="center" justifyContent="center" sx={{ p: 2 }}>
                        <CircularProgress />
                    </Grid>
                )}
            </>
        </MainCard>
    );
};

export default Vehicles;
