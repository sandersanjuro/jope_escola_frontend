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
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox
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
import { getResourceUnit, getUnitPerId, postUnit, updateUnit } from 'services/unit';
import { getUserRegional } from 'services/users';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Unit = ({ ...others }) => {
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
        nameUnit: '',
        idReg: '',
        active: 1,
        modelUnit: 0,
        idModel: '',
        user_id: '',
        chave_ura: ''
    };
    const initialStateOptions = {
        regs: [],
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
    const [users, setUsers] = useState([]);
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [errorValidate, setErrorValidate] = useState({});
    const [regional_id, setRegionalId] = useState('');
    const isDisabled = params.action === 'view' ? true : false;
    useEffect(() => {
        viewPerId();
    }, [params.id]);
    useEffect(() => {
        getResource();
    }, []);
    useEffect(() => {
        getUsersRegional();
    }, [regional_id]);
    function viewPerId() {
        params.action &&
            getUnitPerId(params.id).then((resp) => {
                setValuesEdit({
                    nameUnit: resp.data.nameUnit,
                    idReg: resp.data.idReg,
                    modelUnit: resp.data.modelUnit,
                    active: resp.data.active,
                    user_id: resp.data.user_id,
                    chave_ura: resp.data.chave_ura
                });
            });
    }
    function getResource() {
        getResourceUnit().then((resp) => setOptions(resp.data));
    }
    function getUsersRegional() {
        getUserRegional(regional_id).then((resp) => setUsers(resp.data || []));
    }
    return (
        <>
            <Formik
                initialValues={{
                    nameUnit: valuesEdit.nameUnit,
                    chave_ura: valuesEdit.chave_ura,
                    idReg: valuesEdit.idReg,
                    idModel: valuesEdit.idModel,
                    modelUnit: valuesEdit.modelUnit,
                    active: valuesEdit.active,
                    user_id: valuesEdit.user_id,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    nameUnit: Yup.string().max(255).trim().required('Nome da Unidade obrigatório'),
                    idReg: Yup.string().max(255).trim().required('Nome da regional obrigatório'),
                    user_id: Yup.string().max(255).trim().required('Nome do responsável obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateUnit(params.id, values)
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
                            postUnit(values)
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
                                    UNIDADE
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
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.nameUnit && errors.nameUnit) || Boolean(errorValidate.nameUnit)}
                                                id="outlined-nameUnit"
                                                type="text"
                                                label="Nome da Unidade"
                                                value={values.nameUnit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="nameUnit"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.nameUnit && errors.nameUnit
                                                        ? errors.nameUnit
                                                        : errorValidate.nameUnit
                                                        ? errorValidate.nameUnit
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.idReg && errors.idReg) || Boolean(errorValidate.idReg)}
                                                select
                                                label="Regional"
                                                id="idReg"
                                                type="text"
                                                value={values.idReg}
                                                name="idReg"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    setFieldValue('idReg', e.target.value);
                                                    setRegionalId(e.target.value);
                                                    setFieldValue('user_id', '');
                                                }}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.idReg && errors.idReg
                                                        ? errors.idReg
                                                        : errorValidate.idReg
                                                        ? errorValidate.idReg
                                                        : ''
                                                }
                                            >
                                                {options.regs.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {`${option.nome} - ${option.negocio}`}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.user_id && errors.user_id) || Boolean(errorValidate.user_id)}
                                                select
                                                label="Responsável"
                                                id="user_id"
                                                type="text"
                                                value={values.user_id}
                                                name="user_id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.user_id && errors.user_id
                                                        ? errors.user_id
                                                        : errorValidate.user_id
                                                        ? errorValidate.user_id
                                                        : ''
                                                }
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.nome}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.chave_ura && errors.chave_ura) || Boolean(errorValidate.chave_ura)}
                                                id="outlined-chave_ura"
                                                type="text"
                                                label="Chave URA"
                                                value={values.chave_ura}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="chave_ura"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.chave_ura && errors.chave_ura
                                                        ? errors.chave_ura
                                                        : errorValidate.chave_ura
                                                        ? errorValidate.chave_ura
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        {!params.action && (
                                            <>
                                                <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        error={Boolean(touched.idModel && errors.idModel) || Boolean(errorValidate.idModel)}
                                                        select
                                                        label="Unidade Modelo"
                                                        id="idModel"
                                                        type="text"
                                                        value={values.idModel}
                                                        name="idModel"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        disabled={isDisabled}
                                                        helperText={
                                                            touched.idModel && errors.idModel
                                                                ? errors.idModel
                                                                : errorValidate.idModel
                                                                ? errorValidate.idModel
                                                                : ''
                                                        }
                                                    >
                                                        {options.units.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        error={
                                                            Boolean(touched.initialDate && errors.initialDate) ||
                                                            Boolean(errorValidate.initialDate)
                                                        }
                                                        id="outlined-initialDate"
                                                        type="date"
                                                        label="Desde"
                                                        value={values.initialDate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        name="initialDate"
                                                        disabled={isDisabled}
                                                        helperText={
                                                            touched.initialDate && errors.initialDate
                                                                ? errors.initialDate
                                                                : errorValidate.initialDate
                                                                ? errorValidate.initialDate
                                                                : ''
                                                        }
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item xs={12} sm={!params.action ? 4 : 3} sx={{ marginTop: 3 }}>
                                            <FormLabel>Habilitado</FormLabel>
                                            <RadioGroup value={values.active} onChange={handleChange} row aria-label="active" name="active">
                                                <FormControlLabel value={1} control={<Radio />} label="Sim" />
                                                <FormControlLabel value={0} control={<Radio />} label="Não" />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={!params.action ? 4 : 3} sx={{ marginTop: 3 }}>
                                            <FormLabel>Unidade Modelo</FormLabel>
                                            <RadioGroup
                                                value={values.modelUnit}
                                                onChange={handleChange}
                                                row
                                                aria-label="modelUnit"
                                                name="modelUnit"
                                            >
                                                <FormControlLabel value={1} control={<Radio />} label="Sim" />
                                                <FormControlLabel value={0} control={<Radio />} label="Não" />
                                            </RadioGroup>
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
                                                            to={`/unidade/${params.id}/edit`}
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

export default Unit;
