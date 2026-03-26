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
import BalanceIcon from '@mui/icons-material/Balance';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HomeWork from '@mui/icons-material/HomeWork';
import { MENU_OPEN } from 'store/actions';
import ModalFilter from 'components/Modal/ModalFilter';
import { deleteColeta, getColetaPerId, getColetas, getExcel } from 'services/coleta';
import { getBrlFormatDate } from 'utils/date';
import { getItens } from 'services/item';
import NumberFormat from 'react-number-format';
import MoreVertIcon from '@mui/icons-material/Add';
import { pesoColeta } from 'services/coleta';
import { postItemColeta } from 'services/item_coleta';
import Returned from '@mui/icons-material/AssignmentReturned';
import { getAllUsers } from 'services/users';
import { Autocomplete } from '@mui/material';

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
export default function GridColeta() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const page = useSelector((state) => state.coleta.page);
    const nameFamily = useSelector((state) => state.coleta.nameFamily);
    const rowsPerPage = useSelector((state) => state.coleta.rowsPerPage);
    const idUnit = useSelector((state) => state.user.unit || '');
    const [coletas, setColetas] = React.useState([]);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idDestroyColeta, setIdDestroyColeta] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalFilter, setOpenModalFilter] = React.useState(false);
    const [pesoTotal, setPesoTotal] = React.useState('');
    const [openModalDevolucao, setOpenModalDevolucao] = React.useState(false);
    const [itens, setItens] = React.useState([]);
    const [idIten, setIdIten] = React.useState('');
    const [peso, setPeso] = React.useState('');
    const [itensSend, setItensSend] = React.useState([])
    const [idSelected, setIdSelected] = React.useState('');
    const [itemSelected, setItemSelected] = React.useState('');
    const [drivers, setDrivers] = React.useState([]);
    const driver_id = useSelector((state) => state.coleta.driver_id);
    const initialDate = useSelector((state) => state.coleta.initialDate);
    const finalDate = useSelector((state) => state.coleta.finalDate);
    const handleOpenDestroy = (idDestroy) => {
        setIdDestroyColeta(idDestroy);
        setOpenModal(true);
    };
    const handleCloseModal = (event, reason) => {
        if (reason && reason === 'backdropClick') return;
        setOpenModal(false);
    };
    const handleCloseModalFilter = (event, reason) => {
        if (reason && reason === 'backdropClick') return;
        setOpenModalFilter(false);
        setPesoTotal('');
    };
    const handleCloseModalDevolucao = (event, reason) => {
        if (reason && reason === 'backdropClick') return;
        setOpenModalDevolucao(false);
        setItensSend([]);
        setIdIten('');
        setPeso('');
        getAllItens();
    };
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farms.total) : 0;
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_COLETA', payload: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_COLETA', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_COLETA', payload: 0 });
    };
    React.useEffect(() => {
        getDrivers();
    }, []);
    React.useEffect(() => {
        getAllItens();
    }, []);
    React.useEffect(() => {
        getAllColetas();
    }, [page, rowsPerPage]);
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'coletas');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'coletas' });
        }
    }, []);
    function getAllColetas(driver_attr, initial, final) {
        let driverFilter = driver_attr === '' ? driver_attr : driver_id?.id;
        let initialFilter = initial === '' ? initial : initialDate;
        let finalFilter = final === '' ? final : finalDate;
        getColetas(page + 1, rowsPerPage, idUnit, driverFilter, initialFilter, finalFilter).then((resp) => setColetas(resp.data));
    }
    function getAllItens() {
        getItens().then((resp) => {
            setItens(resp.data.data)
            setItensSend(resp.data.data.map((desc) => ({
                id: desc.id,
                peso: 0
            })))
        });
    }
    const deleteColetaById = () => {
        handleCloseModal();
        deleteColeta(idDestroyColeta)
            .then((resp) => {
                getAllColetas();
                setError('');
                setSuccess(resp.data.success);
                setIdDestroyColeta('');
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
    const handleItens = () => {
        let filter = itensSend.find((desc) => parseInt(desc.id) === parseInt(idIten));
        if(filter){
            return [
                setError('Item já selecionado'),
                setTimeout(() => {
                    setError('');
                }, 2000)
            ];
        }
        const data = {
            id: idIten,
            peso: peso
        };
        setItensSend([...itensSend, data]);
        setIdIten('');
        setPeso('');
    }

    const handleDeleteItensSend = (id) => {
        setItensSend(itensSend.filter((desc) => parseInt(desc.id) !== parseInt(id)));
    };

    const handleSendItens = () => {
        try {
            // Verifica se há itens para enviar
            if (itensSend.length <= 0) {
                setError('Adicione itens para o envio');
                
                // Limpa a mensagem de erro após 2 segundos
                setTimeout(() => {
                    setError('');
                }, 2000);
    
                return; // Sai da função se não houver itens
            }
    
            // Converte os dados, garantindo que peso é uma string antes de substituir
            const data = itensSend.map((desc) => ({
                ...desc,
                peso: String(desc.peso).replace(',', '.')
            }));
            const payload = {
                data: data,
                coleta_id: idSelected
            }
            
            postItemColeta(payload)
                .then((resp) => {
                    setOpenModalDevolucao(false);
                    getAllColetas();
                    setError('');
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                })
            // Aqui você pode adicionar o código para enviar os dados para um servidor, etc.
            
        } catch (e) {
            console.log(e);
            setSuccess('');
            setError(e.response.data.error);
            setTimeout(() => {
                setError('');
            }, 4000);
        }
    };

    const handleSendPesoTotal = () => {
        try{
            const data = {
                peso_coleta: pesoTotal.replace(",", ".")
            }
            pesoColeta(idSelected, data)
                .then((resp) => {
                    setOpenModalFilter(false);
                    setSuccess(resp.data.success);
                    getAllColetas();
                    setError('');
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                })
        }catch(e){
            setError(e.response.data.error);
        }
    }

    const handleOpenModalFilter = (id) => {
        setIdSelected(id);
        getColetaPerId(id)
            .then((resp) => setPesoTotal(resp.data.data.peso_coleta))
        setOpenModalFilter(true);
    }

    const handleOpenModalDevolucao = (item) => {
        setIdSelected(item.id);
        getColetaPerId(item.id)
            .then((resp) => {
                setItemSelected(resp.data.data);
                if(resp.data.data.item_coleta.length > 0){
                    setItensSend(resp.data.data.item_coleta.map((desc) => ({id: desc.item_id, peso: desc.peso})))
                }
            })
        setOpenModalDevolucao(true);
    }

    const handleChangePeso = (e) => {
        const id = e.target.id;
        // const newValue = e.target.value;
        const newValue = e.target.value.trim(); // Remove espaços em branco

        // Define `newValue` como `0` se estiver vazio
        const normalizedValue = newValue === '' ? '0' : newValue;
    
        // Cria uma nova instância do array com o item atualizado
        const updatedItens = itensSend.map((desc) => {
            if (desc.id == id) {
                return { ...desc, peso: normalizedValue }; // Cria uma nova instância do objeto com a propriedade atualizada
            }
            return desc; // Retorna o item original se não corresponder ao id
        });
    
        // Atualiza o estado com o novo array
        setItensSend(updatedItens);
    
        console.log(updatedItens);
    };
    function getDrivers(){
        let qtdPerPage = '';
        let pageFilter = '';
        let perfil_id = 8;
        getAllUsers(qtdPerPage, pageFilter, perfil_id).then((resp) => setDrivers(resp.data.data.map((desc) => ({id: desc.id, label: desc.nome}))));
    }
    const download = () => {
        try {
            let qtdPerPage = '';
            let pageFilter = '';
            let driverFilter = driver_id ? driver_id?.id : '';
            getExcel(qtdPerPage, pageFilter, idUnit, driverFilter, initialDate, finalDate).then((resp) => {
                let blob = new Blob([resp.data], { type: 'application/vnd.ms-excel' });
                let link = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.download = 'file.xlsx';
                a.href = link;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setSuccess('Logs gerados com sucesso.');
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <BasicModal
                open={openModal}
                title="Excluir Familia"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja excluir a Família ?"
                onDelete={deleteColetaById}
            />
            <ModalFilter
                open={openModalFilter}
                title="Peso Total"
                handleClose={handleCloseModalFilter}
                content={
                    <>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <NumberFormat
                                    fullWidth
                                    id="outlined-pesoTotal"
                                    type="text"
                                    label="Peso Total"
                                    value={pesoTotal}
                                    onChange={(e) => setPesoTotal(e.target.value)}
                                    allowNegative={false}
                                    decimalScale={3}
                                    decimalSeparator=","
                                    fixedDecimalScale={true}
                                    name="pesoTotal"
                                    customInput={TextField}
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
                                                setOpenModalFilter(false),
                                            ]}
                                        >
                                            Cancelar
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
                                            onClick={() => handleSendPesoTotal()}
                                        >
                                            Salvar
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                }
            />
            <ModalFilter
                width="60%"
                open={openModalDevolucao}
                title="Devolução"
                handleClose={handleCloseModalDevolucao}
                content={
                    <>
                        <hr></hr>
                        <h3>Itens de Devolução</h3>
                        {
                            itensSend.map((desc) => (
                                <Grid container spacing={matchDownSM ? 0 : 2} key={desc.id}>
                                    <Grid item xs={5} sm={5} sx={{ marginTop: 3 }}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Itens do Enxoval"
                                            id="idItens"
                                            type="text"
                                            name="idItens"
                                            value={desc.id}
                                            disabled={true}
                                        >
                                            {itens.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.nome}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={5} sm={5} sx={{ marginTop: 3 }}>
                                        <NumberFormat
                                            fullWidth
                                            id={desc.id}
                                            type="text"
                                            label="Peças"
                                            value={desc.peso}
                                            allowNegative={false}
                                            name="peso"
                                            customInput={TextField}
                                            onChange={(e) => handleChangePeso(e)}
                                            disabled={itemSelected.data_devolucao ? true : false}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} sm={1} sx={{ marginTop: 4 }}>
                                        <IconButton aria-label="remover" onClick={() => handleDeleteItensSend(desc.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid> */}
                                </Grid>
                            ))
                        }
                        <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3 }}>
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
                                            onClick={handleCloseModalDevolucao}
                                        >
                                            Cancelar
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
                                            onClick={handleSendItens}
                                        >
                                            Salvar
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
                    <HomeWork /> Coletas
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
                    Gerencie suas coletas
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
                <div style={{ display: 'block' }}>
                    <Grid container spacing={2} alignItems="left" justifyContent="left">
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <Autocomplete
                                fullWidth
                                select
                                label="Motoristas"
                                id="driver"
                                type="text"
                                value={driver_id || ''}
                                name="driver"
                                onChange={(e, newValue) =>
                                    dispatch({
                                        type: 'SET_IDDRIVER_FILTER',
                                        payload: newValue == null ? '' : newValue,
                                    })
                                }
                                options={drivers}
                                renderInput={(params) => (
                                    <TextField {...params} label="Motoristas" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <TextField
                                fullWidth
                                id="outlined-initialDate"
                                type="date"
                                label="Data Início Criação"
                                value={initialDate}
                                onChange={(e) =>
                                dispatch({
                                    type: 'SET_INITIALDATE_COLETA_FILTER',
                                    payload: e.target.value,
                                })
                                }
                                name="initialDate"
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <TextField
                                fullWidth
                                id="outlined-finalDate"
                                type="date"
                                label="Data Fim Criação"
                                value={finalDate}
                                onChange={(e) =>
                                dispatch({
                                    type: 'SET_FINALDATE_COLETA_FILTER',
                                    payload: e.target.value,
                                })
                                }
                                name="finalDate"
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="right" justifyContent="right" sx={{ marginBottom: 4 }}>
                        <Grid item xs={6} sm={1} sx={{ marginTop: -6 }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => getAllColetas()}
                                >
                                    Buscar
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item xs={6} sm={1} sx={{ marginTop: -6 }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={(e) => [
                                        dispatch({
                                            type: 'SET_CLEAR_COLETA_FILTER'
                                        }),
                                        getAllColetas('', '', ''),
                                    ]}
                                >
                                    Limpar
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item xs={6} sm={1} sx={{ marginTop: -6 }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={download}
                                >
                                    Exportar
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </div>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead style={{ backgroundColor: '#00008B' }}>
                        <TableRow>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Unidade</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Responsável</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Peso</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Data Coleta</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Data Devolução</StyledTableCell>
                            <StyledTableCell style={{ backgroundColor: '#c0c0c0', color: 'black' }}>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coletas.data &&
                            coletas.data.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell style={{ color: 'black' }}>{row.unidade}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.usuario}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.peso_coleta}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{getBrlFormatDate(row.data_coleta)}</StyledTableCell>
                                    <StyledTableCell style={{ color: 'black' }}>{row.data_devolucao && getBrlFormatDate(row.data_devolucao)}</StyledTableCell>
                                    <Tooltip title="Peso Total">
                                        <IconButton onClick={() => handleOpenModalFilter(row.id)}>
                                            <BalanceIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Devolução">
                                        <IconButton onClick={() => handleOpenModalDevolucao(row)}>
                                            <Returned />
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
                                count={coletas.total}
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
            {/* <SpeedDial
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
            </SpeedDial> */}
        </>
    );
}
