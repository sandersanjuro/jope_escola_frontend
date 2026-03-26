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
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AnimateButton from 'ui-component/extended/AnimateButton';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { TablePaginationActions } from '../../../components/Pagination/TablePaginationActions';
import { useDispatch, useSelector } from 'react-redux';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PersonAdd from '@mui/icons-material/PersonAdd';
import FilterIcon from '@mui/icons-material/FilterAlt';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import BasicModal from '../../../components/Modal/BasicModal';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HomeWork from '@mui/icons-material/HomeWork';
import { MENU_OPEN } from 'store/actions';
import ModalFilter from 'components/Modal/ModalFilter';
import { deleteTypeProblem, getTypeProblems } from 'services/typeProblem';

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
export default function GridTypeProblem() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const page = useSelector((state) => state.typeProblem.page);
    const nameTypeProblem = useSelector((state) => state.typeProblem.nameTypeProblem);
    const rowsPerPage = useSelector((state) => state.typeProblem.rowsPerPage);
    const [familys, setFamilys] = React.useState([]);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idDestroyTypeProblem, setIdDestroyTypeProblem] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalFilter, setOpenModalFilter] = React.useState(false);
    const handleOpenDestroy = (idDestroy) => {
        setIdDestroyTypeProblem(idDestroy);
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalFilter = () => setOpenModalFilter(false);
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farms.total) : 0;
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_TYPEPROBLEM', payload: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_TYPEPROBLEM', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_TYPEPROBLEM', payload: 0 });
    };
    React.useEffect(() => {
        getAllTypeProblems();
    }, [page, rowsPerPage]);
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'familias');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'familias' });
        }
    }, []);
    function getAllTypeProblems(nameTypeProblemAttr) {
        let nameTypeProblemFilter = nameTypeProblemAttr === '' ? nameTypeProblemAttr : nameTypeProblem;
        getTypeProblems(page + 1, rowsPerPage, nameTypeProblemFilter).then((resp) => setFamilys(resp.data));
    }
    const deleteTypeProblemById = () => {
        handleCloseModal();
        deleteTypeProblem(idDestroyTypeProblem)
            .then((resp) => {
                getAllTypeProblems();
                setError('');
                setSuccess(resp.data.success);
                setIdDestroyTypeProblem('');
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
    const actions = [
        { icon: withLink('/novo_tipo_problema', <PersonAdd />), name: 'Novo Problema' },
        { icon: withLink('#/', <FilterIcon />), name: 'Filtros', operation: 'filtros' }
    ];
    return (
        <>
            <BasicModal
                open={openModal}
                title="Excluir Problema"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja excluir o Problema ?"
                onDelete={deleteTypeProblemById}
            />
            <ModalFilter
                open={openModalFilter}
                title="Filtros"
                handleClose={handleCloseModalFilter}
                content={
                    <>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <TextField
                                    fullWidth
                                    id="outlined-nameTypeProblem"
                                    type="text"
                                    label="Nome do Problema"
                                    value={nameTypeProblem}
                                    onChange={(e) => dispatch({ type: 'SET_NAMETYPEPROBLEM_TYPEPROBLEM_FILTER', payload: e.target.value })}
                                    name="nameTypeProblem"
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                            <Grid item>
                                <Box sx={{ mt: 2, mr: 3 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="error"
                                            onClick={(e) => [
                                                dispatch({ type: 'SET_CLEAR_TYPEPROBLEM_FILTER' }),
                                                setOpenModalFilter(false),
                                                getAllTypeProblems('', '')
                                            ]}
                                        >
                                            Limpar Busca
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{ mt: 2, mr: 3 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth
                                            size="large"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => [getAllTypeProblems(), setOpenModalFilter(false)]}
                                        >
                                            Buscar
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                }
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
                    <HomeWork /> Problemas
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
                    Gerencie seus problemas
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
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Nome</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {familys.data &&
                            familys.data.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell style={{ color: 'black' }}>{row.nameTypeProblem}</StyledTableCell>
                                    <Tooltip title="Visualizar">
                                        <IconButton onClick={() => navigate({ pathname: `/tipo_problema/${row.id}/view` })}>
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => navigate({ pathname: `/tipo_problema/${row.id}/edit` })}>
                                            <EditIcon />
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
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                colSpan={3}
                                count={familys.total}
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
                                labelRowsPerPage="Registros por página:"
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <SpeedDial
                direction="left"
                ariaLabel="SpeedDial basic example"
                sx={{
                    position: 'absolute',
                    top: '90%',
                    position: 'fixed',
                    right: 50,
                    zIndex: theme.zIndex.speedDial
                }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={(e) => (action.operation === 'filtros' ? [e.stopPropagation(), setOpenModalFilter(true)] : '')}
                    />
                ))}
            </SpeedDial>
        </>
    );
}
