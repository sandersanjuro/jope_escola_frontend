import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Snackbar, MenuItem } from '@mui/material';
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
import { getResourceRegional, getRegionalPerId, postRegional, updateRegional } from 'services/regional';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Regional = ({ ...others }) => {
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
        nameRegional: '',
        idBusiness: ''
    };
    const initialStateOptions = {
        business: []
    };
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [options, setOptions] = useState(initialStateOptions);
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [errorValidate, setErrorValidate] = useState({});
    const isDisabled = params.action === 'view' ? true : false;
    useEffect(() => {
        viewPerId();
    }, [params.id]);
    useEffect(() => {
        getResource();
    }, []);
    function viewPerId() {
        params.action &&
            getRegionalPerId(params.id).then((resp) => {
                setValuesEdit({
                    nameRegional: resp.data.nameRegional,
                    idBusiness: resp.data.idBusiness
                });
            });
    }
    function getResource() {
        getResourceRegional().then((resp) => setOptions(resp.data));
    }
    return (
        <>
            <Formik
                initialValues={{
                    nameRegional: valuesEdit.nameRegional,
                    idBusiness: valuesEdit.idBusiness,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    nameRegional: Yup.string().max(45, 'Permitido no máximo 45 caracteres').trim().required('Nome da Regional obrigatório'),
                    idBusiness: Yup.string().max(255).trim().required('Negócio obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateRegional(params.id, values)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    viewPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
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
                            postRegional(values)
                                .then((resp) => {
                                    setError('');
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        resetForm();
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
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                                    REGIONAL
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
                                                error={
                                                    Boolean(touched.nameRegional && errors.nameRegional) ||
                                                    Boolean(errorValidate.nameRegional)
                                                }
                                                id="outlined-nameRegional"
                                                type="text"
                                                label="Nome da Regional"
                                                value={values.nameRegional}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="nameRegional"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.nameRegional && errors.nameRegional
                                                        ? errors.nameRegional
                                                        : errorValidate.nameRegional
                                                        ? errorValidate.nameRegional
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.idBusiness && errors.idBusiness) || Boolean(errorValidate.idBusiness)
                                                }
                                                select
                                                label="Negócio"
                                                id="idBusiness"
                                                type="text"
                                                value={values.idBusiness}
                                                name="idBusiness"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.idBusiness && errors.idBusiness
                                                        ? errors.idBusiness
                                                        : errorValidate.idBusiness
                                                        ? errorValidate.idBusiness
                                                        : ''
                                                }
                                            >
                                                {options.business.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.nome}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
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
                                                            to={`/regional/${params.id}/edit`}
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

export default Regional;
