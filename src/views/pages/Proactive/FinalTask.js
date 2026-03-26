import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-uialertse
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Stack, Snackbar, Autocomplete, Typography } from '@mui/material';
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
import { parse } from 'date-fns';
import { getDatabaseDate } from 'utils/date';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


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
        status_id: '',
        data_abertura: '',
        inicio_atendimento: ''
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
            const parsedDate = resp.data.inicio_atendimento 
                ? parse(resp.data.inicio_atendimento, 'dd/MM/yyyy HH:mm', new Date(), { locale: ptBR })
                : null;
            setValuesEdit({
                ...initialValues,
                status_id: resp.data.status_id,
                data_abertura: resp.data.data_abertura,
                inicio_atendimento: parsedDate
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
        const file = event.target.files[0];
    
        if (!file) return;
    
        // Verifica se o arquivo é uma imagem ou um PDF
        if (file.type.startsWith('image/')) {
            const options = {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 1920
            };
            try {
                const compressedFile = await imageCompression(file, options);
                setFinalPhoto(compressedFile);
            } catch (error) {
                console.log('Erro ao comprimir imagem:', error);
            }
        } else if (file.type === 'application/pdf') {
            setFinalPhoto(file);
        } else {
            console.log('Formato não suportado.');
        }
    }

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
        disabled: isDisabled,
        maxSize: 20242880, // 20MB
        onDropRejected: () => {
            setError('Arquivo muito grande ou tipo não suportado');
        }
    });

    return (
        <>
            <Formik
                initialValues={{
                    initialPhoto: valuesEdit.initialPhoto,
                    description: valuesEdit.description,
                    submit: null,
                    finalPhoto: valuesEdit.finalPhoto,
                    problemResolved: valuesEdit.problemResolved,
                    date_inicio: valuesEdit.inicio_atendimento,
                    date_fim: '',
                    technical: '',
                    data_abertura: valuesEdit.data_abertura
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    technical: id_role == 1 ? Yup.object().required('Técnico obrigatório') : '',
                    description: Yup.string().required('Descrição obrigatório'),
                    date_inicio: Yup.date()
                        .required('Data de início obrigatória')
                        .nullable()
                        .test('is-greater', 'Data de início deve ser maior que a data de abertura', function (value) {
                            const { data_abertura } = this.parent; // Obtendo data_abertura do contexto
                            return value && data_abertura ? new Date(value) > new Date(data_abertura) : true; // Retorna true se a data de início for maior
                        })
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
                        .test('is-greater-than-abertura', 'Data de fim deve ser maior que a data de abertura', function (value) {
                            const { data_abertura } = this.parent; // Obtendo data_abertura do contexto
                            return value && data_abertura ? new Date(value) > new Date(data_abertura) : true; // Verifica se date_fim é maior que data_abertura
                        })
                        .test('is-not-future', 'Data de fim não pode ser maior que a data e hora atuais', function (value) {
                            const currentDate = new Date();
                            return value && new Date(value) <= currentDate;
                        }),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        console.log(parse(valuesEdit.data_abertura, 'yyyy-MM-dd HH:mm:ss', new Date()));
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        const data = new FormData();
                        data.append('technical', values.technical?.id);
                        data.append('date_inicio', formatDateTime(values.date_inicio));
                        data.append('date_fim', formatDateTime(values.date_fim));
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
                                    navigate({ pathname: `/${params.module}s` });
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
                                                                disabled={valuesEdit.inicio_atendimento ? true : false}
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
                                        </>
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
                                        <Box
                                            {...getRootProps()}
                                            sx={{
                                                border: '2px dashed #cccccc',
                                                borderRadius: '4px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                                                opacity: isDisabled ? 0.6 : 1,
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
