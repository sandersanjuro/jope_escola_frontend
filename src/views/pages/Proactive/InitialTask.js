import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
    ListItemText
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
    initialAttendance
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
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import imageCompression from 'browser-image-compression';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const InitialTask = ({ ...others }) => {
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
        description_initial: '',
        initialPhoto: '',
        status: ''
    };
    const path = window.location.pathname;
    const moduleOs =
        path === '/nova_corretiva' || path.split('/')[1] === 'corretiva'
            ? 1
            : path === '/nova_preventiva' || path.split('/')[1] === 'preventiva'
            ? 2
            : '';
    const titleModule = moduleOs === 1 ? 'CORRETIVAS' : moduleOs === 2 ? 'PREVENTIVAS' : '';
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
    const [idUnit, setIdUnit] = useState(useSelector((state) => state.user.unit || ''));
    const [valuesEdit, setValuesEdit] = useState(initialValues);
    const [atendimento, setAtendimento] = useState('');
    const [solucao, setSolucao] = useState('');
    const [idSla, setIdSla] = useState('');
    const [operatings, setOperatings] = useState([]);
    const [idOperating, setIdOperating] = useState('');
    const [optionsSla, setOptionsSla] = useState([]);
    const [currentOperating, setCurrentOperating] = useState('');
    const [openingDate, setOpeningDate] = useState(new Date());
    const isDisabled = params.action === 'view' ? true : false;
    const [openModal, setOpenModal] = useState(false);
    const [openModalFilter, setOpenModalFilter] = useState(false);
    const [techinal, setTechinal] = useState([]);
    const [optionsTechinal, setOptionsTechinal] = useState(initialStateOptionsTechinal);
    const [initialPhoto, setInitialPhoto] = useState('');
    const [description_initial, setDescriptionInitial] = useState('');
    const [team, setTeam] = useState('');
    useEffect(() => {
        getResource();
    }, []);
    useEffect(() => {
        taskPerId();
    }, [params.id]);
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
    }, [idUnit, idCategory]);
    function getTimeSla() {
        getTimesSla(idSla ? idSla.id : '', formatDateTime(openingDate)).then((resp) => {
            setAtendimento(resp.data.slaAtendimento);
            setSolucao(resp.data.slaConclusao);
        });
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

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseModalFilter = () => setOpenModalFilter(false);
    const handleOpenDestroy = () => {
        setOpenModal(true);
    };

    async function handleInitialImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            setInitialPhoto(compressedFile);
            console.log(compressedFile);
        } catch (error) {
            console.log(error);
        }
    }

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
                initialPhoto: resp.data.foto_antes,
                status: resp.data.status_id
            });
            setDescriptionInitial(resp.data.descricao_inicio_os);
            setInitialPhoto(resp.data.foto_antes);
            setTechinal(resp.data.technicals.map((res) => res.tecnico));
            setOpeningDate(resp.data.data_abertura);
            setIdSla(resp.data.sla);
            setAtendimento(resp.data.sla_atendimento);
            setSolucao(resp.data.sla_solucao);
            setIdOperating(resp.data.operating);
            // redirectFinal(resp.data.tecnico_id, resp.data.inicio_atendimento, resp.data.end ? resp.data.end.fim_atendimento : '');
        });
    }
    function getSla() {
        getSlaTask(idUnit).then((resp) => setOptionsSla(resp.data.sla));
    }
    function getResource() {
        console.log(window.location);
        getResourceTask().then((resp) => setOptions(resp.data));
    }
    function getTechinal() {
        getTechinalDispatch(team ? team.id : '').then((resp) => setOptionsTechinal(resp.data));
    }
    function getOperatings() {
        getOperatingTask(idUnit, idCategory ? idCategory.id : '').then((resp) => setOperatings(resp.data.operating));
    }
    const handleInit = (e) => {
        try {
            if (!description_initial) {
                return [
                    setError('Acrescente uma descrição inicial !'),
                    setTimeout(() => {
                        setError('');
                        // navigate({ pathname: `/atendimento/${params.id}` });
                    }, 3000)
                ];
            }
            setLoading(true);
            const data = new FormData();
            data.append('initialPhoto', initialPhoto);
            data.append('description_initial', description_initial);
            initialAttendance(params.id, data)
                .then((resp) => {
                    setError('');
                    setLoading(false);
                    setOpenModal(false);
                    setSuccess(resp.data.success);
                    taskPerId();
                    setTimeout(() => {
                        setSuccess('');
                        // navigate({ pathname: `/atendimento/${params.id}` });
                    }, 3000);
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

    function formatDateTime(dateTime) {
        let dateTimeFull = new Date(dateTime);
        const year = dateTimeFull.getFullYear();
        const month = dateTimeFull.getUTCMonth() + 1;
        const day = dateTimeFull.getDate().toString().padStart(2, '0');
        let opening_date = `${year}-${month}-${day} ${dateTimeFull.getHours()}:${dateTimeFull.getMinutes()}`;
        return opening_date;
    }
    const handleOperating = () => {
        setError('');
        setIdOperating([...idOperating, currentOperating]);
        setIdCategory('');
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
                                    <b>Categoria: </b>
                                    {desc.categoria}
                                </Typography>
                                <Typography fontSize={18}>
                                    <b>Andar : </b>
                                    {desc.andar}
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
            let idTechinal = setIdTechinal();
            const data = {
                idTask: params.id,
                technical: idTechinal
            };
            setLoading(true);
            postDispatchTechnical(data)
                .then((resp) => {
                    setLoading(false);
                    setOpenModal(false);
                    setSuccess(resp.data.success);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
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
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name,
                    email: valuesEdit.email,
                    submit: null,
                    type_os: valuesEdit.type_os,
                    unit: valuesEdit.unit,
                    nature_of_operation: valuesEdit.nature_of_operation,
                    opening_date: valuesEdit.opening_date,
                    type_equipament: valuesEdit.type_equipament,
                    operative: valuesEdit.operative,
                    type_of_problem: valuesEdit.type_of_problem,
                    description_of_problem: valuesEdit.description_of_problem,
                    family: valuesEdit.family,
                    sla: valuesEdit.sla,
                    moduleOs: moduleOs,
                    initialPhoto: valuesEdit.initialPhoto
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required('Nome obrigatório'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    type_os: Yup.object().required('Tipo de Os obrigatório'),
                    nature_of_operation: Yup.object().required('Natureza de Operação obrigatório'),
                    opening_date: Yup.string().required('Data de abertura obrigatório'),
                    type_equipament: Yup.object().required('Tipo de equipamento obrigatório'),
                    type_of_problem: Yup.object().required('Tipo de problema obrigatório'),
                    description_of_problem: Yup.string().required('Descrição do problema obrigatório'),
                    family: Yup.object().required('Família Obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        if (idOperating.length <= 0) {
                            return setError('É necessário adicionar ativos');
                        }
                        setLoading(true);
                        const data = new FormData();
                        data.append('initialPhoto', values.initialPhoto);
                        data.append('opening_date', formatDateTime(values.opening_date));
                        data.append('idOperating', idOperating);
                        data.append('slaAtendimento', atendimento);
                        data.append('slaConclusao', solucao);
                        data.append('sla', values.sla ? values.sla.id : '');
                        if (params.action === 'edit') {
                            updateTask(params.id, data)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    taskPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        setSuccess('');
                                    }, 3000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error);
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                        } else {
                            postTask(data)
                                .then((resp) => {
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        window.location.reload();
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
                        }
                        // console.log(data);
                    } catch (err) {
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
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
                                        {id_role !== 3 ? `ORDEM DE SERVIÇO - ${titleModule}` : `OS${params.id}`}
                                    </h1>
                                    <hr style={{ width: '100%', marginTop: 0 }}></hr>
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
                                <form noValidate onSubmit={handleSubmit} {...others}>
                                    {optionsSla.length > 0 && loading == false && moduleOs !== 2 && (
                                        <>
                                            <h3>Sla</h3>
                                            <hr></hr>
                                            <Grid container spacing={matchDownSM ? 0 : 2}>
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
                                            </Grid>
                                        </>
                                    )}
                                    <h3>Ativos</h3>
                                    <hr></hr>
                                    {!params.action && (
                                        <Grid container spacing={matchDownSM ? 0 : 2}>
                                            <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    select
                                                    label="Categoria"
                                                    id="category"
                                                    value={idCategory}
                                                    name="category"
                                                    onChange={(e, newValue) => setIdCategory(newValue)}
                                                    options={options.categories}
                                                    renderInput={(params) => <TextField {...params} label="Categoria" />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    select
                                                    label="Ativos"
                                                    id="operative"
                                                    name="operative"
                                                    value={currentOperating}
                                                    onChange={(e, newValue) => setCurrentOperating(newValue)}
                                                    options={operatings}
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
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sx={{ marginTop: 2 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.description_initial && errors.description_initial)}
                                                label="Descrição Atendimento"
                                                multiline
                                                rows={4}
                                                id="description_initial"
                                                type="text"
                                                value={description_initial}
                                                name="description_initial"
                                                onBlur={handleBlur}
                                                onChange={(e) => setDescriptionInitial(e.target.value)}
                                                helperText={
                                                    touched.description_initial && errors.description_initial
                                                        ? errors.description_initial
                                                        : ''
                                                }
                                                disabled={valuesEdit.end ? true : false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sx={{ marginTop: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Foto Antes"
                                                multiline
                                                type="text"
                                                disabled={true}
                                                value={initialPhoto ? initialPhoto.name : ''}
                                            />
                                            <IconButton
                                                disabled={valuesEdit.initial ? true : false}
                                                color="primary"
                                                aria-label="upload picture"
                                                component="label"
                                            >
                                                <input
                                                    name="initialPhoto"
                                                    id="initialPhoto"
                                                    hidden
                                                    accept="image/*"
                                                    type="file"
                                                    disabled={valuesEdit.initial ? true : false}
                                                    onChange={(e) => handleInitialImageUpload(e)}
                                                />
                                                <PhotoCamera />
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                    {valuesEdit.end && (
                                        <Carousel showThumbs={false}>
                                            <div>
                                                <img src={valuesEdit.end?.foto_antes} alt="antes" />
                                                <p className="legend">Antes</p>
                                            </div>
                                            <div>
                                                <img src={valuesEdit.end?.foto_depois} alt="depois" />
                                                <p className="legend">Depois</p>
                                            </div>
                                        </Carousel>
                                    )}
                                    {/* {valuesEdit.end && (
                                        <>
                                            <h3 style={{ marginTop: '30px' }}>Atendimento</h3>
                                            <hr></hr>
                                            <OppositeContentTimeline
                                                initialDate={valuesEdit.end.inicio_atendimento}
                                                finalDate={valuesEdit.end.fim_atendimento}
                                                initialTechnical={valuesEdit.end.tecnico_inicio}
                                                finalTechnical={valuesEdit.end.tecnico_inicio}
                                                initialPhoto={valuesEdit.end.foto_antes}
                                                finalPhoto={valuesEdit.end.foto_depois}
                                            />
                                        </>
                                    )} */}
                                    <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                        <Grid item>
                                            <Box sx={{ mt: 2 }}>
                                                <ThemeProvider theme={themeButton}>
                                                    <AnimateButton>
                                                        {!valuesEdit.end ? (
                                                            <Button
                                                                disableElevation
                                                                disabled={isSubmitting}
                                                                fullWidth
                                                                size="small"
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={handleInit}
                                                            >
                                                                Iniciar
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                disableElevation
                                                                disabled={valuesEdit.status === 5 ? true : false}
                                                                fullWidth
                                                                size="small"
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => navigate({ pathname: `/atendimento/${params.id}` })}
                                                            >
                                                                Finalizar
                                                            </Button>
                                                        )}
                                                    </AnimateButton>
                                                </ThemeProvider>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{ mt: 2, ml: 1 }}>
                                                <ThemeProvider theme={themeButton}>
                                                    <AnimateButton>
                                                        <Button
                                                            disableElevation
                                                            disabled={isSubmitting}
                                                            fullWidth
                                                            size="small"
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
                            </MainCard>
                        </div>
                    </>
                )}
            </Formik>
        </>
    );
};

export default InitialTask;
