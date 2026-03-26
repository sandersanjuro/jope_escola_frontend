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
import { getResourceUser, getUserPerId, postUser, updateUser } from 'services/users';

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
        email: '',
        // password: '',
        regional: '',
        profile: '',
        unidade: ''
    };
    const initialStateOptions = {
        regional: [],
        profile: [],
        unit: []
    };
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [options, setOptions] = useState(initialStateOptions);
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
            getUserPerId(params.id).then((resp) => {
                setValuesEdit({
                    name: resp.data.name || '',
                    email: resp.data.email || '',
                    // password: resp.data.password,
                    idProfile: resp.data.idProfile || '',
                    idRegional: resp.data.idRegional || '',
                    idUnidade: resp.data.unidade_id || ''
                });
            });
    }
    function getResource() {
        getResourceUser().then((resp) => setOptions({ ...options, regional: resp.data.regionals, profile: resp.data.profile, unit: resp.data.unit }) );
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: valuesEdit.name || '',
                    email: valuesEdit.email || '',
                    // password: valuesEdit.password,
                    regional: valuesEdit.idRegional || '',
                    profile: valuesEdit.idProfile || '',
                    unidade: valuesEdit.idUnidade || '',
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(80, 'Máximo de caracteres permitido: 80').trim().required('Nome obrigatório'),
                    email: Yup.string()
                        .email('Digite um email válido')
                        .max(80, 'Máximo de caracteres permitido: 80')
                        .required('Email obrigatório'),
                    // password: !params.action
                    //     ? Yup.string()
                    //           .required('Insira a Nova Senha')
                    //           .matches(
                    //               /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    //               'Deve conter 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial'
                    //           )
                    //     : '',
                    profile: Yup.string().required('Escolha um perfil para esse usuário'),
                    regional: Yup.string().required('Escolha uma regional para esse usuário'),
                    unidade: Yup.string().nullable().when('profile', {
                        is: 9,
                        then: (schema) => schema.required('Escolha uma unidade para o diretor'),
                        otherwise: (schema) => schema.notRequired()
                    })
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm, validateForm }) => {
                    console.log('=== DEBUG SUBMIT ===');
                    console.log('Values recebidos:', values);
                    console.log('Params action:', params.action);
                    console.log('Params id:', params.id);
                    
                    // Validar o formulário antes de submeter
                    const validationErrors = await validateForm();
                    console.log('Erros de validação:', validationErrors);
                    
                    if (Object.keys(validationErrors).length > 0) {
                        console.log('Formulário tem erros de validação, não submetendo');
                        setErrors(validationErrors);
                        setSubmitting(false);
                        return;
                    }
                    
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        if (params.action === 'edit') {
                            console.log('Executando updateUser com:', { id: params.id, values });
                            updateUser(params.id, values)
                                .then((resp) => {
                                    console.log('updateUser sucesso:', resp);
                                    setError('');
                                    setLoading(false);
                                    viewPerId();
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        setSuccess('');
                                    }, 3000);
                                })
                                .catch((e) => {
                                    console.log('updateUser erro:', e);
                                    setLoading(false);
                                    setSuccess('');
                                    setErrorValidate(e.response?.data?.errorValidate || {});
                                    setError(e.response?.data?.error || 'Erro ao atualizar usuário');
                                    setTimeout(() => {
                                        setError('');
                                    }, 3000);
                                });
                        } else {
                            console.log('Executando postUser com:', values);
                            postUser(values)
                                .then((resp) => {
                                    console.log('postUser sucesso:', resp);
                                    setError('');
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        resetForm();
                                        setSuccess('');
                                    }, 2000);
                                })
                                .catch((e) => {
                                    console.log('postUser erro:', e);
                                    setLoading(false);
                                    setSuccess('');
                                    setErrorValidate(e.response?.data?.errorValidate || {});
                                    setError(e.response?.data?.error || 'Erro ao criar usuário');
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
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                    console.log('=== DEBUG FORM ===');
                    console.log('Errors:', errors);
                    console.log('Touched:', touched);
                    console.log('Values:', values);
                    console.log('IsSubmitting:', isSubmitting);
                    
                    return (
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
                                    Novo Usuário
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
                                    </Grid>
                                    <Grid container spacing={matchDownSM ? 0 : 2}>
                                        <Grid item xs={12} sm={values.profile === 9 ? 3 : 4} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.email && errors.email) || Boolean(errorValidate.email)}
                                                id="outlined-email"
                                                type="text"
                                                label="E-mail"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="email"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.email && errors.email
                                                        ? errors.email
                                                        : errorValidate.email
                                                        ? errorValidate.email
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={values.profile === 9 ? 3 : 4} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.profile && errors.profile) || Boolean(errorValidate.profile)}
                                                select
                                                label="Perfil"
                                                id="profile"
                                                type="text"
                                                value={values.profile || ''}
                                                name="profile"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    // Limpa o campo unidade quando o perfil muda
                                                    setFieldValue('unidade', '');
                                                }}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.profile && errors.profile
                                                        ? errors.profile
                                                        : errorValidate.profile
                                                        ? errorValidate.profile
                                                        : ''
                                                }
                                            >
                                                {options.profile.length > 0 &&
                                                    options.profile.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.nome}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        </Grid>
                                         {values.profile === 9 && (
                                            <Grid item xs={12} sm={values.profile === 9 ? 3 : 4} sx={{ marginTop: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.unidade && errors.unidade) || Boolean(errorValidate.unidade)}
                                                    select
                                                    label="Unidade"
                                                    id="unidade"
                                                    type="text"
                                                    value={values.unidade || ''}
                                                    name="unidade"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    disabled={isDisabled}
                                                    helperText={
                                                        touched.unidade && errors.unidade
                                                            ? errors.unidade
                                                            : errorValidate.unidade
                                                            ? errorValidate.unidade
                                                            : ''
                                                    }
                                                >
                                                    {options.unit.length > 0 &&
                                                        options.unit.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.nome}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} sm={values.profile === 9 ? 3 : 4} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.regional && errors.regional) || Boolean(errorValidate.regional)}
                                                select
                                                label="Regional"
                                                id="regional"
                                                type="text"
                                                value={values.regional || ''}
                                                name="regional"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.regional && errors.regional
                                                        ? errors.regional
                                                        : errorValidate.regional
                                                        ? errorValidate.regional
                                                        : ''
                                                }
                                            >
                                                {options.regional.length > 0 &&
                                                    options.regional.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.nome}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    {/* <Grid container spacing={matchDownSM ? 0 : 2}> */}
                                        {/* {!params.action && (
                                            <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.password && errors.password) || Boolean(errorValidate.password)}
                                                    id="outlined-password"
                                                    type="password"
                                                    label="Senha"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="password"
                                                    disabled={isDisabled}
                                                    helperText={
                                                        touched.password && errors.password
                                                            ? errors.password
                                                            : errorValidate.password
                                                            ? errorValidate.password
                                                            : ''
                                                    }
                                                />
                                            </Grid>
                                        )} */}
                                    {/* </Grid> */}
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
                                                            to={`/usuario/${params.id}/edit`}
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
                    );
                }}
            </Formik>
        </>
    );
};

export default User;
