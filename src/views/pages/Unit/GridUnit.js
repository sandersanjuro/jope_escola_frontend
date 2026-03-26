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
import { deleteFarm, getFarms, getResourceFarm } from 'services/farm';
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
import { deleteUnit, getUnits, getResourceUnit, generateQrUnit } from 'services/unit';
import Print from '@mui/icons-material/QrCode2';
import Loading from 'components/Loading/Loading';
import MainCard from 'ui-component/cards/MainCard';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#015641',
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
const initialOptions = {
    regs: []
};
export default function GridUnit() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const page = useSelector((state) => state.unit.page);
    const nameUnit = useSelector((state) => state.unit.nameUnit);
    const idReg = useSelector((state) => state.unit.idReg);
    const rowsPerPage = useSelector((state) => state.unit.rowsPerPage);
    const [units, setUnits] = React.useState([]);
    const [options, setOptions] = React.useState(initialOptions);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idDestroyUnit, setIdDestroyUnit] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalFilter, setOpenModalFilter] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleOpenDestroy = (idDestroy) => {
        setIdDestroyUnit(idDestroy);
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalFilter = () => setOpenModalFilter(false);
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farms.total) : 0;
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_UNIT', payload: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_UNIT', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_UNIT', payload: 0 });
    };
    React.useEffect(() => {
        getAllUnits();
    }, [page, rowsPerPage]);
    React.useEffect(() => {
        getResoucesFilters();
    }, []);
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'unidades');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'unidades' });
        }
    }, []);
    function getResoucesFilters() {
        getResourceUnit().then((resp) => setOptions(resp.data));
    }
    function getAllUnits(nameUnitAttr, idRegAttr) {
        let nameUnitFilter = nameUnitAttr === '' ? nameUnitAttr : nameUnit;
        let idRegFilter = idRegAttr === '' ? idRegAttr : idReg;
        getUnits(page + 1, rowsPerPage, nameUnitFilter, idRegFilter).then((resp) => setUnits(resp.data));
    }
    const deleteUnitById = () => {
        handleCloseModal();
        deleteUnit(idDestroyUnit)
            .then((resp) => {
                getAllUnits();
                setError('');
                setSuccess(resp.data.success);
                setIdDestroyUnit('');
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
        { icon: withLink('/nova_unidade', <PersonAdd />), name: 'Nova Unidade' },
        { icon: withLink('#/', <FilterIcon />), name: 'Filtros', operation: 'filtros' }
    ];

    const handleQr = (unit) => {
        setLoading(true);
        generateQrUnit(unit?.id).then((resp) => {
            let blob = new Blob([resp.data], { type: 'application/pdf' });
            let link = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = `${unit?.nameUnit}.pdf`;
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setLoading(false);
            setSuccess('QrCode gerado com sucesso.');
            setTimeout(() => {
                setSuccess('');
            }, 2000);
        });
    };
    return (
        <>
            <BasicModal
                open={openModal}
                title="Excluir Unidade"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja excluir a unidade ?"
                onDelete={deleteUnitById}
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
                                    id="outlined-flow"
                                    type="text"
                                    label="Nome da Unidade"
                                    value={nameUnit}
                                    onChange={(e) => dispatch({ type: 'SET_NAMEUNIT_UNIT_FILTER', payload: e.target.value })}
                                    name="flow"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Regional"
                                    id="regional"
                                    type="text"
                                    name="regional"
                                    value={idReg}
                                    onChange={(e) => dispatch({ type: 'SET_IDREG_UNIT_FILTER', payload: e.target.value })}
                                >
                                    {options.regs.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                                dispatch({ type: 'SET_CLEAR_UNIT_FILTER' }),
                                                setOpenModalFilter(false),
                                                getAllUnits('', '')
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
                                            onClick={(e) => [getAllUnits(), setOpenModalFilter(false)]}
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
                    <HomeWork /> Unidades
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
                    Gerencie suas unidades
                </h3>
                {loading && (
                    <Grid container alignItems="center" justifyContent="center">
                        <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loading color="#015641" type="cubes" />
                        </MainCard>
                    </Grid>
                )}
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
                <Table style={{ display: loading ? 'none' : '' }} sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead style={{ backgroundColor: '#00008B' }}>
                        <TableRow>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Nome</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Regional</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {units.data &&
                            units.data.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell style={{ color: 'black' }}>{row.nameUnit}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.nameReg}</StyledTableCell>
                                    <Tooltip title="Visualizar">
                                        <IconButton onClick={() => navigate({ pathname: `/unidade/${row.id}/view` })}>
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => navigate({ pathname: `/unidade/${row.id}/edit` })}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton onClick={() => handleOpenDestroy(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Qrcode">
                                        <IconButton onClick={() => handleQr(row)}>
                                            <Print />
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
                                count={units.total}
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
