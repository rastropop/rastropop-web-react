import React, { SetStateAction, useEffect, useState } from 'react';
// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getAllVehicles } from 'services/vehicle';
import { getTrackerStateByDoc } from 'services/tracker';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

const Vehicles = () => {
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const vehicles = await getAllVehicles();
            console.log(vehicles);
            setRows(vehicles);
        })();
    }, []);

    return (
        <MainCard title="Meus Veículos" content={false}>
            <>
                <PerfectScrollbar style={{ height: 440, padding: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ pr: 3 }}>
                                        Placa
                                    </TableCell>
                                    <TableCell align="left">Marca/Modelo</TableCell>
                                    <TableCell align="left">Cor</TableCell>
                                    <TableCell align="left">Ano</TableCell>
                                    <TableCell align="left">Tipo</TableCell>
                                    <TableCell align="left">Ancoragem</TableCell>
                                    <TableCell align="left">Km Atual</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell align="left">{row.placa}</TableCell>
                                        <TableCell align="left">{row.marca}</TableCell>
                                        <TableCell align="left">{row.cor}</TableCell>
                                        <TableCell align="left">{row.ano}</TableCell>
                                        <TableCell align="left">{row.tipo}</TableCell>
                                        <TableCell align="left">{row.ancoragem}</TableCell>
                                        <TableCell align="left">{row.km}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </PerfectScrollbar>
            </>
        </MainCard>
    );
};

export default Vehicles;
