/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Clients.module.css';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Container from '@mui/material/Container';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Button from '@mui/material/Button';

import { useSnackbar } from 'react-simple-snackbar';

import { deleteClient } from '../../redux/actions/client';

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{
            flexShrink: 0,
            marginLeft: 2.5,
        }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const Clients = ({ setOpen, setCurrentId, clients }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(clients.length);
    // eslint-disable-next-line 
    const [openSnackbar, closeSnackbar] = useSnackbar();

    const dispatch = useDispatch();
    const rows = clients;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows?.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (selectedInvoice) => {
        setOpen((prevState) => !prevState);
        setCurrentId(selectedInvoice);
    };

    const tableStyle = { width: 160, fontSize: 14, cursor: 'pointer', borderBottom: 'none', padding: '8px', textAlign: 'center' };
    const headerStyle = { borderBottom: 'none', textAlign: 'center' };

    return (
        <div className={styles.pageLayout}>
            <Container style={{ width: '85%' }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ ...headerStyle, width: '10px' }}>Number</TableCell>
                                <TableCell style={headerStyle}>Name</TableCell>
                                <TableCell style={headerStyle}>Email</TableCell>
                                <TableCell style={headerStyle}>Phone</TableCell>
                                <TableCell style={headerStyle}>Edit</TableCell>
                                <TableCell style={headerStyle}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows
                                
                            ).map((row, index) => (
                                <TableRow key={row._id} styel={{ cursor: 'pointer' }}>
                                    <TableCell style={{ ...tableStyle, width: '10px' }}>{index + 1}</TableCell>
                                    <TableCell style={tableStyle} scope="row" >
                                        <Button style={{ textTransform: 'none' }} > {row.name} </Button>
                                    </TableCell>
                                    <TableCell style={tableStyle}>{row.email}</TableCell>
                                    <TableCell style={tableStyle}>{row.tel}</TableCell>
                                    <TableCell style={{ ...tableStyle, width: '10px' }}>
                                        <IconButton onClick={() => handleEdit(row._id)}>
                                            <BorderColorIcon style={{ width: '20px', height: '20px' }} />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{ ...tableStyle, width: '10px' }}>
                                        <IconButton onClick={() => dispatch(deleteClient(row._id, openSnackbar))}>
                                            <DeleteOutlineRoundedIcon style={{ width: '20px', height: '20px' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]
                                    }
                                    colSpan={6}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default Clients;
