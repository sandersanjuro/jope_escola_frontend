import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { uniqueId } from 'lodash';
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
import MoreVertIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

// assets
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { getResourceTypeOs, getTypeOsPerId, postTypeOs, updateTypeOs } from 'services/typeOs';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const TypeOs = ({ ...others }) => {
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
        description: '',
        family: ''
    };
    const initialStateOptions = {
        team: [],
        regional: [],
        family: []
    };
    const initialteam = {
        id: '',
        team: '',
        regional: ''
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
    const [operating, setOperating] = useState('');
    const isDisabled = params.action === 'view' ? true : false;
    const [team, setTeam] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(initialteam);
    const idUnit = useSelector((state) => state.user.unit || '');
    useEffect(() => {
        getResource();
    }, []);
    const handleChangeInput = (e) => {
        let name = e.target.name;
        setCurrentTeam({ ...currentTeam, [name]: e.target.value });
    };
    function getResource() {
        getResourceTypeOs().then((resp) =>
            setOptions({
                team: resp.data.team,
                regional: resp.data.regional.map((desc) => ({
                    id: desc.id,
                    label: `${desc.regional} - ${desc.negocio}`
                })),
                family: resp.data.family
            })
        );
    }

    useEffect(() => {
        viewPerId();
    }, [params.id]);
    function viewPerId() {
        params.action &&
            getTypeOsPerId(params.id).then((resp) => {
                setValuesEdit({
                    description: resp.data.nome,
                    family: resp.data.family
                });
                setTeam(
                    resp.data.team.map((desc) => ({
                        id: desc.id,
                        team: desc.team,
                        regional: { ...desc.regional, label: `${desc.regional.regional} - ${desc.regional.negocio}` }
                    }))
                );
            });
    }

    const handleTeam = () => {
        if (!currentTeam.team || !currentTeam.regional) {
            return [
                setError('Selecione a equipe e regional'),
                setTimeout(() => {
                    setError('');
                }, 2000)
            ];
        }
        let teamObject = { ...currentTeam, id: uniqueId() };
        if (team.length > 0) {
            let filter = team.filter((desc) => desc.team.id === currentTeam.team.id && desc.regional.id === currentTeam.regional.id);
            if (filter.length > 0) {
                return [
                    setError('Equipe e regional já selecionados'),
                    setTimeout(() => {
                        setError('');
                    }, 2000)
                ];
            }
        }
        // console.log(currentTeam);
        // setOptions({ ...options, team: options.team.filter((desc) => desc.id !== currentTeam.team.id) });
        setError('');
        setTeam([...team, teamObject]);
        setCurrentTeam(initialteam);
    };
    const handleDeleteTeam = (id) => {
        setTeam(team.filter((desc) => parseInt(desc.id) !== parseInt(id)));
    };
    function renderTeam() {
        let teamRender = team || [];
        return teamRender.map((desc) => (
            <Grid key={desc.id} container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                    <Autocomplete
                        fullWidth
                        select
                        label="Regional"
                        id="regional"
                        value={desc.regional}
                        name="team"
                        options={options.regional}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Regional"
                                // helperText={touched.idTeam && errors.idTeam ? errors.idTeam : ''}
                                // error={Boolean(touched.idTeam && errors.idTeam)}
                            />
                        )}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                    <Autocomplete
                        fullWidth
                        select
                        label="Equipe"
                        id="team"
                        value={desc.team}
                        name="team"
                        options={options.team}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Equipe"
                                // helperText={touched.idTeam && errors.idTeam ? errors.idTeam : ''}
                                // error={Boolean(touched.idTeam && errors.idTeam)}
                            />
                        )}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                    <IconButton aria-label="remover" onClick={() => handleDeleteTeam(desc.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        ));
    }
    return (
        <>
            <Formik
                initialValues={{
                    description: valuesEdit.description,
                    family: valuesEdit.family,
                    // idCategory: valuesEdit.idCategory,
                    // idUnit: valuesEdit.idUnit,
                    // floor: valuesEdit.floor,
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    description: Yup.string().max(151, 'Permitido no máximo 151 caracteres').trim().required('Nome do tipo obrigatório'),
                    family: Yup.object().required('Família Obrigatório')
                    // name: Yup.string().max(255).trim().required('Nome do Ativo obrigatório'),
                    // idUnit: Yup.object().required('Unidade obrigatório'),
                    // idCategory: Yup.object().required('Categoria obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                        const data = { description: values.description, team: team, family: values.family };
                        setLoading(true);
                        if (params.action === 'edit') {
                            updateTypeOs(params.id, data)
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
                            postTypeOs(data)
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
                                    TIPO DE OS
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
                                    <Grid container spacing={matchDownSM ? 0 : 2} sx={{ mb: 5 }}>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={
                                                    Boolean(touched.description && errors.description) || Boolean(errorValidate.description)
                                                }
                                                id="outlined-description"
                                                type="text"
                                                label="Nome do Tipo"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="description"
                                                disabled={isDisabled}
                                                helperText={
                                                    touched.description && errors.description
                                                        ? errors.description
                                                        : errorValidate.description
                                                        ? errorValidate.description
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                select
                                                label="Família"
                                                id="family"
                                                type="text"
                                                value={values.family}
                                                name="family"
                                                onBlur={handleBlur}
                                                onChange={(e, newValue) => setFieldValue('family', newValue)}
                                                options={options.family}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Família"
                                                        helperText={touched.family && errors.family ? errors.family : ''}
                                                        error={Boolean(touched.family && errors.family)}
                                                    />
                                                )}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                    </Grid>
                                    {params.action !== 'view' && (
                                        <>
                                            <h3>Adicionar Equipes</h3>
                                            <hr></hr>
                                            <Grid container spacing={matchDownSM ? 0 : 2} sx={{ mb: 10 }}>
                                                <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        select
                                                        label="Regional"
                                                        id="team"
                                                        value={currentTeam.regional}
                                                        name="team"
                                                        onBlur={handleBlur}
                                                        onChange={(e, newValue) => setCurrentTeam({ ...currentTeam, regional: newValue })}
                                                        options={options.regional}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Regional"
                                                                helperText={touched.regional && errors.regional ? errors.regional : ''}
                                                                error={Boolean(touched.regional && errors.regional)}
                                                            />
                                                        )}
                                                        disabled={isDisabled}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={5} sx={{ marginTop: 3 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        select
                                                        label="Equipe"
                                                        id="team"
                                                        value={currentTeam.team}
                                                        name="team"
                                                        onBlur={handleBlur}
                                                        onChange={(e, newValue) => setCurrentTeam({ ...currentTeam, team: newValue })}
                                                        options={options.team}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Equipe"
                                                                helperText={touched.idTeam && errors.idTeam ? errors.idTeam : ''}
                                                                error={Boolean(touched.idTeam && errors.idTeam)}
                                                            />
                                                        )}
                                                        disabled={isDisabled}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                                                    <IconButton aria-label="adicionar" onClick={handleTeam}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                                    <h3>Equipes</h3>
                                    <hr></hr>
                                    {renderTeam()}
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
                                                            to={`/tipo_os/${params.id}/edit`}
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

export default TypeOs;
