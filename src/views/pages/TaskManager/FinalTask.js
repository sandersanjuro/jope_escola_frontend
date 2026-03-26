import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-uialertse
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Stack, Snackbar, Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { finalAttendance, getTechnicalTask, taskEndPerId } from 'services/task';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import imageCompression from 'browser-image-compression';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FinalTask = ({ ...others }) => {
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
    const initialValues = {
        initialPhoto: '',
        description: '',
        finalPhoto: '',
        problemResolved: true,
        endDate: '',
        status_id: ''
    };
    const dispatch = useDispatch();
    const path = window.location.pathname;
    const navigate = useNavigate();
    const theme = useTheme();
    const params = useParams();
    const scriptedRef = useScriptRef();
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [valuesEdit, setValuesEdit] = useState(initialValues);
    const [isDisabled, setIdDisabled] = useState(true);
    const [technicals, setTechnicals] = useState('');
    const [finalPhoto, setFinalPhoto] = useState('');

    useEffect(() => {
        taskPerId();
    }, [params.id]);
    useEffect(() => {
        technicalPerOs();
    }, [params.id]);

    function taskPerId() {
        taskEndPerId(params.id).then((resp) => {
            setValuesEdit({
                ...initialValues,
                status_id: resp.data.status_id
            });
            setIdDisabled(resp.data.status_id === 5 ? true : false);
        });
    }
    function technicalPerOs() {
        getTechnicalTask(params.id).then((resp) => setTechnicals(resp.data));
    }
    function srcset(image, width, height, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`
        };
    }
    function formatDateTime(dateTime) {
        let dateTimeFull = params.action ? new Date(dateTime) : dateTime;
        const year = dateTimeFull.getFullYear();
        const month = dateTimeFull.getUTCMonth() + 1;
        const day = dateTimeFull.getDate().toString().padStart(2, '0');
        let date = `${year}-${month}-${day} ${dateTimeFull.getHours()}:${dateTimeFull.getMinutes()}`;
        return date;
    }

    async function handleFinalImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            setFinalPhoto(compressedFile);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Formik
                initialValues={{
                    initialPhoto: valuesEdit.initialPhoto,
                    description: valuesEdit.description,
                    submit: null,
                    finalPhoto: valuesEdit.finalPhoto,
                    problemResolved: valuesEdit.problemResolved,
                    technical: '',
                    date: new Date()
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    technical: id_role == 1 ? Yup.object().required('Técnico obrigatório') : '',
                    description: Yup.string().required('Descrição obrigatório'),
                    date: Yup.string().required('Data obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        const data = new FormData();
                        if (id_role == 1) {
                            data.append('technical', values.technical?.id);
                            data.append('date', formatDateTime(values.date));
                        }
                        data.append('initialPhoto', values.initialPhoto);
                        data.append('finalPhoto', finalPhoto);
                        data.append('description', values.description);
                        data.append('problemResolved', values.problemResolved === true ? 1 : 0);
                        console.log(data);
                        finalAttendance(params.id, data)
                            .then((resp) => {
                                dispatch({ type: 'SET_PAGE_TASK', payload: 1 });
                                setLoading(false);
                                setSuccess(resp.data.success);
                                setTimeout(() => {
                                    navigate({ pathname: `/corretivas` });
                                    // window.location.reload();
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
                                        {`OS${params.id}`}
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
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        {id_role == 1 && (
                                            <>
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
                                                                helperText={touched.technical && errors.technical ? errors.technical : ''}
                                                                error={Boolean(touched.technical && errors.technical)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                                    <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                        <Stack spacing={3}>
                                                            <DateTimePicker
                                                                fullWidth
                                                                ampm={false}
                                                                error={Boolean(touched.date && errors.date)}
                                                                label="Data de Abertura"
                                                                id="date"
                                                                type="date"
                                                                value={values.date}
                                                                name="date"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => setFieldValue('date', e)}
                                                                // onChange={(e) => setFieldValue('date', e)}
                                                                helperText={touched.date && errors.date ? errors.date : ''}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </>
                                        )}
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
                                                helperText={touched.description && errors.description ? errors.description : ''}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ marginTop: 3 }}>
                                            {isDisabled === true ? (
                                                <Carousel showThumbs={false}>
                                                    <div>
                                                        <img src={values.initialPhoto} alt="antes" />
                                                        <p className="legend">Antes</p>
                                                    </div>
                                                    <div>
                                                        <img src={values.finalPhoto} alt="depois" />
                                                        <p className="legend">Depois</p>
                                                    </div>
                                                </Carousel>
                                            ) : (
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Foto Depois"
                                                        multiline
                                                        type="text"
                                                        disabled={true}
                                                        value={finalPhoto ? finalPhoto.name : ''}
                                                    />
                                                    <IconButton color="primary" aria-label="upload picture" component="label">
                                                        <input
                                                            name="finalPhoto"
                                                            id="finalPhoto"
                                                            hidden
                                                            accept="image/*"
                                                            type="file"
                                                            disabled={isDisabled}
                                                            onChange={(e) => handleFinalImageUpload(e)}
                                                        />
                                                        <PhotoCamera />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sx={{ marginTop: 1 }}>
                                            <FormControlLabel
                                                value={values.problemResolved}
                                                control={
                                                    <Switch
                                                        disabled={isDisabled}
                                                        color="primary"
                                                        checked={values.problemResolved}
                                                        onChange={(e) => setFieldValue('problemResolved', !values.problemResolved)}
                                                    />
                                                }
                                                label="Problema Resolvido ?"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                        <Grid item>
                                            <Box sx={{ mt: 2, mr: 3 }}>
                                                <ThemeProvider theme={themeButton}>
                                                    <AnimateButton>
                                                        <Button
                                                            disableElevation
                                                            disabled={isSubmitting || isDisabled}
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
                            </MainCard>
                        </div>
                    </>
                )}
            </Formik>
        </>
    );
};

export default FinalTask;
