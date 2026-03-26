// material-ui
import React from 'react';
import {
    Autocomplete,
    Button,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Snackbar,
    TextField,
    Checkbox,
    useMediaQuery,
    Box,
    Rating,
    Typography,
    FormControlLabel
} from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import { useDispatch, useSelector } from 'react-redux';
import { cancelTask, getResourceTask, getTasks, getTasksGerente, reopenTask } from 'services/task';
import Tasks from './Tasks';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useTheme, makeStyles } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { BrowserView, MobileView } from 'react-device-detect';
import ReportTask from './ReportTask';
import AddButton from 'components/Buttons/AddButton';
import Alert from '@mui/material/Alert';
import BasicModal from '../../../components/Modal/BasicModal';
import AnimateButton from 'ui-component/extended/AnimateButton';
import NumberFormat from 'react-number-format';
import ModalFilter from 'components/Modal/ModalFilter';
import { getSatisfactionQuestions } from 'services/surveySatisfactionQuestions';
import { postSatisfaction } from 'services/surveySatisfaction';
import { evaluations } from './Docs/docs';

// ==============================|| Index ||============================== //
const GridTaskManager = () => {
    const initialStateOptions = {
        typeOfEquipament: [],
        typeOfProblem: [],
        unit: [],
        typeOfOs: [],
        natureOfOperation: [],
        family: [],
        categories: [],
        statusOs: []
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        }
    };
    const theme = useTheme();
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const navigate = useNavigate();
    const path = window.location.pathname;
    const dispatch = useDispatch();
    const page = useSelector((state) => state.task.page);
    const rowsPerPage = useSelector((state) => state.task.rowsPerPage);
    const general = useSelector((state) => state.task.general);
    const initialDate = useSelector((state) => state.task.initialDate);
    const finalDate = useSelector((state) => state.task.finalDate);
    const idStatus = useSelector((state) => state.task.idStatus);
    const idUnit = useSelector((state) => state.user.unit || '');
    const idTypeOs = useSelector((state) => state.task.idTypeOs || '');
    const os = useSelector((state) => state.task.os || '');
    const objectStatus = useSelector((state) => state.task.objectStatus || []);
    const idNatureOfOperation = useSelector((state) => state.task.idNatureOfOperation || '');
    const moduleOs = 4;
    const modulePost = '/novo_chamado_gerente';
    const titleModule = 'OS GERENTE';
    const [tasks, setTasks] = React.useState([]);
    const [options, setOptions] = React.useState(initialStateOptions);
    const [filterAvanced, setFilterAvanced] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idCancelTask, setIdCancelTask] = React.useState('');
    const [idReopenTask, setIdReopenTask] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalEvaluation, setOpenModalEvaluation] = React.useState(false);
    const [openModalReopen, setOpenModalReopen] = React.useState(false);
    const [displayItem, setDisplayItem] = React.useState(screen.width < 768 ? true : false);
    const [loadingButton, setLoadingButton] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const [idTaskEvaluation, setIdTaskEvaluation] = React.useState('');
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    const actions = [{ icon: withLink(`${modulePost}`, <PersonAdd />), name: 'Nova OS' }];
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    React.useEffect(() => {
        getAllTasks();
    }, [page, moduleOs, idUnit]);
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_TASK', payload: newPage });
    };
    React.useEffect(() => {
        getResource();
    }, []);
    function getResource() {
        getResourceTask().then((resp) =>
            setOptions({
                ...resp.data,
                natureOfOperation: resp.data.natureOfOperation.filter((desc) => desc.flag_corretiva === moduleOs),
                statusOs: moduleOs === 4 ? resp.data.statusOs : resp.data.statusOs.filter((desc) => desc.id !== 4)
            })
        );
    }
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalEvaluation = () => {
        setAnswers([]);
        setIdTaskEvaluation('');
        setOpenModalEvaluation(false);
    };
    const handleCloseModalReopen = () => setOpenModalReopen(false);
    const handleOpenCancel = (idTask) => {
        setIdCancelTask(idTask);
        setOpenModal(true);
    };

    const handleReopenTask = (idTask) => {
        setIdReopenTask(idTask);
        setOpenModalReopen(true);
    };

    function setIdStatus() {
        let idStatusNew = [];
        objectStatus.forEach((element) => {
            let valueId = parseInt(element.split(' -')[0]);
            idStatusNew = [...idStatusNew, valueId];
        });
        return idStatusNew;
    }

    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_TASK', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_TASK', payload: 1 });
    };

    function getAllTasks(pageNumber = page, statusIdAttr, typeOsIdAttr, natureOfOperationIdAttr, OsAttr, proactive = 0) {
        let statuId = statusIdAttr === '' ? statusIdAttr : idStatus ? setIdStatus() : '';
        let typeOsId = typeOsIdAttr === '' ? typeOsIdAttr : idTypeOs ? idTypeOs.id : '';
        let osNumber = OsAttr === '' ? OsAttr : os;
        let natureOfOperationId =
            natureOfOperationIdAttr === ''
                ? natureOfOperationIdAttr
                : moduleOs === 4
                ? 26
                : idNatureOfOperation
                ? idNatureOfOperation.id
                : '';
        getTasksGerente(
            pageNumber,
            rowsPerPage,
            general,
            initialDate,
            finalDate,
            statuId,
            idUnit,
            typeOsId,
            moduleOs,
            natureOfOperationId,
            osNumber,
            proactive
        ).then((resp) => setTasks(resp.data));
    }
    const cancel = () => {
        try {
            cancelTask(idCancelTask)
                .then((resp) => {
                    setOpenModal(false);
                    setSuccess(resp.data.success);
                    getAllTasks();
                    setTimeout(() => {
                        setSuccess('');
                    }, 2000);
                })
                .catch((e) => {
                    setSuccess('');
                    setError(e.response.data.error);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const reopen = () => {
        try {
            let modulePath = path.split('/')[1];
            let moduleDispatch = '';
            if (modulePath === 'proativas') {
                moduleDispatch = 'proativa';
            } else {
                moduleDispatch = 'preventiva';
            }
            reopenTask(idReopenTask)
                .then((resp) => {
                    setOpenModalReopen(false);
                    setSuccess(resp.data.success);
                    getAllTasks();
                    setTimeout(() => {
                        setSuccess('');
                        navigate({ pathname: `/${moduleDispatch}/${idReopenTask}/edit` });
                    }, 1000);
                })
                .catch((e) => {
                    setSuccess('');
                    setError(e.response.data.error);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpenModalEvaluation = (id) => {
        try {
            if (!openModalEvaluation) {
                getSatisfactionQuestions()
                    .then((resp) => {
                        setQuestions(resp.data);
                    })
                    .then(() => {
                        setIdTaskEvaluation(id);
                    })
                    .then(() => {
                        setOpenModalEvaluation(true);
                    });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChangeEvaluation = (e) => {
        let id = e.target.name;
        let arrayData = answers.filter((desc) => parseInt(desc.id) !== parseInt(id));
        let object = {
            id: id,
            weight: e.target.value
        };

        setAnswers([...arrayData, object]);
    };

    const postEvaluation = () => {
        try {
            setError('');
            if (answers.length !== questions.length) {
                return setError('Responda todas as perguntas !');
            }

            const data = {
                os_id: idTaskEvaluation,
                data: answers
            };

            postSatisfaction(data)
                .then((resp) => {
                    setAnswers([]);
                    setIdTaskEvaluation('');
                    setOpenModalEvaluation(false);
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                })
                .then(() => {
                    getAllTasks();
                });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <BasicModal
                open={openModal}
                title="Cancelar Chamado"
                handleClose={handleCloseModal}
                description="Tem certeza que deseja cancelar a os ?"
                onDelete={cancel}
            />
            <BasicModal
                open={openModalReopen}
                title="Reabrir Chamado"
                handleClose={handleCloseModalReopen}
                description="Tem certeza que deseja reabrir a os ?"
                onDelete={reopen}
            />
            <MainCard sx={{ height: '100%', background: '#F5F5F5', border: 0 }} xs={12} md={12} sm={12} container>
                <Grid xs={12} md={12} sm={12} container>
                    <h1
                        style={{
                            font: 'normal normal bold 24px Myriad Pro',
                            letterSpacing: '0px',
                            color: 'var(--unnamed-color-015641)',
                            color: 'black',
                            opacity: 1,
                            padding: 15,
                            marginLeft: '2%'
                        }}
                    >
                        {`OS - ${titleModule}`}
                    </h1>
                    <hr style={{ width: '95%', marginTop: 0 }}></hr>
                </Grid>
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
                <MobileView>
                    <Grid container spacing={2} alignItems="left" justifyContent="left">
                        <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                            <AnimateButton>
                                <Button variant="contained" color="primary" onClick={() => setDisplayItem(!displayItem)}>
                                    Filtros
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                            <h3>{`${tasks.total} chamados`}</h3>
                        </Grid>
                    </Grid>
                </MobileView>
                <div style={{ display: displayItem === true ? 'none' : 'block' }}>
                    <Grid container spacing={2} alignItems="left" justifyContent="left">
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <NumberFormat
                                fullWidth
                                id="outlined-quantidade"
                                type="text"
                                label="OS"
                                value={os}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'SET_OS_TASK_FILTER',
                                        payload: e.target.value
                                    })
                                }
                                name="os"
                                customInput={TextField}
                                decimalScale={0}
                                allowNegative
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    labelId="status_id"
                                    multiple
                                    name="status_id"
                                    id="status_id"
                                    value={idStatus}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SET_IDSTATUS_TASK_FILTER',
                                            payload: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
                                            objectStatus: e.target.value
                                        })
                                    }
                                    input={<OutlinedInput label="status_id" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {options.statusOs.map((option) => (
                                        <MenuItem key={option.id} value={`${option.id} - ${option.label}`}>
                                            <Checkbox checked={idStatus.indexOf(`${option.id} - ${option.label}`) > -1} />
                                            <ListItemText primary={option.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* <Autocomplete
                                fullWidth
                                select
                                label="Status"
                                id="status_id"
                                type="text"
                                value={idStatus || ''}
                                name="type_os"
                                onChange={(e, newValue) =>
                                    dispatch({ type: 'SET_IDSTATUS_TASK_FILTER', payload: newValue == null ? '' : newValue })
                                }
                                options={options.statusOs}
                                renderInput={(params) => <TextField {...params} label="Status" />}
                            /> */}
                        </Grid>
                        {/* <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <Autocomplete
                                fullWidth
                                select
                                label="Tipo de OS"
                                id="type_os"
                                type="text"
                                value={idTypeOs || ''}
                                name="type_os"
                                onChange={(e, newValue) =>
                                    dispatch({ type: 'SET_IDTYPEOSTASK_FILTER', payload: newValue == null ? '' : newValue })
                                }
                                options={options.typeOfOs}
                                renderInput={(params) => <TextField {...params} label="Tipo de OS" />}
                            />
                        </Grid> */}
                        {/* {moduleOs !== 2 && (
                            <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                                <Autocomplete
                                    fullWidth
                                    select
                                    label="Natureza"
                                    id="nature_of_operation"
                                    type="text"
                                    value={idNatureOfOperation || ''}
                                    name="nature_of_operation"
                                    onChange={(e, newValue) =>
                                        dispatch({ type: 'SET_IDNATUREOFOPERATION_FILTER', payload: newValue == null ? '' : newValue })
                                    }
                                    options={options.natureOfOperation}
                                    renderInput={(params) => <TextField {...params} label="Natureza" />}
                                />
                            </Grid>
                        )} */}
                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                            <TextField
                                fullWidth
                                id="outlined-initialDate"
                                type="date"
                                label="Data Início Criação"
                                value={initialDate}
                                onChange={(e) => dispatch({ type: 'SET_INITIALDATE_TASK_FILTER', payload: e.target.value })}
                                name="initialDate"
                                InputLabelProps={{
                                    shrink: true
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
                                onChange={(e) => dispatch({ type: 'SET_FINALDATE_TASK_FILTER', payload: e.target.value })}
                                name="finalDate"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="right" justifyContent="right">
                        <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                            <AnimateButton>
                                <Button variant="contained" color="primary" onClick={() => getAllTasks(1)}>
                                    Buscar
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={(e) => [
                                        dispatch({
                                            type: 'SET_CLEAR_TASK_FILTER',
                                            idNatureOfOperation:
                                                moduleOs !== 2 ? '' : options.natureOfOperation.filter((desc) => desc.id === 26)
                                        }),
                                        getAllTasks('', '', '', 26, '', '')
                                    ]}
                                >
                                    Limpar
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </div>
                {filterAvanced === true && <ReportTask options={options} getAllTasks={getAllTasks} />}
                {!displayItem && <h3>{`Total: ${tasks.total} chamados`}</h3>}
                <Grid sx={{ mt: 4 }} xs={12} md={12} sm={12} container alignItems="center" justifyContent="center">
                    <ModalFilter
                        width="60%"
                        open={openModalEvaluation}
                        title="Avaliação do Chamado"
                        handleClose={handleCloseModalEvaluation}
                        content={
                            <>
                                <Grid container style={{ marginTop: 15 }} spacing={matchDownSM ? 0 : 2}>
                                    {questions.map((desc) => (
                                        <Grid item xs={12} md={12} sm={12} key={desc.id}>
                                            <Typography component="legend">{`${desc.ordem}. ${desc.descricao}`}</Typography>
                                            <FormControl component="fieldset">
                                                <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
                                                    {evaluations.map((res) => (
                                                        <FormControlLabel value={res.value} control={<Radio />} label={res.label} />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3 }}>
                                    <Grid item>
                                        <Box sx={{ mt: 2, mr: 3 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={loadingButton}
                                                    fullWidth
                                                    size="large"
                                                    type="button"
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleCloseModalEvaluation}
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
                                                    disabled={loadingButton}
                                                    fullWidth
                                                    size="large"
                                                    type="button"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={postEvaluation}
                                                >
                                                    Enviar
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    />
                    {tasks.data && (
                        <>
                            <Tasks
                                id_role={id_role}
                                onReopen={handleReopenTask}
                                navigate={navigate}
                                moduleOs={moduleOs}
                                tasks={tasks.data}
                                onCancel={handleOpenCancel}
                                onModalEvaluation={handleOpenModalEvaluation}
                            />
                        </>
                    )}
                    {tasks.data && (
                        <Grid container alignItems="center" justifyContent="center" xs={12} md={12} sm={12} sx={{ padding: 3 }}>
                            <Stack spacing={2}>
                                <Pagination
                                    count={Math.ceil(parseInt(tasks.total) / parseInt(rowsPerPage))}
                                    variant="outlined"
                                    color="primary"
                                    page={page}
                                    onChange={handleChangePage}
                                />
                            </Stack>
                        </Grid>
                    )}
                </Grid>
            </MainCard>
            {id_role == 4 && <AddButton href={modulePost} />}
        </>
    );
};

export default GridTaskManager;
