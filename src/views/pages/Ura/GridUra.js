import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { TablePaginationActions } from '../../../components/Pagination/TablePaginationActions';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import HomeWork from '@mui/icons-material/HomeWork';
import { MENU_OPEN } from 'store/actions';
import { destroy, get } from 'services/ura';
import { IconButton, Tooltip } from '@mui/material';
import Checklist from '@mui/icons-material/Checklist';
import BasicModal from 'components/Modal/BasicModal';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#c0c0c0',
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));
export default function GridUra() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const page = useSelector((state) => state.ura.page);
    const rowsPerPage = useSelector((state) => state.ura.rowsPerPage);
    const [uras, setUras] = React.useState([]);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idDestroy, setIdDestroy] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farms.total) : 0;
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_URA', payload: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_URA', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_URA', payload: 0 });
    };
    React.useEffect(() => {
        getAllUras();
    }, [page, rowsPerPage]);
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'uras');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'uras' });
        }
    }, []);
    function getAllUras() {
        get(page + 1, rowsPerPage).then((resp) => setUras(resp.data));
    }

    const handleOpenDestroy = (idDestroy) => {
        setIdDestroy(idDestroy);
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);

    const deleteById = () => {
        handleCloseModal();
        destroy(idDestroy)
            .then((resp) => {
                getAllUras();
                setError('');
                setSuccess(resp.data.success);
                setIdDestroy('');
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            })
            .catch((e) => {
                console.log(e);
                setSuccess('');
                setError(e.response.data.error);
                setTimeout(() => {
                    setError('');
                }, 4000);
            });
    };

    const handleUra = (row) => {
        console.log(row);
        const unit = row?.unidade;
        const family = row?.familia;
        const type_os = row?.tipo_os;
        const payload = JSON.parse(row?.payload);
        const firstDigit = payload?.type_ikey[0];

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_UNIT_USER', payload: unit?.id });
        dispatch({ type: 'SET_FAMILY_URA', payload: family ? {...family, label: family?.nome} : '' });
        dispatch({ type: 'SET_TYPEOS_URA', payload: type_os ? {...type_os, label: type_os?.nome } : ''});
        dispatch({ type: 'SET_ID_URA', payload: row.id});
        localStorage.setItem('unit', unit?.id);
        setTimeout(() => {
            dispatch({ type: 'SET_LOADING', payload: false });
            if(firstDigit == 4){
                navigate({ pathname: `/nova_proativa` })
            } else {
                navigate({ pathname: `/nova_corretiva` })
            }
        }, 500);
    }
   
    return (
        <>
            <BasicModal
                open={openModal}
                title="Excluir Registro"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja excluir o registro ?"
                onDelete={deleteById}
            />
            <TableContainer sx={{ mt: 2, height: '100%', padding: 3 }} component={Paper}>
                <h1
                    style={{
                        font: 'normal normal bold 35px/44px Myriad Pro',
                        letterSpacing: '0px',
                        color: 'var(--unnamed-color-015641)',
                        color: 'black',
                        opacity: 1,
                        padding: 15,
                        marginLeft: '2%'
                    }}
                >
                    <HomeWork /> URA
                </h1>
                <hr style={{ width: '95%', marginTop: 0 }}></hr>
                <h3
                    style={{
                        font: 'normal normal 300 18px/22px Myriad Pro',
                        letterSpacing: '0px',
                        color: 'black',
                        opacity: 1,
                        padding: 15,
                        marginLeft: '2%'
                    }}
                >
                    Gerencie suas ligaçoes
                </h3>
                {error || success ? (
                    <Snackbar open={true} autoHideDuration={6000}>
                        <Alert
                            severity={error ? 'error' : success ? 'success' : ''}
                            sx={{
                                width: '100%',
                                backgroundColor: error ? 'red' : success ? 'green' : 'orange',
                                color: '#FFF'
                            }}
                        >
                            {error ? error : success ? success : ''}
                        </Alert>
                    </Snackbar>
                ) : (
                    ''
                )}
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead style={{ backgroundColor: '#00008B' }}>
                        <TableRow>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Código</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Unidade</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Família</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Tipo OS</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Chave URA</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {uras.data &&
                            uras.data.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell style={{ color: 'black' }}>{row.id}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row?.unidade?.nome}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row?.familia?.nome}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row?.tipo_os?.nome}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>
                                        {row?.payload ? (
                                            // Verifica se o payload é válido e se "type_ikey" existe e tem um valor.
                                            JSON.parse(row.payload)?.project_ikey || 'Valor não disponível'
                                        ) : (
                                            'Valor não disponível'
                                        )}
                                    </StyledTableCell>
                                    <Tooltip title="Abrir Chamado">
                                        <IconButton onClick={() => handleUra(row)}>
                                            <Checklist />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton onClick={() => handleOpenDestroy(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                colSpan={3}
                                count={uras.total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'Registros por Página'
                                    },
                                    native: true
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
