import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Snackbar,
    Stack,
    Typography,
    useMediaQuery,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import { LogoLogin } from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { updatePassword } from 'services/users';

// assets
// ================================|| AUTH3 - LOGIN ||================================ //

const NewPassword = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [error, setError] = useState('');
    const scriptedRef = useScriptRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [data, setData] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <LogoLogin />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography color="#00008B" gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                                                        Escolha uma senha segura
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                        color="#00008B"
                                                    >
                                                        Trocar senha
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            initialValues={{
                                                password: '',
                                                submit: null
                                            }}
                                            validationSchema={Yup.object().shape({
                                                    password: Yup.string()
                                                          .required('Insira a Nova Senha')
                                                          .matches(
                                                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                                              'Deve conter 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial'
                                                          )
                                                })
                                            }
                                                
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                try {
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: true });
                                                        setSubmitting(false);
                                                    }
                                                    console.log(values);
                                                    setLoading(true);
                                                    updatePassword(values)
                                                        .then((resp) => {
                                                            console.log(resp);
                                                            setError('');
                                                            setSuccess(resp.data.success);
                                                            setTimeout(() => {
                                                                setSuccess('');
                                                                localStorage.removeItem('token');
                                                                location.reload();
                                                            }, 2000);
                                                        })
                                                        .catch((e) => {
                                                            console.log(e);
                                                            setError(e.response.data?.errorValidate?.password);
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
                                                <form noValidate onSubmit={handleSubmit} {...others}>
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
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.password && errors.password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password">Nova senha</InputLabel>
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
                                                    <Box sx={{ mt: 2 }}>
                                                        <AnimateButton>
                                                            <Button
                                                                disableElevation
                                                                disabled={isSubmitting}
                                                                fullWidth
                                                                size="large"
                                                                type="submit"
                                                                variant="contained"
                                                                style={{
                                                                    backgroundColor: '#00008B'
                                                                }}
                                                            >
                                                                Alterar senha
                                                            </Button>
                                                        </AnimateButton>
                                                    </Box>
                                                </form>
                                            )}
                                        </Formik>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default NewPassword;
