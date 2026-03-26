import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { uniqueId } from 'lodash';

import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Snackbar, IconButton } from '@mui/material';

import { Formik } from 'formik';
import * as Yup from 'yup';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import MoreVertIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import { updateOperating } from 'services/operating';
import { postCalendar, updateCalendar, getCalendarPerId } from 'services/calendar';
import 'react-toggle/style.css';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Calendar = ({ ...others }) => {
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
    const initialMaintenance = {
        id: '',
        nome: '',
        data_feriado: ''
    };
    const initialValuesEdit = {
        title: ''
    };
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [errorValidate, setErrorValidate] = useState({});
    const isDisabled = params.action === 'view' ? true : false;
    const [maintenance, setMaintenance] = useState([]);
    const [currentMaintenance, setCurrentMaintenance] = useState(initialMaintenance);
    useEffect(() => {
        viewPerId();
    }, [params.idOperating]);

    function viewPerId() {
        getCalendarPerId(params.id).then((resp) => {
            setValuesEdit({
                title: resp.data.nome
            }),
                setMaintenance(
                    resp.data.calendarioFeriado.map((desc) => ({
                        id: desc.id,
                        nome: desc.nome,
                        data_feriado: desc.data_feriado
                    }))
                );
        });
    }
    const handleChangeInput = (e) => {
        let name = e.target.name;
        setCurrentMaintenance({ ...currentMaintenance, [name]: e.target.value });
    };

    const handleMaintenance = () => {
        let maintenanceObject = { ...currentMaintenance, id: uniqueId() };
        setError('');
        setMaintenance([...maintenance, maintenanceObject]);
        setCurrentMaintenance(initialMaintenance);
    };
    const handleDeleteMaintenance = (id) => {
        setMaintenance(maintenance.filter((desc) => parseInt(desc.id) !== parseInt(id)));
    };
    function renderMaintenance() {
        let maintenanceRender = maintenance || [];
        return maintenanceRender.map((desc) => (
            <Grid key={desc.id} container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                    <TextField
                        fullWidth
                        id="outlined-nome"
                        type="text"
                        label="Feriado"
                        value={desc.nome}
                        disabled={true}
                        name="nome"
                        customInput={TextField}
                    />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                    <TextField
                        fullWidth
                        id="outlined-date"
                        type="date"
                        label="Desde"
                        value={desc.data_feriado}
                        name="data_feriado"
                        disabled={true}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={1} sx={{ marginTop: 4 }}>
                    <IconButton aria-label="remover" onClick={() => handleDeleteMaintenance(desc.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        ));
    }

    return (
        <>
            <Formik
                initialValues={{
                    title: valuesEdit.title,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().max(80).trim().required('Título obrigatório')
                })}
                enableReinitialize
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        const data = { calendarioFeriado: maintenance, nome: values.title };
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateCalendar(params.id, data)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    viewPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        navigate('/calendarios');
                                        setSuccess('');
                                    }, 3000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setErrorValidate(e.response.data.errorValidate);
                                    setError(e.response.data.error);
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                        } else {
                            postCalendar(data)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        navigate('/calendarios');
                                        setSuccess('');
                                    }, 2000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error);
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
                                    CALENDÁRIO
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
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.title && errors.title) || Boolean(errorValidate.title)}
                                                id="outlined-title"
                                                type="text"
                                                label="Título"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="title"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.title && errors.title
                                                        ? errors.title
                                                        : errorValidate.title
                                                        ? errorValidate.title
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <h3>Adicionar Feriado</h3>
                                    <hr></hr>
                                    <Grid container spacing={matchDownSM ? 0 : 2} sx={{ mb: 10 }}>
                                        <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.nome && errors.nome) || Boolean(errorValidate.nome)}
                                                id="outlined-nome"
                                                type="text"
                                                label="Novo Feriado"
                                                value={currentMaintenance.nome}
                                                onChange={handleChangeInput}
                                                onBlur={handleBlur}
                                                name="nome"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.nome && errors.nome ? errors.nome : errorValidate.nome ? errorValidate.nome : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.date && errors.date)}
                                                id="outlined-date"
                                                type="date"
                                                label="Data do feriado"
                                                onChange={handleChangeInput}
                                                value={currentMaintenance.data_feriado}
                                                name="data_feriado"
                                                disabled={isDisabled}
                                                helperText={touched.date && errors.date ? errors.date : ''}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1} sx={{ marginTop: 4 }}>
                                            <IconButton aria-label="adicionar" onClick={handleMaintenance}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <h3>Feriados</h3>
                                    <hr></hr>
                                    {renderMaintenance()}
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
                                                            to={`/calendario/${params.id}/edit`}
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

export default Calendar;
