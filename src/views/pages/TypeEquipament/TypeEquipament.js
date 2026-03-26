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
    Autocomplete,
    IconButton
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
import { getResourceTypeEquipament, getTypeEquipamentPerId, postTypeEquipament, updateTypeEquipament } from 'services/typeequipament';
import MoreVertIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const TypeEquipament = ({ ...others }) => {
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
        nameTypeEquipament: ''
    };
    const initialTypeOs = {
        id: '',
        label: ''
    };
    const initialStateOptions = {
        type_os: []
    };
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [valuesEdit, setValuesEdit] = useState(initialValuesEdit);
    const [errorValidate, setErrorValidate] = useState({});
    const [currentTypeOs, setCurrentTypeOs] = useState(initialTypeOs);
    const [typeOs, setTypeOs] = useState([]);
    const [options, setOptions] = useState(initialStateOptions);
    const isDisabled = params.action === 'view' ? true : false;
    useEffect(() => {
        getResource();
    }, []);
    useEffect(() => {
        viewPerId();
    }, [params.id]);
    function viewPerId() {
        params.action &&
            getTypeEquipamentPerId(params.id).then((resp) => {
                setValuesEdit({
                    nameTypeEquipament: resp.data.nameTypeEquipament
                });
                setTypeOs(
                    resp.data.type_os.map((desc) => ({
                        id: desc.id,
                        label: desc.nome
                    }))
                );
            });
    }
    function getResource() {
        getResourceTypeEquipament().then((resp) =>
            setOptions({
                type_os: resp.data.type_os
            })
        );
    }

    const handleTypeOs = () => {
        if (!currentTypeOs.id) {
            return [
                setError('Selecione um tipo de OS'),
                setTimeout(() => {
                    setError('');
                }, 2000)
            ];
        }
        // let teamObject = { ...currentTeam, id: uniqueId() };
        if (typeOs.length > 0) {
            let filter = typeOs.filter((desc) => desc.id === currentTypeOs.id);
            if (filter.length > 0) {
                return [
                    setError('Tipo de OS já selecionado'),
                    setTimeout(() => {
                        setError('');
                    }, 2000)
                ];
            }
        }
        // console.log(currentTeam);
        // setOptions({ ...options, team: options.team.filter((desc) => desc.id !== currentTeam.team.id) });
        setError('');
        setTypeOs([...typeOs, currentTypeOs]);
        setCurrentTypeOs(initialTypeOs);
    };
    function renderTypeOs() {
        let typeOsRender = typeOs || [];
        return typeOsRender.map((desc) => (
            <Grid key={desc.id} container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12} sm={10} sx={{ marginTop: 3 }}>
                    <Autocomplete
                        fullWidth
                        select
                        label="Tipo de OS"
                        id="type_os"
                        value={{ id: desc.id, label: desc.label }}
                        name="type_os"
                        options={options.type_os}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tipo de OS"
                                // helperText={touched.idTeam && errors.idTeam ? errors.idTeam : ''}
                                // error={Boolean(touched.idTeam && errors.idTeam)}
                            />
                        )}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                    <IconButton
                        disabled={params.action === 'view' ? true : false}
                        aria-label="remover"
                        onClick={() => handleDeleteTypeOs(desc.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        ));
    }
    const handleDeleteTypeOs = (id) => {
        setTypeOs(typeOs.filter((desc) => parseInt(desc.id) !== parseInt(id)));
    };
    return (
        <>
            <Formik
                initialValues={{
                    nameTypeEquipament: valuesEdit.nameTypeEquipament,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    nameTypeEquipament: Yup.string()
                        .max(55, 'Permitido no máximo 45 caracteres')
                        .trim()
                        .required('O nome do tipo de equipamento é obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        const data = { nameTypeEquipament: values.nameTypeEquipament, type_os: typeOs };
                        console.log(data);
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateTypeEquipament(params.id, data)
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
                            postTypeEquipament(data)
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
                                    Tipo Equipamento
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
                                        <Grid item xs={12} sm={12} sx={{ marginTop: 3, mb: 10 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.nameTypeEquipament && errors.nameTypeEquipament) ||
                                                    Boolean(errorValidate.nameTypeEquipament)
                                                }
                                                id="outlined-nameTypeEquipament"
                                                type="text"
                                                label="Nome do Tipo de Equipamento"
                                                value={values.nameTypeEquipament}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="nameTypeEquipament"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.nameTypeEquipament && errors.nameTypeEquipament
                                                        ? errors.nameTypeEquipament
                                                        : errorValidate.nameTypeEquipament
                                                        ? errorValidate.nameTypeEquipament
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    {params.action !== 'view' && (
                                        <>
                                            <h3>Adicionar Tipo de OS</h3>
                                            <hr></hr>
                                            <Grid container spacing={matchDownSM ? 0 : 2} sx={{ mb: 10 }}>
                                                <Grid item xs={12} sm={10} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        select
                                                        label="Tipos de OS"
                                                        id="tipo_os"
                                                        value={currentTypeOs}
                                                        name="tipo_os"
                                                        onBlur={handleBlur}
                                                        onChange={(e, newValue) =>
                                                            setCurrentTypeOs({ ...currentTypeOs, id: newValue.id, label: newValue.label })
                                                        }
                                                        options={options.type_os}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Tipo de OS"
                                                                helperText={touched.tipo_os && errors.tipo_os ? errors.tipo_os : ''}
                                                                error={Boolean(touched.tipo_os && errors.tipo_os)}
                                                            />
                                                        )}
                                                        disabled={isDisabled}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                                                    <IconButton aria-label="adicionar" onClick={handleTypeOs}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                                    <h3>Tipos de OS</h3>
                                    <hr></hr>
                                    {renderTypeOs()}
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
                                                            to={`/tipoequipamento/${params.id}/edit`}
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

export default TypeEquipament;
