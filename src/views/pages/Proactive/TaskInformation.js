import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Upload from 'components/Upload/upload';
import FileList from 'components/FileList/FileList';
import { ContentUpload } from 'components/Upload/styles';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const TaskInformation = ({ ...others }) => {
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
        timeline: []
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
    const [team, setTeam] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
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
                timeline: resp.data.timeline
            });
            setTechinal(resp.data.technicals.map((res) => res.tecnico));
            setOpeningDate(resp.data.data_abertura);
            setIdSla(resp.data.sla);
            setAtendimento(resp.data.sla_atendimento);
            setSolucao(resp.data.sla_solucao);
            setIdOperating(resp.data.operating);
            setUploadedFiles(
                resp.data.file.map((desc) => ({
                    id: desc.id,
                    name: desc.name,
                    readableSize: filesize(desc.size),
                    url: desc.url,
                    viewURL: desc.url
                }))
            );
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
                    moduleOs: moduleOs
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
                        const data = {
                            ...values,
                            opening_date: formatDateTime(values.opening_date),
                            idOperating: idOperating,
                            slaAtendimento: atendimento,
                            slaConclusao: solucao,
                            sla: values.sla ? values.sla.id : ''
                        };
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
                                                    options={options.team}
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
                                                                fullWidth
                                                                size="large"
                                                                type="submit"
                                                                variant="contained"
                                                                color="error"
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
                                                                onClick={dispatchTechinal}
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
                                <form noValidate onSubmit={handleSubmit} {...others}>
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
                                                            disabled={params.action ? true : false}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </>
                                    {optionsSla.length > 0 && loading == false && moduleOs !== 2 && (
                                        <>
                                            <h3>Sla</h3>
                                            <hr></hr>
                                            <Grid container spacing={matchDownSM ? 0 : 2}>
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
                                                            disabled={params.action ? true : false}
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
                                            </Grid>
                                        </>
                                    )}
                                    <h3>Ativos</h3>
                                    <hr></hr>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        {renderOperatings()}
                                    </Grid>
                                    <h3 style={{ marginTop: '30px' }}>Informações da OS</h3>
                                    <hr></hr>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <>
                                            <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
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
                                            </Grid>
                                            <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    select
                                                    label="Tipo de OS"
                                                    id="type_os"
                                                    type="text"
                                                    value={values.type_os}
                                                    name="type_os"
                                                    onBlur={handleBlur}
                                                    onChange={(e, newValue) => setFieldValue('type_os', newValue)}
                                                    options={options.typeOfOs}
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
                                            <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    select
                                                    label="Família"
                                                    id="family"
                                                    type="text"
                                                    value={values.family}
                                                    name="family"
                                                    onBlur={handleBlur}
                                                    onChange={(e, newValue) => setFieldValue('family', newValue)}
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
                                            <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    select
                                                    label="Tipo de Equipamento"
                                                    id="type_equipament"
                                                    value={values.type_equipament}
                                                    name="type_equipament"
                                                    onBlur={handleBlur}
                                                    onChange={(e, newValue) => setFieldValue('type_equipament', newValue)}
                                                    options={options.typeOfEquipament}
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
                                                        disabled={true}
                                                        accept={{
                                                            'image/jpeg': [],
                                                            'image/png': []
                                                        }}
                                                    />

                                                    {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
                                                </>
                                            </ContentUpload>
                                        </Grid>
                                    </Grid>
                                    {valuesEdit.timeline.length > 0 && (
                                        <>
                                            {/* <h3 style={{ marginTop: '30px' }}>Atendimento</h3> */}
                                            <hr></hr>
                                            <OppositeContentTimeline timeline={valuesEdit.timeline} />
                                        </>
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

export default TaskInformation;
