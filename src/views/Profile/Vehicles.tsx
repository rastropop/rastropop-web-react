import React from 'react';
// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

// table data
function createData(placa: string, marca: string, cor: string, ano?: string, tipo?: string, ancoragem?: string, km?: string) {
    return { placa, marca, cor, ano, tipo, ancoragem, km };
}

const rows = [
    createData('OII2050', 'Volkswagen Up', 'PRETO', '2013/2014', 'Carro', 'ativo', '55281.19Km'),
    createData('ORR0100', 'Porche Panamera', 'PRETO', '', 'Carro', 'ativo', '55281.19Km'),
    createData('NUQ1I76', 'Volkswagen Fox', 'PRETO', '2018', 'Carro', 'Inativo', '55281.19Km'),
    createData('CARCELL', 'Yamaha XJ6', 'PRETO', '2013/2014', 'Moto', 'ativo', '55281.19Km'),
    createData('CARCELL', 'Yamaha XJ6', 'PRETO', '2013/2014', 'Moto', 'ativo', '55281.19Km'),
    createData('CARCELL', 'Yamaha XJ6', 'PRETO', '2013/2014', 'Moto', 'ativo', '55281.19Km'),
    createData('CARCELL', 'Yamaha XJ6', 'PRETO', '2013/2014', 'Moto', 'ativo', '55281.19Km'),
    createData('POT0H08', 'Toyota SW3', 'PRETO', '2015', 'Carro', 'inativo', '55281.19Km'),
    createData('POT0H08', 'Toyota SW3', 'PRETO', '2015', 'Carro', 'inativo', '55281.19Km'),
    createData('POT0H08', 'Toyota SW3', 'PRETO', '2015', 'Carro', 'inativo', '55281.19Km')
];

const vehicles = () => (
    <MainCard title="Meus Veículos" content={false}>
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
    </MainCard>
);

export default vehicles;
