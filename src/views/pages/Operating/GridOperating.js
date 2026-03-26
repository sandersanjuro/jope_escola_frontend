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
import ConfigIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HomeWork from '@mui/icons-material/HomeWork';
import { MENU_OPEN } from 'store/actions';
import ModalFilter from 'components/Modal/ModalFilter';
import { deleteOperating, getOperatings, getResourceOperating, changeStatus, printerQr } from 'services/operating';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import { Checkbox } from '@mui/material';
import Print from '@mui/icons-material/Print';

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
    units: [],
    categorys: []
};
export default function GridOperating() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const checkboxRef = React.useRef();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const page = useSelector((state) => state.operating.page);
    const nameOperating = useSelector((state) => state.operating.nameOperating);
    const idUnit = useSelector((state) => state.user.unit || '');
    const unidade_modelo = useSelector((state) => state.user.unidade_modelo || 0);
    const idCategory = useSelector((state) => state.operating.idCategory);
    const rowsPerPage = useSelector((state) => state.operating.rowsPerPage);
    const [operatings, setOperatings] = React.useState([]);
    const [options, setOptions] = React.useState(initialOptions);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idDestroyOperating, setIdDestroyOperating] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalFilter, setOpenModalFilter] = React.useState(false);
    const [selectedQr, setSelectedQr] = React.useState([]);
    const [selected, setSelected] = React.useState('');
    const handleOpenDestroy = (idDestroy) => {
        setIdDestroyOperating(idDestroy);
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalFilter = () => setOpenModalFilter(false);
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farms.total) : 0;
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_OPERATING', payload: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_OPERATING', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_OPERATING', payload: 0 });
    };
    React.useEffect(() => {
        getAllOperatings();
    }, [page, rowsPerPage, idUnit]);
    React.useEffect(() => {
        getResoucesFilters();
    }, []);
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'ativos');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'ativos' });
        }
    }, []);
    function getResoucesFilters() {
        getResourceOperating().then((resp) => setOptions(resp.data));
    }
    function getAllOperatings(nameOperatingAttr, idUnitAttr, idCategoryAttr) {
        let nameUnitFilter = nameOperatingAttr === '' ? nameOperatingAttr : nameOperating;
        let idUnitFilter = idUnitAttr === '' ? idUnitAttr : idUnit;
        let idCategoryFilter = idCategoryAttr === '' ? idCategoryAttr : idCategory;
        getOperatings(page + 1, rowsPerPage, nameUnitFilter, idUnitFilter, idCategoryFilter).then((resp) => setOperatings(resp.data));
    }

    const changeStatusActive = (event) => {
        const id = event.target.id;
        changeStatus(id)
            .then((resp) => getAllOperatings())
            .catch((resp) => getAllOperatings());
    };

    const deleteOperatingById = () => {
        handleCloseModal();
        deleteOperating(idDestroyOperating)
            .then((resp) => {
                getAllOperatings();
                setError('');
                setSuccess(resp.data.success);
                setIdDestroyOperating('');
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
        // só adiciona Novo Ativo se unidade_modelo != 0
        ...(unidade_modelo !== 0
            ? [{ icon: withLink('/novo_ativo', <PersonAdd />), name: 'Novo Ativo' }]
            : []),
        { icon: withLink('#/', <FilterIcon />), name: 'Filtros', operation: 'filtros' }
    ];
    const handleChangeQr = (desc, value = false) => {
        console.log(checkboxRef);
        let arrayState = { ...selected, [desc.id]: selected[desc.id] ? !selected[desc.id] : true };
        if (arrayState[desc.id]) {
            setSelectedQr([...selectedQr, desc]);
        } else {
            setSelectedQr(selectedQr.filter((val) => val.id != desc.id));
        }
        setSelected(arrayState);
    };
    const handleChangePrint = () => {
        const data = {
            ativos: selectedQr.map((desc) => desc.id)
        };
        console.log(data);
        printerQr(data).then((resp) => {
            let blob = new Blob([resp.data], { type: 'application/pdf' });
            let link = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = 'file.pdf';
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setSuccess('Ativos gerados com sucesso.');
            setTimeout(() => {
                setSuccess('');
                setSelectedQr([]);
                setSelected(null);
            }, 2000);
        });
    };
    return (
        <>
            <BasicModal
                open={openModal}
                title="Excluir Ativo"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja excluir o ativo ?"
                onDelete={deleteOperatingById}
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
                                    label="Nome do Ativo"
                                    value={nameOperating}
                                    onChange={(e) => dispatch({ type: 'SET_NAME_OPERATING_FILTER', payload: e.target.value })}
                                    name="flow"
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Unidade"
                                    id="idUnit"
                                    type="text"
                                    name="idUnit"
                                    value={idUnit}
                                    onChange={(e) => dispatch({ type: 'SET_IDUNIT_OPERATING_FILTER', payload: e.target.value })}
                                >
                                    {options.units.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid> */}
                            <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Categoria"
                                    id="idCategory"
                                    type="text"
                                    name="idCategory"
                                    value={idCategory}
                                    onChange={(e) => dispatch({ type: 'SET_IDCATEGORY_OPERATING_FILTER', payload: e.target.value })}
                                >
                                    {options.categorys.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
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
                                                dispatch({ type: 'SET_CLEAR_OPERATING_FILTER' }),
                                                setOpenModalFilter(false),
                                                getAllOperatings('', '', '')
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
                                            onClick={(e) => [getAllOperatings(), setOpenModalFilter(false)]}
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
                    <HomeWork /> ATIVOS
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
                    Gerencie seus ativos
                </h3>
                {selectedQr.length > 0 && (
                    <Button onClick={handleChangePrint} variant="outlined" startIcon={<Print />}>
                        Imprimir
                    </Button>
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
                <Table sx={{ minWidth: 700, mt: 3 }} aria-label="customized table">
                    <TableHead style={{ backgroundColor: '#00008B' }}>
                        <TableRow>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Marcar</StyledTableCell>
                            {unidade_modelo == 1 && (
                                <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Status</StyledTableCell>
                            )}
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Nome</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Categoria</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Unidade</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Andar</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operatings.data &&
                            operatings.data.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell style={{ color: 'black' }}>
                                        <Checkbox
                                            ref={checkboxRef}
                                            checked={selected ? selected[row.id] : false}
                                            onChange={() => handleChangeQr(row)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </StyledTableCell>
                                    {unidade_modelo == 1 && (
                                        <StyledTableCell>
                                            <Toggle id={`${row.id}`} checked={row.ativo === 1 ? true : false} onChange={changeStatusActive} />
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell style={{ color: 'black' }}>{row.name}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.nameCategory}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.nameUnit}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.floor}</StyledTableCell>
                                    <Tooltip title="Manutenção">
                                        <IconButton onClick={() => navigate({ pathname: `/plano_manutencao/${row.id}` })}>
                                            <ConfigIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {unidade_modelo == 1 && (
                                        <>
                                            <Tooltip title="Visualizar">
                                                <IconButton onClick={() => navigate({ pathname: `/ativo/${row.id}/view` })}>
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton onClick={() => navigate({ pathname: `/ativo/${row.id}/edit` })}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => handleOpenDestroy(row.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </StyledTableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                colSpan={3}
                                count={operatings.total}
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
