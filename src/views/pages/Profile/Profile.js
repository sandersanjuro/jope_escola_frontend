import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    TextField,
    useMediaQuery,
    Alert,
    Snackbar,
    MenuItem,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    FormControl
} from '@mui/material';
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
import { getResourceUser, getUserPerId, postUser, updateProfile, updateUser } from 'services/users';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Profile = ({ ...others }) => {
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
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [errorValidate, setErrorValidate] = useState({});
    const isDisabled = params.action === 'view' ? true : false;
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const id = useSelector((state) => state.auth.user.id) || '';
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleMouseDownNewPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        if (params.id !== id) {
            navigate(`/profile/${id}`);
        }
    }, []);
    return (
        <>
            <Formik
                initialValues={{
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    password: !params.action ? Yup.string().max(255).required('Senha obrigatório') : '',
                    newPassword: Yup.string()
                        .required('Insira a Nova Senha')
                        .notOneOf([Yup.ref('password')], 'Nova senha não pode ser igual à atual')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                            'Deve conter 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial'
                        ),
                    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'As senhas não conferem')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        updateProfile(params.id, values)
                            .then((resp) => {
                                setError('');
                                setLoading(false);
                                setSuccess(resp.data.success);
                                setTimeout(() => {
                                    setSuccess('');
                                    window.location.reload();
                                }, 2000);
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
                                    Perfil
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
                                    <Grid container direction="row" justifyContent="center" alignItems="center">
                                        <Grid item sm={6} xs={6}>
                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-password-login">Senha Atual</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password-login"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                    inputProps={{}}
                                                />
                                                {touched.password && errors.password && (
                                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                                        {errors.password}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center">
                                        <Grid item sm={6} xs={6}>
                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.newPassword && errors.newPassword)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-newPassword-login">Nova Senha</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-newPassword-login"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={values.newPassword}
                                                    name="newPassword"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle newPassword visibility"
                                                                onClick={handleClickShowNewPassword}
                                                                onMouseDown={handleMouseDownNewPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="newPassword"
                                                    inputProps={{}}
                                                />
                                                {touched.newPassword && errors.newPassword && (
                                                    <FormHelperText error id="standard-weight-helper-text-newPassword-login">
                                                        {errors.newPassword}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center">
                                        <Grid item sm={6} xs={6}>
                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-confirmPassword-login">
                                                    Confirmar Nova Senha
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-confirmPassword-login"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={values.confirmPassword}
                                                    name="confirmPassword"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle confirmPassword visibility"
                                                                onClick={handleClickShowConfirmPassword}
                                                                onMouseDown={handleMouseDownConfirmPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="confirmPassword"
                                                    inputProps={{}}
                                                />
                                                {touched.confirmPassword && errors.confirmPassword && (
                                                    <FormHelperText error id="standard-weight-helper-text-confirmPassword-login">
                                                        {errors.confirmPassword}
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
                )}
            </Formik>
        </>
    );
};

export default Profile;
