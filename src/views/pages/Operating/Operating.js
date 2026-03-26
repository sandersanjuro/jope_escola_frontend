import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Snackbar, MenuItem, Autocomplete } from '@mui/material';
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
import { getResourceOperating, getOperatingPerId, postOperating, updateOperating } from 'services/operating';
import { floors } from './Docs/Floors';
import { useSelector } from 'react-redux';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Operating = ({ ...others }) => {
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
        idCategory: '',
        idUnit: '',
        floor: ''
    };
    const initialStateOptions = {
        categorys: [],
        units: []
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
    const idUnit = useSelector((state) => state.user.unit || '');
    useEffect(() => {
        viewPerId();
    }, [params.id]);
    useEffect(() => {
        getResource();
    }, []);
    
    // Atualiza o idUnit quando as opções são carregadas
    useEffect(() => {
        if (options.units && options.units.length > 0 && !valuesEdit.idUnit && idUnit) {
            const defaultUnit = options.units.find((item) => item.id === idUnit);
            if (defaultUnit) {
                setValuesEdit(prev => ({
                    ...prev,
                    idUnit: defaultUnit
                }));
            }
        }
    }, [options.units, idUnit]);
    function viewPerId() {
        params.action &&
            getOperatingPerId(params.id).then((resp) => {
                setValuesEdit({
                    name: resp.data.nome,
                    idCategory: resp.data.category,
                    idUnit: resp.data.unit,
                    floor: floors.filter((desc) => desc.id === resp.data.andar)[0]
                });
            });
    }
    function getResource() {
        getResourceOperating().then((resp) => setOptions(resp.data));
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name || '',
                    idCategory: valuesEdit.idCategory || null,
                    idUnit: valuesEdit.idUnit || (options.units && options.units.length > 0 ? options.units.find((item) => item.id === idUnit) : null),
                    floor: valuesEdit.floor || null,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).trim().required('Nome do Ativo obrigatório'),
                    idUnit: Yup.object().required('Unidade obrigatório'),
                    idCategory: Yup.object().required('Categoria obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        
                        // Validação adicional para garantir que os campos obrigatórios estejam preenchidos
                        if (!values.idUnit || !values.idUnit.id) {
                            setLoading(false);
                            setError('Unidade é obrigatória');
                            setTimeout(() => {
                                setError('');
                            }, 3000);
                            return;
                        }
                        if (!values.idCategory || !values.idCategory.id) {
                            setLoading(false);
                            setError('Categoria é obrigatória');
                            setTimeout(() => {
                                setError('');
                            }, 3000);
                            return;
                        }
                        if (!values.floor || !values.floor.id) {
                            setLoading(false);
                            setError('Andar é obrigatório');
                            setTimeout(() => {
                                setError('');
                            }, 3000);
                            return;
                        }
                        
                        const data = { 
                            ...values, 
                            idUnit: values.idUnit.id, 
                            idCategory: values.idCategory.id, 
                            floor: values.floor.id 
                        };
                        if (params.action === 'edit') {
                            updateOperating(params.id, data)
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
                            postOperating(data)
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
                                    ATIVO
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
                                                error={Boolean(touched.name && errors.name) || Boolean(errorValidate.name)}
                                                id="outlined-name"
                                                type="text"
                                                label="Nome do Ativo"
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
                                            <Autocomplete
                                                fullWidth
                                                label="Unidade"
                                                id="idUnit"
                                                value={values.idUnit}
                                                name="idUnit"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('idUnit', newValue)}
                                                options={options.units || []}
                                                getOptionLabel={(option) => option.label || ''}
                                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Unidade"
                                                        helperText={touched.idUnit && errors.idUnit ? errors.idUnit : ''}
                                                        error={Boolean(touched.idUnit && errors.idUnit)}
                                                    />
                                                )}
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                label="Categoria"
                                                id="idCategory"
                                                value={values.idCategory}
                                                name="idCategory"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('idCategory', newValue)}
                                                options={options.categorys || []}
                                                getOptionLabel={(option) => option.label || ''}
                                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Categoria"
                                                        helperText={touched.idCategory && errors.idCategory ? errors.idCategory : ''}
                                                        error={Boolean(touched.idCategory && errors.idCategory)}
                                                    />
                                                )}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                label="Andar"
                                                id="floor"
                                                value={values.floor}
                                                name="floor"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('floor', newValue)}
                                                options={floors || []}
                                                // getOptionLabel={(option) => option.label || ''}
                                                // isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Andar"
                                                        helperText={touched.floor && errors.floor ? errors.floor : ''}
                                                        error={Boolean(touched.floor && errors.floor)}
                                                    />
                                                )}
                                                disabled={isDisabled}
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
                                                            to={`/ativo/${params.id}/edit`}
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

export default Operating;
