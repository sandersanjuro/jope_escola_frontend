import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Button,
    Grid,
    TextField,
    useMediaQuery,
    Alert,
    Snackbar,
    Autocomplete,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Divider,
    Tooltip
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// assets
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import { getOperatingPerId } from 'services/operating';
import { 
    getMaintenancePlanPerId, 
    getResourceMaintenancePlan, 
    postMaintenancePlan,
    updateMaintenancePlan,
    deleteMaintenancePlan,
    getTeamsByTypeOs
} from 'services/maintenancePlan';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import BasicModal from 'components/Modal/BasicModal';
import { getBrlDate, getBrlFormatDate } from 'utils/date';

const MaintenancePlan = ({ ...others }) => {
    const params = useParams();
    const formRef = useRef(null);
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
    
    const initialMaintenance = {
        id: null,
        frequency: null,
        amount: '',
        nextMaintenanceDate: '',
        equipamento: null,
        tipoOs: null,
        equipe: null,
        descricao: '',
        active: true
    };
    
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [options, setOptions] = useState({
        frequency: [],
        equipamento: [],
        tipo_os: [],
        equipe: []
    });
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [operating, setOperating] = useState('');
    const [maintenance, setMaintenance] = useState([]);
    const [currentMaintenance, setCurrentMaintenance] = useState(initialMaintenance);
    const [editingId, setEditingId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const idUnit = useSelector((state) => state.user.unit || '');
    const [operatingUnitId, setOperatingUnitId] = useState(null);
    
    useEffect(() => {
        viewPerId();
    }, [params.idOperating]);

    useEffect(() => {
        getOperating();
    }, [params.idOperating]);
    
    useEffect(() => {
        getResource();
    }, []);

    // Valida se o ativo pertence à unidade atual quando a unidade mudar
    useEffect(() => {
        if (operatingUnitId && idUnit) {
            // Converte para string para comparação consistente
            const operatingUnitStr = String(operatingUnitId);
            const currentUnitStr = String(idUnit);
            
            // Se a unidade do ativo não corresponde à unidade atual (e não é "TODOS")
            if (operatingUnitStr !== currentUnitStr && currentUnitStr !== '14725896312') {
                setError('O ativo selecionado não pertence à unidade atual. Redirecionando...');
                setTimeout(() => {
                    navigate('/ativos');
                }, 2000);
            }
        }
    }, [idUnit, operatingUnitId, navigate]);

    // Filtrar equipes quando tipo de OS mudar
    useEffect(() => {
        if (currentMaintenance.tipoOs && currentMaintenance.tipoOs.id && idUnit) {
            loadTeamsByTypeOs(currentMaintenance.tipoOs.id);
        } else {
            setFilteredTeams([]);
            // Se não tem tipo de OS selecionado, limpar equipe
            if (!currentMaintenance.tipoOs) {
                setCurrentMaintenance({ ...currentMaintenance, equipe: null });
            }
        }
    }, [currentMaintenance.tipoOs, idUnit]);
    
    function viewPerId() {
        setLoading(true);
        getMaintenancePlanPerId(params.idOperating)
            .then((resp) => {
                if (resp.data && Array.isArray(resp.data)) {
                    setMaintenance(
                        resp.data.map((desc) => ({
                            id: desc.id,
                            frequency: { id: desc.idFrequency, label: desc.frequency },
                            amount: desc.amount,
                            nextMaintenanceDate: desc.nextMaintenanceDate || '',
                            equipamento: desc.idEquipamento ? { id: desc.idEquipamento, label: desc.equipamento } : null,
                            tipoOs: desc.idTipoOs ? { id: desc.idTipoOs, label: desc.tipoOs } : null,
                            equipe: desc.idEquipe ? { id: desc.idEquipe, label: desc.equipe } : null,
                            descricao: desc.descricao || '',
                            active: desc.active === 1 ? true : false
                        }))
                    );
                } else {
                    setMaintenance([]);
                }
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                setError(e.response?.data?.error || 'Erro ao carregar planos de manutenção.');
                setTimeout(() => {
                    setError('');
                }, 3000);
                setMaintenance([]);
            });
    }
    
    const handleChangeInput = (e) => {
        let name = e.target.name;
        setCurrentMaintenance({ ...currentMaintenance, [name]: e.target.value });
    };
    
    function getOperating() {
        getOperatingPerId(params.idOperating)
            .then((resp) => {
                setOperating({ id: resp.data.id, label: resp.data.nome });
                // Armazena a unidade do ativo para validação
                const unitId = resp.data.unit?.id || resp.data.unidade_id || null;
                setOperatingUnitId(unitId);
                
                // Valida imediatamente se o ativo pertence à unidade atual
                const currentUnitId = idUnit || localStorage.getItem('unit');
                if (unitId && currentUnitId) {
                    // Converte para string para comparação consistente
                    const unitIdStr = String(unitId);
                    const currentUnitStr = String(currentUnitId);
                    
                    if (unitIdStr !== currentUnitStr && currentUnitStr !== '14725896312') {
                        setError('O ativo selecionado não pertence à unidade atual. Redirecionando...');
                        setTimeout(() => {
                            navigate('/ativos');
                        }, 2000);
                    }
                }
            })
            .catch((e) => {
                setError('Erro ao carregar ativo. Redirecionando...');
                setTimeout(() => {
                    navigate('/ativos');
                }, 2000);
            });
    }
    
    function getResource() {
        getResourceMaintenancePlan(idUnit).then((resp) => {
            setOptions({
                frequency: resp.data.frequency || [],
                equipamento: resp.data.equipamento || [],
                tipo_os: resp.data.tipo_os || [],
                equipe: resp.data.equipe || []
            });
        });
    }

    const loadTeamsByTypeOs = async (tipoOsId) => {
        try {
            const resp = await getTeamsByTypeOs(tipoOsId, idUnit);
            if (resp.data && Array.isArray(resp.data)) {
                setFilteredTeams(resp.data);
            } else {
                setFilteredTeams([]);
            }
        } catch (e) {
            setFilteredTeams([]);
        }
    };

    const handleAddMaintenance = () => {
        if (!currentMaintenance.frequency || !currentMaintenance.amount || !currentMaintenance.nextMaintenanceDate || 
            !currentMaintenance.equipamento || !currentMaintenance.tipoOs || !currentMaintenance.descricao) {
            setError('Preencha todos os campos obrigatórios.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        setError('');
        setLoading(true);
        
        if (editingId && typeof editingId === 'number' && editingId < 1000000) {
            // É um plano do banco, atualizar via API
            const planoData = {
                tipo_frequencia_id: currentMaintenance.frequency.id,
                qtde: currentMaintenance.amount,
                data_proxima_manutencao: currentMaintenance.nextMaintenanceDate,
                equipamento_id: currentMaintenance.equipamento.id,
                tipo_os_id: currentMaintenance.tipoOs.id,
                equipe_id: currentMaintenance.equipe ? currentMaintenance.equipe.id : null,
                descricao: currentMaintenance.descricao,
                ativo: currentMaintenance.active ? 1 : 0
            };
            
            updateMaintenancePlan(editingId, planoData)
                .then((resp) => {
                    setError('');
                    setLoading(false);
                    viewPerId(); // Recarregar planos
                    setSuccess(resp.data.success);
                    setCurrentMaintenance(initialMaintenance);
                    setEditingId(null);
                    setFilteredTeams([]);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                })
                .catch((e) => {
                    setLoading(false);
                    setSuccess('');
                    setError(e.response?.data?.error || 'Erro ao atualizar plano de manutenção.');
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                });
        } else {
            // Criar novo plano via API
            const planoData = {
                planos: [{
                    frequency: currentMaintenance.frequency,
                    amount: currentMaintenance.amount,
                    nextMaintenanceDate: currentMaintenance.nextMaintenanceDate,
                    equipamento: currentMaintenance.equipamento,
                    tipoOs: currentMaintenance.tipoOs,
                    equipe: currentMaintenance.equipe,
                    descricao: currentMaintenance.descricao,
                    active: currentMaintenance.active
                }],
                idOperating: parseInt(params.idOperating)
            };
            
            postMaintenancePlan(planoData)
                .then((resp) => {
                    setError('');
                    setLoading(false);
                    viewPerId(); // Recarregar planos
                    setSuccess(resp.data.success);
                    setCurrentMaintenance(initialMaintenance);
                    setFilteredTeams([]);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                })
                .catch((e) => {
                    setLoading(false);
                    setSuccess('');
                    setError(e.response?.data?.error || 'Erro ao adicionar plano de manutenção.');
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                });
        }
    };
    
    const handleEditMaintenance = (item) => {
        setCurrentMaintenance(item);
        setEditingId(item.id);
        
        // Carregar equipes para o tipo de OS selecionado
        if (item.tipoOs && item.tipoOs.id && idUnit) {
            loadTeamsByTypeOs(item.tipoOs.id).then(() => {
                // Scroll para o formulário
                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            });
        } else {
            // Scroll para o formulário
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };
    
    const handleCancelEdit = () => {
        setCurrentMaintenance(initialMaintenance);
        setEditingId(null);
        setFilteredTeams([]);
    };
    
    const handleDeleteMaintenance = (id) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (deleteId && typeof deleteId === 'number' && deleteId > 1000000) {
            // É um ID temporário (adicionado localmente), apenas remover da lista
            setMaintenance(maintenance.filter((desc) => desc.id !== deleteId));
        } else {
            // É um ID do banco, fazer chamada à API
            setLoading(true);
            deleteMaintenancePlan(deleteId)
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
                    setError(e.response?.data?.error || 'Erro ao excluir plano de manutenção.');
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                });
        }
        setDeleteModalOpen(false);
        setDeleteId(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    
    return (
        <>
            <BasicModal
                open={deleteModalOpen}
                title="Excluir Plano de Manutenção"
                handleClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteId(null);
                }}
                description="Tem certeza que deseja excluir este plano de manutenção?"
                onDelete={confirmDelete}
            />
            
            <Formik
                initialValues={{
                    submit: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({})}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(false);
                }}
            >
                {({ errors, handleBlur, handleSubmit, isSubmitting }) => (
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
                                        color: '#015641',
                                        opacity: 1,
                                        padding: 15,
                                        marginLeft: '2%'
                                    }}
                                >
                                    PLANO DE MANUTENÇÃO
                                </h1>
                                <hr style={{ width: '100%', marginTop: 0 }}></hr>
                            </Grid>
                            {error || success ? (
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
                                    {/* Ativo */}
                                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    fullWidth
                                                    label="Ativo"
                                                    id="idOperating"
                                                    value={operating}
                                                    options={[]}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Ativo"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    disabled={true}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    {/* Formulário de Adicionar/Editar */}
                                    <Box ref={formRef} sx={{ mb: 4, p: 3, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#015641', fontWeight: 'bold' }}>
                                            {editingId ? 'Editar' : 'Adicionar'} Plano de Manutenção
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Grid container spacing={3}>
                                            {/* Primeira linha: Campos principais */}
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Autocomplete
                                                    fullWidth
                                                    label="Frequência *"
                                                    id="frequency"
                                                    value={currentMaintenance.frequency}
                                                    onChange={(e, newValue) =>
                                                        setCurrentMaintenance({ ...currentMaintenance, frequency: newValue })
                                                    }
                                                    options={options.frequency}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Frequência *"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <NumberFormat
                                                    fullWidth
                                                    id="outlined-quantidade"
                                                    type="text"
                                                    label="Quantidade *"
                                                    value={currentMaintenance.amount}
                                                    onChange={handleChangeInput}
                                                    name="amount"
                                                    customInput={TextField}
                                                    variant="outlined"
                                                    isAllowed={(values) => {
                                                        const { floatValue, formattedValue } = values;
                                                        return formattedValue === '' || (floatValue >= 1 && floatValue <= 99);
                                                    }}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-date"
                                                    type="date"
                                                    label="Data da Próxima Manutenção *"
                                                    onChange={handleChangeInput}
                                                    value={currentMaintenance.nextMaintenanceDate}
                                                    name="nextMaintenanceDate"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Autocomplete
                                                    fullWidth
                                                    label="Equipamento *"
                                                    id="equipamento"
                                                    value={currentMaintenance.equipamento}
                                                    onChange={(e, newValue) =>
                                                        setCurrentMaintenance({ ...currentMaintenance, equipamento: newValue })
                                                    }
                                                    options={options.equipamento}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Equipamento *"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            
                                            {/* Segunda linha: Tipo OS, Equipe e Ativo */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Autocomplete
                                                    fullWidth
                                                    label="Tipo de OS *"
                                                    id="tipoOs"
                                                    value={currentMaintenance.tipoOs}
                                                    onChange={(e, newValue) => {
                                                        setCurrentMaintenance({ 
                                                            ...currentMaintenance, 
                                                            tipoOs: newValue,
                                                            equipe: null // Limpar equipe quando mudar tipo de OS
                                                        });
                                                    }}
                                                    options={options.tipo_os}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Tipo de OS *"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Autocomplete
                                                    fullWidth
                                                    label="Equipe"
                                                    id="equipe"
                                                    value={currentMaintenance.equipe}
                                                    onChange={(e, newValue) =>
                                                        setCurrentMaintenance({ ...currentMaintenance, equipe: newValue })
                                                    }
                                                    options={filteredTeams}
                                                    disabled={!currentMaintenance.tipoOs || filteredTeams.length === 0}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Equipe"
                                                            variant="outlined"
                                                            helperText={!currentMaintenance.tipoOs ? 'Selecione primeiro o Tipo de OS' : filteredTeams.length === 0 ? 'Nenhuma equipe disponível para este tipo de OS' : ''}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', minHeight: '56px' }}>
                                                    <Toggle
                                                        checked={currentMaintenance.active}
                                                        onChange={(e) =>
                                                            setCurrentMaintenance({ ...currentMaintenance, active: e.target.checked })
                                                        }
                                                    />
                                                    <span style={{ marginLeft: 10, fontWeight: 500 }}>Ativo</span>
                                                </Box>
                                            </Grid>
                                            
                                            {/* Terceira linha: Descrição */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-descricao"
                                                    type="text"
                                                    label="Descrição *"
                                                    value={currentMaintenance.descricao}
                                                    onChange={handleChangeInput}
                                                    name="descricao"
                                                    multiline
                                                    rows={3}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            
                                            {/* Quarta linha: Botões */}
                                            <Grid item xs={12} sx={{ mt: 1, display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={editingId ? <EditIcon /> : <AddIcon />}
                                                    onClick={handleAddMaintenance}
                                                    size="large"
                                                >
                                                    {editingId ? 'Atualizar' : 'Adicionar'}
                                                </Button>
                                                {editingId && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={handleCancelEdit}
                                                        startIcon={<CancelIcon />}
                                                        size="large"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    {/* Listagem de Planos em Cards */}
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#015641', fontWeight: 'bold' }}>
                                            Planos de Manutenção ({maintenance.length})
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        {maintenance.length === 0 ? (
                                            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    Nenhum plano de manutenção cadastrado.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Grid container spacing={3}>
                                                {maintenance.map((item) => (
                                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                                        <Card 
                                                            sx={{ 
                                                                height: '100%', 
                                                                display: 'flex', 
                                                                flexDirection: 'column',
                                                                boxShadow: 2,
                                                                '&:hover': {
                                                                    boxShadow: 4,
                                                                    transform: 'translateY(-2px)',
                                                                    transition: 'all 0.3s ease'
                                                                }
                                                            }}
                                                        >
                                                            <CardContent sx={{ flexGrow: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                    <Chip 
                                                                        label={item.active ? 'Ativo' : 'Inativo'} 
                                                                        color={item.active ? 'success' : 'default'}
                                                                        size="small"
                                                                        icon={item.active ? <CheckCircleIcon /> : <CancelIcon />}
                                                                    />
                                                                </Box>
                                                                
                                                                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', color: '#015641' }}>
                                                                    {item.frequency?.label || '-'}
                                                                </Typography>
                                                                
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="body2" color="textSecondary" component="span" sx={{ fontWeight: 'bold' }}>
                                                                        Quantidade: 
                                                                    </Typography>
                                                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                        {item.amount}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="body2" color="textSecondary" component="span" sx={{ fontWeight: 'bold' }}>
                                                                        Data Próxima: 
                                                                    </Typography>
                                                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                        {item?.nextMaintenanceDate ? getBrlDate(item?.nextMaintenanceDate) : '' }
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="body2" color="textSecondary" component="span" sx={{ fontWeight: 'bold' }}>
                                                                        Equipamento: 
                                                                    </Typography>
                                                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                        {item.equipamento?.label || '-'}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="body2" color="textSecondary" component="span" sx={{ fontWeight: 'bold' }}>
                                                                        Tipo OS: 
                                                                    </Typography>
                                                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                        {item.tipoOs?.label || '-'}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                {item.equipe && (
                                                                    <Box sx={{ mb: 1 }}>
                                                                        <Typography variant="body2" color="textSecondary" component="span" sx={{ fontWeight: 'bold' }}>
                                                                            Equipe: 
                                                                        </Typography>
                                                                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                            {item.equipe?.label || '-'}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                                
                                                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                                        Descrição:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 3,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }}>
                                                                        {item.descricao || '-'}
                                                                    </Typography>
                                                                </Box>
                                                            </CardContent>
                                                            
                                                            <CardActions sx={{ justifyContent: 'flex-end', p: 1.5, pt: 0 }}>
                                                                <Tooltip title="Editar">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleEditMaintenance(item)}
                                                                        color="primary"
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Excluir">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleDeleteMaintenance(item.id)}
                                                                        color="error"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Box>
                                    
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
                                    </Grid>
                                </form>
                            </div>
                        </MainCard>
                    </>
                )}
            </Formik>
        </>
    );
};

export default MaintenancePlan;
