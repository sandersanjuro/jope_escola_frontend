import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Snackbar, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import { getResourceSla, postSla, getSlaPerId, updateSla } from 'services/sla';
import { useSelector } from 'react-redux';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const User = ({ ...others }) => {
    const params = useParams();
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
    const initialValuesEdit = {
        name: '',
        negocio_id: '',
        calendario_id: '',
        sunday: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        horaini: '',
        horafim: '',
        sla_atendimento: '',
        sla_solucao: '',
        prioridade: ''
    };
    const prioridade = [
        {
            title: 'Baixa',
            id: 1
        },
        {
            title: 'Média',
            id: 2
        },
        {
            title: 'Alta',
            id: 3
        }
    ];

    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [options, setOptions] = useState('');
    const [errorValidate, setErrorValidate] = useState({});
    const isDisabled = params.action === 'view' ? true : false;
    const negocio_id = useSelector((state) => state.auth.user.negocio_id);
    useEffect(() => {
        viewPerId();
    }, [params.id]);
    useEffect(() => {
        getResource();
    }, []);
    function viewPerId() {
        params.action &&
            getSlaPerId(params.id).then((resp) => {
                setValuesEdit({
                    name: resp.data.name,
                    negocio_id: resp.data.negocio_id,
                    calendario_id: resp.data.calendario_id,
                    sunday: resp.data.sunday === 1 ? true : false,
                    monday: resp.data.monday === 1 ? true : false,
                    tuesday: resp.data.tuesday === 1 ? true : false,
                    wednesday: resp.data.wednesday === 1 ? true : false,
                    thursday: resp.data.thursday === 1 ? true : false,
                    friday: resp.data.friday === 1 ? true : false,
                    saturday: resp.data.saturday === 1 ? true : false,
                    horaini: resp.data.horaini,
                    horafim: resp.data.horafim,
                    sla_atendimento: resp.data.sla_atendimento,
                    sla_solucao: resp.data.sla_solucao,
                    prioridade: resp.data.prioridade
                });
            });
    }
    function getResource() {
        getResourceSla().then((resp) => setOptions(resp.data));
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name,
                    business: valuesEdit.negocio_id,
                    calendar: valuesEdit.calendario_id,
                    sunday: valuesEdit.sunday,
                    monday: valuesEdit.monday,
                    tuesday: valuesEdit.tuesday,
                    wednesday: valuesEdit.wednesday,
                    thursday: valuesEdit.thursday,
                    friday: valuesEdit.friday,
                    saturday: valuesEdit.saturday,
                    horaini: valuesEdit.horaini,
                    horafim: valuesEdit.horafim,
                    sla_atendimento: valuesEdit.sla_atendimento,
                    sla_solucao: valuesEdit.sla_solucao,
                    prioridade: valuesEdit.prioridade,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(50, 'Permitido máximo de 50 caracteres').trim().required('Nome obrigatório'),
                    sla_atendimento: Yup.number()
                        .positive('Digite um número positivo')
                        .max(900, 'máxima permitida: 900 horas')
                        .required('Hora inicial obrigatória'),
                    sla_solucao: Yup.number()
                        .positive('Digite um número positivo')
                        .max(900, 'Hora máxima permitida: 900 horas')
                        .required('Hora inicial obrigatória'),
                    prioridade: Yup.number().required('Prioridade é obrigatória'),
                    business: Yup.number().required('Negócio é obrigatório'),
                    calendar: Yup.number().required('Calendário é obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        const data = {
                            nome: values.name,
                            prioridade: values.prioridade,
                            negocio_id: values.business,
                            calendario_id: values.calendar,
                            horaini: values.horaini,
                            horafim: values.horafim,
                            sla_atendimento: values.sla_atendimento,
                            sla_solucao: values.sla_solucao,
                            sunday: values.sunday === true ? 1 : 0,
                            monday: values.monday === true ? 1 : 0,
                            tuesday: values.tuesday === true ? 1 : 0,
                            wednesday: values.wednesday === true ? 1 : 0,
                            thursday: values.thursday === true ? 1 : 0,
                            friday: values.friday === true ? 1 : 0,
                            saturday: values.saturday === true ? 1 : 0
                        };
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateSla(params.id, data)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    viewPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        setSuccess('');
                                        navigate('/slas');
                                    }, 3000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error || Object.values(e.response.data.errorValidate).flat().join());
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                        } else {
                            postSla(data)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        navigate('/slas');
                                        setSuccess('');
                                    }, 2000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error || Object.values(e.response.data.errorValidate).flat().join());
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                        }
                    } catch (err) {
                        console.error(err);
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
                                    <Loading color="#015641" type="cubes" />
                                </MainCard>
                            </Grid>
                        )}
                        <MainCard spacing={gridSpacing} style={{ padding: 15, margin: 25 }}>
                            <Grid xs={12} md={12} sm={12} container>
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
                                    Cadastro de SLA
                                </h1>
                                <hr style={{ width: '100%', marginTop: 0 }}></hr>
                            </Grid>
                            {error || alert ? (
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
                            <div style={{ display: loading ? 'none' : 'block' }}>
                                <form noValidate onSubmit={handleSubmit} {...others}>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.name && errors.name) || Boolean(errorValidate.name)}
                                                id="outlined-name"
                                                type="text"
                                                label="Nome"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="name"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.name && errors.name ? errors.name : errorValidate.name ? errorValidate.name : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.prioridade && errors.prioridade) || Boolean(errorValidate.prioridade)
                                                }
                                                select
                                                label="Prioridade"
                                                id="prioridade"
                                                type="text"
                                                value={values.prioridade || ''}
                                                name="prioridade"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.prioridade && errors.prioridade
                                                        ? errors.prioridade
                                                        : errorValidate.prioridade
                                                        ? errorValidate.prioridade
                                                        : ''
                                                }
                                            >
                                                {prioridade.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.title}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.calendar && errors.calendar) || Boolean(errorValidate.calendar)}
                                                select
                                                label="Calendário"
                                                id="calendar"
                                                type="text"
                                                value={values.calendar || ''}
                                                name="calendar"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.calendar && errors.calendar
                                                        ? errors.calendar
                                                        : errorValidate.calendar
                                                        ? errorValidate.calendar
                                                        : ''
                                                }
                                            >
                                                {options !== '' &&
                                                    options.calendar.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.nome}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.business && errors.business) || Boolean(errorValidate.business)}
                                                select
                                                label="Negócio"
                                                id="business"
                                                type="text"
                                                value={values.business || ''}
                                                name="business"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.business && errors.business
                                                        ? errors.business
                                                        : errorValidate.business
                                                        ? errorValidate.business
                                                        : ''
                                                }
                                            >
                                                {options !== '' &&
                                                    options.business.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.nome}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.horaini && errors.horaini) || Boolean(errorValidate.horaini)}
                                                id="horaini"
                                                type="time"
                                                label="Hora inicial"
                                                InputLabelProps={{ shrink: true }}
                                                value={values.horaini || null}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                horaini="horaini"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.horaini && errors.horaini
                                                        ? errors.horaini
                                                        : errorValidate.horaini
                                                        ? errorValidate.horaini
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.horafim && errors.horafim) || Boolean(errorValidate.horafim)}
                                                id="horafim"
                                                type="time"
                                                label="Hora Final"
                                                InputLabelProps={{ shrink: true }}
                                                value={values.horafim || null}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                horafim="horafim"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.horafim && errors.horafim
                                                        ? errors.horafim
                                                        : errorValidate.horafim
                                                        ? errorValidate.horafim
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.sla_atendimento && errors.sla_atendimento) ||
                                                    Boolean(errorValidate.sla_atendimento)
                                                }
                                                id="sla_atendimento"
                                                type="number"
                                                label={negocio_id == 2 ? "SLA Atendimento (Horas)" : "SLA Atendimento (Minutos)"}
                                                InputLabelProps={{ shrink: true }}
                                                value={values.sla_atendimento || null}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                sla_atendimento="sla_atendimento"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.sla_atendimento && errors.sla_atendimento
                                                        ? errors.sla_atendimento
                                                        : errorValidate.sla_atendimento
                                                        ? errorValidate.sla_atendimento
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.sla_solucao && errors.sla_solucao) || Boolean(errorValidate.sla_solucao)
                                                }
                                                id="sla_solucao"
                                                type="number"
                                                label={negocio_id == 2 ? "SLA Solução (Horas)" : "SLA Solução (Minutos)"}
                                                value={values.sla_solucao || null}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                sla_solucao="sla_solucao"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.sla_solucao && errors.sla_solucao
                                                        ? errors.sla_solucao
                                                        : errorValidate.sla_solucao
                                                        ? errorValidate.sla_solucao
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Dias da semana que o SLA é válido</FormLabel>
                                                <FormGroup aria-label="position" row>
                                                    <FormControlLabel
                                                        checked={values.sunday}
                                                        value={values.sunday}
                                                        control={<Checkbox />}
                                                        label="Domingo"
                                                        labelPlacement="Domingo"
                                                        onChange={(e) => setFieldValue('sunday', e.target.checked)}
                                                        disabled={isDisabled}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.monday}
                                                        value={values.monday}
                                                        control={<Checkbox />}
                                                        label="Segunda-feira"
                                                        labelPlacement="Segunda-feira"
                                                        onChange={(e) => setFieldValue('monday', e.target.checked)}
                                                        disabled={isDisabled}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.tuesday}
                                                        value={values.tuesday}
                                                        control={<Checkbox />}
                                                        label="Terça-feira"
                                                        labelPlacement="Terça-feira"
                                                        disabled={isDisabled}
                                                        onChange={(e) => setFieldValue('tuesday', e.target.checked)}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.wednesday}
                                                        disabled={isDisabled}
                                                        value={values.wednesday}
                                                        control={<Checkbox />}
                                                        label="Quarta-feira"
                                                        labelPlacement="Quarta-feira"
                                                        onChange={(e) => setFieldValue('wednesday', e.target.checked)}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.thursday}
                                                        disabled={isDisabled}
                                                        value={values.thursday}
                                                        control={<Checkbox />}
                                                        label="Quinta-feira"
                                                        labelPlacement="Quinta-feira"
                                                        onChange={(e) => setFieldValue('thursday', e.target.checked)}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.friday}
                                                        disabled={isDisabled}
                                                        value={values.friday}
                                                        control={<Checkbox />}
                                                        label="Sexta-feira"
                                                        labelPlacement="Sexta-feira"
                                                        onChange={(e) => setFieldValue('friday', e.target.checked)}
                                                    />
                                                    <FormControlLabel
                                                        checked={values.saturday}
                                                        disabled={isDisabled}
                                                        value={values.saturday}
                                                        control={<Checkbox />}
                                                        label="Sábado"
                                                        labelPlacement="Sábado"
                                                        onChange={(e) => setFieldValue('saturday', e.target.checked)}
                                                    />
                                                </FormGroup>
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
                                                            to={`/sla/${params.id}/edit`}
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
                            </div>
                        </MainCard>
                    </>
                )}
            </Formik>
        </>
    );
};

export default User;
