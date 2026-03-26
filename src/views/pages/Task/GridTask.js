// material-ui
import React, { useEffect, useRef } from 'react';
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
    FormControlLabel,
    RadioGroup,
    Radio,
    Badge,
    FormHelperText,
} from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import { useDispatch, useSelector } from 'react-redux';
import {
    cancelTask,
    destroy,
    finalAttendanceAll,
    getResourceTask,
    getTaskExportSurvey,
    getTasks,
    getTasksPreventiva,
    getTasksReport,
    getTechinalDispatch,
    initialAttendance,
    reopenTask,
    repactuation,
    reset,
} from 'services/task';
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
import { getSatisfactionQuestions } from 'services/surveySatisfactionQuestions';
import ModalFilter from 'components/Modal/ModalFilter';
import { postSatisfaction } from 'services/surveySatisfaction';
import { evaluations } from './Docs/docs';
import copy from 'copy-to-clipboard';
import { getBrlFormatDate } from 'utils/date';
import Loading from 'components/Loading/Loading';
import { gridSpacing } from 'store/constant';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { id, ptBR } from 'date-fns/locale';
import imageCompression from 'browser-image-compression';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useScriptRef from 'hooks/useScriptRef';
import { display } from '@mui/system';
import Excel from '@mui/icons-material/Task';
import { getResourcePainelChamado } from 'services/biPainelChamado';
import { getTypeOsUser } from 'services/typeOs';
import UpList from '@mui/icons-material/ArrowUpward'
import DownList from '@mui/icons-material/ArrowDownward'
import { useDropzone } from 'react-dropzone';

// ==============================|| Index ||============================== //
const GridTask = () => {
    const themeButton = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#0971f1',
                darker: '#053e85',
            },
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
        },
    });
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
                width: 250,
            },
        },
    };
    const scriptedRef = useScriptRef();
    const infoRef = useRef();
    const theme = useTheme();
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const negocio_id = useSelector((state) => state.auth.user.negocio_id);
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
    const idTypeOs = useSelector((state) => state.task.idTypeOs);
    const keyword = useSelector((state) => state.task.keyword || '');
    const user_id = useSelector((state) => state.task.user_id || '');
    const repactuationFilter = useSelector((state) => state.task.repactuationFilter);
    const equipamento_id = useSelector(
        (state) => state.task.equipamento_id || ''
    );
    const os = useSelector((state) => state.task.os || '');
    const objectStatus = useSelector((state) => state.task.objectStatus || []);
    const objectTypeOs = useSelector((state) => state.task.objectTypeOs || []);
    const idNatureOfOperation = useSelector(
        (state) => state.task.idNatureOfOperation || ''
    );
    const moduleOs =
        path === '/corretivas' ? 1 : path === '/preventivas' ? 2 : path === '/proativas' ? 3 : '';
    const modulePost =
        path === '/corretivas'
        ? '/nova_corretiva'
        : path === '/preventivas'
            ? '/nova_preventiva'
            : '';
    const titleModule =
        moduleOs === 1 ? 'CORRETIVAS' : moduleOs === 2 ? 'PREVENTIVAS' : moduleOs === 3 ? 'PROATIVAS' : '';
    const [tasks, setTasks] = React.useState([]);
    const [options, setOptions] = React.useState(initialStateOptions);
    const [filterAvanced, setFilterAvanced] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [idCancelTask, setIdCancelTask] = React.useState('');
    const [idReopenTask, setIdReopenTask] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalReset, setOpenModalReset] = React.useState(false);
    const [openModalReopen, setOpenModalReopen] = React.useState(false);
    const [openModalInitialAttendance, setOpenModalInitialAttendance] = React.useState(false);
    const [idInitialAttendance, setIdInitialAttendance] = React.useState('');
    const [displayItem, setDisplayItem] = React.useState(
        screen.width < 768 ? true : false
    );
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const [idTaskEvaluation, setIdTaskEvaluation] = React.useState('');
    const [idReset, setIdReset] = React.useState('');
    const [openModalEvaluation, setOpenModalEvaluation] = React.useState(false);
    const [openModalRepactuation, setOpenModalRepactuation] = React.useState(false);
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    const actions = [
        { icon: withLink(`${modulePost}`, <PersonAdd />), name: 'Nova OS' },
    ];
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loadingButton, setLoadingButton] = React.useState(false);
    const [modalInfo, setModalInfo] = React.useState(false);
    const [informacoes, setInformacoes] = React.useState({});
    const [selectedQr, setSelectedQr] = React.useState([]);
    const [selected, setSelected] = React.useState('');
    const checkboxRef = React.useRef();
    const [todosMarcados, setTodosMarcados] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openModalAll, setOpenModalAll] = React.useState(false);
    const [isDisabled, setIdDisabled] = React.useState(true);
    const [technicals, setTechnicals] = React.useState('');
    const [finalPhoto, setFinalPhoto] = React.useState('');
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
    const [idTaskRepactuation, setIdTaskRepactuation] = React.useState('');

    React.useEffect(() => {
        getAllTasks();
    }, [page, moduleOs, idUnit, rowsPerPage, orderDirection, typeOrder]);
    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_TASK', payload: newPage });
    };
    const handleChangeQtd = (event, newPage) => {
        dispatch({ type: 'SET_PAGE_TASK', payload: newPage });
    };
    React.useEffect(() => {
        getResource();
        dispatch({ type: 'SET_ID_URA', payload: ''});
    }, []);
    const handleCloseModalEvaluation = () => {
        setAnswers([]);
        setIdTaskEvaluation('');
        setOpenModalEvaluation(false);
    };

    useEffect(() => {
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

    useEffect(() => {
        if(id_role == 3){
            const statusSupervisor = ['1 - PENDENTE', '2 - INICIADO']
            dispatch({ type: 'SET_TYPE_ORDER', payload: 'os.sla_solucao' });
            dispatch({ type: 'SET_ORDER_DIRECTION', payload: 'asc' })
            dispatch({ type: 'SET_IDSTATUS_TASK_FILTER', payload: statusSupervisor, objectStatus: statusSupervisor })
            // objectTypeOs: e.target.value

        }
    }, [user_id]);

    function getResource() {
        getResourceTask().then((resp) =>
            setOptions({
                ...resp.data,
                natureOfOperation: resp.data.natureOfOperation.filter(
                    (desc) => desc.flag_corretiva === moduleOs
                ),
                statusOs:
                    moduleOs === 1
                        ? resp.data.statusOs
                        : resp.data.statusOs.filter((desc) => desc.id !== 4),
            })
        );
    }
    const handleOrderToggle = () => {
        dispatch({ type: 'SET_ORDER_DIRECTION', payload: orderDirection === 'asc' ? 'desc' : 'asc' });
    };
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalReset = () => setOpenModalReset(false);
    const handleCloseModalAll = () => setOpenModalAll(false);
    const handleCloseModalRepactuation = () => setOpenModalRepactuation(false);
    const handleCloseInfo = () => setModalInfo(false);
    const handleCloseModalReopen = () => setOpenModalReopen(false);
    const handleCloseModalDelete = () => setOpenModalDelete(false);
    const handleCloseModalInitialAttendance = () => {
        setOpenModalInitialAttendance(false);
        setIdInitialAttendance('');
    };
    const handleOpenCancel = (idTask) => {
        setIdCancelTask(idTask);
        setOpenModal(true);
    };
    const handleOpenDelete= (idTask) => {
        setIdDeleteTask(idTask);
        setOpenModalDelete(true);
    };
    const handleOpenModalAll = (idTask) => {
        setOpenModalAll(true);
    };
    const info = (desc) => {
        setModalInfo(true);
        setInformacoes(desc);
    };

    const handleReopenTask = (idTask) => {
        setIdReopenTask(idTask);
        setOpenModalReopen(true);
    };

    const handleOpenReset = (idTask) => {
        setIdReset(idTask);
        setOpenModalReset(true);
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

    const handleChangeRowsPerPage = (event) => {
        dispatch({
            type: 'SET_ROWS_PER_PAGE_TASK',
            payload: parseInt(event),
        });
        dispatch({ type: 'SET_PAGE_TASK', payload: 1 });
    };

    const handleChangeQr = (desc, value = false) => {
        console.log(checkboxRef);
        if (desc.status_id !== 3 && desc.status_id !== 5) {
            let arrayState = {
                ...selected,
                [desc.id]: selected[desc.id] ? !selected[desc.id] : true,
            };
            if (arrayState[desc.id]) {
                setSelectedQr([...selectedQr, desc]);
            } else {
                setSelectedQr(selectedQr.filter((val) => val.id != desc.id));
            }
            setSelected(arrayState);
        }
    };

    function getAllTasks(
        pageNumber = page,
        statusIdAttr,
        typeOsIdAttr,
        natureOfOperationIdAttr,
        OsAttr,
        typeEquipamentIdAttr,
        keywordAttr,
        repactuationFilterAttr
    ) {
        setLoading(true);
        let statuId =
        statusIdAttr === '' ? statusIdAttr : idStatus ? setIdStatus() : '';
        let typeOsId =
        typeOsIdAttr === '' ? typeOsIdAttr : idTypeOs ? setIdTypeOs() : '';
        let osNumber = OsAttr === '' ? OsAttr : os;
        let natureOfOperationId = moduleOs == 1 ? 1 : 11
       
        let typeEquipamentId =
        typeEquipamentIdAttr === ''
            ? typeEquipamentIdAttr
            : equipamento_id
            ? equipamento_id.id
            : '';
        let keywordGeneral = keywordAttr === '' ? OsAttr : keyword;
        let repactuationFilterDef = repactuationFilterAttr === 'TODOS' ? repactuationFilterAttr : repactuationFilter;
        getTasksPreventiva(
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
            '',
            typeEquipamentId,
            keywordGeneral,
            orderDirection,
            typeOrder,
            repactuationFilterDef
        )
        .then((resp) => setTasks(resp.data))
        .then(() => setLoading(false));
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

    const reopen = () => {
        try {
            let modulePath = path.split('/')[1];
            let moduleDispatch = '';
            if (modulePath === 'corretivas') {
                moduleDispatch = 'corretiva';
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
    // Função para buscar questões e avaliações
    const fetchQuestionsAndEvaluations = async () => {
        try {
            const resp = await getSatisfactionQuestions();
            setQuestions(resp.data);
            // Supondo que você também precise buscar as avaliações
            // const evalResp = await getEvaluations();
            // setEvaluations(evalResp.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModalEvaluation = async (desc) => {
        try {
            // Configurar as respostas
            if (desc.surveySatisfaction) {
                const initialAnswers = desc.surveySatisfaction.answers.map((res) => ({
                    id: res.pesquisa_satisfacao_pergunta_id,
                    weight: res.resposta,
                }));
                setAnswers(initialAnswers);
            } else {
                setAnswers([]);
            }

            // Buscar as questões e abrir o modal
            const resp = await getSatisfactionQuestions();
            setQuestions(resp.data);
            setIdTaskEvaluation(desc?.id);
            setOpenModalEvaluation(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpenModalRepactuation = async (desc) => {
        try {
            // Buscar as questões e abrir o modal
            setIdTaskRepactuation(desc?.id);
            setOpenModalRepactuation(true);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (openModalEvaluation) {
            console.log('Modal aberto com questões e respostas:', {
            questions,
            answers,
        });
        // Isso garantirá que as respostas sejam atualizadas corretamente
        // Quando o modal for aberto, as respostas serão usadas
        }
    }, [openModalEvaluation, answers]); // Adicione `answers` como dependência para garantir que as atualizações sejam refletidas

    const handleChangeEvaluation = (e) => {
        let id = e.target.name;
        let arrayData = answers.filter((desc) => parseInt(desc.id) !== parseInt(id));
        let object = {
            id: id,
            weight: e.target.value,
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
                data: answers,
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

    function renderButton() {
        console.log(id_role);
        if (moduleOs === 3) {
            return <AddButton href={modulePost} />;
        } else if (moduleOs === 1 && id_role !== 3 && id_role !== 9) {
            return <AddButton href={modulePost} />;
        } else if (moduleOs === 2 && id_role !== 3 && id_role !== 9) {
            return <AddButton href={modulePost} />;
        }
    }
    const copyToClipboard = () => {
        let infoText = infoRef.current.innerText;
        copy(infoText);
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

    const handleMarcarTodos = (items) => {
        const newSelected = {};
        const newSelectedQr = [];

        if (todosMarcados) {
            // Se todos estão marcados, desmarque-os
            tasks?.data.forEach((item) => {
                if (item.status_id !== 3 && item.status_id !== 5) {
                newSelected[item.id] = false; // Desmarcar
                }
            });
            setSelectedQr([]); // Limpa a lista de selecionados
        } else {
            // Se não estão marcados, marque todos
            tasks?.data.forEach((item) => {
                if (item.status_id !== 3 && item.status_id !== 5) {
                    newSelected[item.id] = true; // Marcar
                    newSelectedQr.push(item); // Adicionar ao array de selecionados
                }
            });
        }

        setSelected(newSelected);
        setSelectedQr(newSelectedQr);
        setTodosMarcados(!todosMarcados); // Inverte o estado
    };
    function formatDateTime(dateTime) {
        let dateTimeFull = new Date(dateTime);
        const year = dateTimeFull.getFullYear();
        const month = dateTimeFull.getUTCMonth() + 1;
        const day = dateTimeFull.getDate().toString().padStart(2, '0');
        let date = `${year}-${month}-${day} ${dateTimeFull.getHours()}:${dateTimeFull.getMinutes()}`;
        return date;
    }
    function technicalPerOs() {
        getTechinalDispatch().then((resp) => setTechnicals(resp.data.techinal));
    }
    useEffect(() => {
        technicalPerOs();
    }, []);
    async function handleFinalImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920,
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            setFinalPhoto(compressedFile);
        } catch (error) {
            console.log(error);
        }
    }

    const download = () => {
        try {
            // if (!initialDate && !finalDate) {
            //     return [
            //         setError('Preencha uma das datas.'),
            //         setTimeout(() => {
            //             setError('');
            //         }, 3000)
            //     ];
            // }
            getTaskExportSurvey(initialDate, finalDate, idUnit).then((resp) => {
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

    const downloadTask = (
        statusIdAttr,
        typeOsIdAttr,
        natureOfOperationIdAttr,
        OsAttr,
        typeEquipamentIdAttr,
        keywordAttr
    ) => {
        try {
            setLoading(true);
            let statuId =
            statusIdAttr === '' ? statusIdAttr : idStatus ? setIdStatus() : '';
            let typeOsId =
            typeOsIdAttr === '' ? typeOsIdAttr : idTypeOs ? setIdTypeOs() : '';
            let osNumber = OsAttr === '' ? OsAttr : os;
            let natureOfOperationId = moduleOs == 1 ? 1 : 11
            let typeEquipamentId =
            typeEquipamentIdAttr === ''
                ? typeEquipamentIdAttr
                : equipamento_id
                ? equipamento_id.id
                : '';
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
                '',
                typeEquipamentId
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Chama a função getAllTasks(1) ao pressionar Enter
            getAllTasks(1);
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

    const onDrop = async (acceptedFiles) => {
        if (!acceptedFiles || acceptedFiles.length === 0) {
            console.log('Nenhum arquivo selecionado');
            return;
        }
    
        const file = acceptedFiles[0];
        const isImage = file.type.startsWith('image/');
        const isPDF = file.type === 'application/pdf';
        
        if (!isImage && !isPDF) {
            setError('Por favor, selecione apenas arquivos de imagem ou PDF');
            return;
        }
        
        try {
            if (isImage) {
                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setFinalPhoto(compressedFile);
            } else {
                setFinalPhoto(file); // PDFs não precisam de compressão
            }
            
            setError(''); // Limpa qualquer erro anterior
        } catch (error) {
            console.error('Erro ao processar o arquivo:', error);
            setError('Erro ao processar o arquivo. Tente novamente.');
            setFinalPhoto(null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf']
        },
        multiple: false,
        maxSize: 20242880, // 20MB
        onDropRejected: () => {
            setError('Arquivo muito grande ou tipo não suportado');
        }
    });

    return (
        <>
        <ModalFilter
            width="60%"
            open={openModalAll}
            title="Fechar Vários"
            handleClose={handleCloseModalAll}
            content={
                <Formik
                    initialValues={{
                        description: '',
                        submit: null,
                        finalPhoto: '',
                        problemResolved: true,
                        technical: '',
                        date_inicio: '',
                        date_fim: ''
                    }}
                    // enableReinitialize
                    validationSchema={Yup.object().shape({
                        technical:
                            id_role == 1
                            ? Yup.object().required('Técnico obrigatório')
                            : '',
                        description: Yup.string().required('Descrição obrigatório'),
                        date_inicio: Yup.date()
                            .required('Data de início obrigatória')
                            .nullable()
                            .test('is-less', 'Data de início deve ser menor que a data de fim', function (value) {
                                const { date_fim } = this.parent; // Obtendo date_fim do contexto
                                return value && date_fim ? new Date(value) < new Date(date_fim) : true; // Retorna true se a data de início for menor
                            })
                            .test('is-not-future', 'Data de início não pode ser maior que a data e hora atuais', function (value) {
                                const currentDate = new Date();
                                return value && new Date(value) <= currentDate;
                            }),
                        date_fim: Yup.date()
                            .required('Data de fim obrigatória')
                            .nullable()
                            .test('is-greater', 'Data de fim deve ser maior que a data de início', function (value) {
                                const { date_inicio } = this.parent; // Obtendo date_inicio do contexto
                                return value && date_inicio ? new Date(value) > new Date(date_inicio) : true; // Verifica se date_fim é maior que date_inicio
                            })
                            .test('is-not-future', 'Data de fim não pode ser maior que a data e hora atuais', function (value) {
                                const currentDate = new Date();
                                return value && new Date(value) <= currentDate;
                            })
                    })}
                    onSubmit={async (values,{ setErrors, setStatus, setSubmitting, resetForm }) => {
                        try {
                            setOpenModalAll(false);
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
                            setLoading(true);
                            const data = new FormData();
                            let ids = selectedQr.map((desc) => desc.id);
                            data.append('date_inicio', formatDateTime(values.date_inicio));
                            data.append('date_fim', formatDateTime(values.date_fim));
                            data.append('technical', values.technical?.id);
                            data.append('finalPhoto', finalPhoto);
                            data.append('description', values.description);
                            data.append('problemResolved', values.problemResolved === true ? 1 : 0);
                            data.append('ids', JSON.stringify(ids));
                            console.log(data);
                            finalAttendanceAll(data)
                                .then((resp) => {
                                    setSuccess(resp.data.success)
                                    setSelectedQr([]);
                                    setSelected('');
                                    setLoading(false);
                                    getAllTasks();
                                    setFinalPhoto('');
                                    setTimeout(() => {
                                        setSuccess('');
                                    }, 3000)
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setError(e.response.data.error);
                                });
                        } catch (err) {
                            console.log(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                                setLoading(false);
                            }
                        }
                    }}
                >
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <>
                            <div style={{ display: 'block', marginTop: '40px' }}>
                                <MainCard spacing={gridSpacing} style={{ marginTop: 15, display: loading ? 'none' : 'block' }}>
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
                                                <Loading color="#00008B" type="cubes" />
                                            </MainCard>
                                        </Grid>
                                    )}
                                    <div style={{ display: loading ? 'none' : 'block' }}>

                                        <form noValidate onSubmit={handleSubmit}>
                                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                                <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        select
                                                        label="Técnico"
                                                        id="technical"
                                                        value={values.technical}
                                                        name="technical"
                                                        onBlur={handleBlur}
                                                        onChange={(e, newValue) => setFieldValue('technical', newValue)}
                                                        options={technicals}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Técnico"
                                                                helperText={
                                                                touched.technical && errors.technical
                                                                    ? errors.technical
                                                                    : ''
                                                                }
                                                                error={Boolean(touched.technical && errors.technical)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                        <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                            <Stack spacing={3}>
                                                                <DateTimePicker
                                                                    fullWidth
                                                                    ampm={false}
                                                                    error={Boolean(touched.date_inicio && errors.date_inicio)}
                                                                    label="Data de Início"
                                                                    id="date_inicio"
                                                                    type="date_inicio"
                                                                    value={values.date_inicio}
                                                                    name="date_inicio"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => setFieldValue('date_inicio', e)}
                                                                    helperText={
                                                                        touched.date_inicio && errors.date_inicio ? errors.date_inicio : ''
                                                                    }
                                                                    renderInput={(params) => <TextField {...params}  helperText={touched.date_inicio && errors.date_inicio ? errors.date_inicio : ''} error={Boolean(touched.date_inicio && errors.date_inicio)} />}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                    <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                        <Stack spacing={3}>
                                                            <DateTimePicker
                                                                fullWidth
                                                                ampm={false}
                                                                error={Boolean(touched.date_fim && errors.date_fim)}
                                                                label="Data de Fim"
                                                                id="date_fim"
                                                                type="date_fim"
                                                                value={values.date_fim}
                                                                name="date_fim"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => setFieldValue('date_fim', e)}
                                                                helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''}
                                                                renderInput={(params) => <TextField {...params} onBlur={handleBlur} helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''} error={Boolean(touched.date_fim && errors.date_fim)} />}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} sx={{ marginTop: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        error={Boolean(touched.description && errors.description)}
                                                        label="Descrição"
                                                        multiline
                                                        rows={4}
                                                        id="description"
                                                        type="text"
                                                        value={values.description}
                                                        name="description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.description && errors.description
                                                                ? errors.description
                                                                : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ marginTop: 3 }}>
                                                    <Box
                                                        {...getRootProps()}
                                                        sx={{
                                                            border: '2px dashed #cccccc',
                                                            borderRadius: '4px',
                                                            padding: '20px',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                                                            opacity: 1,
                                                            '&:hover': {
                                                                backgroundColor: isDisabled ? 'white' : '#f0f0f0'
                                                            }
                                                        }}
                                                    >
                                                        <input {...getInputProps()} />
                                                        {finalPhoto ? (
                                                            <Box>
                                                                <p>Arquivo selecionado: {finalPhoto.name}</p>
                                                                {finalPhoto instanceof File && finalPhoto.type.startsWith('image/') && (
                                                                    <img
                                                                        src={URL.createObjectURL(finalPhoto)}
                                                                        alt="Preview"
                                                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                                                        onError={() => {
                                                                            setError('Erro ao carregar preview da imagem');
                                                                            setFinalPhoto(null);
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        ) : (
                                                            <Box>
                                                                <PhotoCamera sx={{ fontSize: 40, color: '#666666', mb: 1 }} />
                                                                <p>{isDragActive 
                                                                    ? 'Solte a imagem aqui' 
                                                                    : 'Arraste e solte uma imagem aqui, ou clique para selecionar'}
                                                                </p>
                                                                <p style={{ fontSize: '12px', color: '#666' }}>
                                                                    (Tamanho máximo: 20MB, formatos: JPG, PNG, GIF, PDF)
                                                                </p>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sx={{ marginTop: 1 }}>
                                                    <FormControlLabel
                                                        value={values.problemResolved}
                                                        control={
                                                            <Switch
                                                                color="primary"
                                                                checked={values.problemResolved}
                                                                onChange={(e) =>
                                                                    setFieldValue(
                                                                        'problemResolved',
                                                                        !values.problemResolved
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label="Problema Resolvido ?"
                                                        labelPlacement="start"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                alignItems="end"
                                                justifyContent="end"
                                                sx={{ mt: 3 }}
                                            >
                                                <Grid item>
                                                    <Box sx={{ mt: 2, mr: 3 }}>
                                                        <ThemeProvider theme={themeButton}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={isSubmitting}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="submit"
                                                                    variant="contained"
                                                                    color="primary"
                                                                >
                                                                    Finalizar
                                                                </Button>
                                                            </AnimateButton>
                                                        </ThemeProvider>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ mt: 2, mr: 3 }}>
                                                        <ThemeProvider theme={themeButton}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={isSubmitting}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="neutral"
                                                                    onClick={() => navigate(-1)}
                                                                >
                                                                    Voltar
                                                                </Button>
                                                            </AnimateButton>
                                                        </ThemeProvider>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                        </form>
                                    </div>
                                </MainCard>
                            </div>
                        </>
                    )}
                </Formik>
            }
        />
        <ModalFilter
            width="60%"
            open={openModalRepactuation}
            title="Repactuação de OS"
            handleClose={handleCloseModalRepactuation}
            content={
                <Formik
                    initialValues={{
                        description: '',
                        submit: null,
                        date_fim: ''
                    }}
                    // enableReinitialize
                    validationSchema={Yup.object().shape({
                        date_fim: Yup.date()
                            .required('Data de fim obrigatória')
                            .min(new Date(), 'A data deve ser no futuro')
                    })}
                    onSubmit={async (values,{ setErrors, setStatus, setSubmitting, resetForm }) => {
                        try {
                            setOpenModalRepactuation(false);
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
                            setLoading(true);
                            const data = {
                                date_fim: formatDateTime(values.date_fim),
                                description: values.description
                            }
                            repactuation(data, idTaskRepactuation)
                                .then((resp) => {
                                    setSuccess(resp.data.success)
                                    setLoading(false);
                                    getAllTasks();
                                    setTimeout(() => {
                                        setSuccess('');
                                    }, 3000)
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setError(e.response.data.error);
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000)
                                });
                        } catch (err) {
                            console.log(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                                setLoading(false);
                            }
                        }
                    }}
                >
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <>
                            <div style={{ display: 'block', marginTop: '40px' }}>
                                <MainCard spacing={gridSpacing} style={{ marginTop: 15, display: loading ? 'none' : 'block' }}>
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
                                                <Loading color="#00008B" type="cubes" />
                                            </MainCard>
                                        </Grid>
                                    )}
                                    <div style={{ display: loading ? 'none' : 'block' }}>

                                        <form noValidate onSubmit={handleSubmit}>
                                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                                <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                                    <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                        <Stack spacing={3}>
                                                            <DateTimePicker
                                                                fullWidth
                                                                ampm={false}
                                                                error={Boolean(touched.date_fim && errors.date_fim)}
                                                                label="Data de Fim"
                                                                id="date_fim"
                                                                type="date_fim"
                                                                value={values.date_fim}
                                                                name="date_fim"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => setFieldValue('date_fim', e)}
                                                                helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''}
                                                                renderInput={(params) => <TextField {...params} onBlur={handleBlur} helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''} error={Boolean(touched.date_fim && errors.date_fim)} />}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} sx={{ marginTop: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        error={Boolean(touched.description && errors.description)}
                                                        label="Descrição"
                                                        multiline
                                                        rows={4}
                                                        id="description"
                                                        type="text"
                                                        value={values.description}
                                                        name="description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.description && errors.description
                                                                ? errors.description
                                                                : ''
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                alignItems="end"
                                                justifyContent="end"
                                                sx={{ mt: 3 }}
                                            >
                                                <Grid item>
                                                    <Box sx={{ mt: 2, mr: 3 }}>
                                                        <ThemeProvider theme={themeButton}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={isSubmitting}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="submit"
                                                                    variant="contained"
                                                                    color="primary"
                                                                >
                                                                    Salvar
                                                                </Button>
                                                            </AnimateButton>
                                                        </ThemeProvider>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ mt: 2, mr: 3 }}>
                                                        <ThemeProvider theme={themeButton}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={isSubmitting}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="neutral"
                                                                    onClick={() => navigate(-1)}
                                                                >
                                                                    Voltar
                                                                </Button>
                                                            </AnimateButton>
                                                        </ThemeProvider>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                        </form>
                                    </div>
                                </MainCard>
                            </div>
                        </>
                    )}
                </Formik>
            }
        />
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
                {
                    negocio_id == 2 ? (
                        <li>{`Chamado Inventys: ${informacoes?.codigo_inventys}`}</li>
                    ) : (

                        <li>{`Chamado Optimus: ${informacoes?.codigo_inventys}`}</li>
                    )
                }
                <li>{`Local: ${informacoes?.unidade}`}</li>
                <li>{`Solicitante: ${informacoes?.solicitante}`}</li>
                <li>{`Telefone: ${mascaraDeTelefone(informacoes?.telefone)}`}</li>
                <li>{`Descrição: ${informacoes?.descricao}`}</li>
                <li>{`Tipo de Chamado: ${informacoes?.tipo_os}`}</li>
                <li>{`Equipamento: ${informacoes?.tipo_equipamento}`}</li>
                <li>{`Ambiente: ${informacoes?.ativo}`}</li>
                <li>{`Data Abertura: ${informacoes?.data_abertura}`}</li>
                <li>{`SLA: ${informacoes?.sla}`}</li>
                <li>{`Data de 1° atendimento: ${informacoes?.sla_atendimento}`}</li>
                {informacoes?.natureza_id == 11 ? (
                    <li>{`Prazo Final Preventiva: ${getBrlFormatDate(informacoes?.prazo_final_preventiva)}`}</li>
                ) : (
                    <li>{`Prazo Final: ${informacoes?.sla_solucao}`}</li>
                )}
                </ul>
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
                                    disabled={loadingButton}
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
                    marginLeft: '2%',
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
                            color: '#FFF',
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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setDisplayItem(!displayItem)}
                            >
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
                    <Grid item xs={12} sm={moduleOs == 1 ? 3 : 2} sx={{ marginTop: 3 }}>
                        <NumberFormat
                            fullWidth
                            id="outlined-quantidade"
                            type="text"
                            label="OS"
                            value={os}
                            onChange={(e) =>
                            dispatch({
                                type: 'SET_OS_TASK_FILTER',
                                payload: e.target.value,
                            })
                            }
                            name="os"
                            customInput={TextField}
                            decimalScale={0}
                            allowNegative
                            onKeyDown={handleKeyDown}
                        />
                    </Grid>
                    <Grid item xs={12} sm={moduleOs == 1 ? 3 : 2} sx={{ marginTop: 3 }}>
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
                                        payload:
                                            typeof e.target.value === 'string'
                                            ? e.target.value.split(',')
                                            : e.target.value,
                                        objectStatus: e.target.value,
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
                    </Grid>
                    {
                        moduleOs == 2 && (
                            <Grid item xs={12} sm={moduleOs == 1 ? 5 : 2} sx={{ marginTop: 3 }}>
                                <Autocomplete
                                    fullWidth
                                    select
                                    label="Equipamento"
                                    id="equipamento_id"
                                    type="text"
                                    value={equipamento_id || ''}
                                    name="equipamento_id"
                                    onChange={(e, newValue) =>
                                        dispatch({
                                            type: 'SET_IDEQUIPAMENTO_FILTER',
                                            payload: newValue == null ? '' : newValue,
                                        })
                                    }
                                    options={options.typeOfEquipament}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Equipamento" />
                                    )}
                                />
                            </Grid>
                        )
                    }
                    {
                        moduleOs === 3 && (
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
                                        dispatch({
                                            type: 'SET_IDNATUREOFOPERATION_FILTER',
                                            payload: newValue == null ? '' : newValue,
                                        })
                                    }
                                    options={options.natureOfOperation}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Natureza" />
                                    )}
                                />
                            </Grid>
                        )
                    }
                    <Grid item xs={12} sm={moduleOs === 1 ? 3 : 3} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-initialDate"
                            type="date"
                            label="Data Início Criação"
                            value={initialDate}
                            onChange={(e) =>
                                dispatch({
                                    type: 'SET_INITIALDATE_TASK_FILTER',
                                    payload: e.target.value,
                                })
                            }
                            name="initialDate"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={moduleOs === 1 ? 3 : 3} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-finalDate"
                            type="date"
                            label="Data Fim Criação"
                            value={finalDate}
                            onChange={(e) =>
                                dispatch({
                                    type: 'SET_FINALDATE_TASK_FILTER',
                                    payload: e.target.value,
                                })
                            }
                            name="finalDate"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    
                    {
                        moduleOs == 2 && (
                            <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                <TextField
                                    fullWidth
                                    id="outlined-keyword"
                                    type="text"
                                    label="Palavra Chave"
                                    value={keyword}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SET_KEYWORD_TASK_FILTER',
                                            payload: e.target.value,
                                        })
                                    }
                                    name="keyword"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        )
                    }
                </Grid>
                <Grid container spacing={2} alignItems="left" justifyContent="left">
                    <Grid item xs={6} sm={moduleOs === 1 ? 4 : 6} sx={{ marginTop: 1 }}>
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
                    <Grid item xs={12} sm={moduleOs === 1 ? 4 : 6} sx={{ marginTop: 3 }}>
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
                    {
                        moduleOs === 1 && (
                            <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="repactuation">Repactuação</InputLabel>
                                    <Select
                                        labelId="repactuation"
                                        id="repactuation"
                                        label="Repactuação"
                                        name="repactuation"
                                        value={repactuationFilter}
                                        onChange={(e) =>
                                            dispatch({
                                                type: 'SET_REPACTUATION_FILTER',
                                                payload: e.target.value
                                            })
                                        }
                                    >
                                        <MenuItem value="TODOS">Todos</MenuItem>
                                        <MenuItem value="1">Repactuados</MenuItem>
                                        <MenuItem value="0">Não Repactuados</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                </Grid>
                
                <Grid container spacing={1} alignItems="center" justifyContent="space-between" sx={{ mt: 4 }}>
                    {/* Bloco de Botões - Alinhado à Direita */}
                    <Grid item>
                        <Grid container spacing={1} alignItems="center">
                                <>
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
                                </>
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
                                            getAllTasks('', '', moduleOs === 1 ? '' : 11, '', '', '', '', 'TODOS'),
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
            {
                filterAvanced === true && (
                    <ReportTask options={options} getAllTasks={getAllTasks} />
                )
            }
            {
                !displayItem && <h3>{`Total: ${tasks.total} chamados`}</h3>
            }
            {
                moduleOs == 2 && idUnit !== 14725896312 && id_role != 4 && id_role != 7 && id_role != 9 && (
                    <Grid container>
                        <Grid item xs={6} sm={2} sx={{ mt: 4 }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleMarcarTodos}
                                >
                                    Marcar Todos
                                </Button>
                            </AnimateButton>
                        </Grid>
                        {
                            selectedQr.length > 0 && idUnit !== 14725896312 && (
                                <Grid item xs={6} sm={6} sx={{ mt: 4 }}>
                                    <AnimateButton>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleOpenModalAll}
                                        sx={{ display: 'flex', alignItems: 'center' }} // Para alinhar o badge e o texto
                                    >
                                        <Badge 
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }} 
                                            badgeContent={selectedQr.length}  
                                            color="secondary"
                                            sx={{ marginRight: 2 }} // Espaço entre o badge e o texto
                                        >
                                            <span />
                                        </Badge>
                                        Finalizar Selecionados
                                    </Button>
                                    </AnimateButton>
                                </Grid>
                            )
                        }
                    </Grid>
                )
            }
            <Grid sx={{ mt: 4 }} xs={12} md={12} sm={12} container alignItems="center" justifyContent="center">
                <ModalFilter
                    width="60%"
                    open={openModalEvaluation}
                    title="Avaliação do Chamado"
                    handleClose={handleCloseModalEvaluation}
                    content={
                        <>
                            <Grid container style={{ marginTop: 15 }} spacing={matchDownSM ? 0 : 2}>
                                {questions.map((desc) => {
                                    // Encontre a resposta para a pergunta atual
                                    const answer = answers.find((ans) => parseInt(ans.id) === parseInt(desc.id));
                                    // Defina o valor padrão do `RadioGroup` como a resposta encontrada ou um valor padrão se não houver resposta
                                    const defaultValue = answer ? answer.weight : '';

                                    return (
                                        <Grid item xs={12} md={12} sm={12} key={desc.id}>
                                            <Typography component="legend">
                                                <b>{`${desc.ordem}. ${desc.descricao}`}</b>
                                            </Typography>
                                            <FormControl
                                                disabled={id_role !== 4 ? true : false}
                                                component="fieldset"
                                                onChange={(event) =>
                                                    handleChangeEvaluation(event, desc.id)
                                                }
                                            >
                                                <RadioGroup
                                                    row
                                                    aria-label="evaluation"
                                                    name={desc.id}
                                                    value={defaultValue}
                                                >
                                                    {evaluations.map((res) => (
                                                        <FormControlLabel
                                                            key={res.value}
                                                            value={res.value}
                                                            control={<Radio />}
                                                            label={`${res.value}. ${res.label}`}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    );
                                })}
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
                            info={info}
                            handleChangeQr={handleChangeQr}
                            selected={selected}
                            checkboxRef={checkboxRef}
                            handleInitialTask={handleInitialTask}
                            onDelete={handleOpenDelete}
                            onModalRepactuation={handleOpenModalRepactuation}
                            handleOpenReset={handleOpenReset}
                        />
                    </>
                )}
                {tasks.data && (
                    <Grid container alignItems="center" justifyContent="center" xs={12} md={12} sm={12} sx={{ padding: 3 }}>
                        {idUnit && equipamento_id && moduleOs == 2 && (
                            <Stack spacing={2}>
                                <Button onClick={() => handleChangeRowsPerPage(tasks.total)}>
                                    Mostrar Todos
                                </Button>
                            </Stack>
                        )}
                        <Stack spacing={2}>
                            <Pagination
                                count={Math.ceil(
                                    parseInt(tasks.total) / parseInt(rowsPerPage)
                                )}
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
        {idUnit !== 14725896312 &&
            id_role !== 4 &&
            id_role !== 7 &&
            renderButton()}
        </>
    );
};

export default GridTask;
