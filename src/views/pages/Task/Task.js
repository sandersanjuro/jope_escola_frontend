import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RMIUploader } from 'react-multiple-image-uploader';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

// material-uialertse
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    // Card,
    MenuItem,
    Select,
    Alert,
    AlertTitle,
    Snackbar,
    ListItemText,
    Chip
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import {
    getResourceTask,
    postTask,
    getOperatingTask,
    getSlaTask,
    getTimesSla,
    getTaskPerId,
    updateTask,
    getTechinalDispatch,
    postDispatchTechnical,
    initialAttendance,
    getTeamTask,
    getTeamTaskPost,
    getTypeOs,
    getTEquipamentOs,
    removeAttachment,
    reopenTask
} from 'services/task';
import Loading from 'components/Loading/Loading';
import CardMaterial from 'components/Card/CardMaterial';
import IconButtonMaterial from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { ptBR } from 'date-fns/locale';
import ModalFilter from 'components/Modal/ModalFilter';
import OppositeContentTimeline from 'components/Timeline/OppositeContentTimeline';
import Upload from 'components/Upload/upload';
import FileList from 'components/FileList/FileList';
import { ContentUpload } from 'components/Upload/styles';
import imageCompression from 'browser-image-compression';
import { map } from 'modern-async';
import NumberFormat from 'react-number-format';
import CarouselArquivos from 'components/Carrossel/CarouselArquivos';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Task = ({ ...others }) => {
    const themeButton = createTheme({
        status: {
            danger: '#e53e3e'
        },
        palette: {
            primary: {
                main: '#0971f1',
                darker: '#053e85'
            },
            neutral: {
                main: '#64748B',
                contrastText: '#fff'
            }
        }
    });
    const initialStateOptions = {
        typeOfEquipament: [],
        typeOfProblem: [],
        unit: [],
        typeOfOs: [],
        natureOfOperation: [],
        family: [],
        categories: [],
        techinal: [],
        team: []
    };
    const initialStateOptionsTechinal = {
        techinal: []
    };
    const initialValues = {
        name: useSelector((state) => state.auth.user.nome),
        email: useSelector((state) => state.auth.user.email),
        type_os: '',
        unit: parseInt(useSelector((state) => state.user.unit)),
        nature_of_operation: '',
        opening_date: new Date(),
        type_equipament: '',
        operative: '',
        type_of_problem: '',
        description_of_problem: '',
        family: '',
        sla: '',
        end: '',
        initial: '',
        byAttendance: '',
        status_id: '',
        status: '',
        timeline: [],
        phone: '',
        arquivos_atendimento: [],
        repactuacao: '',
        data_repactuacao: '',
        fim_atendimento: '',
        inicio_atendimento: ''
    };
    const path = window.location.pathname;
    const moduleOs =
        path === '/nova_corretiva' || path.split('/')[1] === 'corretiva'
            ? 1
            : path === '/nova_preventiva' || path.split('/')[1] === 'preventiva'
            ? 2
            : path === '/nova_proativa' || path.split('/')[1] === 'proativa'
            ? 3
            : '';
    const titleModule = moduleOs === 1 ? 'CORRETIVAS' : moduleOs === 2 ? 'PREVENTIVAS' : moduleOs === 3 ? 'PROATIVAS' : '';
    const navigate = useNavigate();
    const theme = useTheme();
    const params = useParams();
    const scriptedRef = useScriptRef();
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const id_technical = useSelector((state) => state.auth.user.tecnico_id);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [options, setOptions] = useState(initialStateOptions);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [idCategory, setIdCategory] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [idUnit, setIdUnit] = useState(useSelector((state) => state.user.unit || ''));
    const [valuesEdit, setValuesEdit] = useState(initialValues);
    const [atendimento, setAtendimento] = useState('');
    const [solucao, setSolucao] = useState('');
    const [idSla, setIdSla] = useState('');
    const [operatings, setOperatings] = useState([]);
    const [idOperating, setIdOperating] = useState('');
    const [optionsSla, setOptionsSla] = useState([]);
    const [currentOperating, setCurrentOperating] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [loadingButton, setLoadingButton] = useState(false);
    
    // Opções de andar para o filtro
    const floorOptions = [
        { value: '', label: 'Limpar Filtro' },
        { value: 'Todos', label: 'Todos' },
        { value: '1º Andar', label: '1º Andar' },
        { value: '2º Andar', label: '2º Andar' },
        { value: '3º Andar', label: '3º Andar' },
        { value: 'Área Externa', label: 'Área Externa' },
        { value: 'Área Técnica', label: 'Área Técnica' }
    ];
    const [idTaskResp, setIdTaskResp] = useState('');
    const [openingDate, setOpeningDate] = useState(new Date());
    const isDisabled = params.action === 'view' ? true : false;
    const [openModal, setOpenModal] = useState(false);
    const [openModalDispatch, setOpenModalDispatch] = useState(false);
    const [openModalFilter, setOpenModalFilter] = useState(false);
    const [techinal, setTechinal] = useState([]);
    const [optionsTechinal, setOptionsTechinal] = useState(initialStateOptionsTechinal);
    const [team, setTeam] = useState('');
    const [postData, setPostData] = useState('');
    const [typeOs, setTypeOs] = useState('');
    const [idFamily, setIdFamily] = useState('');
    const [idTypeOs, setIdTypeOs] = useState('');
    const [optionsTeam, setOptionsTeam] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataSources, setDatasources] = useState([]);
    const [optionsType, setOptionsType] = useState([]);
    const [optionsEquipament, setOptionsEquipament] = useState([]);
    const [save, setIsSave] = useState(true);
    const family_ura = useSelector((state) => state.ura.family);
    const type_os_ura = useSelector((state) => state.ura.type_os);
    const id_ura = useSelector((state) => state.ura.id);
    const negocio_id = useSelector((state) => state.auth.user.negocio_id);

    const handleSetVisible = () => {
        setVisible(true);
    };
    useEffect(() => {
        getType();
    }, [idFamily]);
    useEffect(() => {
        getEquipament();
    }, [idTypeOs]);
    useEffect(() => {
        getResource();
    }, []);
    useEffect(() => {
        taskPerId();
    }, [params.id]);
    useEffect(() => {
        redirect();
    }, []);
    useEffect(() => {
        getTechinal();
    }, [team]);
    useEffect(() => {
        getSla();
    }, [idUnit]);
    useEffect(() => {
        getTimeSla();
    }, [idSla, openingDate]);
    useEffect(() => {
        getOperatings();
        setSelectedFloor(''); // Limpa o filtro de andar quando categoria ou unidade mudar
    }, [idUnit, idCategory]);
    

    function getTimeSla() {
        getTimesSla(idSla ? idSla.id : '', formatDateTime(openingDate)).then((resp) => {
            setAtendimento(resp.data.slaAtendimento);
            setSolucao(resp.data.slaConclusao);
        }).catch((error) => {
            console.error("Error fetching SLA times:", error);
        });
    }
    
    function isValidReopen($idStatus) {
        if (params.action == 'reopen') {
            if (id_role !== 1 || $idStatus !== 5) {
                let modulePath = path.split('/')[1];
                return navigate({ pathname: `/${modulePath}/${params.id}/view` });
            }
        }
        if (params.action == 'edit') {
            if (id_role == 7) {
                let modulePath = path.split('/')[1];
                return navigate({ pathname: `/${modulePath}/${params.id}/view` });
            }
        }
        if (path == 'nova_corretiva') {
            if (id_role == 7) {
                return navigate({ pathname: `/corretivas` });
            }
        }
    }
    function redirect() {
        if (id_role == 7) {
            if (params.action == 'edit') {
                let modulePath = path.split('/')[1];
                return navigate({ pathname: `/${modulePath}/${params.id}/view` });
            }
            if (path == '/nova_corretiva') {
                if (id_role == 7) {
                    return navigate({ pathname: `/corretivas` });
                }
            }
        }
    }
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
    const handleCloseModal = (event, reason) => {
        if (reason && reason === 'backdropClick') return;
        if (!params.action) {
            postDataTask;
        } else {
            setOpenModal(false);
            setLoading(false);
        }
    };
    const handleCloseModalDispatch = (event, reason) => {
        if (reason && reason === 'backdropClick') return;
        setOpenModalDispatch(false);
    };
    // const handleCloseModalDispatch = () => setOpenModalDispatch(false);
    const handleCloseModalFilter = () => setOpenModalFilter(false);
    const handleOpenDestroy = () => {
        setOpenModal(true);
    };

    function redirectFinal(tecnico_id, initial, end) {
        if (id_role === 3) {
            if (initial && !end) {
                if (id_technical === tecnico_id) {
                    navigate({ pathname: `/atendimento/${params.id}` });
                } else {
                    navigate({ pathname: `/index` });
                }
            }
        }
    }
    function taskPerId() {
        params.action &&
            getTaskPerId(params.id).then((resp) => {
                console.log(resp.data);
                setIdUnit(resp.data.unidade_id);
                setValuesEdit({
                    name: resp.data.solicitante,
                    email: resp.data.email_solicitante,
                    type_os: resp.data.typeOfOs,
                    unit: resp.data.unit,
                    nature_of_operation: resp.data.natureOfOperation,
                    opening_date: resp.data.data_abertura,
                    type_equipament: resp.data.typeOfEquipament,
                    operative: resp.data.ativo_id,
                    type_of_problem: resp.data.typeOfProblem,
                    description_of_problem: resp.data.descricao,
                    family: resp.data.family,
                    opening_date: resp.data.data_abertura,
                    sla: resp.data.sla,
                    end: resp.data.end,
                    initial: resp.data.inicio_atendimento,
                    byAttendance: resp.data.tecnico_id,
                    status_id: resp.data.status_id,
                    status: resp.data.status,
                    timeline: resp.data.timeline,
                    phone: resp.data.telefone,
                    codigo_inventys: resp.data.codigo_inventys,
                    arquivos_atendimento: resp.data.arquivos_atendimento,
                    repactuacao: resp.data.repactuacao,
                    data_repactuacao: resp.data.data_repactuacao,
                    fim_atendimento: resp.data.fim_atendimento,
                    inicio_atendimento: resp.data.inicio_atendimento
                });
                setTechinal(resp.data.technicals.map((res) => res.tecnico));
                setOpeningDate(resp.data.data_abertura);
                setIdSla(resp.data.sla);
                setAtendimento(resp.data.sla_atendimento);
                setSolucao(resp.data.sla_solucao);
                setIdOperating(resp.data.operating);
                getTeam(resp.data.typeOfOs.id, resp.data.unit.id);
                setUploadedFiles(
                    resp.data.file.map((desc) => ({
                        id: desc.id,
                        name: desc.name,
                        readableSize: filesize(desc.size),
                        url: desc.url,
                        viewURL: desc.url
                    }))
                );
                setIdFamily(resp.data.family.id);
                setIdTypeOs(resp.data.typeOfOs.id);
                isValidReopen(resp.data.status_id);
                // redirectFinal(resp.data.tecnico_id, resp.data.inicio_atendimento, resp.data.end ? resp.data.end.fim_atendimento : '');
            });
    }
    function getSla() {
        getSlaTask(idUnit).then((resp) => setOptionsSla(resp.data.sla));
    }
    async function getType() {
        await getTypeOs(idFamily).then((resp) => setOptionsType(params.action ? resp.data : resp.data.filter((desc) => desc.ativo == 1)));
    }
    async function getEquipament() {
        await getTEquipamentOs(idTypeOs).then((resp) => setOptionsEquipament(resp.data));
    }
    async function getResource() {
        await getResourceTask().then((resp) =>
            setOptions({
                ...options,
                typeOfProblem: resp.data.typeOfProblem,
                unit: resp.data.unit,
                family: params.action ? resp.data.family : resp.data.family.filter((desc) => desc.ativo == 1),
                categories: resp.data.categories,
                techinal: resp.data.techinal,
                natureOfOperation: resp.data.natureOfOperation.filter((desc) => desc.flag_corretiva === moduleOs)
            })
        );
    }
    function getTeam(typeOsEdit, unitEdit) {
        console.log(typeOsEdit, unitEdit);
        getTeamTaskPost(typeOsEdit, unitEdit).then((resp) => {
            setOptionsTeam(resp.data);
            if (resp.data.length == 1) {
                setTeam(resp.data[0]);
            }
        });
    }
    async function handleInitialImageUpload(file) {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpload(files) {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920
        };
        const uploadedFile = await map(files, async (res) => ({
            file: await imageCompression(res, options),
            id: uniqueId(),
            name: res.name,
            readableSize: filesize(res.size),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
            viewURL: URL.createObjectURL(res)
        }));
        console.log(uploadedFile);
        setUploadedFiles(uploadedFiles.concat(uploadedFile));
    }
    //Deleta arquivo
    const handleDelete = (id) => {
        setLoading(true);
        let file = uploadedFiles.filter((desc) => parseInt(desc.id) === parseInt(id))[0];
        if (file.url) {
            removeAttachment(id)
                .then((resp) => {
                    setLoading(false);
                    setError('');
                    setSuccess(resp.data.success);
                    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
                    setTimeout(() => {
                        setSuccess('');
                    }, 2000);
                })
                .catch((e) => {
                    setLoading(false);
                    setSuccess('');
                    setError(e.response.data.error);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } else {
            setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
            setLoading(false);
        }
    };

    function getTechinal() {
        getTechinalDispatch(team ? team.id : null)
            .then((resp) => setOptionsTechinal(resp.data))
            .then(() => setIsSave(false));
    }
    function getOperatings() {
        getOperatingTask(idUnit, idCategory ? idCategory.id : '').then((resp) => setOperatings(resp.data.operating));
    }
    
    // Função para filtrar operatings baseado no andar selecionado
    const getFilteredOperatings = () => {
        if (!selectedFloor || selectedFloor === '') {
            return operatings;
        }
        
        if (selectedFloor === 'Todos') {
            return operatings.filter(operating => operating.andar && operating.andar === 'Todos');
        }
        
        // Filtra por andar específico
        return operatings.filter(operating => operating.andar && operating.andar === selectedFloor);
    };
    const handleInit = (e) => {
        try {
            setLoading(true);
            initialAttendance(params.id)
                .then((resp) => {
                    setLoading(false);
                    setOpenModal(false);
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        navigate({ pathname: `/atendimento/${params.id}` });
                    }, 1000);
                })
                .catch((e) => {
                    setLoading(false);
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
    function setIdTechinal() {
        let idTechinal = [];
        techinal.forEach((element) => {
            let valueId = options.techinal.filter((desc) => desc.label === element)[0];
            idTechinal = [...idTechinal, valueId];
        });
        return idTechinal;
    }

    const modalYes = () => {
        getTeamTaskPost(typeOs ? typeOs.id : idTypeOs, idUnit).then((resp) => {
            setOptionsTeam(resp.data);
            if (resp.data.length == 1) {
                setTeam(resp.data[0]);
            }
        });

        setOpenModal(true);
    };
    function formatDateTime(dateTime) {
        let dateTimeFull = params.action ? new Date(dateTime) : dateTime;
        const year = dateTimeFull.getFullYear();
        const month = (dateTimeFull.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = dateTimeFull.getDate().toString().padStart(2, '0');
        let opening_date = `${year}-${month}-${day} ${dateTimeFull.getHours()}:${dateTimeFull.getMinutes()}`;
        return opening_date;
    }
    const handleOperating = () => {
        if (!currentOperating) {
            return [
                setError('Selecione um ativo !'),
                setTimeout(() => {
                    setError('');
                }, 2000)
            ];
        }
        if (idOperating.length > 0) {
            let isOperating = idOperating.filter((desc) => desc.id === currentOperating.id);
            if (isOperating.length > 0) {
                return [
                    setError('Ativo ja selecionado !'),
                    setTimeout(() => {
                        setError('');
                    }, 2000)
                ];
            }
        }
        setError('');
        setIdOperating([...idOperating, currentOperating]);
        // setIdCategory('');
        setCurrentOperating('');
    };
    const handleDeleteOperating = (id) => {
        setIdOperating(idOperating.filter((desc) => parseInt(desc.id) !== parseInt(id)));
    };
    function renderOperatings() {
        let operatindsId = idOperating || [];
        return operatindsId.map((desc) =>
            id_role === 3 ? (
                <Grid key={desc.id} item xs={12} sm={3} sx={{ marginTop: 0 }}>
                    <p>
                        {desc.label} - {desc.andar}
                    </p>
                </Grid>
            ) : (
                <Grid key={desc.id} item xs={12} sm={3} sx={{ marginTop: 3 }}>
                    <CardMaterial
                        title={desc.label}
                        content={
                            <>
                                <Typography fontSize={18}>
                                    <b>Unidade : </b>
                                    {desc.unidade}
                                </Typography>
                                <Typography fontSize={18}>
                                    <b>Andar : </b>
                                    {desc.andar}
                                </Typography>
                                <Typography fontSize={18}>
                                    <b>Categoria: </b>
                                    {desc.categoria}
                                </Typography>
                            </>
                        }
                        handleDelete={handleDeleteOperating}
                        idDelete={desc.id}
                        action={params.action ? true : false}
                    />
                </Grid>
            )
        );
    }
    const dispatchTechinal = (e) => {
        try {
            setLoadingButton(true);
            let idTechinal = setIdTechinal();
            // const data = {
            //     idTask: params.id,
            //     technical: idTechinal,
            //     team: team
            // };
            const data = new FormData();
            data.append('idTask', params.id);
            data.append('technical', JSON.stringify(idTechinal));
            data.append('team', JSON.stringify(team));
            // const data = {
            //     idTask: params.id,
            //     // postData: postData,
            //     technical: idTechinal,
            //     team: team
            // };
            setLoading(true);
            setIsSave(true);
            let modulePath = path.split('/')[1];
            let moduleDispatch = '';
            if (modulePath === 'corretiva') {
                moduleDispatch = 'nova_corretiva';
            } else {
                moduleDispatch = 'nova_preventiva';
            }
            postDispatchTechnical(data, {
                headers: {
                    'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                }
            })
                .then((resp) => {
                    setLoading(false);
                    setOpenModal(false);
                    setOpenModalDispatch(false);
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        navigate({ pathname: `/${moduleDispatch}` });
                        window.location.reload();
                    }, 3000);
                })
                .catch((e) => {
                    setLoadingButton(false);
                    setLoading(false);
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
    function redirectDispatch() {
        let modulePath = path.split('/')[1];
        let moduleDispatch = '';
        if (modulePath === 'nova_corretiva') {
            moduleDispatch = 'corretiva';
        } else {
            moduleDispatch = 'preventiva';
        }
        navigate({ pathname: `/${moduleDispatch}/${idTaskResp}/view` });
        setTimeout(() => {
            setOpenModal(true);
        }, 1000);
    }

    const changePhone = (event) => {
        const number = event.target.value.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
        setPhone(number);
    };

    const postDataTask = () => {
        setLoadingButton(true);
        const data = new FormData();
        uploadedFiles.map((value) => data.append('file[]', value.file));
        let idTechinal = setIdTechinal();
        data.append('postData', JSON.stringify(postData));
        data.append('technical', JSON.stringify(idTechinal));
        data.append('team', JSON.stringify(team));
        setIsSave(true);
        if (params.action == 'reopen') {
            data.append('_method', 'put');
            reopenTask(params.id, data, {
                headers: {
                    'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                }
            })
                .then((resp) => {
                    setLoading(false);
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((e) => {
                    setLoadingButton(false);
                    setLoading(false);
                    setSuccess('');
                    setError(e.response.data.error);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        } else {
            postTask(data, {
                headers: {
                    'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                }
            })
                .then((resp) => {
                    setLoading(false);
                    setSuccess(resp.data.success);
                    if (id_role !== 3) {
                        setOpenModalDispatch(true);
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((e) => {
                    setLoadingButton(false);
                    setLoading(false);
                    setSuccess('');
                    setOpenModalDispatch(false);
                    setError(e.response.data.error);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                });
        }
    };
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name,
                    email: valuesEdit.email,
                    submit: null,
                    type_os: valuesEdit.type_os  || type_os_ura,
                    unit: valuesEdit.unit,
                    nature_of_operation:
                        moduleOs == 1
                            ? options.natureOfOperation.filter((desc) => desc.id === 1)[0]
                            : moduleOs == 2
                            ? options.natureOfOperation.filter((desc) => desc.id === 11)[0]
                            : valuesEdit.nature_of_operation,
                    // nature_of_operation: valuesEdit.nature_of_operation,
                    opening_date: valuesEdit.opening_date,
                    type_equipament: valuesEdit.type_equipament,
                    operative: valuesEdit.operative,
                    type_of_problem: valuesEdit.type_of_problem,
                    description_of_problem: valuesEdit.description_of_problem,
                    family: valuesEdit.family || family_ura,
                    sla: valuesEdit.sla,
                    moduleOs: moduleOs,
                    phone: valuesEdit.phone,
                    codigo_inventys: valuesEdit.codigo_inventys
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(45, 'Permitido máximo de 45 caracteres.').required('Nome obrigatório'),
                    phone: Yup.string().min(10, 'Mínimo de 10 caracteres.').max(11, 'Máximo de 11 caracteres.').nullable(),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    type_os: Yup.object().required('Tipo de Os obrigatório'),
                    nature_of_operation: moduleOs === 3 ? Yup.object().required('Natureza de Operação obrigatório') : '',
                    opening_date: Yup.string().required('Data de abertura obrigatório'),
                    type_equipament: Yup.object().required('Tipo de equipamento obrigatório'),
                    type_of_problem: Yup.object().required('Tipo de problema obrigatório'),
                    description_of_problem: Yup.string().required('Descrição do problema obrigatório'),
                    family: Yup.object().required('Família Obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        console.log(values.type_os);
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        let operating =
                            idOperating.length <= 0 || !idOperating ? (currentOperating ? [currentOperating] : idOperating) : idOperating;
                        if (operating.length <= 0) {
                            setLoading(false);
                            return setError('É necessário adicionar ativos');
                        }
                        const data = {
                            ...values,
                            opening_date: formatDateTime(values.opening_date),
                            idOperating: operating,
                            slaAtendimento: values.nature_of_operation?.id == 1 ? atendimento : '',
                            slaConclusao: values.nature_of_operation?.id == 1 ? solucao : '',
                            sla: values.sla ? values.sla.id : '',
                            nature_of_operation:
                                moduleOs == 1
                                    ? options.natureOfOperation.filter((desc) => desc.id === 1)[0]
                                    : moduleOs == 2
                                    ? options.natureOfOperation.filter((desc) => desc.id === 11)[0]
                                    : values.nature_of_operation,
                            ura_id: id_ura
                            // moduleOs !== 2 ? values.nature_of_operation : options.natureOfOperation.filter((desc) => desc.id === 11)[0]
                        };
                        if (params.action === 'edit') {
                            const data = new FormData();
                            uploadedFiles.map((value) => data.append('file[]', value.file));
                            let idTechinal = setIdTechinal();
                            data.append('type_of_problem', JSON.stringify(values.type_of_problem));
                            data.append('type_os', JSON.stringify(values.type_os));
                            data.append('family', JSON.stringify(values.family));
                            data.append('nature_of_operation', JSON.stringify(values.nature_of_operation));
                            data.append('type_equipament', JSON.stringify(values.type_equipament));
                            data.append('sla', JSON.stringify(values.sla));
                            data.append('description_of_problem', values.description_of_problem);
                            data.append('name', values.name);
                            data.append('moduleOs', values.moduleOs);
                            data.append('email', values.email);
                            data.append('phone', values.phone);
                            data.append('codigo_inventys', values.codigo_inventys);
                            data.append('slaAtendimento', values.nature_of_operation?.id == 1 ? atendimento : '');
                            data.append('slaConclusao', values.nature_of_operation?.id == 1 ? solucao : '');
                            data.append('opening_date', formatDateTime(values.opening_date));
                            data.append('_method', 'put');
                            updateTask(params.id, data, {
                                headers: {
                                    'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                                }
                            })
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    taskPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        setSuccess('');
                                    }, 2000);
                                })
                                .then((resp) => {
                                    if (parseInt(valuesEdit.type_os.id) !== parseInt(values.type_os.id)) {
                                        setOpenModalDispatch(true);
                                    }
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error);
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                            // updateTask(params.id, data)
                            //     .then((resp) => {
                            //         setError('');
                            //         setLoading(false);
                            //         taskPerId();
                            //         setSuccess(resp.data.success);
                            //         setTimeout(() => {
                            //             setSuccess('');
                            //         }, 2000);
                            //     })
                            //     .then((resp) => {
                            //         setOpenModalDispatch(true);
                            //     })
                            //     .catch((e) => {
                            //         setLoading(false);
                            //         setSuccess('');
                            //         setError(e.response.data.error);
                            //         setTimeout(() => {
                            //             setError('');
                            //         }, 3000);
                            //     });
                        } else if (params.action === 'reopen') {
                            setPostData(data);
                            modalYes();
                        } else if (!params.action) {
                            if (id_role == 3 && moduleOs !== 3) {
                                const dataPost = new FormData();
                                uploadedFiles.map((value) => dataPost.append('file[]', value.file));
                                dataPost.append('postData', JSON.stringify(data));

                                return postTask(dataPost, {
                                    headers: {
                                        'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                                    }
                                })
                                    .then((resp) => {
                                        setLoading(false);
                                        setSuccess(resp.data.success);
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    })
                                    .catch((e) => {
                                        setLoadingButton(false);
                                        setLoading(false);
                                        setSuccess('');
                                        setError(e.response.data.error);
                                        setTimeout(() => {
                                            setError('');
                                        }, 2000);
                                    });
                            } else if (values.type_os.despacha_aut == 1) {
                                const dataPost = new FormData();
                                uploadedFiles.map((value) => dataPost.append('file[]', value.file));
                                dataPost.append('postData', JSON.stringify(data));

                                return postTask(dataPost, {
                                    headers: {
                                        'Content-Type': `multipart/form-data;boundary=${data._boundary}`
                                    }
                                })
                                    .then((resp) => {
                                        setLoading(false);
                                        setSuccess(resp.data.success);
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    })
                                    .catch((e) => {
                                        setLoadingButton(false);
                                        setLoading(false);
                                        setSuccess('');
                                        setError(e.response.data.error);
                                        setTimeout(() => {
                                            setError('');
                                        }, 2000);
                                    });
                            } else {
                                setPostData(data);
                                setOpenModalDispatch(true);
                            }
                        }
                        // console.log(data);
                    } catch (err) {
                        console.log(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) =>  {
                    useEffect(() => {
                        if(id_role == 1){
                            if(family_ura){
                                setFieldValue('family', family_ura);
                                setIdFamily(family_ura.id);
                                setIdTypeOs('');
                                setFieldValue('type_os', '');
                                setTypeOs('');
                            }
                            if(type_os_ura){
                                setFieldValue('type_os', type_os_ura);
                                setIdTypeOs(type_os_ura.id);
                                setTypeOs(type_os_ura);
                                getTeam(type_os_ura.id, idUnit);
                                setFieldValue('type_equipament', '');
                            }
                        }
                    }, [family_ura, type_os_ura]);
                    return(
                        <>
                            {loading && (
                                <Grid container alignItems="center" justifyContent="center">
                                    <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loading color="#00008B" type="cubes" />
                                    </MainCard>
                                </Grid>
                            )}
                            <div style={{ display: loading ? 'none' : 'block', marginTop: '40px' }}>
                                <MainCard spacing={gridSpacing} style={{ marginTop: 15 }}>
                                    <Grid container>
                                        {moduleOs == 1 && params.action && (
                                            <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                                <Grid item>
                                                    <Chip label={valuesEdit.status.nome} color={valuesEdit.status.cor} />
                                                </Grid>
                                            </Grid>
                                        )}
                                        <h1
                                            style={{
                                                font: 'normal normal bold 35px/44px Myriad Pro',
                                                letterSpacing: '0px',
                                                color: 'var(--unnamed-color-015641)',
                                                Color: '#015641',
                                                opacity: 1,
                                                padding: 15,
                                                marginLeft: '2%'
                                            }}
                                        >
                                            {/* {id_role !== 3 ? `OS${params.id} - ${titleModule}` : `OS${params.id}`} */}
                                            {params.id ? `OS${params.id}` : `ORDEM DE SERVIÇO - ${titleModule}`}
                                        </h1>
                                        <hr style={{ width: '100%', marginTop: 0 }}></hr>
                                        {/* <h3
                                            style={{
                                                font: 'normal normal 300 18px/22px Myriad Pro',
                                                letterSpacing: '0px',
                                                Color: '#00000',
                                                opacity: 1,
                                                padding: 15,
                                                marginLeft: '2%'
                                            }}
                                        >
                                            Gerencie os serviços
                                        </h3> */}
                                    </Grid>
                                    {error || success ? (
                                        <Snackbar open={true} autoHideDuration={6000}>
                                            <Alert
                                                severity={error ? 'error' : 'success'}
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
                                    <ModalFilter
                                        width="60%"
                                        open={openModal}
                                        title="Seleção de Técnicos"
                                        handleClose={handleCloseModal}
                                        content={
                                            <>
                                                <Grid container style={{ marginTop: 15 }} spacing={matchDownSM ? 0 : 2}>
                                                    <Autocomplete
                                                        fullWidth
                                                        select
                                                        label="Equipe"
                                                        id="team"
                                                        type="text"
                                                        value={team}
                                                        name="team"
                                                        onChange={(e, newValue) => setTeam(newValue)}
                                                        options={optionsTeam}
                                                        renderInput={(params) => <TextField {...params} label="Equipe" />}
                                                    />
                                                </Grid>
                                                <Grid container style={{ marginTop: 15 }} spacing={matchDownSM ? 0 : 2}>
                                                    <FormControl sx={{ width: '100%' }}>
                                                        <InputLabel id="techinal">Técnicos</InputLabel>
                                                        <Select
                                                            labelId="techinal"
                                                            onBlur={handleBlur}
                                                            multiple
                                                            name="techinal"
                                                            id="techinal"
                                                            value={techinal}
                                                            onChange={(e) =>
                                                                setTechinal(
                                                                    typeof e.target.value === 'string'
                                                                        ? e.target.value.split(',')
                                                                        : e.target.value
                                                                )
                                                            }
                                                            input={<OutlinedInput label="Técnicos" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {optionsTechinal.techinal.map((option) => (
                                                                <MenuItem key={option.id} value={option.label}>
                                                                    <Checkbox checked={techinal.indexOf(option.label) > -1} />
                                                                    <ListItemText primary={option.label} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3 }}>
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={save}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={!params.action ? postDataTask : handleCloseModal}
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
                                                                    disabled={save}
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={
                                                                        !params.action || params.action == 'reopen'
                                                                            ? postDataTask
                                                                            : dispatchTechinal
                                                                    }
                                                                >
                                                                    Despachar
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
                                        open={openModalDispatch}
                                        title="Despachar"
                                        handleClose={handleCloseModalDispatch}
                                        content={
                                            <>
                                                <Typography>Deseja despachar o chamado ?</Typography>
                                                <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3 }}>
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disabled={save}
                                                                    disableElevation
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={!params.action ? postDataTask : () => window.location.reload()}
                                                                >
                                                                    Não
                                                                </Button>
                                                            </AnimateButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disabled={save}
                                                                    disableElevation
                                                                    fullWidth
                                                                    size="large"
                                                                    type="button"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={modalYes}
                                                                >
                                                                    Sim
                                                                </Button>
                                                            </AnimateButton>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    />
                                    <form noValidate onSubmit={handleSubmit} {...others}>
                                        {id_role && (
                                            <>
                                                <h3>Solicitante</h3>
                                                <hr></hr>
                                                <Grid container spacing={matchDownSM ? 0 : 2}>
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <TextField
                                                            fullWidth
                                                            error={Boolean(touched.name && errors.name)}
                                                            id="outlined-name"
                                                            type="text"
                                                            label="Nome"
                                                            value={values.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="name"
                                                            disabled={isDisabled}
                                                            helperText={touched.name && errors.name ? errors.name : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <NumberFormat
                                                            disabled={params.action === 'view' ? true : false}
                                                            fullWidth
                                                            id="outlined-quantidade"
                                                            type="text"
                                                            label="Telefone"
                                                            value={values.phone}
                                                            format={
                                                                values.phone
                                                                    ? values.phone[2] === '3' ||
                                                                      values.phone[2] === '4' ||
                                                                      values.phone[2] === '2'
                                                                        ? '(##) ####-####'
                                                                        : '(##) #####-####'
                                                                    : '(##) #####-####'
                                                            }
                                                            onChange={(e) => {
                                                                const number = e.target.value
                                                                    .replace('(', '')
                                                                    .replace(')', '')
                                                                    .replace(' ', '')
                                                                    .replace('-', '');
                                                                setFieldValue('phone', number);
                                                            }}
                                                            name="phone"
                                                            error={Boolean(touched.phone && errors.phone)}
                                                            helperText={touched.phone && errors.phone ? errors.phone : ''}
                                                            onBlur={handleBlur}
                                                            customInput={TextField}
                                                            // isAllowed={(values) => {
                                                            //     const { floatValue, formattedValue } = values;
                                                            //     return formattedValue === '' || (floatValue >= 1 && floatValue <= 99);
                                                            // }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <TextField
                                                            fullWidth
                                                            error={Boolean(touched.email && errors.email)}
                                                            id="outlined-email"
                                                            type="email"
                                                            label="Email"
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="email"
                                                            disabled={isDisabled}
                                                            helperText={touched.email && errors.email ? errors.email : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={valuesEdit.repactuacao == 1 ? 4 : 6} sx={{ marginTop: 3 }}>
                                                        <TextField
                                                            fullWidth
                                                            error={Boolean(touched.codigo_inventys && errors.codigo_inventys)}
                                                            id="outlined-codigo_inventys"
                                                            type="text"
                                                            label={negocio_id == 2 ? "Código Inventys" : "Código Optimus"}
                                                            value={values.codigo_inventys}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="codigo_inventys"
                                                            disabled={isDisabled}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            helperText={touched.codigo_inventys && errors.codigo_inventys ? errors.codigo_inventys : ''}
                                                        />
                                                    </Grid>
                                                    {/* <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Unidade"
                                                            id="unit"
                                                            value={values.unit}
                                                            name="unit"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => {
                                                                setFieldValue('unit', newValue);
                                                                setIdUnit(newValue);
                                                            }}
                                                            options={options.unit}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Unidade"
                                                                    helperText={touched.unit && errors.unit ? errors.unit : ''}
                                                                    error={Boolean(touched.unit && errors.unit)}
                                                                />
                                                            )}
                                                            disabled={params.action ? true : false}
                                                        />
                                                    </Grid> */}
                                                    <Grid item xs={12} sm={valuesEdit.repactuacao == 1 ? 4 : 6} sx={{ marginTop: 3 }}>
                                                        <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                            <Stack spacing={3}>
                                                                {/* <MobileDateTimePicker
                                                                value={value}
                                                                onChange={(newValue) => {
                                                                    setValue(newValue);
                                                                }}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                /> */}
                                                                <DateTimePicker
                                                                    fullWidth
                                                                    ampm={false}
                                                                    error={Boolean(touched.opening_date && errors.opening_date)}
                                                                    label="Data de Abertura"
                                                                    id="opening_date"
                                                                    type="date"
                                                                    value={values.opening_date}
                                                                    name="opening_date"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        setFieldValue('opening_date', e);
                                                                        setOpeningDate(e);
                                                                    }}
                                                                    // onChange={(e) => setFieldValue('opening_date', e)}
                                                                    helperText={
                                                                        touched.opening_date && errors.opening_date ? errors.opening_date : ''
                                                                    }
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    disabled={!params.action || params.action == 'reopen' ? false : true}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    {valuesEdit.repactuacao == 1 && (
                                                        <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                            <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    {/* <MobileDateTimePicker
                                                                    value={value}
                                                                    onChange={(newValue) => {
                                                                        setValue(newValue);
                                                                    }}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    /> */}
                                                                    <DateTimePicker
                                                                        fullWidth
                                                                        ampm={false}
                                                                        label="Data de Repactuação"
                                                                        id="date_repactuation"
                                                                        type="date"
                                                                        value={valuesEdit.data_repactuacao}
                                                                        name="date_repactuation"
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        disabled={true}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </Grid>
                                                    )}
                                                    {moduleOs === 3 && (
                                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                                            <Autocomplete
                                                                fullWidth
                                                                select
                                                                label="Tipo de Chamado"
                                                                id="nature_of_operation"
                                                                value={values.nature_of_operation}
                                                                name="nature_of_operation"
                                                                onBlur={handleBlur}
                                                                onChange={(e, newValue) => setFieldValue('nature_of_operation', newValue)}
                                                                options={options.natureOfOperation}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Natureza de Operação"
                                                                        helperText={
                                                                            touched.nature_of_operation && errors.nature_of_operation
                                                                                ? errors.nature_of_operation
                                                                                : ''
                                                                        }
                                                                        error={Boolean(
                                                                            touched.nature_of_operation && errors.nature_of_operation
                                                                        )}
                                                                    />
                                                                )}
                                                                disabled={!params.action || params.action == 'reopen' ? false : true}
                                                            />
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </>
                                        )}
                                        {optionsSla.length > 0 && loading == false && moduleOs !== 2 && values.nature_of_operation?.id == 1 && (
                                            <>
                                                <h3>Sla</h3>
                                                <hr></hr>
                                                <Grid container spacing={matchDownSM ? 0 : 2}>
                                                    {id_role === 3 ? (
                                                        <>
                                                            <Grid item xs={12} sm={3} sx={{ marginTop: 1 }}>
                                                                <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            fullWidth
                                                                            ampm={false}
                                                                            label="Atendimento"
                                                                            id="atendimento"
                                                                            type="date"
                                                                            value={atendimento}
                                                                            name="atendimento"
                                                                            onBlur={handleBlur}
                                                                            disabled={true}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3} sx={{ marginTop: 1 }}>
                                                                <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            fullWidth
                                                                            ampm={false}
                                                                            label="Solução"
                                                                            id="solucao"
                                                                            type="date"
                                                                            value={solucao}
                                                                            name="solucao"
                                                                            onBlur={handleBlur}
                                                                            disabled={true}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                                <Autocomplete
                                                                    fullWidth
                                                                    select
                                                                    error={Boolean(touched.sla && errors.sla)}
                                                                    label="Sla"
                                                                    id="sla"
                                                                    type="text"
                                                                    value={values.sla}
                                                                    name="sla"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e, newValue) => {
                                                                        setFieldValue('sla', newValue);
                                                                        setIdSla(newValue);
                                                                    }}
                                                                    helperText={touched.sla && errors.sla ? errors.sla : ''}
                                                                    options={optionsSla}
                                                                    renderInput={(params) => <TextField {...params} label="Sla" />}
                                                                    disabled={!params.action || params.action == 'reopen' ? false : true}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                                <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            fullWidth
                                                                            ampm={false}
                                                                            label="Atendimento"
                                                                            id="atendimento"
                                                                            type="date"
                                                                            value={atendimento}
                                                                            name="atendimento"
                                                                            onBlur={handleBlur}
                                                                            disabled={true}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                                <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            fullWidth
                                                                            ampm={false}
                                                                            label="Solução"
                                                                            id="solucao"
                                                                            type="date"
                                                                            value={solucao}
                                                                            name="solucao"
                                                                            onBlur={handleBlur}
                                                                            disabled={true}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>
                                                        </>
                                                    )}
                                                </Grid>
                                            </>
                                        )}
                                        <h3>Ativos</h3>
                                        <hr></hr>
                                        {!params.action && (
                                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                                <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        label="Categoria"
                                                        id="category"
                                                        value={idCategory}
                                                        name="category"
                                                        onChange={(e, newValue) => setIdCategory(newValue)}
                                                        options={options.categories}
                                                        getOptionLabel={(option) => option.label || ''}
                                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                        renderInput={(params) => <TextField {...params} label="Categoria" />}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        label="Andar"
                                                        id="floor"
                                                        name="floor"
                                                        value={floorOptions.find(option => option.value === selectedFloor) || null}
                                                        onChange={(e, newValue) => setSelectedFloor(newValue ? newValue.value : '')}
                                                        options={floorOptions}
                                                        getOptionLabel={(option) => option.label || ''}
                                                        isOptionEqualToValue={(option, value) => option.value === value?.value}
                                                        renderInput={(params) => <TextField {...params} label="Andar" />}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        label="Ativos"
                                                        id="operative"
                                                        name="operative"
                                                        value={currentOperating}
                                                        onChange={(e, newValue) => setCurrentOperating(newValue)}
                                                        options={getFilteredOperatings()}
                                                        getOptionLabel={(option) => option.label || ''}
                                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                        renderInput={(params) => <TextField {...params} label="Ativos" />}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                                                    <IconButtonMaterial aria-label="adicionar" onClick={handleOperating}>
                                                        <MoreVertIcon />
                                                    </IconButtonMaterial>
                                                </Grid>
                                            </Grid>
                                        )}
                                        <Grid container spacing={matchDownSM ? 0 : 2}>
                                            {renderOperatings()}
                                        </Grid>
                                        <h3 style={{ marginTop: '30px' }}>Informações da OS</h3>
                                        <hr></hr>
                                        <Grid container spacing={matchDownSM ? 0 : 2}>
                                            {id_role && (
                                                <>
                                                    {/* <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Tipo de Chamado"
                                                            id="nature_of_operation"
                                                            value={values.nature_of_operation}
                                                            name="nature_of_operation"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => setFieldValue('nature_of_operation', newValue)}
                                                            options={options.natureOfOperation}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Natureza de Operação"
                                                                    helperText={
                                                                        touched.nature_of_operation && errors.nature_of_operation
                                                                        ? errors.nature_of_operation
                                                                        : ''
                                                                    }
                                                                    error={Boolean(touched.nature_of_operation && errors.nature_of_operation)}
                                                                />
                                                                )}
                                                                disabled={isDisabled}
                                                                />
                                                            </Grid> */}
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Família"
                                                            id="family"
                                                            type="text"
                                                            value={values.family}
                                                            name="family"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => {
                                                                setFieldValue('family', newValue);
                                                                setIdFamily(newValue.id);
                                                                setIdTypeOs('');
                                                                setFieldValue('type_os', '');
                                                                setTypeOs('');
                                                            }}
                                                            // onChange={(e, newValue) => setFieldValue('family', newValue)}
                                                            options={options.family}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Família"
                                                                    helperText={touched.family && errors.family ? errors.family : ''}
                                                                    error={Boolean(touched.family && errors.family)}
                                                                />
                                                            )}
                                                            disabled={isDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Tipo de OS"
                                                            id="type_os"
                                                            type="text"
                                                            value={values.type_os}
                                                            name="type_os"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => {
                                                                setFieldValue('type_os', newValue);
                                                                setIdTypeOs(newValue.id);
                                                                setTypeOs(newValue);
                                                                getTeam(newValue.id, idUnit);
                                                                setFieldValue('type_equipament', '');
                                                            }}
                                                            options={optionsType}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Tipo de OS"
                                                                    helperText={touched.type_os && errors.type_os ? errors.type_os : ''}
                                                                    error={Boolean(touched.type_os && errors.type_os)}
                                                                />
                                                            )}
                                                            disabled={isDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Tipo de Equipamento"
                                                            id="type_equipament"
                                                            value={values.type_equipament}
                                                            name="type_equipament"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => setFieldValue('type_equipament', newValue)}
                                                            options={optionsEquipament}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Tipo de Equipamento"
                                                                    helperText={
                                                                        touched.type_equipament && errors.type_equipament
                                                                            ? errors.type_equipament
                                                                            : ''
                                                                    }
                                                                    error={Boolean(touched.type_equipament && errors.type_equipament)}
                                                                />
                                                            )}
                                                            disabled={isDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Tipo de Problema"
                                                            id="type_of_problem"
                                                            value={values.type_of_problem}
                                                            name="type_of_problem"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => setFieldValue('type_of_problem', newValue)}
                                                            options={options.typeOfProblem}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Tipo de Problema"
                                                                    helperText={
                                                                        touched.type_of_problem && errors.type_of_problem
                                                                            ? errors.type_of_problem
                                                                            : ''
                                                                    }
                                                                    error={Boolean(touched.type_of_problem && errors.type_of_problem)}
                                                                />
                                                            )}
                                                            disabled={isDisabled}
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            <Grid item xs={12} sx={{ marginTop: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.description_of_problem && errors.description_of_problem)}
                                                    label="Descrição"
                                                    multiline
                                                    rows={4}
                                                    id="description_of_problem"
                                                    type="text"
                                                    value={values.description_of_problem}
                                                    name="description_of_problem"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    helperText={
                                                        touched.description_of_problem && errors.description_of_problem
                                                            ? errors.description_of_problem
                                                            : ''
                                                    }
                                                    disabled={isDisabled}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{ marginTop: 2 }}>
                                                {/* <label>Upload</label> */}
                                                <ContentUpload>
                                                    <>
                                                        <Upload
                                                            disabled={params.action === 'view' ? true : false}
                                                            onUpload={handleUpload}
                                                            required={true}
                                                            accept={{
                                                                'image/jpeg': [],
                                                                'image/png': []
                                                            }}
                                                        />
    
                                                        {!!uploadedFiles.length && (
                                                            <FileList
                                                                action={params.action}
                                                                files={uploadedFiles}
                                                                onDelete={handleDelete}
                                                                required={true}
                                                            />
                                                        )}
                                                    </>
                                                </ContentUpload>
                                            </Grid>
                                        </Grid>
                                        {valuesEdit.timeline.length > 0 && (
                                            <>
                                                <h3 style={{ marginTop: '30px' }}>Atendimento</h3>
                                                <hr></hr>
                                                <OppositeContentTimeline timeline={valuesEdit.timeline} fim_atendimento={valuesEdit.fim_atendimento} inicio_atendimento={valuesEdit.inicio_atendimento} />
                                            </>
                                        )}
                                        {valuesEdit.arquivos_atendimento?.length > 0 && (
                                            <>
                                                <h3 style={{ marginTop: '30px' }}>Arquivos do Atendimento</h3>   
                                                <hr></hr>
                                                <CarouselArquivos arquivos={valuesEdit.arquivos_atendimento} />
                                             </>
                                        )}
                                        {id_role !== 3 || path === '/nova_corretiva' || path === '/nova_proativa' ? (
                                            <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                                {params.action && (
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
                                                            <ThemeProvider theme={themeButton}>
                                                                <AnimateButton>
                                                                    <Button
                                                                        disableElevation
                                                                        disabled={params.action == 'edit' ? false : true}
                                                                        fullWidth
                                                                        size="large"
                                                                        type="button"
                                                                        variant="contained"
                                                                        color="neutral"
                                                                        onClick={handleOpenDestroy}
                                                                    >
                                                                        Despachar
                                                                    </Button>
                                                                </AnimateButton>
                                                            </ThemeProvider>
                                                        </Box>
                                                    </Grid>
                                                )}
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
                                                {params.action === 'view' ? (
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={valuesEdit.status_id !== 1 || id_role == 4 || id_role == 7 || id_role == 9 ? true : false}
                                                                    component={Link}
                                                                    to={`/${path.split('/')[1]}/${params.id}/edit`}
                                                                    fullWidth
                                                                    size="large"
                                                                    variant="contained"
                                                                    color="primary"
                                                                >
                                                                    Editar
                                                                </Button>
                                                            </AnimateButton>
                                                        </Box>
                                                    </Grid>
                                                ) : (
                                                    <Grid item>
                                                        <Box sx={{ mt: 2, mr: 3 }}>
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
                                                        </Box>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        ) : (
                                            <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                                <Grid item>
                                                    <Box sx={{ mt: 2, mr: 3 }}>
                                                        <ThemeProvider theme={themeButton}>
                                                            <AnimateButton>
                                                                <Button
                                                                    disableElevation
                                                                    disabled={isSubmitting}
                                                                    fullWidth
                                                                    size="large"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleInit}
                                                                >
                                                                    Iniciar
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
                                        )}
                                        {errors.submit && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}
                                    </form>
                                </MainCard>
                            </div>
                        </>
                    )}
                }
                
            </Formik>
        </>
    );
};

export default Task;
