// material-ui
import React, { useRef } from 'react';
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
    Box,
    FormHelperText,
    Typography
} from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import { useDispatch, useSelector } from 'react-redux';
import { cancelTask, destroy, getResourceTask, getTasks, getTasksReport, initialAttendance, reopenTask, reset } from 'services/task';
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
import copy from 'copy-to-clipboard';
import Excel from '@mui/icons-material/Task';
import Loading from 'components/Loading/Loading';
import { getTypeOsUser } from 'services/typeOs';
import UpList from '@mui/icons-material/ArrowUpward'
import DownList from '@mui/icons-material/ArrowDownward'
import IconButton from '@mui/material/IconButton';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gridSpacing } from 'store/constant';
import useScriptRef from 'hooks/useScriptRef';

// ==============================|| Index ||============================== //
const GridProactive = () => {
    const initialStateOptions = {
        typeOfEquipament: [],
        typeOfProblem: [],
        unit: [],
        typeOfOs: [],
        natureOfOperation: [],
        family: [],
        categories: [],
        statusOs: [],
        users: []
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
    const infoRef = useRef();
    const scriptedRef = useScriptRef();
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
    const os = useSelector((state) => state.task.os || '');
    const objectStatus = useSelector((state) => state.task.objectStatus || []);
    const idNatureOfOperation = useSelector((state) => state.task.idNatureOfOperation || '');
    const moduleOs = 3;
    const modulePost = '/nova_proativa';
    const titleModule = 'PROATIVAS';
    const [tasks, setTasks] = React.useState([]);
    const [options, setOptions] = React.useState(initialStateOptions);
    const [filterAvanced, setFilterAvanced] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idCancelTask, setIdCancelTask] = React.useState('');
    const [idReopenTask, setIdReopenTask] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalReopen, setOpenModalReopen] = React.useState(false);
    const [displayItem, setDisplayItem] = React.useState(screen.width < 768 ? true : false);
    const [modalInfo, setModalInfo] = React.useState(false);
    const [informacoes, setInformacoes] = React.useState({});
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    const actions = [{ icon: withLink(`${modulePost}`, <PersonAdd />), name: 'Nova OS' }];
    const idTypeOs = useSelector((state) => state.task.idTypeOs);
    const objectTypeOs = useSelector((state) => state.task.objectTypeOs || []);
    const [loading, setLoading] = React.useState(false);
    const user_id = useSelector((state) => state.task.user_id || '');
    const [typeOs, setTypeOs] = React.useState([]);
    const [ optionsFilter, setOptionsFilter ] = React.useState(
            [
                {
                    id: 'os.sla_solucao', label: 'sla_solucao'
                },
                {
                    id: 'os.data_abertura', label: 'data_abertura'
                }
            ]
        )
    const typeOrder = useSelector((state) => state.task.typeOrder);
    const orderDirection = useSelector((state) => state.task.orderDirection);
    const [idDeleteTask, setIdDeleteTask] = React.useState('');
    const [openModalDelete, setOpenModalDelete] = React.useState(false);
    const [idReset, setIdReset] = React.useState('');
    const [openModalReset, setOpenModalReset] = React.useState(false);
    const [openModalInitialAttendance, setOpenModalInitialAttendance] = React.useState(false);
    const [idInitialAttendance, setIdInitialAttendance] = React.useState('');

    const handleCloseModalReset = () => setOpenModalReset(false);
    const handleCloseModalInitialAttendance = () => {
        setOpenModalInitialAttendance(false);
        setIdInitialAttendance('');
    };

    const handleOrderToggle = () => {
        dispatch({ type: 'SET_ORDER_DIRECTION', payload: orderDirection === 'asc' ? 'desc' : 'asc' });
    };

    React.useEffect(() => {
        getAllTasks();
    }, [page, moduleOs, idUnit, orderDirection, typeOrder]);
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_TASK', payload: newPage });
    };
    React.useEffect(() => {
        getResource();
        dispatch({ type: 'SET_ID_URA', payload: ''});
    }, []);
    React.useEffect(() => {
        if(id_role == 3){
            const statusSupervisor = ['1 - PENDENTE', '2 - INICIADO']
            dispatch({ type: 'SET_TYPE_ORDER', payload: 'os.data_abertura' });
            dispatch({ type: 'SET_ORDER_DIRECTION', payload: 'asc' })
            dispatch({ type: 'SET_IDSTATUS_TASK_FILTER', payload: statusSupervisor, objectStatus: statusSupervisor })
        }
    }, [user_id]);
    function getResource() {
        getResourceTask().then((resp) =>
            setOptions({
                ...resp.data,
                natureOfOperation: resp.data.natureOfOperation.filter((desc) => desc.id !== 1 && desc.id !== 11),
                statusOs: moduleOs === 3 ? resp.data.statusOs : resp.data.statusOs.filter((desc) => desc.id !== 4)
            })
        );
    }
    React.useEffect(() => {
        const fetchDataResource = async () => {
            try {
                const response = await getTypeOsUser(user_id);
                setTypeOs(response.data);
    
                if (id_role == 3 && user_id) {
                    // Selecionar todos os tipos de OS quando o perfil for 3
                    const allSelected = response.data.map((desc) => `${desc.id} - ${desc.label}`);
                    dispatch({
                        type: 'SET_IDTYPEOSTASK_FILTER',
                        payload: allSelected,
                        objectTypeOs: allSelected,
                    });
    
                    // Atualizando o estado de idTypeOs com todos os valores selecionados
                    setIdTypeOs(allSelected);  // Supondo que você tenha um estado idTypeOs
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
    
        fetchDataResource();
    }, [user_id, id_role]); // Dependências para recarregar o useEffect
    React.useEffect(() => {
        dispatch({ type: 'SET_TYPE_ORDER', payload: 'os.data_abertura' });
        dispatch({ type: 'SET_ORDER_DIRECTION', payload: 'desc' });
    }, [user_id]);
    const handleCloseInfo = () => setModalInfo(false);
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalReopen = () => setOpenModalReopen(false);
    const handleCloseModalDelete = () => setOpenModalDelete(false);
    const handleOpenCancel = (idTask) => {
        setIdCancelTask(idTask);
        setOpenModal(true);
    };

    const handleOpenReset = (idTask) => {
        setIdReset(idTask);
        setOpenModalReset(true);
    };

    const info = (desc) => {
        setModalInfo(true);
        setInformacoes(desc);
    };

    const handleReopenTask = (idTask) => {
        setIdReopenTask(idTask);
        setOpenModalReopen(true);
    };

    const handleOpenDelete= (idTask) => {
        setIdDeleteTask(idTask);
        setOpenModalDelete(true);
    };

    function setIdStatus() {
        let idStatusNew = [];
        objectStatus.forEach((element) => {
            let valueId = parseInt(element.split(' -')[0]);
            idStatusNew = [...idStatusNew, valueId];
        });
        return idStatusNew;
    }

    function setIdTypeOs() {
        let idStatusNew = [];
        objectTypeOs.forEach((element) => {
            let valueId = parseInt(element.split(' -')[0]);
            idStatusNew = [...idStatusNew, valueId];
        });
        return idStatusNew;
    }

    const resetTask = () => {
        try {
            reset({}, idReset)
                .then((resp) => {
                    setOpenModalReset(false);
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

    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'SET_ROWS_PER_PAGE_TASK', payload: parseInt(event.target.value, 10) });
        dispatch({ type: 'SET_PAGE_TASK', payload: 1 });
    };

    function mascaraDeTelefone(telefone) {
        let textoAjustado;
        if (telefone && telefone.length > 0) {
            const textoAtual = telefone;
            const isCelular = textoAtual.length === 11;
            if (isCelular) {
                const parte1 = textoAtual.slice(0, 2);
                const parte2 = textoAtual.slice(2, 7);
                const parte3 = textoAtual.slice(7, 11);
                textoAjustado = `(${parte1})${parte2}-${parte3}`;
            } else {
                const parte1 = textoAtual.slice(0, 2);
                const parte2 = textoAtual.slice(2, 6);
                const parte3 = textoAtual.slice(6, 10);
                textoAjustado = `(${parte1})${parte2}-${parte3}`;
            }
        }
        return textoAjustado;
    }

    function getAllTasks(pageNumber = page, statusIdAttr, typeOsIdAttr, natureOfOperationIdAttr, OsAttr, proactive = 1) {
        let statuId = statusIdAttr === '' ? statusIdAttr : idStatus ? setIdStatus() : '';
        let typeOsId = typeOsIdAttr === '' ? typeOsIdAttr : idTypeOs ? setIdTypeOs() : '';
        let osNumber = OsAttr === '' ? OsAttr : os;
        let natureOfOperationId =
            natureOfOperationIdAttr === ''
                ? natureOfOperationIdAttr
                : moduleOs === 2
                ? 11
                : idNatureOfOperation
                ? idNatureOfOperation.id
                : '';
        getTasks(
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
            proactive,
            orderDirection,
            typeOrder
        ).then((resp) => setTasks(resp.data));
    }
    const cancel = (motivoCancelamento) => {
        try {
            const data = {
                motivo_cancelamento: motivoCancelamento
            };
            cancelTask(idCancelTask, data)
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
                    setError(e.response?.data?.error || 'Erro ao cancelar chamado');
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } catch (err) {
            console.log(err);
            setError('Erro ao cancelar chamado');
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    const copyToClipboard = () => {
        let infoText = infoRef.current.innerText;
        copy(infoText);
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
    const downloadTask = (
        statusIdAttr, typeOsIdAttr, natureOfOperationIdAttr, OsAttr, proactive = 1
    ) => {
        try {
            setLoading(true);
            let statuId = statusIdAttr === '' ? statusIdAttr : idStatus ? setIdStatus() : '';
            let typeOsId = typeOsIdAttr === '' ? typeOsIdAttr : idTypeOs ? setIdTypeOs() : '';
            let osNumber = OsAttr === '' ? OsAttr : os;
            let natureOfOperationId = natureOfOperationIdAttr === '' ? natureOfOperationIdAttr : idNatureOfOperation ? idNatureOfOperation.id : ''
                
            getTasksReport(
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
            )
            .then((resp) => {
                let blob = new Blob([resp.data], { type: 'application/vnd.ms-excel' });
                let link = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.download = 'file.xlsx';
                a.href = link;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setSuccess('Logs gerados com sucesso.');
                setLoading(false);
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            });
        } catch (err) {
            console.log(err);
        }
    };
    const handleInitialTask = (idTask) => {
        setIdInitialAttendance(idTask);
        setOpenModalInitialAttendance(true);
    };

    const confirmInitialAttendance = (description) => {
        try {
            const data = {
                description_initial: description
            };
            initialAttendance(idInitialAttendance, data)
                .then((resp) => {
                    setSuccess(resp.data.success);
                    getAllTasks();
                    setOpenModalInitialAttendance(false);
                    setIdInitialAttendance('');
                    setTimeout(() => {
                        setSuccess('');
                    }, 2000);
                })
                .catch((e) => {
                    setSuccess('');
                    setError(e.response?.data?.error || 'Erro ao iniciar atendimento');
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } catch (err) {
            console.log(err);
            setError('Erro ao iniciar atendimento');
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    const deleteTask = () => {
        try {
            destroy(idDeleteTask)
                .then((resp) => {
                    setOpenModalDelete(false);
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Chama a função getAllTasks(1) ao pressionar Enter
            getAllTasks(1);
        }
    };
    
    return (
        <>
            <BasicModal
                open={openModalReset}
                title="Resetar Chamado"
                handleClose={handleCloseModalReset}
                description="Tem certeza que deseja resetar a os ?"
                onDelete={resetTask}
            />
            <ModalFilter
                width="60%"
                open={openModal}
                title="Cancelar Chamado"
                handleClose={handleCloseModal}
                content={
                    <Formik
                        initialValues={{
                            motivo_cancelamento: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            motivo_cancelamento: Yup.string()
                                .required('O motivo do cancelamento é obrigatório')
                                .min(10, 'O motivo deve ter no mínimo 10 caracteres')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                            try {
                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                                cancel(values.motivo_cancelamento);
                                resetForm();
                            } catch (err) {
                                console.error(err);
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            Tem certeza que deseja cancelar a OS?
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            label="Motivo do Cancelamento"
                                            name="motivo_cancelamento"
                                            value={values.motivo_cancelamento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(touched.motivo_cancelamento && errors.motivo_cancelamento)}
                                            helperText={touched.motivo_cancelamento && errors.motivo_cancelamento}
                                            placeholder="Descreva o motivo do cancelamento..."
                                            required
                                        />
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    size="large"
                                                    type="button"
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleCloseModal}
                                                >
                                                    Não
                                                </Button>
                                            </AnimateButton>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    Sim, Cancelar
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                }
            />
            <BasicModal
                open={openModalDelete}
                title="Excluir Chamado"
                handleClose={handleCloseModalDelete}
                description="Tem certeza que deseja excluir a os ?"
                onDelete={deleteTask}
            />
            <BasicModal
                open={openModalReopen}
                title="Reabrir Chamado"
                handleClose={handleCloseModalReopen}
                description="Tem certeza que deseja reabrir a os ?"
                onDelete={reopen}
            />
            <ModalFilter
                width="60%"
                open={openModalInitialAttendance}
                title="Iniciar Atendimento"
                handleClose={handleCloseModalInitialAttendance}
                content={
                    <Formik
                        initialValues={{
                            description: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            description: Yup.string()
                                .required('A descrição do início do atendimento é obrigatória')
                                .min(10, 'A descrição deve ter no mínimo 10 caracteres')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                            try {
                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                                confirmInitialAttendance(values.description);
                                resetForm();
                            } catch (err) {
                                console.error(err);
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            label="Descrição do Início do Atendimento"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(touched.description && errors.description)}
                                            helperText={touched.description && errors.description}
                                            placeholder="Descreva os detalhes do início do atendimento..."
                                        />
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    size="large"
                                                    type="button"
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleCloseModalInitialAttendance}
                                                >
                                                    Cancelar
                                                </Button>
                                            </AnimateButton>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Iniciar Atendimento
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                }
            />
            <ModalFilter
                open={modalInfo}
                title="Informações do Chamado"
                handleClose={handleCloseInfo}
                width="600px"
                content={
                    <>
                        <ul ref={infoRef} id={`info-${informacoes?.id}`}>
                            <li>{`Chamado: OS${informacoes?.id}`}</li>
                            <li>{`Local: ${informacoes?.unidade}`}</li>
                            <li>{`Solicitante: ${informacoes?.solicitante}`}</li>
                            <li>{`Telefone: ${mascaraDeTelefone(informacoes?.telefone)}`}</li>
                            <li>{`Descrição: ${informacoes?.descricao}`}</li>
                            <li>{`Tipo de Chamado: ${informacoes?.tipo_os}`}</li>
                            <li>{`Equipamento: ${informacoes?.tipo_equipamento}`}</li>
                            <li>{`Ambiente: ${informacoes?.ativo}`}</li>
                            <li>{`Data Abertura: ${informacoes?.data_abertura}`}</li>
                            <li>{`Data de 1° atendimento: ${informacoes?.sla_atendimento}`}</li>
                            <li>{`Prazo Final: ${informacoes?.sla_solucao}`}</li>
                        </ul>
                        <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3 }}>
                            <Grid item>
                                <Box sx={{ mt: 2, mr: 3 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            // disabled={loadingButton}
                                            fullWidth
                                            size="large"
                                            type="button"
                                            variant="contained"
                                            color="error"
                                            onClick={handleCloseInfo}
                                        >
                                            Fechar
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{ mt: 2, mr: 3 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            // disabled={loadingButton}
                                            fullWidth
                                            size="large"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={copyToClipboard}
                                        >
                                            Copiar
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                }
            />
            <MainCard sx={{ height: '100%', background: '#F5F5F5', border: 0 }} xs={12} md={12} sm={12} container>
            {loading && (
                <Grid container alignItems="center" justifyContent="center">
                    <MainCard
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Loading color="#015641" type="cubes" />
                    </MainCard>
                </Grid>
            )}
            <div style={{ display: loading ? 'none' : 'block' }}>
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
                        <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
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
                                onKeyDown={handleKeyDown}
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
                        {moduleOs !== 2 && (
                            <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
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
                        )}
                        <Grid item xs={12} sm={moduleOs !== 2 ? 2 : 3} sx={{ marginTop: 3 }}>
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
                        <Grid item xs={12} sm={moduleOs !== 2 ? 2 : 3} sx={{ marginTop: 3 }}>
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
                    <Grid container spacing={2} alignItems="left" justifyContent="left">
                        <Grid item xs={6} sm={6} sx={{ marginTop: 1 }}>
                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                <InputLabel>Filtrar por Supervisor</InputLabel>
                                <Select
                                    value={user_id}
                                    onChange={(e) => dispatch({ type: 'SET_USER_TASK', payload: e.target.value })}
                                    label="Filtrar por Supervisor"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {options?.users.map(user => (
                                        <MenuItem key={user.id} value={user.id}>{user.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="type_os">Tipo de OS</InputLabel>
                                <Select
                                    labelId="type_os"
                                    multiple
                                    name="type_os"
                                    id="type_os"
                                    value={idTypeOs}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SET_IDTYPEOSTASK_FILTER',
                                            payload:
                                                typeof e.target.value === 'string'
                                                ? e.target.value.split(',')
                                                : e.target.value,
                                            objectTypeOs: e.target.value,
                                        })
                                    }
                                    input={<OutlinedInput label="type_os" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {typeOs.map((option) => (
                                        <MenuItem key={option.id} value={`${option.id} - ${option.label}`}>
                                            <Checkbox checked={idTypeOs.indexOf(`${option.id} - ${option.label}`) > -1} />
                                            <ListItemText primary={option.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center" justifyContent="space-between" sx={{ mt: 4 }}>
                    {/* Bloco de Botões - Alinhado à Direita */}
                    <Grid item>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <AnimateButton>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => downloadTask()}
                                        startIcon={<Excel />}
                                    >
                                        Exportar
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            {id_role == 1 && (
                                <Grid item>
                                    <AnimateButton>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => download()}
                                            startIcon={<Excel />}
                                        >
                                            Avaliações
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            )}
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" color="primary" onClick={() => getAllTasks(1)}>
                                        Buscar
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item>
                                <AnimateButton>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={(e) => [
                                            dispatch({
                                                type: 'SET_CLEAR_TASK_FILTER',
                                                idNatureOfOperation:
                                                    moduleOs === 1
                                                        ? ''
                                                        : options.natureOfOperation.filter((desc) => desc.id === 11),
                                            }),
                                            getAllTasks('', '', moduleOs === 1 ? '' : 11, '', '', '', ''),
                                        ]}
                                    >
                                        Limpar
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Bloco de Ordenação - Alinhado à Esquerda */}
                    <Grid item>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <FormControl fullWidth sx={{ minWidth: 200, marginBottom: 2 }}>
                                <InputLabel>Ordenar por:</InputLabel>
                                <Select
                                    value={typeOrder}
                                    onChange={(e) => dispatch({ type: 'SET_TYPE_ORDER', payload: e.target.value })}
                                    label="Ordenar por:"
                                >
                                    {optionsFilter.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={handleOrderToggle} color="primary">
                                {orderDirection === 'asc' ? <UpList /> : <DownList />}
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
                </div>
                {filterAvanced === true && <ReportTask options={options} getAllTasks={getAllTasks} />}
                {!displayItem && <h3>{`Total: ${tasks.total} chamados`}</h3>}
                <Grid sx={{ mt: 4 }} xs={12} md={12} sm={12} container alignItems="center" justifyContent="center">
                    {tasks.data && (
                        <>
                            <Tasks
                                id_role={id_role}
                                onReopen={handleReopenTask}
                                navigate={navigate}
                                moduleOs={moduleOs}
                                tasks={tasks.data}
                                onCancel={handleOpenCancel}
                                info={info}
                                handleInitialTask={handleInitialTask}
                                onDelete={handleOpenDelete}
                                handleOpenReset={handleOpenReset}
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
                </div>
            </MainCard>
            {idUnit !== 14725896312 && id_role !== 4 && id_role !== 7 && id_role !== 9 &&
                <AddButton href={modulePost} />
            }
        </>
    );
};

export default GridProactive;
