import { Link } from 'react-router-dom';
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
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Snackbar,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import { LogoLogin } from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { rememberPassword } from 'services/auth';
import Loading from 'components/Loading/Loading';
import MainCard from 'ui-component/cards/MainCard';

// assets
// ================================|| AUTH3 - LOGIN ||================================ //

const EmailForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [error, setError] = useState('');
    const scriptedRef = useScriptRef();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [errorValidate, setErrorValidate] = useState({});
    return (
        <AuthWrapper1>
            {loading && (
                <Grid container alignItems="center" justifyContent="center">
                    <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loading color="#015641" type="cubes" />
                    </MainCard>
                </Grid>
            )}
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
                                                        Recuperação de senha
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                        color="#00008B"
                                                    >
                                                        Entre com seu e-mail para continuar
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            initialValues={{
                                                email: '',
                                                submit: null
                                            }}
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                try {
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: true });
                                                        setSubmitting(false);
                                                    }
                                                    setLoading(true);
                                                    rememberPassword(values)
                                                        .then((resp) => {
                                                            setError('');
                                                            setSuccess(resp.data.message);
                                                            setLoading(false);
                                                            setTimeout(() => {
                                                                setSuccess('');
                                                            }, 2000);
                                                        })
                                                        .catch((e) => {
                                                            setLoading(false);
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
                                                <form noValidate onSubmit={handleSubmit} {...others}>
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
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-email-login"
                                                            type="email"
                                                            value={values.email}
                                                            name="email"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            label="Email Address / Username"
                                                            inputProps={{}}
                                                        />
                                                        {touched.email && errors.email && (
                                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                                {errors.email}
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
                                                                Recuperar senha
                                                            </Button>
                                                        </AnimateButton>
                                                    </Box>
                                                    <Box sx={{ mt: 2 }}>
                                                        <AnimateButton>
                                                            <Button
                                                                disableElevation
                                                                fullWidth
                                                                size="large"
                                                                variant="contained"
                                                                href="/login"
                                                                style={{
                                                                    backgroundColor: '#00008B'
                                                                }}
                                                            >
                                                                Voltar
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
            </Grid>
        </AuthWrapper1>
    );
};

export default EmailForgotPassword;
