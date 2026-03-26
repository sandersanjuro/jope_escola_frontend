import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
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
    Radio,
    RadioGroup,
    FormLabel
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
import { getResourceTask, postTask, getOperatingTask, getSlaTask, getTimesSla, getTaskPerId, updateTask } from 'services/task';
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
import NumberFormat from 'react-number-format';
import { days, months, weeks } from './Docs/docs';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Rotina = ({ ...others }) => {
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
    const initialStateOptions = {
        typeOfEquipament: [],
        typeOfProblem: [],
        unit: [],
        typeOfOs: [],
        natureOfOperation: [],
        family: [],
        categories: []
    };
    const initialValues = {
        name: useSelector((state) => state.auth.user.nome),
        email: useSelector((state) => state.auth.user.email),
        type_os: '',
        unit: '',
        nature_of_operation: '',
        opening_date: new Date(),
        type_equipament: '',
        operative: '',
        type_of_problem: '',
        description_of_problem: '',
        family: '',
        sla: '',
        week: '',
        day: '',
        months: [],
        dayMonth: 'Dia Fixo'
    };
    const path = window.location.pathname;
    const moduleOs =
        path === '/nova_corretiva' || path.split('/')[1] === 'corretiva'
            ? 1
            : path === '/nova_preventiva' || path.split('/')[1] === 'preventiva'
            ? 2
            : '';
    const titleModule = moduleOs === 1 ? 'CORRETIVAS' : moduleOs === 2 ? 'PREVENTIVAS' : '';
    const optionsDay = days;
    const optionsMonth = months;
    const optionsWeek = weeks;
    const navigate = useNavigate();
    const theme = useTheme();
    const params = useParams();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [options, setOptions] = useState(initialStateOptions);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [idCategory, setIdCategory] = useState('');
    const [idUnit, setIdUnit] = useState('');
    const [valuesEdit, setValuesEdit] = useState(initialValues);
    const [atendimento, setAtendimento] = useState('');
    const [solucao, setSolucao] = useState('');
    const [idSla, setIdSla] = useState('');
    const [operatings, setOperatings] = useState([]);
    const [idOperating, setIdOperating] = useState('');
    const [optionsSla, setOptionsSla] = useState([]);
    const [currentOperating, setCurrentOperating] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [openingDate, setOpeningDate] = useState(new Date());
    const [errorValidate, setErrorValidate] = useState({});
    const isDisabled = params.action === 'view' ? true : false;
    useEffect(() => {
        getResource();
    }, []);
    useEffect(() => {
        taskPerId();
    }, [params.id]);
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
    function taskPerId() {
        params.action &&
            getTaskPerId(params.id).then((resp) => {
                console.log(resp.data);
                setIdUnit({ id: resp.data.unidade_id, label: resp.data.unidade });
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
                    dayMonth: initialValues.dayMonth
                });
                setOpeningDate(resp.data.data_abertura);
                setIdSla(resp.data.sla);
                setAtendimento(resp.data.sla_atendimento);
                setSolucao(resp.data.sla_solucao);
                setIdOperating(resp.data.operating);
            });
    }
    function getSla() {
        getSlaTask(idUnit ? idUnit.id : '').then((resp) => setOptionsSla(resp.data.sla));
    }
    function getResource() {
        console.log(window.location);
        getResourceTask().then((resp) => setOptions(resp.data));
    }
    function getOperatings() {
        getOperatingTask(idUnit ? idUnit.id : '', idCategory ? idCategory.id : '').then((resp) => setOperatings(resp.data.operating));
    }
    function setIdMonths(valueMonths) {
        let idMonth = [];
        valueMonths.forEach((element) => {
            let valueId = optionsMonth.filter((desc) => desc.label === element)[0];
            idMonth = [...idMonth, valueId];
        });
        return idMonth;
    }
    function formatDateTime(dateTime) {
        let dateTimeFull = params.action ? new Date(dateTime) : dateTime;
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
        return operatindsId.map((desc) => (
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
                            <Typography fontSize={18}>
                                <b>Quantidade : </b>
                                {quantidade}
                            </Typography>
                        </>
                    }
                    handleDelete={handleDeleteOperating}
                    idDelete={desc.id}
                    action={params.action ? true : false}
                />
            </Grid>
        ));
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name,
                    email: valuesEdit.email,
                    submit: null,
                    type_os: valuesEdit.type_os,
                    unit: valuesEdit.unit,
                    nature_of_operation: valuesEdit.week,
                    opening_date: valuesEdit.opening_date,
                    type_equipament: valuesEdit.type_equipament,
                    operative: valuesEdit.operative,
                    type_of_problem: valuesEdit.type_of_problem,
                    description_of_problem: valuesEdit.description_of_problem,
                    family: valuesEdit.family,
                    sla: valuesEdit.sla,
                    moduleOs: moduleOs,
                    week: valuesEdit.week,
                    day: valuesEdit.day,
                    months: valuesEdit.months || [],
                    dayMonth: valuesEdit.dayMonth
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required('Nome obrigatório'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    type_os: Yup.object().required('Tipo de Os obrigatório'),
                    unit: Yup.object().required('Unidade obrigatório'),
                    nature_of_operation: Yup.object().required('Natureza de Operação obrigatório'),
                    opening_date: Yup.string().required('Data de abertura obrigatório'),
                    type_equipament: Yup.object().required('Tipo de equipamento obrigatório'),
                    type_of_problem: Yup.object().required('Tipo de problema obrigatório'),
                    description_of_problem: Yup.string().required('Descrição do problema obrigatório'),
                    family: Yup.object().required('Família Obrigatório'),
                    months: Yup.array().required('Meses Obrigatório').min(1, 'Necessário escolher meses')
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
                        let idMonths = setIdMonths(values.months);
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
                                        {`GERADOR DE PROTATIVAS`}
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
                                {error || alert ? (
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
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
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
                                        </Grid>
                                    </Grid>
                                    <h3>Ativos</h3>
                                    <hr></hr>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
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
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
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
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                            <NumberFormat
                                                fullWidth
                                                id="outlined-quantidade"
                                                type="text"
                                                label="Quantidade"
                                                value={quantidade}
                                                onChange={(e) => setQuantidade(e.target.value)}
                                                onBlur={handleBlur}
                                                name="quantidade"
                                                disabled={isDisabled}
                                                customInput={TextField}
                                                isAllowed={(values) => {
                                                    const { floatValue, formattedValue } = values;
                                                    return formattedValue === '' || (floatValue >= 1 && floatValue <= 99);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                                            <IconButtonMaterial aria-label="adicionar" onClick={handleOperating}>
                                                <MoreVertIcon />
                                            </IconButtonMaterial>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        {renderOperatings()}
                                    </Grid>
                                    <h3 style={{ marginTop: '50px' }}>Informações</h3>
                                    <hr></hr>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Definir dia do mês à gerar ordem de serviço</FormLabel>
                                                <RadioGroup
                                                    onChange={handleChange}
                                                    row
                                                    aria-label="Definir dia do mês à gerar ordem de serviço"
                                                    name="dayMonth"
                                                    value={values.dayMonth}
                                                >
                                                    <FormControlLabel value="Dia Fixo" control={<Radio />} label="Dia Fixo" />
                                                    <FormControlLabel value="Semana Fixa" control={<Radio />} label="Semana Fixa" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                select
                                                label="Semana"
                                                id="week"
                                                value={values.week}
                                                name="week"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('week', newValue)}
                                                options={optionsWeek}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Semana"
                                                        helperText={touched.week && errors.week ? errors.week : ''}
                                                        error={Boolean(touched.week && errors.week)}
                                                    />
                                                )}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                select
                                                label="Dia"
                                                id="day"
                                                value={values.day}
                                                name="day"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('day', newValue)}
                                                options={optionsDay}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Dia"
                                                        helperText={touched.day && errors.day ? errors.day : ''}
                                                        error={Boolean(touched.day && errors.day)}
                                                    />
                                                )}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                            <FormControl
                                                sx={{ width: '100%' }}
                                                error={Boolean(touched.months && errors.months) || Boolean(errorValidate.months)}
                                            >
                                                <InputLabel id="months">Meses</InputLabel>
                                                <Select
                                                    labelId="months"
                                                    onBlur={handleBlur}
                                                    multiple
                                                    name="months"
                                                    id="months"
                                                    value={values.months}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            'months',
                                                            typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                                                        )
                                                    }
                                                    input={<OutlinedInput label="MesesS" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                    MenuProps={MenuProps}
                                                    disabled={isDisabled}
                                                >
                                                    {optionsMonth.map((option) => (
                                                        <MenuItem key={option.value} value={option.label}>
                                                            <Checkbox checked={values.months.indexOf(option.label) > -1} />
                                                            <ListItemText primary={option.label} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errorValidate.months && (
                                                    <FormHelperText error id="standard-weight-helper-text--months">
                                                        {errorValidate.months}
                                                    </FormHelperText>
                                                )}
                                                {touched.months && errors.months && (
                                                    <FormHelperText error id="standard-weight-helper-text--months">
                                                        {errors.months}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
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
                                                            // disabled={isSubmitting}
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

export default Rotina;
